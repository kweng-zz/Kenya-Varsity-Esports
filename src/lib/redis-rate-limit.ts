import { NextRequest, NextResponse } from 'next/server';

/**
 * Simple Redis-based rate limiter with fallback to in-memory
 * For production scalability with graceful fallback
 */
class RedisRateLimiter {
  private static instance: RedisRateLimiter;
  private redis: any = null;

  static getInstance(): RedisRateLimiter {
    if (!RedisRateLimiter.instance) {
      RedisRateLimiter.instance = new RedisRateLimiter();
    }
    return RedisRateLimiter.instance;
  }

  constructor() {
    this.initializeRedis();
  }

  private async initializeRedis() {
    // Check if Redis is available
    const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_HOST;
    
    if (!redisUrl) {
      console.warn('Redis not configured, falling back to in-memory rate limiting');
      return;
    }

    try {
      // Simple Redis initialization
      const RedisModule = await import('ioredis');
      const Redis = RedisModule.default;
      this.redis = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        keepAlive: 30000,
        connectTimeout: 10000,
        commandTimeout: 5000,
      });
      
      console.log('Redis rate limiter initialized');
    } catch (error) {
      console.error('Failed to initialize Redis:', error);
      console.warn('Falling back to in-memory rate limiting');
      this.redis = null;
    }
  }

  private getMemoryMap() {
    const storage = global as any;
    if (!storage._rateLimitMemory) {
      storage._rateLimitMemory = new Map();
    }
    return storage._rateLimitMemory;
  }

  async isAllowed(
    identifier: string, 
    limit: number, 
    windowMs: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    // Use Redis if available, otherwise fallback to in-memory
    if (this.redis) {
      return this.isAllowedRedis(identifier, limit, windowMs);
    } else {
      return this.isAllowedInMemory(identifier, limit, windowMs);
    }
  }

  private async isAllowedRedis(
    identifier: string, 
    limit: number, 
    windowMs: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const now = Date.now();
    const key = `rate_limit:${identifier}`;
    const resetTime = now + windowMs;

    try {
      // Redis pipeline for atomic operations
      const pipeline = this.redis.pipeline();
      pipeline.get(key);
      pipeline.incr(key);
      pipeline.expire(key, Math.ceil(windowMs / 1000));
      
      const results = await pipeline.exec();
      const currentCount = results[0] && results[0][1] ? parseInt(results[0][1]) : 0;
      const newCount = results[1] && results[1][1] ? parseInt(results[1][1]) : 1;

      if (newCount > limit) {
        return { allowed: false, remaining: 0, resetTime };
      }

      return {
        allowed: true,
        remaining: limit - newCount,
        resetTime
      };

    } catch (error) {
      console.error('Redis rate limiting error:', error);
      // Fallback to in-memory
      return this.isAllowedInMemory(identifier, limit, windowMs);
    }
  }

  private isAllowedInMemory(
    identifier: string, 
    limit: number, 
    windowMs: number
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const memory = this.getMemoryMap();
    const now = Date.now();
    const entry = memory.get(identifier);

    if (entry && now > entry.resetTime) {
      memory.delete(identifier);
    }

    const currentEntry = memory.get(identifier);
    
    if (!currentEntry) {
      memory.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      });
      
      return { allowed: true, remaining: limit - 1, resetTime: now + windowMs };
    }

    if (currentEntry.count >= limit) {
      return { allowed: false, remaining: 0, resetTime: currentEntry.resetTime };
    }

    currentEntry.count++;
    
    return {
      allowed: true,
      remaining: limit - currentEntry.count,
      resetTime: currentEntry.resetTime
    };
  }

  async getStats(): Promise<{ connected: boolean; memory?: string }> {
    if (!this.redis) {
      return { connected: false, memory: 'Using in-memory fallback' };
    }

    try {
      const info = await this.redis.info('memory');
      return { 
        connected: true, 
        memory: info?.split('\r\n')?.find((line: string) => line.startsWith('used_memory:'))?.split(':')[1]?.trim()
      };
    } catch (error) {
      console.error('Redis stats error:', error);
      return { connected: false };
    }
  }

  async close(): Promise<void> {
    if (this.redis) {
      try {
        await this.redis.quit();
        console.log('Redis connection closed');
      } catch (error) {
        console.error('Error closing Redis connection:', error);
      }
    }
  }
}

export const RATE_LIMITS = {
  PUBLIC: { limit: 10, windowMs: 60 * 1000 },
  CONTACT: { limit: 10, windowMs: 60 * 1000 },
  NEWSLETTER: { limit: 5, windowMs: 60 * 1000 },
  AUTHENTICATED: { limit: 100, windowMs: 60 * 1000 },
  ADMIN: { limit: 200, windowMs: 60 * 1000 },
  UPLOAD: { limit: 10, windowMs: 60 * 1000 }
};

function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  return '127.0.0.1';
}

export async function checkRateLimit(
  request: NextRequest, 
  limitType: keyof typeof RATE_LIMITS
): Promise<NextResponse | null> {
  const rateLimiter = RedisRateLimiter.getInstance();
  const config = RATE_LIMITS[limitType];
  const identifier = getClientIP(request);
  const userId = request.headers.get('x-user-id');
  const finalIdentifier = userId ? `user:${userId}` : `ip:${identifier}`;
  
  // Check rate limit
  const result = await rateLimiter.isAllowed(finalIdentifier, config.limit, config.windowMs);
  
  if (!result.allowed) {
    return NextResponse.json({
      success: false,
      error: 'RATE_LIMIT_EXCEEDED',
      message: `Rate limit exceeded. Please try again in ${Math.ceil((result.resetTime - Date.now()) / 1000)} seconds.`,
      retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
    }, { 
      status: 429,
      headers: {
        'X-RateLimit-Limit': config.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
        'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString()
      }
    });
  }
  
  // Return null to allow request to proceed
  return null;
}

export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  limitType: keyof typeof RATE_LIMITS
) {
  return async (request: NextRequest) => {
    const rateLimitError = await checkRateLimit(request, limitType);
    if (rateLimitError) return rateLimitError;
    
    const response = await handler(request);
    
    // Add rate limit headers
    const config = RATE_LIMITS[limitType];
    const rateLimiter = RedisRateLimiter.getInstance();
    const identifier = getClientIP(request);
    const userId = request.headers.get('x-user-id');
    const finalIdentifier = userId ? `user:${userId}` : `ip:${identifier}`;
    const result = await rateLimiter.isAllowed(finalIdentifier, config.limit, config.windowMs);
    
    response.headers.set('X-RateLimit-Limit', config.limit.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString());
    
    return response;
  };
}

export { RedisRateLimiter };