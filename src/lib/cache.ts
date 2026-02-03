// src/lib/cache.ts
/**
 * Multi-layer caching system built on Redis
 * Provides tournament data caching, leaderboard caching with sorted sets,
 * and stale-while-revalidate patterns for optimal performance
 */

import Redis from 'ioredis';

// Cache TTL configurations (in seconds)
export const CACHE_TTL = {
  TOURNAMENT_LIST: 300,      // 5 minutes for list of tournaments
  TOURNAMENT_DETAIL: 180,    // 3 minutes for individual tournament
  LEADERBOARD: 30,           // 30 seconds for leaderboards (frequently updated)
  PARTICIPANT_LIST: 120,     // 2 minutes for participant lists
  USER_DATA: 600,            // 10 minutes for user data
  STATIC_DATA: 3600,         // 1 hour for relatively static data
} as const;

// Cache key prefixes
export const CACHE_KEYS = {
  tournament: (id: string) => `tournament:${id}`,
  tournamentList: () => 'tournaments:all',
  tournamentsByStatus: (status: string) => `tournaments:status:${status}`,
  leaderboard: (tournamentId: string) => `leaderboard:${tournamentId}`,
  participant: (tournamentId: string, participantId: string) => 
    `participant:${tournamentId}:${participantId}`,
  participantList: (tournamentId: string) => `participants:${tournamentId}`,
  user: (userId: string) => `user:${userId}`,
} as const;

// Singleton Redis client
let redisClient: Redis | null = null;
let isRedisAvailable = false;

/**
 * Initialize or get Redis client
 */
function getRedisClient(): Redis | null {
  if (redisClient) return redisClient;

  const redisUrl = process.env.REDIS_URL || process.env.REDIS_HOST;
  
  if (!redisUrl) {
    console.warn('[Cache] Redis not configured, caching disabled');
    return null;
  }

  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      keepAlive: 30000,
      connectTimeout: 10000,
      commandTimeout: 5000,
      retryStrategy: (times) => {
        if (times > 3) {
          console.error('[Cache] Redis connection failed after 3 retries');
          isRedisAvailable = false;
          return null;
        }
        return Math.min(times * 200, 2000);
      },
    });

    redisClient.on('connect', () => {
      console.log('[Cache] Redis connected');
      isRedisAvailable = true;
    });

    redisClient.on('error', (err) => {
      console.error('[Cache] Redis error:', err.message);
      isRedisAvailable = false;
    });

    return redisClient;
  } catch (error) {
    console.error('[Cache] Failed to initialize Redis:', error);
    return null;
  }
}

/**
 * Cache service class
 */
class CacheService {
  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    const redis = getRedisClient();
    if (!redis || !isRedisAvailable) return null;

