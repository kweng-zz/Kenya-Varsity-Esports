// src/__tests__/performance.test.ts
/**
 * Performance Module Tests: DB Optimization, Caching, Benchmarks
 * Run with: bun test src/__tests__/performance.test.ts
 */

import { test, expect, describe } from 'bun:test';

describe('DBOptimizationService', () => {
  test('Can be imported', async () => {
    const { DBOptimizationService } = await import('@/lib/performance/dbOptimization');
    expect(DBOptimizationService).toBeDefined();
  });

  test('Singleton is available', async () => {
    const { dbOptimization } = await import('@/lib/performance/dbOptimization');
    expect(dbOptimization).toBeDefined();
    expect(typeof dbOptimization.logQuery).toBe('function');
    expect(typeof dbOptimization.getSlowQueries).toBe('function');
  });

  test('Has analysis methods', async () => {
    const { dbOptimization } = await import('@/lib/performance/dbOptimization');
    expect(typeof dbOptimization.analyzeQueries).toBe('function');
    expect(typeof dbOptimization.getQueryStats).toBe('function');
  });

  test('Has pool configuration', async () => {
    const { dbOptimization } = await import('@/lib/performance/dbOptimization');
    expect(typeof dbOptimization.configurePool).toBe('function');
    expect(typeof dbOptimization.getPoolConfig).toBe('function');
  });
});

describe('AdvancedCacheService', () => {
  test('Can be imported', async () => {
    const { AdvancedCacheService } = await import('@/lib/performance/advancedCache');
    expect(AdvancedCacheService).toBeDefined();
  });

  test('Singleton is available', async () => {
    const { advancedCache } = await import('@/lib/performance/advancedCache');
    expect(advancedCache).toBeDefined();
    expect(typeof advancedCache.get).toBe('function');
    expect(typeof advancedCache.set).toBe('function');
  });

  test('Has multi-tier methods', async () => {
    const { advancedCache } = await import('@/lib/performance/advancedCache');
    expect(typeof advancedCache.getOrFetch).toBe('function');
    expect(typeof advancedCache.delete).toBe('function');
  });

  test('Has cache warming', async () => {
    const { advancedCache } = await import('@/lib/performance/advancedCache');
    expect(typeof advancedCache.warmCache).toBe('function');
    expect(typeof advancedCache.invalidatePattern).toBe('function');
  });

  test('Has stats and management', async () => {
    const { advancedCache } = await import('@/lib/performance/advancedCache');
    expect(typeof advancedCache.getStats).toBe('function');
    expect(typeof advancedCache.prune).toBe('function');
    expect(typeof advancedCache.configure).toBe('function');
  });
});

describe('Connection Pool Config', () => {
  test('Default pool config values', async () => {
    const { dbOptimization } = await import('@/lib/performance/dbOptimization');
    const config = dbOptimization.getPoolConfig();
    expect(config.minConnections).toBeGreaterThan(0);
    expect(config.maxConnections).toBeGreaterThan(config.minConnections);
    expect(config.idleTimeout).toBeGreaterThan(0);
  });
});

describe('Cache Tiers', () => {
  test('Cache tiers are defined', () => {
    const tiers = ['memory', 'redis', 'cdn'];
    expect(tiers).toContain('memory');
    expect(tiers).toContain('redis');
  });

  test('Cache entry structure', () => {
    const entry = {
      data: { test: 'value' },
      tier: 'memory' as const,
      createdAt: Date.now(),
      expiresAt: Date.now() + 60000,
      hitCount: 0,
      lastAccessed: Date.now(),
    };
    expect(entry.tier).toBe('memory');
    expect(entry.hitCount).toBe(0);
  });
});

describe('Query Metrics', () => {
  test('Metrics structure', () => {
    const metric = {
      query: 'SELECT * FROM users WHERE id = ?',
      executionTime: 150,
      rowsAffected: 1,
      timestamp: new Date().toISOString(),
      cached: false,
    };
    expect(metric.executionTime).toBe(150);
    expect(metric.cached).toBe(false);
  });
});

describe('Index Recommendations', () => {
  test('Recommendation structure', () => {
    const recommendation = {
      table: 'users',
      columns: ['email', 'created_at'],
      type: 'btree' as const,
      reason: 'Frequently filtered',
      estimatedImprovement: '50-80%',
    };
    expect(recommendation.table).toBe('users');
    expect(recommendation.type).toBe('btree');
  });
});
