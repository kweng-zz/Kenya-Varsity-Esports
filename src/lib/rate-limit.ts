import { NextRequest, NextResponse } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * In-memory rate limiter for API endpoints
 * In production, consider using Redis or a dedicated rate limiting service
 */
class RateLimiter {
  private static instance: RateLimiter;
  private requests: Map<string, RateLimitEntry> = new Map();

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  /**
   * Check if a request is allowed
   * @param identifier - Unique identifier (IP address, user ID, etc.)
   * @param limit - Number of requests allowed
   * @param windowMs - Time window in milliseconds
   * @returns Object with allowed boolean and remaining requests
   */
  isAllowed(identifier: string, limit: number, windowMs: number): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const key = identifier;
    const entry = this.requests.get(key);

    // Clean up expired entries
    if (entry && now > entry.resetTime) {
      this.requests.delete(key);
    }

    const currentEntry = this.requests.get(key);
    
    if (!currentEntry) {
      // First request from this identifier
      this.requests.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: now + windowMs
      };
    }

    if (currentEntry.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: currentEntry.resetTime
      };
    }

    // Increment counter
    currentEntry.count++;
    
    return {
      allowed: true,
      remaining: limit - currentEntry.count,
      resetTime: currentEntry.resetTime
    };
  }

  /**
   * Clean up expired entries (call periodically)
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

// Rate limit configurations for different endpoint types
export const RATE_LIMITS = {
  // Public endpoints - more restrictive
  PUBLIC: {
    limit: 10, // 10 requests
    windowMs: 60 * 1000 // per minute
  },
  
  // Contact form - very restrictive to prevent spam
  CONTACT: {
    limit: 3, // 3 requests
    windowMs: 60 * 1000 // per minute
  },
  
  // Newsletter subscription - moderate restriction
  NEWSLETTER: {
    limit: 5, // 5 requests
    windowMs: 60 * 1000 // per minute
  },
  
  // Authenticated endpoints - less restrictive
  AUTHENTICATED: {
    limit: 100, // 100 requests
    windowMs: 60 * 1000 // per minute
  },
  
  // Admin endpoints - even less restrictive for logged-in admins
  ADMIN: {
    limit: 200, // 200 requests
    windowMs: 60 * 1000 // per minute
  },
  
  // File upload - restrictive due to resource usage
  UPLOAD: {
    limit: 10, // 10 uploads
    windowMs: 60 * 1000 // per minute
  }
};

/**
 * Get client IP address from request
 */
function getClientIP(request: NextRequest): string {
  // Try various headers for the real IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback to request IP
  return '127.0.0.1';
}

/**
 * Rate limiting middleware
 * @param request - The incoming request
 * @param limitType - Type of rate limit to apply
 * @returns NextResponse with error if rate limited, null if allowed
 */
export async function checkRateLimit(
  request: NextRequest, 
  limitType: keyof typeof RATE_LIMITS
): Promise<NextResponse | null> {
  const rateLimiter = RateLimiter.getInstance();
  const config = RATE_LIMITS[limitType];
  
  // Get client identifier
  const identifier = getClientIP(request);
  
  // Add user identifier if available (for authenticated routes)
  const userId = request.headers.get('x-user-id');
  const finalIdentifier = userId ? `user:${userId}` : `ip:${identifier}`;
  
  // Check rate limit
  const result = rateLimiter.isAllowed(finalIdentifier, config.limit, config.windowMs);
  
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
  
  // Add rate limit headers to successful responses
  const headers = new Headers();
  headers.set('X-RateLimit-Limit', config.limit.toString());
  headers.set('X-RateLimit-Remaining', result.remaining.toString());
  headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString());
  
  return null;
}

/**
 * Higher-order function to add rate limiting to API routes
 * @param handler - The route handler function
 * @param limitType - Type of rate limit to apply
 * @returns Protected route handler
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  limitType: keyof typeof RATE_LIMITS
) {
  return async (request: NextRequest) => {
    const rateLimitError = await checkRateLimit(request, limitType);
    if (rateLimitError) return rateLimitError;
    
    const response = await handler(request);
    
    // Add rate limit headers to the response
    const config = RATE_LIMITS[limitType];
    const rateLimiter = RateLimiter.getInstance();
    const identifier = getClientIP(request);
    const userId = request.headers.get('x-user-id');
    const finalIdentifier = userId ? `user:${userId}` : `ip:${identifier}`;
    const result = rateLimiter.isAllowed(finalIdentifier, config.limit, config.windowMs);
    
    response.headers.set('X-RateLimit-Limit', config.limit.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString());
    
    return response;
  };
}

// Cleanup expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    RateLimiter.getInstance().cleanup();
  }, 5 * 60 * 1000);
}