    try {
      const value = await redis.get(key);
      if (!value) return null;
      
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`[Cache] Error getting key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set value in cache with TTL
   */
  async set<T>(key: string, value: T, ttlSeconds: number): Promise<boolean> {
    const redis = getRedisClient();
    if (!redis || !isRedisAvailable) return false;

    try {
      await redis.setex(key, ttlSeconds, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`[Cache] Error setting key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<boolean> {
    const redis = getRedisClient();
    if (!redis || !isRedisAvailable) return false;

    try {
      await redis.del(key);
      return true;
    } catch (error) {
      console.error(`[Cache] Error deleting key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete multiple keys matching a pattern
   */
  async deletePattern(pattern: string): Promise<boolean> {
    const redis = getRedisClient();
    if (!redis || !isRedisAvailable) return false;

    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      return true;
    } catch (error) {
      console.error(`[Cache] Error deleting pattern ${pattern}:`, error);
      return false;
    }
  }

  /**
   * Get or set with callback (stale-while-revalidate pattern)
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds: number
  ): Promise<T> {
    // Try cache first
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Fetch fresh data
    const freshData = await fetcher();
    
    // Cache in background (don't await)
    this.set(key, freshData, ttlSeconds).catch(() => {});
    
    return freshData;
  }

  // ==========================================
  // Leaderboard Operations (Redis Sorted Sets)
  // ==========================================

  /**
   * Add or update score in leaderboard
   */
  async updateLeaderboardScore(
    tournamentId: string,
    participantId: string,
    score: number
  ): Promise<boolean> {
    const redis = getRedisClient();
    if (!redis || !isRedisAvailable) return false;

    try {
      const key = CACHE_KEYS.leaderboard(tournamentId);
      await redis.zadd(key, score, participantId);
      // Set expiry on the sorted set
      await redis.expire(key, CACHE_TTL.LEADERBOARD * 10); // Longer TTL for sorted sets
      return true;
    } catch (error) {
      console.error(`[Cache] Error updating leaderboard:`, error);
      return false;
    }
  }

  /**
   * Get leaderboard rankings
   */
  async getLeaderboard(
    tournamentId: string,
    start: number = 0,
    end: number = 99
  ): Promise<Array<{ participantId: string; score: number; rank: number }>> {
    const redis = getRedisClient();
    if (!redis || !isRedisAvailable) return [];

    try {
      const key = CACHE_KEYS.leaderboard(tournamentId);
      // ZREVRANGE with scores (highest first)
      const results = await redis.zrevrange(key, start, end, 'WITHSCORES');
      
      const leaderboard: Array<{ participantId: string; score: number; rank: number }> = [];
      for (let i = 0; i < results.length; i += 2) {
        leaderboard.push({
          participantId: results[i],
          score: parseFloat(results[i + 1]),
          rank: start + Math.floor(i / 2) + 1,
        });
      }
      
      return leaderboard;
    } catch (error) {
      console.error(`[Cache] Error getting leaderboard:`, error);
      return [];
    }
  }

  /**
   * Get participant rank in leaderboard
   */
  async getParticipantRank(
    tournamentId: string,
    participantId: string
  ): Promise<{ rank: number; score: number } | null> {
    const redis = getRedisClient();
    if (!redis || !isRedisAvailable) return null;

    try {
      const key = CACHE_KEYS.leaderboard(tournamentId);
      
      const [rank, score] = await Promise.all([
        redis.zrevrank(key, participantId),
        redis.zscore(key, participantId),
      ]);
      
      if (rank === null || score === null) return null;
      
      return {
        rank: rank + 1, // Convert 0-indexed to 1-indexed
        score: parseFloat(score),
      };
    } catch (error) {
      console.error(`[Cache] Error getting participant rank:`, error);
      return null;
    }
  }

  /**
   * Get total participants in leaderboard
   */
  async getLeaderboardCount(tournamentId: string): Promise<number> {
    const redis = getRedisClient();
    if (!redis || !isRedisAvailable) return 0;

    try {
      const key = CACHE_KEYS.leaderboard(tournamentId);
      return await redis.zcard(key);
    } catch (error) {
      console.error(`[Cache] Error getting leaderboard count:`, error);
      return 0;
    }
  }

  /**
   * Increment score for participant
   */
  async incrementScore(
    tournamentId: string,
    participantId: string,
    increment: number
  ): Promise<number | null> {
    const redis = getRedisClient();
    if (!redis || !isRedisAvailable) return null;

    try {
      const key = CACHE_KEYS.leaderboard(tournamentId);
      const newScore = await redis.zincrby(key, increment, participantId);
      return parseFloat(newScore);
    } catch (error) {
      console.error(`[Cache] Error incrementing score:`, error);
      return null;
    }
  }

  // ==========================================
  // Tournament-specific caching
  // ==========================================

  /**
   * Cache tournament data
   */
  async cacheTournament<T>(tournamentId: string, data: T): Promise<boolean> {
    const key = CACHE_KEYS.tournament(tournamentId);
    return this.set(key, data, CACHE_TTL.TOURNAMENT_DETAIL);
  }

  /**
   * Get cached tournament
   */
  async getCachedTournament<T>(tournamentId: string): Promise<T | null> {
    const key = CACHE_KEYS.tournament(tournamentId);
    return this.get<T>(key);
  }

  /**
   * Invalidate tournament cache
   */
  async invalidateTournamentCache(tournamentId: string): Promise<void> {
    await Promise.all([
      this.delete(CACHE_KEYS.tournament(tournamentId)),
      this.delete(CACHE_KEYS.participantList(tournamentId)),
      this.delete(CACHE_KEYS.tournamentList()),
    ]);
  }

  // ==========================================
  // Health & Stats
  // ==========================================

  /**
   * Check if cache is available
   */
  isAvailable(): boolean {
    return isRedisAvailable;
  }

  /**
   * Get cache stats
   */
  async getStats(): Promise<{
    available: boolean;
    memory?: string;
    keyCount?: number;
  }> {
    const redis = getRedisClient();
    if (!redis || !isRedisAvailable) {
      return { available: false };
    }

    try {
      const info = await redis.info('memory');
      const keyCount = await redis.dbsize();
      
      const memoryLine = info.split('\r\n').find(line => 
        line.startsWith('used_memory_human:')
      );
      
      return {
        available: true,
        memory: memoryLine?.split(':')[1]?.trim(),
        keyCount,
      };
    } catch (error) {
      return { available: false };
    }
  }
}

// Export singleton instance
export const cache = new CacheService();

// Export class for testing
export { CacheService };
