import { NextRequest, NextResponse } from 'next/server';

interface LogEntry {
  timestamp: string;
  level: 'error' | 'warn' | 'info' | 'debug' | 'critical';
  message: string;
  userId?: string;
  articleId?: string;
  action?: string;
  ip?: string;
  userAgent?: string;
  requestId?: string;
  error?: any;
  metadata?: Record<string, any>;
}

interface LogFilter {
  startDate?: string;
  endDate?: string;
  level?: 'error' | 'warn' | 'info' | 'debug';
  userId?: string;
  articleId?: string;
  action?: string;
  limit?: number;
  search?: string;
}

interface LogAnalytics {
  totalLogs: number;
  errorCount: number;
  warnCount: number;
  infoCount: number;
  debugCount: number;
  criticalCount: number;
  timeRange: {
    earliest: string | null;
    latest: string | null;
  };
}

/**
 * Production logging service for debugging and monitoring
 * Logs errors, warnings, and performance metrics
 */
class ProductionLogger {
  private static instance: ProductionLogger;
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 logs in memory

  static getInstance(): ProductionLogger {
    if (!ProductionLogger.instance) {
      ProductionLogger.instance = new ProductionLogger();
    }
    return ProductionLogger.instance;
  }

  constructor() {
    this.startLogRotation();
  }

  private startLogRotation() {
    // Clean old logs every hour
    setInterval(() => {
      this.cleanupOldLogs();
    }, 60 * 60 * 1000);
  }

  private cleanupOldLogs() {
    const now = Date.now();
    const cutoffTime = now - (24 * 60 * 60 * 1000); // 24 hours ago
    
    this.logs = this.logs.filter(log => {
      const logTime = new Date(log.timestamp).getTime();
      return logTime > cutoffTime;
    });
    
    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  private getClientIP(request?: NextRequest): string {
    if (!request) return '127.0.0.1';
    
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

  public generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private shouldLog(level: string): boolean {
    // Different log levels for production vs development
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      // In production, log errors, warnings, and critical issues
      return ['error', 'warn', 'critical'].includes(level);
    } else {
      // In development, log everything including debug
      return ['error', 'warn', 'info', 'debug'].includes(level);
    }
  }

  log(level: 'error' | 'warn' | 'info' | 'debug', message: string, data?: Partial<LogEntry>) {
    if (!this.shouldLog(level)) return;
    
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      userId: data?.userId || 'anonymous',
      articleId: data?.articleId || '',
      action: data?.action || '',
      ip: data?.ip || this.getClientIP(),
      userAgent: data?.userAgent || '',
      requestId: data?.requestId || this.generateRequestId(),
      error: data?.error || null,
      metadata: data?.metadata || {}
    };

    this.logs.push(logEntry);
    
    // Log to console (could also log to external service in production)
    console.log(`[${level.toUpperCase()}] ${logEntry.timestamp}: ${message}`, logEntry);
  }

  logError(message: string, error?: any, data?: Partial<LogEntry>) {
    this.log('error', message, { error, ...data });
  }

  logWarning(message: string, data?: Partial<LogEntry>) {
    this.log('warn', message, data);
  }

  logInfo(message: string, data?: Partial<LogEntry>) {
    this.log('info', message, data);
  }

  logDebug(message: string, data?: Partial<LogEntry>) {
    this.log('debug', message, data);
  }

  logAction(userId: string, articleId: string, action: string, data?: any) {
    this.log('info', action, { 
      userId, 
      articleId, 
      action,
      metadata: { 
        action: action,
        timestamp: new Date().toISOString(),
        ...data
      }
    });
  }

  logSecurityEvent(event: string, userId: string, data?: any) {
    this.log('warn', `SECURITY: ${event}`, {
      userId,
      metadata: { 
        security: true,
        timestamp: new Date().toISOString(),
        ...data
      }
    });
  }

  logPerformanceMetrics(data: Record<string, any>) {
    this.log('info', 'PERFORMANCE: Database query, views', {
      metadata: { 
        performance: true,
        ...data
      }
    });
  }

  // Track API errors specifically
  logApiError(request: NextRequest, error: any, endpoint: string, userId?: string) {
    this.log('error', `API Error: ${endpoint}`, {
      userId,
      error: error ? error.message : 'Unknown error',
      action: 'api_request_failed',
      ip: this.getClientIP(request),
      userAgent: request.headers.get('user-agent') || '',
      requestId: this.generateRequestId(),
      metadata: {
        endpoint,
        method: request.method,
        statusCode: error?.status || 500,
        timestamp: new Date().toISOString()
      }
    });
  }

  // Track successful operations
  logSuccess(message: string, userId: string, articleId?: string, action?: string, data?: any) {
    this.log('info', message, {
      userId,
      action: action || 'operation_completed',
      articleId,
      metadata: {
        timestamp: new Date().toISOString(),
        ...data
      }
    });
  }

