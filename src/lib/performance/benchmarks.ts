// src/lib/performance/benchmarks.ts
/**
 * Performance Benchmarks and Monitoring Utilities
 * Used for measuring response times and identifying bottlenecks
 */

export interface BenchmarkResult {
  name: string;
  duration: number;
  timestamp: number;
  success: boolean;
  metadata?: Record<string, unknown>;
}

// In-memory benchmark storage (replace with proper monitoring in production)
const benchmarkResults: BenchmarkResult[] = [];
const MAX_RESULTS = 1000;

/**
 * Measure execution time of an async function
 */
export async function benchmark<T>(
  name: string,
  fn: () => Promise<T>,
  metadata?: Record<string, unknown>
): Promise<{ result: T; duration: number }> {
  const start = performance.now();
  
  try {
    const result = await fn();
    const duration = performance.now() - start;
    
    // Store result
    storeBenchmark({
      name,
      duration,
      timestamp: Date.now(),
      success: true,
      metadata,
    });
    
    return { result, duration };
  } catch (error) {
    const duration = performance.now() - start;
    
    storeBenchmark({
      name,
      duration,
      timestamp: Date.now(),
      success: false,
      metadata: { ...metadata, error: String(error) },
    });
    
    throw error;
  }
}

/**
 * Measure execution time synchronously
 */
export function benchmarkSync<T>(
  name: string,
  fn: () => T,
  metadata?: Record<string, unknown>
): { result: T; duration: number } {
  const start = performance.now();
  
  try {
    const result = fn();
    const duration = performance.now() - start;
    
    storeBenchmark({
      name,
      duration,
      timestamp: Date.now(),
      success: true,
      metadata,
    });
    
    return { result, duration };
  } catch (error) {
    const duration = performance.now() - start;
    
    storeBenchmark({
      name,
      duration,
      timestamp: Date.now(),
      success: false,
      metadata: { ...metadata, error: String(error) },
    });
    
    throw error;
  }
}

function storeBenchmark(result: BenchmarkResult): void {
  benchmarkResults.push(result);
  
  // Keep only last MAX_RESULTS
  if (benchmarkResults.length > MAX_RESULTS) {
    benchmarkResults.shift();
  }
}

/**
 * Get benchmark statistics for a specific operation
 */
export function getBenchmarkStats(name: string, windowMs: number = 60000): {
  count: number;
  avgDuration: number;
  p50Duration: number;
  p95Duration: number;
  p99Duration: number;
  successRate: number;
} {
  const cutoff = Date.now() - windowMs;
  const relevant = benchmarkResults.filter(
    (r) => r.name === name && r.timestamp >= cutoff
  );

  if (relevant.length === 0) {
    return {
      count: 0,
      avgDuration: 0,
      p50Duration: 0,
      p95Duration: 0,
      p99Duration: 0,
      successRate: 0,
    };
  }

  const durations = relevant.map((r) => r.duration).sort((a, b) => a - b);
  const successCount = relevant.filter((r) => r.success).length;

  return {
    count: relevant.length,
    avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
    p50Duration: percentile(durations, 50),
    p95Duration: percentile(durations, 95),
    p99Duration: percentile(durations, 99),
    successRate: (successCount / relevant.length) * 100,
  };
}

/**
 * Get all benchmark statistics
 */
export function getAllBenchmarkStats(windowMs: number = 60000): Map<string, ReturnType<typeof getBenchmarkStats>> {
  const cutoff = Date.now() - windowMs;
  const relevant = benchmarkResults.filter((r) => r.timestamp >= cutoff);
  
  const names = new Set(relevant.map((r) => r.name));
  const stats = new Map<string, ReturnType<typeof getBenchmarkStats>>();
  
  names.forEach((name) => {
    stats.set(name, getBenchmarkStats(name, windowMs));
  });
  
  return stats;
}

/**
 * Clear benchmark history
 */
export function clearBenchmarks(): void {
  benchmarkResults.length = 0;
}

function percentile(arr: number[], p: number): number {
  if (arr.length === 0) return 0;
  const index = Math.ceil((p / 100) * arr.length) - 1;
  return arr[Math.max(0, index)];
}

/**
 * Performance thresholds for alerts
 */
export const PERFORMANCE_THRESHOLDS = {
  // API response times (ms)
  API_P95: 100,
  API_P99: 200,
  
  // Database query times (ms)
  DB_QUERY_P95: 50,
  DB_QUERY_P99: 100,
  
  // Cache operations (ms)
  CACHE_HIT_P95: 5,
  CACHE_MISS_P95: 50,
  
  // WebSocket latency (ms)
  WS_LATENCY_P95: 50,
} as const;

/**
 * Check if performance meets thresholds
 */
export function checkPerformanceThresholds(): {
  healthy: boolean;
  violations: Array<{ metric: string; value: number; threshold: number }>;
} {
  const violations: Array<{ metric: string; value: number; threshold: number }> = [];
  
  // Check API stats
  const apiStats = getBenchmarkStats('api_request');
  if (apiStats.p95Duration > PERFORMANCE_THRESHOLDS.API_P95) {
    violations.push({
      metric: 'API P95',
      value: apiStats.p95Duration,
      threshold: PERFORMANCE_THRESHOLDS.API_P95,
    });
  }
  
  // Check cache stats
  const cacheStats = getBenchmarkStats('cache_hit');
  if (cacheStats.p95Duration > PERFORMANCE_THRESHOLDS.CACHE_HIT_P95) {
    violations.push({
      metric: 'Cache P95',
      value: cacheStats.p95Duration,
      threshold: PERFORMANCE_THRESHOLDS.CACHE_HIT_P95,
    });
  }
  
  return {
    healthy: violations.length === 0,
    violations,
  };
}
