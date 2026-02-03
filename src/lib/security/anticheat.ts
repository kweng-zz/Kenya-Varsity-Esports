// src/lib/security/anticheat.ts
/**
 * Anti-Cheat System
 * Detects suspicious behavior, score anomalies, and gaming violations
 */

import { notificationService, NotificationType } from '@/lib/services/notification';

export type ViolationType = 
  | 'score_manipulation'
  | 'rapid_actions'
  | 'impossible_timing'
  | 'duplicate_account'
  | 'automation_detected'
  | 'ip_anomaly'
  | 'device_ban'
  | 'collusion';

export interface ViolationReport {
  id: string;
  userId: string;
  tournamentId?: string;
  matchId?: string;
  type: ViolationType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  evidence: Record<string, any>;
  detectedAt: string;
  status: 'pending' | 'confirmed' | 'dismissed';
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface UserRiskProfile {
  userId: string;
  riskScore: number; // 0-100
  violations: ViolationReport[];
  flags: string[];
  lastAnalyzed: string;
  isBanned: boolean;
  banReason?: string;
  banExpiresAt?: string;
}

export interface ActionPattern {
  userId: string;
  actions: Array<{
    type: string;
    timestamp: number;
    metadata?: Record<string, any>;
  }>;
}

// Detection thresholds
const THRESHOLDS = {
  rapidActionsPerMinute: 60,
  scoreJumpPercent: 500,
  minHumanReactionMs: 100,
  suspiciousScoreVariance: 0.1,
  maxAccountsPerIP: 3,
};

class AntiCheatService {
  // Violation reports
  private violations: Map<string, ViolationReport[]> = new Map();
  
  // User risk profiles
  private riskProfiles: Map<string, UserRiskProfile> = new Map();
  
  // Action tracking for pattern analysis
  private actionPatterns: Map<string, ActionPattern> = new Map();
  
  // Banned entities
  private bannedUsers: Set<string> = new Set();
  private bannedIPs: Set<string> = new Set();
  private bannedDevices: Set<string> = new Set();

