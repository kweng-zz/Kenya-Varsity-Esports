// src/lib/security/auditLog.ts
/**
 * Security Audit Logging Service
 * Tracks all security-relevant events for compliance and forensics
 */

export type AuditEventType =
  | 'auth.login'
  | 'auth.logout'
  | 'auth.login_failed'
  | 'auth.mfa_enabled'
  | 'auth.mfa_verified'
  | 'auth.password_changed'
  | 'auth.session_created'
  | 'auth.session_revoked'
  | 'user.created'
  | 'user.updated'
  | 'user.deleted'
  | 'user.role_changed'
  | 'user.banned'
  | 'user.unbanned'
  | 'tournament.created'
  | 'tournament.updated'
  | 'tournament.deleted'
  | 'tournament.status_changed'
  | 'match.score_submitted'
  | 'match.result_disputed'
  | 'match.result_verified'
  | 'anticheat.violation_detected'
  | 'anticheat.violation_resolved'
  | 'admin.settings_changed'
  | 'admin.user_impersonated'
  | 'api.rate_limited'
  | 'security.suspicious_activity'
  | 'data.exported'
  | 'data.deleted';

export type AuditSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventType: AuditEventType;
  severity: AuditSeverity;
  actorId: string;
  actorType: 'user' | 'admin' | 'system' | 'api';
  actorIP?: string;
  targetId?: string;
  targetType?: string;
  action: string;
  details: Record<string, any>;
  metadata: {
    userAgent?: string;
    sessionId?: string;
    requestId?: string;
    country?: string;
  };
  success: boolean;
  errorMessage?: string;
}

export interface AuditSearchOptions {
  eventTypes?: AuditEventType[];
  severities?: AuditSeverity[];
  actorId?: string;
  targetId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  pageSize?: number;
}

export interface AuditSearchResult {
  entries: AuditLogEntry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

class AuditLogService {
  // In-memory storage (use database in production)
  private logs: AuditLogEntry[] = [];

  /**
   * Log an audit event
   */
  async log(
    eventType: AuditEventType,
    actor: {
      id: string;
      type: AuditLogEntry['actorType'];
      ip?: string;
    },
    action: string,
    options: {
      targetId?: string;
      targetType?: string;
      details?: Record<string, any>;
      metadata?: AuditLogEntry['metadata'];
      success?: boolean;
      errorMessage?: string;
    } = {}
  ): Promise<AuditLogEntry> {
    const entry: AuditLogEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      eventType,
      severity: this.determineSeverity(eventType, options.success ?? true),
      actorId: actor.id,
      actorType: actor.type,
      actorIP: actor.ip,
      targetId: options.targetId,
      targetType: options.targetType,
      action,
      details: options.details || {},
      metadata: options.metadata || {},
      success: options.success ?? true,
      errorMessage: options.errorMessage,
    };

    this.logs.push(entry);

    // Keep only last 10000 entries in memory
    if (this.logs.length > 10000) {
      this.logs = this.logs.slice(-10000);
    }

    // Log critical events to console
    if (entry.severity === 'critical' || entry.severity === 'error') {
      console.warn('[AUDIT]', entry.eventType, entry.action, entry.details);
    }

    return entry;
  }

  /**
   * Log authentication event
   */
  async logAuth(
    eventType: Extract<AuditEventType, `auth.${string}`>,
    userId: string,
    ip: string,
    success: boolean,
    details?: Record<string, any>
  ): Promise<AuditLogEntry> {
    return this.log(
      eventType,
      { id: userId, type: 'user', ip },
      eventType.replace('auth.', '').replace('_', ' '),
      { success, details }
    );
  }

  /**
   * Log admin action
   */
  async logAdminAction(
    adminId: string,
    action: string,
    targetId: string,
    targetType: string,
    details?: Record<string, any>,
    ip?: string
  ): Promise<AuditLogEntry> {
    return this.log(
      'admin.settings_changed',
      { id: adminId, type: 'admin', ip },
      action,
      { targetId, targetType, details }
    );
  }

  /**
   * Log security event
   */
  async logSecurityEvent(
    eventType: AuditEventType,
    actorId: string,
    action: string,
    details: Record<string, any>,
    ip?: string
  ): Promise<AuditLogEntry> {
    return this.log(
      eventType,
      { id: actorId, type: 'system', ip },
      action,
      { details, success: true }
    );
  }

