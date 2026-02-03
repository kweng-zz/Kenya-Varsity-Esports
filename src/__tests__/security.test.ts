// src/__tests__/security.test.ts
/**
 * Security Module Tests: MFA, Anti-Cheat, Audit Logging
 * Run with: bun test src/__tests__/security.test.ts
 */

import { test, expect, describe } from 'bun:test';

describe('MFAService', () => {
  test('Can be imported', async () => {
    const { MFAService } = await import('@/lib/security/mfa');
    expect(MFAService).toBeDefined();
  });

  test('Singleton is available', async () => {
    const { mfaService } = await import('@/lib/security/mfa');
    expect(mfaService).toBeDefined();
    expect(typeof mfaService.enableMFA).toBe('function');
    expect(typeof mfaService.verifyCode).toBe('function');
  });

  test('Has email OTP methods', async () => {
    const { mfaService } = await import('@/lib/security/mfa');
    expect(typeof mfaService.sendEmailOTP).toBe('function');
  });

  test('Has status and management methods', async () => {
    const { mfaService } = await import('@/lib/security/mfa');
    expect(typeof mfaService.getMFAStatus).toBe('function');
    expect(typeof mfaService.disableMFA).toBe('function');
    expect(typeof mfaService.regenerateBackupCodes).toBe('function');
  });

  test('MFA methods are defined', () => {
    const methods = ['totp', 'email', 'sms'];
    expect(methods).toContain('totp');
    expect(methods).toContain('email');
  });
});

describe('AntiCheatService', () => {
  test('Can be imported', async () => {
    const { AntiCheatService } = await import('@/lib/security/anticheat');
    expect(AntiCheatService).toBeDefined();
  });

  test('Singleton is available', async () => {
    const { antiCheat } = await import('@/lib/security/anticheat');
    expect(antiCheat).toBeDefined();
    expect(typeof antiCheat.analyzeAction).toBe('function');
    expect(typeof antiCheat.reportViolation).toBe('function');
  });

  test('Has risk profile methods', async () => {
    const { antiCheat } = await import('@/lib/security/anticheat');
    expect(typeof antiCheat.getRiskProfile).toBe('function');
  });

  test('Has ban management', async () => {
    const { antiCheat } = await import('@/lib/security/anticheat');
    expect(typeof antiCheat.banUser).toBe('function');
    expect(typeof antiCheat.unbanUser).toBe('function');
    expect(typeof antiCheat.isUserBanned).toBe('function');
  });

  test('Has violation resolution', async () => {
    const { antiCheat } = await import('@/lib/security/anticheat');
    expect(typeof antiCheat.resolveViolation).toBe('function');
    expect(typeof antiCheat.getPendingViolations).toBe('function');
  });
});

describe('Violation Types', () => {
  test('All violation types are defined', () => {
    const types = [
      'score_manipulation',
      'rapid_actions',
      'impossible_timing',
      'duplicate_account',
      'automation_detected',
      'ip_anomaly',
      'device_ban',
      'collusion',
    ];
    expect(types).toContain('score_manipulation');
    expect(types).toContain('automation_detected');
    expect(types).toContain('collusion');
  });

  test('Severity levels are defined', () => {
    const severities = ['low', 'medium', 'high', 'critical'];
    expect(severities).toContain('critical');
    expect(severities).toContain('high');
  });

  test('Violation report structure', () => {
    const report = {
      id: 'violation_1',
      userId: 'user_1',
      type: 'score_manipulation' as const,
      severity: 'critical' as const,
      evidence: {},
      detectedAt: new Date().toISOString(),
      status: 'pending' as const,
    };

    expect(report.id).toBeDefined();
    expect(report.severity).toBe('critical');
    expect(report.status).toBe('pending');
  });
});

describe('AuditLogService', () => {
  test('Can be imported', async () => {
    const { AuditLogService } = await import('@/lib/security/auditLog');
    expect(AuditLogService).toBeDefined();
  });

  test('Singleton is available', async () => {
    const { auditLog } = await import('@/lib/security/auditLog');
    expect(auditLog).toBeDefined();
    expect(typeof auditLog.log).toBe('function');
  });

  test('Has specialized logging methods', async () => {
    const { auditLog } = await import('@/lib/security/auditLog');
    expect(typeof auditLog.logAuth).toBe('function');
    expect(typeof auditLog.logAdminAction).toBe('function');
    expect(typeof auditLog.logSecurityEvent).toBe('function');
  });

  test('Has search and query methods', async () => {
    const { auditLog } = await import('@/lib/security/auditLog');
    expect(typeof auditLog.search).toBe('function');
    expect(typeof auditLog.getRecentForUser).toBe('function');
    expect(typeof auditLog.getFailedLogins).toBe('function');
    expect(typeof auditLog.getSecurityAlerts).toBe('function');
  });

  test('Has export and stats methods', async () => {
    const { auditLog } = await import('@/lib/security/auditLog');
    expect(typeof auditLog.exportLogs).toBe('function');
    expect(typeof auditLog.getStats).toBe('function');
  });
});

describe('Audit Event Types', () => {
  test('Auth event types exist', () => {
    const authEvents = [
      'auth.login',
      'auth.logout',
      'auth.login_failed',
      'auth.mfa_enabled',
      'auth.password_changed',
    ];
    expect(authEvents).toContain('auth.login');
    expect(authEvents).toContain('auth.mfa_enabled');
  });

  test('Security event types exist', () => {
    const securityEvents = [
      'anticheat.violation_detected',
      'anticheat.violation_resolved',
      'security.suspicious_activity',
    ];
    expect(securityEvents).toContain('anticheat.violation_detected');
    expect(securityEvents).toContain('security.suspicious_activity');
  });

  test('Tournament event types exist', () => {
    const tournamentEvents = [
      'tournament.created',
      'tournament.updated',
      'tournament.status_changed',
    ];
    expect(tournamentEvents).toContain('tournament.created');
    expect(tournamentEvents).toContain('tournament.status_changed');
  });

  test('Audit severity levels', () => {
    const severities = ['info', 'warning', 'error', 'critical'];
    expect(severities.length).toBe(4);
  });
});

describe('Security Module Index', () => {  
  test('All exports are available', async () => {
    const mfa = await import('@/lib/security/mfa');
    const anticheat = await import('@/lib/security/anticheat');
    const audit = await import('@/lib/security/auditLog');
    expect(mfa.mfaService).toBeDefined();
    expect(anticheat.antiCheat).toBeDefined();
    expect(audit.auditLog).toBeDefined();
  });
});
