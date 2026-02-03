// src/lib/performance/advancedCache.ts
/**
 * Advanced Caching Strategies
 * Multi-tier caching, cache warming, and intelligent invalidation
 */

import { cache, CACHE_TTL } from '@/lib/cache';

export type CacheTier = 'memory' | 'redis' | 'cdn';

export interface CacheEntry<T> {
  data: T;
  tier: CacheTier;
  createdAt: number;
  expiresAt: number;
  hitCount: number;
  lastAccessed: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
  tierBreakdown: Record<CacheTier, number>;
}

export interface CacheWarmingConfig {
  keys: string[];
  fetchFn: (key: string) => Promise<any>;
  priority: 'high' | 'normal' | 'low';
}

class AdvancedCacheService {
  // In-memory L1 cache
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  
  // Cache statistics
  private stats = {
    hits: 0,
    misses: 0,
    memoryHits: 0,
    redisHits: 0,
  };
  
  // L1 cache config
  private maxMemoryCacheSize = 1000;
  private memoryTTL = 60 * 1000; // 1 minute

  /**
   * Get with multi-tier lookup
   */
  async get<T>(key: string): Promise<T | null> {
    // L1: Check memory cache first
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry && Date.now() < memoryEntry.expiresAt) {
      memoryEntry.hitCount++;
      memoryEntry.lastAccessed = Date.now();
      this.stats.hits++;
      this.stats.memoryHits++;
      return memoryEntry.data as T;
    }

    // L2: Check Redis
    try {
      const redisData = await cache.get<T>(key);
      if (redisData !== null) {
        // Promote to L1
        this.setMemoryCache(key, redisData);
        this.stats.hits++;
        this.stats.redisHits++;
        return redisData;
      }
    } catch (error) {
      console.error('[AdvancedCache] Redis error:', error);
    }

    this.stats.misses++;
    return null;
  }

  /**
   * Set with multi-tier storage
   */
  async set<T>(
    key: string,
    data: T,
    options: {
      ttl?: number;
      tiers?: CacheTier[];
    } = {}
  ): Promise<void> {
    const tiers = options.tiers || ['memory', 'redis'];
    const ttl = options.ttl || CACHE_TTL.TOURNAMENT_DETAIL;

    // L1: Memory cache
    if (tiers.includes('memory')) {
      this.setMemoryCache(key, data, this.memoryTTL);
    }

    // L2: Redis cache
    if (tiers.includes('redis')) {
      try {
        await cache.set(key, data, ttl);
      } catch (error) {
        console.error('[AdvancedCache] Redis set error:', error);
      }
    }
  }

  /**
   * Delete from all tiers
   */
  async delete(key: string): Promise<void> {
    this.memoryCache.delete(key);
    await cache.delete(key);
  }

  /**
   * Get or fetch with caching
   */
  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetchFn();
    await this.set(key, data, { ttl });
    return data;
  }

  /**
   * Warm cache with data
   */
  async warmCache(configs: CacheWarmingConfig[]): Promise<{
    warmed: number;
    failed: number;
  }> {
    let warmed = 0;
    let failed = 0;

    // Sort by priority
    const sorted = configs.sort((a, b) => {
      const priorityOrder = { high: 0, normal: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    for (const config of sorted) {
      for (const key of config.keys) {
        try {
          const data = await config.fetchFn(key);
          await this.set(key, data);
          warmed++;
        } catch (error) {
          console.error(`[CacheWarming] Failed to warm ${key}:`, error);
          failed++;
        }
      }
    }

    return { warmed, failed };
  }

  /**
   * Invalidate by pattern
   */
  async invalidatePattern(pattern: string): Promise<number> {
    let invalidated = 0;
    const regex = new RegExp(pattern.replace('*', '.*'));

    // Clear matching memory cache entries
    for (const key of this.memoryCache.keys()) {
      if (regex.test(key)) {
        this.memoryCache.delete(key);
        invalidated++;
      }
    }

    return invalidated;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    
    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: total > 0 ? this.stats.hits / total : 0,
      size: this.memoryCache.size,
      tierBreakdown: {
        memory: this.stats.memoryHits,
        redis: this.stats.redisHits,
        cdn: 0,
      },
    };
  }

  /**
   * Clear all caches
   */
  async clearAll(): Promise<void> {
    this.memoryCache.clear();
    // Would clear Redis cache too in production
  }

  /**
   * Prune expired entries
   */
  prune(): number {
    const now = Date.now();
    let pruned = 0;

    for (const [key, entry] of this.memoryCache.entries()) {
      if (now >= entry.expiresAt) {
        this.memoryCache.delete(key);
        pruned++;
      }
    }

    return pruned;
  }

  /**
   * Configure memory cache
   */
  configure(options: {
    maxSize?: number;
    ttl?: number;
  }): void {
    if (options.maxSize) this.maxMemoryCacheSize = options.maxSize;
    if (options.ttl) this.memoryTTL = options.ttl;
  }

  // Private helpers

  private setMemoryCache<T>(key: string, data: T, ttl?: number): void {
    // Evict if at capacity
    if (this.memoryCache.size >= this.maxMemoryCacheSize) {
      this.evictLRU();
    }

    const now = Date.now();
    this.memoryCache.set(key, {
      data,
      tier: 'memory',
      createdAt: now,
      expiresAt: now + (ttl || this.memoryTTL),
      hitCount: 0,
      lastAccessed: now,
    });
  }

  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestAccess = Infinity;

    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.lastAccessed < oldestAccess) {
        oldestAccess = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.memoryCache.delete(oldestKey);
    }
  }
}

// Export singleton
export const advancedCache = new AdvancedCacheService();

// Export class for testing
export { AdvancedCacheService };