  /**
   * Search audit logs
   */
  async search(options: AuditSearchOptions = {}): Promise<AuditSearchResult> {
    let filtered = [...this.logs];

    // Apply filters
    if (options.eventTypes?.length) {
      filtered = filtered.filter(e => options.eventTypes!.includes(e.eventType));
    }

    if (options.severities?.length) {
      filtered = filtered.filter(e => options.severities!.includes(e.severity));
    }

    if (options.actorId) {
      filtered = filtered.filter(e => e.actorId === options.actorId);
    }

    if (options.targetId) {
      filtered = filtered.filter(e => e.targetId === options.targetId);
    }

    if (options.startDate) {
      filtered = filtered.filter(e => new Date(e.timestamp) >= options.startDate!);
    }

    if (options.endDate) {
      filtered = filtered.filter(e => new Date(e.timestamp) <= options.endDate!);
    }

    // Sort by timestamp descending
    filtered.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Paginate
    const page = options.page || 1;
    const pageSize = Math.min(options.pageSize || 50, 100);
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const entries = filtered.slice(start, start + pageSize);

    return { entries, total, page, pageSize, totalPages };
  }

  /**
   * Get recent entries for a user
   */
  async getRecentForUser(
    userId: string,
    limit: number = 20
  ): Promise<AuditLogEntry[]> {
    return this.logs
      .filter(e => e.actorId === userId || e.targetId === userId)
      .sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, limit);
  }

  /**
   * Get failed login attempts
   */
  async getFailedLogins(
    userId?: string,
    since?: Date
  ): Promise<AuditLogEntry[]> {
    return this.logs.filter(e => {
      if (e.eventType !== 'auth.login_failed') return false;
      if (userId && e.actorId !== userId) return false;
      if (since && new Date(e.timestamp) < since) return false;
      return true;
    });
  }

  /**
   * Get security alerts
   */
  async getSecurityAlerts(limit: number = 50): Promise<AuditLogEntry[]> {
    return this.logs
      .filter(e => e.severity === 'critical' || e.severity === 'error')
      .sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, limit);
  }

  /**
   * Export logs for compliance
   */
  async exportLogs(options: AuditSearchOptions): Promise<{
    data: AuditLogEntry[];
    exportedAt: string;
    totalRecords: number;
  }> {
    const result = await this.search({ ...options, pageSize: 10000 });
    
    // Log the export action
    await this.log(
      'data.exported',
      { id: 'system', type: 'system' },
      'Audit logs exported',
      { details: { recordCount: result.total, filters: options } }
    );

    return {
      data: result.entries,
      exportedAt: new Date().toISOString(),
      totalRecords: result.total,
    };
  }

  /**
   * Get statistics
   */
  async getStats(since?: Date): Promise<{
    totalEvents: number;
    bySeverity: Record<AuditSeverity, number>;
    byEventType: Record<string, number>;
    failedLogins: number;
    securityAlerts: number;
  }> {
    let filtered = this.logs;
    
    if (since) {
      filtered = filtered.filter(e => new Date(e.timestamp) >= since);
    }

    const bySeverity: Record<AuditSeverity, number> = {
      info: 0,
      warning: 0,
      error: 0,
      critical: 0,
    };

    const byEventType: Record<string, number> = {};

    for (const entry of filtered) {
      bySeverity[entry.severity]++;
      byEventType[entry.eventType] = (byEventType[entry.eventType] || 0) + 1;
    }

    return {
      totalEvents: filtered.length,
      bySeverity,
      byEventType,
      failedLogins: byEventType['auth.login_failed'] || 0,
      securityAlerts: bySeverity.critical + bySeverity.error,
    };
  }

  // Private methods

  private determineSeverity(
    eventType: AuditEventType,
    success: boolean
  ): AuditSeverity {
    // Failed events are higher severity
    if (!success) {
      if (eventType.startsWith('auth.')) return 'warning';
      return 'error';
    }

    // Critical event types
    if (eventType === 'anticheat.violation_detected') return 'critical';
    if (eventType === 'user.banned') return 'warning';
    if (eventType === 'security.suspicious_activity') return 'critical';
    if (eventType === 'admin.user_impersonated') return 'warning';
    if (eventType === 'data.deleted') return 'warning';

    // Default to info
    return 'info';
  }
}

// Export singleton
export const auditLog = new AuditLogService();

// Export class for testing
export { AuditLogService };
