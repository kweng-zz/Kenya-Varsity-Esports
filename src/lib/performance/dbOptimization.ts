// src/lib/performance/dbOptimization.ts
/**
 * Database Optimization Service
 * Query optimization, connection pooling, and index management
 */

export interface QueryMetrics {
  query: string;
  executionTime: number;
  rowsAffected: number;
  timestamp: string;
  cached: boolean;
}

export interface IndexRecommendation {
  table: string;
  columns: string[];
  type: 'btree' | 'hash' | 'gin' | 'gist';
  reason: string;
  estimatedImprovement: string;
}

export interface ConnectionPoolConfig {
  minConnections: number;
  maxConnections: number;
  idleTimeout: number;
  acquireTimeout: number;
  maxRetries: number;
}

// Default pool configuration
const DEFAULT_POOL_CONFIG: ConnectionPoolConfig = {
  minConnections: 5,
  maxConnections: 20,
  idleTimeout: 30000,
  acquireTimeout: 60000,
  maxRetries: 3,
};

class DBOptimizationService {
  // Query metrics history
  private queryMetrics: QueryMetrics[] = [];
  
  // Slow query threshold in ms
  private slowQueryThreshold: number = 1000;
  
  // Pool configuration
  private poolConfig: ConnectionPoolConfig = DEFAULT_POOL_CONFIG;

  /**
   * Log query execution
   */
  logQuery(
    query: string,
    executionTime: number,
    rowsAffected: number,
    cached: boolean = false
  ): void {
    const metric: QueryMetrics = {
      query: this.sanitizeQuery(query),
      executionTime,
      rowsAffected,
      timestamp: new Date().toISOString(),
      cached,
    };

    this.queryMetrics.push(metric);

    // Keep last 1000 queries
    if (this.queryMetrics.length > 1000) {
      this.queryMetrics = this.queryMetrics.slice(-1000);
    }

    // Log slow queries
    if (executionTime > this.slowQueryThreshold) {
      console.warn('[DB] Slow query detected:', {
        query: metric.query.substring(0, 100),
        time: `${executionTime}ms`,
      });
    }
  }

  /**
   * Get slow queries
   */
  getSlowQueries(threshold?: number): QueryMetrics[] {
    const limit = threshold ?? this.slowQueryThreshold;
    return this.queryMetrics
      .filter(m => m.executionTime > limit)
      .sort((a, b) => b.executionTime - a.executionTime);
  }

  /**
   * Analyze queries and suggest indexes
   */
  analyzeQueries(): IndexRecommendation[] {
    const recommendations: IndexRecommendation[] = [];
    const queryPatterns = new Map<string, number>();

    // Find repeated slow queries
    for (const metric of this.getSlowQueries()) {
      const pattern = this.extractQueryPattern(metric.query);
      queryPatterns.set(pattern, (queryPatterns.get(pattern) || 0) + 1);
    }

    // Generate recommendations based on patterns
    for (const [pattern, count] of queryPatterns.entries()) {
      if (count >= 3) {
        const recommendation = this.generateIndexRecommendation(pattern);
        if (recommendation) {
          recommendations.push(recommendation);
        }
      }
    }

    return recommendations;
  }

  /**
   * Get query statistics
   */
  getQueryStats(): {
    totalQueries: number;
    avgExecutionTime: number;
    slowQueries: number;
    cacheHitRate: number;
  } {
    if (this.queryMetrics.length === 0) {
      return {
        totalQueries: 0,
        avgExecutionTime: 0,
        slowQueries: 0,
        cacheHitRate: 0,
      };
    }

    const total = this.queryMetrics.length;
    const totalTime = this.queryMetrics.reduce((sum, m) => sum + m.executionTime, 0);
    const avgTime = totalTime / total;
    const slow = this.queryMetrics.filter(m => m.executionTime > this.slowQueryThreshold).length;
    const cached = this.queryMetrics.filter(m => m.cached).length;

    return {
      totalQueries: total,
      avgExecutionTime: Math.round(avgTime * 100) / 100,
      slowQueries: slow,
      cacheHitRate: Math.round((cached / total) * 100) / 100,
    };
  }

  /**
   * Configure connection pool
   */
  configurePool(config: Partial<ConnectionPoolConfig>): void {
    this.poolConfig = { ...this.poolConfig, ...config };
  }

  /**
   * Get pool configuration
   */
  getPoolConfig(): ConnectionPoolConfig {
    return { ...this.poolConfig };
  }

  /**
   * Set slow query threshold
   */
  setSlowQueryThreshold(ms: number): void {
    this.slowQueryThreshold = ms;
  }

  /**
   * Clear metrics
   */
  clearMetrics(): void {
    this.queryMetrics = [];
  }

  // Private helpers

  private sanitizeQuery(query: string): string {
    // Remove sensitive values
    return query
      .replace(/\b\d+\b/g, '?')
      .replace(/'[^']*'/g, '?')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private extractQueryPattern(query: string): string {
    // Extract the basic query pattern
    return query
      .replace(/SELECT .* FROM/, 'SELECT ... FROM')
      .replace(/WHERE .*/, 'WHERE ...')
      .replace(/VALUES .*/, 'VALUES ...')
      .trim();
  }

  private generateIndexRecommendation(pattern: string): IndexRecommendation | null {
    // Simple heuristics for index recommendations
    if (pattern.includes('WHERE')) {
      const tableMatch = pattern.match(/FROM\s+(\w+)/i);
      if (tableMatch) {
        return {
          table: tableMatch[1],
          columns: ['id'], // Simplified
          type: 'btree',
          reason: 'Frequently filtered column',
          estimatedImprovement: '50-80%',
        };
      }
    }
    return null;
  }
}

// Export singleton
export const dbOptimization = new DBOptimizationService();

// Export class for testing
export { DBOptimizationService };