  // Get recent logs (for debugging dashboard)
  getRecentLogs(filter?: LogFilter, limit: number = 50): LogEntry[] {
    let filteredLogs = this.logs;
    
    if (filter) {
      try {
        filteredLogs = this.logs.filter(log => {
          let matchesFilter = true;
          
          if (filter.startDate) {
            const logTime = new Date(log.timestamp).getTime();
            const startTime = new Date(filter.startDate).getTime();
            matchesFilter = matchesFilter && logTime >= startTime;
          }
          
          if (filter.endDate) {
            const logTime = new Date(log.timestamp).getTime();
            const endTime = new Date(filter.endDate).getTime();
            matchesFilter = matchesFilter && logTime <= endTime;
          }
          
          if (filter.level) {
            matchesFilter = matchesFilter && filter.level === log.level;
          }
          
          if (filter.userId) {
            matchesFilter = matchesFilter && filter.userId === log.userId;
          }
          
          if (filter.articleId) {
            matchesFilter = matchesFilter && filter.articleId === log.articleId;
          }
          
          if (filter.search) {
            matchesFilter = matchesFilter && 
              log.message.toLowerCase().includes(filter.search.toLowerCase());
          }
          
          if (filter.action) {
            matchesFilter = matchesFilter && 
              (log.action?.toLowerCase().includes(filter.action.toLowerCase()) || false);
          }
          
          return matchesFilter;
        });
      } catch (error) {
        console.error('Error filtering logs:', error);
      }
    }
    
    return filteredLogs.slice(0, limit);
  }

  // Get analytics summary
  getAnalytics(): LogAnalytics {
    const errorCount = this.logs.filter(log => log.level === 'error').length;
    const warnCount = this.logs.filter(log => log.level === 'warn').length;
    const infoCount = this.logs.filter(log => log.level === 'info').length;
    const debugCount = this.logs.filter(log => log.level === 'debug').length;
    const criticalCount = this.logs.filter(log => log.level === 'critical').length;
    const totalLogs = this.logs.length;
    
    // Get time range
    const timestamps = this.logs.map(log => new Date(log.timestamp).getTime());
    const latestTime = timestamps.length > 0 ? Math.max(...timestamps) : 0;
    const earliestTime = timestamps.length > 0 ? Math.min(...timestamps) : 0;
    
    return {
      totalLogs,
      errorCount,
      warnCount,
      infoCount,
      debugCount,
      criticalCount,
      timeRange: {
        earliest: earliestTime > 0 ? new Date(earliestTime).toISOString() : null,
        latest: latestTime > 0 ? new Date(latestTime).toISOString() : null
      }
    };
  }

  // Clear logs (admin function)
  clearLogs(): void {
    this.logs = [];
    console.log('Logs cleared by administrator');
  }

  // Export logs (for external systems)
  exportLogs(): LogEntry[] {
    return [...this.logs];
  }

  // Get current log count
  getLogCount(): number {
    return this.logs.length;
  }
}

/**
 * Middleware for automatic error logging
 */
export function withErrorLogging(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(request);
    } catch (error) {
      // Log the error with context
      ProductionLogger.getInstance().logApiError(
        request,
        error,
        request.url || 'unknown_endpoint',
        request.headers.get('x-user-id') || undefined
      );
      
      // Return appropriate error response
      return NextResponse.json({
        success: false,
        error: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred. Please try again later.',
        timestamp: new Date().toISOString()
      }, { 
        status: 500,
        headers: {
          'X-Error-ID': ProductionLogger.getInstance().generateRequestId(),
          'X-Server-Timestamp': new Date().toISOString()
        }
      });
    }
  };
}

/**
 * Error tracking utilities for monitoring
 */
export const ErrorTracker = {
  trackError: (error: Error, context: Record<string, any>) => {
    ProductionLogger.getInstance().logError('Error occurred', error, context);
  },
  
  trackApiError: (request: NextRequest, error: any, endpoint?: string) => {
    ProductionLogger.getInstance().logApiError(request, error, endpoint || 'unknown');
  },
  
  trackSuccess: (message: string, context?: Record<string, any>) => {
    ProductionLogger.getInstance().logSuccess(message, context?.userId || 'anonymous', context?.articleId, context?.action, context);
  },

  trackAction: (userId: string, articleId: string, action: string, data?: any) => {
    ProductionLogger.getInstance().logAction(userId, articleId, action, data);
  },

  trackSecurityEvent: (event: string, userId: string, data?: any) => {
    ProductionLogger.getInstance().logSecurityEvent(event, userId, data);
  },

  trackPerformance: (data: Record<string, any>) => {
    ProductionLogger.getInstance().logPerformanceMetrics(data);
  }
};

export { ProductionLogger, type LogEntry, type LogFilter, type LogAnalytics };