  /**
   * Analyze user action for suspicious behavior
   */
  async analyzeAction(
    userId: string,
    action: {
      type: string;
      tournamentId?: string;
      matchId?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<{ allowed: boolean; violations: ViolationType[] }> {
    const violations: ViolationType[] = [];

    // Check if user is banned
    if (this.bannedUsers.has(userId)) {
      return { allowed: false, violations: ['device_ban'] };
    }

    // Track action
    this.trackAction(userId, action.type, action.metadata);

    // Check for rapid actions
    if (this.detectRapidActions(userId)) {
      violations.push('rapid_actions');
    }

    // Check for automation patterns
    if (this.detectAutomation(userId)) {
      violations.push('automation_detected');
    }

    // Score-specific checks
    if (action.type === 'score_submit' && action.metadata?.score) {
      if (this.detectScoreManipulation(userId, action.metadata.score)) {
        violations.push('score_manipulation');
      }
    }

    // Timing checks
    if (action.metadata?.reactionTime !== undefined) {
      if (action.metadata.reactionTime < THRESHOLDS.minHumanReactionMs) {
        violations.push('impossible_timing');
      }
    }

    // Report violations
    for (const type of violations) {
      await this.reportViolation(userId, type, {
        action,
        detectedAt: new Date().toISOString(),
      }, action.tournamentId, action.matchId);
    }

    // Update risk profile
    await this.updateRiskProfile(userId);

    // Allow if no critical violations
    const criticalViolations = violations.filter(v => 
      v === 'score_manipulation' || v === 'automation_detected'
    );

    return {
      allowed: criticalViolations.length === 0,
      violations,
    };
  }

  /**
   * Report a violation
   */
  async reportViolation(
    userId: string,
    type: ViolationType,
    evidence: Record<string, any>,
    tournamentId?: string,
    matchId?: string
  ): Promise<ViolationReport> {
    const severity = this.determineSeverity(type, evidence);

    const violation: ViolationReport = {
      id: `violation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      tournamentId,
      matchId,
      type,
      severity,
      evidence,
      detectedAt: new Date().toISOString(),
      status: 'pending',
    };

    // Store violation
    const userViolations = this.violations.get(userId) || [];
    userViolations.push(violation);
    this.violations.set(userId, userViolations);

    // Notify admins for high/critical violations
    if (severity === 'high' || severity === 'critical') {
      await notificationService.sendToUser('admin', {
        type: NotificationType.SYSTEM_ALERT,
        title: `Anti-Cheat: ${severity.toUpperCase()} Violation`,
        message: `User ${userId}: ${type}`,
        data: { violationId: violation.id, userId, type, severity },
      });
    }

    // Auto-ban for critical violations
    if (severity === 'critical') {
      await this.banUser(userId, type, 24 * 60 * 60 * 1000); // 24 hour ban
    }

    return violation;
  }

  /**
   * Get user risk profile
   */
  async getRiskProfile(userId: string): Promise<UserRiskProfile> {
    let profile = this.riskProfiles.get(userId);
    
    if (!profile) {
      profile = {
        userId,
        riskScore: 0,
        violations: [],
        flags: [],
        lastAnalyzed: new Date().toISOString(),
        isBanned: false,
      };
      this.riskProfiles.set(userId, profile);
    }

    return profile;
  }

  /**
   * Ban a user
   */
  async banUser(
    userId: string,
    reason: string,
    durationMs?: number
  ): Promise<{ success: boolean }> {
    this.bannedUsers.add(userId);

    const profile = await this.getRiskProfile(userId);
    profile.isBanned = true;
    profile.banReason = reason;
    
    if (durationMs) {
      profile.banExpiresAt = new Date(Date.now() + durationMs).toISOString();
    }

    this.riskProfiles.set(userId, profile);

    // Notify user
    await notificationService.sendToUser(userId, {
      type: NotificationType.SYSTEM_ALERT,
      title: 'Account Suspended',
      message: `Your account has been suspended: ${reason}`,
      data: { reason, expiresAt: profile.banExpiresAt },
    });

    return { success: true };
  }

  /**
   * Unban a user
   */
  async unbanUser(userId: string): Promise<{ success: boolean }> {
    this.bannedUsers.delete(userId);

    const profile = await this.getRiskProfile(userId);
    profile.isBanned = false;
    profile.banReason = undefined;
    profile.banExpiresAt = undefined;
    this.riskProfiles.set(userId, profile);

    return { success: true };
  }

  /**
   * Check if user is banned
   */
  async isUserBanned(userId: string): Promise<boolean> {
    if (!this.bannedUsers.has(userId)) {
      return false;
    }

    const profile = await this.getRiskProfile(userId);
    
    // Check if ban has expired
    if (profile.banExpiresAt && new Date() > new Date(profile.banExpiresAt)) {
      await this.unbanUser(userId);
      return false;
    }

    return true;
  }

  /**
   * Resolve a violation
   */
  async resolveViolation(
    violationId: string,
    status: 'confirmed' | 'dismissed',
    resolvedBy: string
  ): Promise<{ success: boolean }> {
    for (const [userId, violations] of this.violations.entries()) {
      const violation = violations.find(v => v.id === violationId);
      if (violation) {
        violation.status = status;
        violation.resolvedBy = resolvedBy;
        violation.resolvedAt = new Date().toISOString();
        
        // Update risk profile
        await this.updateRiskProfile(userId);
        
        return { success: true };
      }
    }

    return { success: false };
  }

  /**
   * Get pending violations
   */
  async getPendingViolations(): Promise<ViolationReport[]> {
    const pending: ViolationReport[] = [];
    
    for (const violations of this.violations.values()) {
      pending.push(...violations.filter(v => v.status === 'pending'));
    }

    return pending.sort((a, b) => 
      new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
    );
  }

  // Private detection methods

  private trackAction(
    userId: string,
    type: string,
    metadata?: Record<string, any>
  ): void {
    let pattern = this.actionPatterns.get(userId);
    
    if (!pattern) {
      pattern = { userId, actions: [] };
    }

    pattern.actions.push({
      type,
      timestamp: Date.now(),
      metadata,
    });

    // Keep only last 100 actions
    if (pattern.actions.length > 100) {
      pattern.actions = pattern.actions.slice(-100);
    }

    this.actionPatterns.set(userId, pattern);
  }

  private detectRapidActions(userId: string): boolean {
    const pattern = this.actionPatterns.get(userId);
    if (!pattern) return false;

    const oneMinuteAgo = Date.now() - 60 * 1000;
    const recentActions = pattern.actions.filter(a => a.timestamp > oneMinuteAgo);

    return recentActions.length > THRESHOLDS.rapidActionsPerMinute;
  }

  private detectAutomation(userId: string): boolean {
    const pattern = this.actionPatterns.get(userId);
    if (!pattern || pattern.actions.length < 10) return false;

    // Check for suspiciously consistent timing
    const intervals: number[] = [];
    for (let i = 1; i < pattern.actions.length; i++) {
      intervals.push(pattern.actions[i].timestamp - pattern.actions[i - 1].timestamp);
    }

    if (intervals.length < 5) return false;

    const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = stdDev / mean;

    // Very low variance suggests automation
    return coefficientOfVariation < THRESHOLDS.suspiciousScoreVariance;
  }

  private detectScoreManipulation(userId: string, score: number): boolean {
    // Would compare against historical scores
    // Placeholder: flag extremely high scores
    return score > 10000000;
  }

  private determineSeverity(
    type: ViolationType,
    evidence: Record<string, any>
  ): ViolationReport['severity'] {
    const severityMap: Record<ViolationType, ViolationReport['severity']> = {
      score_manipulation: 'critical',
      automation_detected: 'high',
      duplicate_account: 'high',
      collusion: 'critical',
      rapid_actions: 'medium',
      impossible_timing: 'medium',
      ip_anomaly: 'low',
      device_ban: 'high',
    };

    return severityMap[type] || 'low';
  }

  private async updateRiskProfile(userId: string): Promise<void> {
    const profile = await this.getRiskProfile(userId);
    const violations = this.violations.get(userId) || [];

    // Calculate risk score based on violations
    let score = 0;
    const severityWeights = { low: 5, medium: 15, high: 30, critical: 50 };

    for (const violation of violations) {
      if (violation.status === 'confirmed') {
        score += severityWeights[violation.severity];
      } else if (violation.status === 'pending') {
        score += severityWeights[violation.severity] * 0.5;
      }
    }

    profile.riskScore = Math.min(100, score);
    profile.violations = violations;
    profile.lastAnalyzed = new Date().toISOString();

    // Add flags based on risk score
    profile.flags = [];
    if (profile.riskScore >= 75) profile.flags.push('HIGH_RISK');
    if (profile.riskScore >= 50) profile.flags.push('ELEVATED_RISK');
    if (violations.some(v => v.type === 'automation_detected')) profile.flags.push('BOT_SUSPECTED');

    this.riskProfiles.set(userId, profile);
  }
}

// Export singleton
export const antiCheat = new AntiCheatService();

// Export class for testing
export { AntiCheatService };
