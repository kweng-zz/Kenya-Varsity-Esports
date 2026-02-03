// src/lib/performance/index.ts
/**
 * Performance Module Exports
 */

export { 
  dbOptimization, 
  DBOptimizationService, 
  type QueryMetrics, 
  type IndexRecommendation, 
  type ConnectionPoolConfig 
} from './dbOptimization';

export { 
  advancedCache, 
  AdvancedCacheService, 
  type CacheTier, 
  type CacheEntry, 
  type CacheStats 
} from './advancedCache';
