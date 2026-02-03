// src/lib/security/mfa.ts
/**
 * Multi-Factor Authentication Service
 * Supports TOTP (Authenticator Apps) and Email OTP
 */

import { cache, CACHE_KEYS } from '@/lib/cache';

export type MFAMethod = 'totp' | 'email' | 'sms';

export interface MFAConfig {
  userId: string;
  enabled: boolean;
  methods: MFAMethod[];
  primaryMethod: MFAMethod;
  totpSecret?: string;
  backupCodes?: string[];
  lastVerified?: string;
}

export interface MFAVerification {
  userId: string;
  method: MFAMethod;
  code: string;
  expiresAt: Date;
  attempts: number;
  maxAttempts: number;
}

// TOTP constants
const TOTP_DIGITS = 6;
const TOTP_STEP = 30; // 30 seconds
const TOTP_WINDOW = 1; // Allow 1 step before/after

// OTP constants
const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 3;

class MFAService {
  // User MFA configurations
  private configs: Map<string, MFAConfig> = new Map();
  
  // Active verification sessions
  private verifications: Map<string, MFAVerification> = new Map();

  /**
   * Enable MFA for a user
   */
  async enableMFA(
    userId: string,
    method: MFAMethod
  ): Promise<{
    success: boolean;
    secret?: string;
    qrCode?: string;
    backupCodes?: string[];
  }> {
    let config = this.configs.get(userId);
    
    if (!config) {
      config = {
        userId,
        enabled: false,
        methods: [],
        primaryMethod: method,
      };
    }

    if (method === 'totp') {
      // Generate TOTP secret
      const secret = this.generateTOTPSecret();
      config.totpSecret = secret;
      
      // Generate backup codes
      config.backupCodes = this.generateBackupCodes(10);
      
      if (!config.methods.includes('totp')) {
        config.methods.push('totp');
      }

      this.configs.set(userId, config);

      return {
        success: true,
        secret,
        qrCode: this.generateQRCodeUrl(userId, secret),
        backupCodes: config.backupCodes,
      };
    }

    if (method === 'email') {
      if (!config.methods.includes('email')) {
        config.methods.push('email');
      }
      this.configs.set(userId, config);
      
      return { success: true };
    }

    return { success: false };
  }

  /**
   * Verify and activate MFA
   */
  async verifyAndActivate(
    userId: string,
    code: string
  ): Promise<{ success: boolean; error?: string }> {
    const config = this.configs.get(userId);
    if (!config) {
      return { success: false, error: 'MFA not configured' };
    }

    const isValid = await this.verifyCode(userId, code);
    if (!isValid) {
      return { success: false, error: 'Invalid verification code' };
    }

    config.enabled = true;
    config.lastVerified = new Date().toISOString();
    this.configs.set(userId, config);

    return { success: true };
  }

  /**
   * Send OTP via email
   */
  async sendEmailOTP(userId: string, email: string): Promise<{
    success: boolean;
    expiresAt?: Date;
  }> {
    const code = this.generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Store verification
    this.verifications.set(userId, {
      userId,
      method: 'email',
      code,
      expiresAt,
      attempts: 0,
      maxAttempts: MAX_OTP_ATTEMPTS,
    });

    // In production, send email here
    console.log(`[MFA] OTP for ${email}: ${code}`);

    // Cache with TTL
    await cache.set(
      `mfa:otp:${userId}`,
      { code, expiresAt: expiresAt.toISOString() },
      OTP_EXPIRY_MINUTES * 60
    );

    return { success: true, expiresAt };
  }

  /**
   * Verify a code (TOTP or OTP)
   */
  async verifyCode(userId: string, code: string): Promise<boolean> {
    const config = this.configs.get(userId);
    if (!config) return false;

    // Check backup codes first
    if (config.backupCodes?.includes(code)) {
      // Remove used backup code
      config.backupCodes = config.backupCodes.filter(c => c !== code);
      this.configs.set(userId, config);
      return true;
    }

    // Check TOTP
    if (config.methods.includes('totp') && config.totpSecret) {
      if (this.verifyTOTP(config.totpSecret, code)) {
        return true;
      }
    }

    // Check email OTP
    const verification = this.verifications.get(userId);
    if (verification && verification.method === 'email') {
      if (new Date() > verification.expiresAt) {
        this.verifications.delete(userId);
        return false;
      }

      verification.attempts++;
      
      if (verification.attempts > verification.maxAttempts) {
        this.verifications.delete(userId);
        return false;
      }

      if (verification.code === code) {
        this.verifications.delete(userId);
        return true;
      }
    }

    return false;
  }

  /**
   * Check if MFA is required for user
   */
  async isMFARequired(userId: string): Promise<boolean> {
    const config = this.configs.get(userId);
    return config?.enabled ?? false;
  }

  /**
   * Get MFA status for user
   */
  async getMFAStatus(userId: string): Promise<{
    enabled: boolean;
    methods: MFAMethod[];
    primaryMethod?: MFAMethod;
  }> {
    const config = this.configs.get(userId);
    
    if (!config) {
      return { enabled: false, methods: [] };
    }

    return {
      enabled: config.enabled,
      methods: config.methods,
      primaryMethod: config.primaryMethod,
    };
  }

  /**
   * Disable MFA
   */
  async disableMFA(userId: string): Promise<{ success: boolean }> {
    const config = this.configs.get(userId);
    if (!config) {
      return { success: false };
    }

    config.enabled = false;
    this.configs.set(userId, config);

    return { success: true };
  }

  /**
   * Regenerate backup codes
   */
  async regenerateBackupCodes(userId: string): Promise<{
    success: boolean;
    backupCodes?: string[];
  }> {
    const config = this.configs.get(userId);
    if (!config || !config.enabled) {
      return { success: false };
    }

    config.backupCodes = this.generateBackupCodes(10);
    this.configs.set(userId, config);

    return { success: true, backupCodes: config.backupCodes };
  }

  // Private helper methods

  private generateTOTPSecret(): string {
    // Generate a random base32 secret (160 bits = 32 characters)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars[Math.floor(Math.random() * chars.length)];
    }
    return secret;
  }

  private generateQRCodeUrl(userId: string, secret: string): string {
    const issuer = 'EsportsPlatform';
    const label = encodeURIComponent(`${issuer}:${userId}`);
    return `otpauth://totp/${label}?secret=${secret}&issuer=${issuer}&digits=${TOTP_DIGITS}&period=${TOTP_STEP}`;
  }

  private generateOTP(): string {
    let otp = '';
    for (let i = 0; i < OTP_LENGTH; i++) {
      otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
  }

  private generateBackupCodes(count: number): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      // Generate 8-character alphanumeric codes
      const code = Array.from({ length: 8 }, () =>
        'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]
      ).join('');
      codes.push(code);
    }
    return codes;
  }

  private verifyTOTP(secret: string, code: string): boolean {
    // Simplified TOTP verification
    // In production, use a proper TOTP library like 'otplib'
    const now = Math.floor(Date.now() / 1000 / TOTP_STEP);
    
    for (let offset = -TOTP_WINDOW; offset <= TOTP_WINDOW; offset++) {
      const expectedCode = this.generateTOTPCode(secret, now + offset);
      if (expectedCode === code) {
        return true;
      }
    }
    
    return false;
  }

  private generateTOTPCode(secret: string, counter: number): string {
    // Simplified - in production use proper HMAC-SHA1
    // This is a placeholder that generates deterministic codes
    const hash = this.simpleHash(`${secret}:${counter}`);
    return (hash % 1000000).toString().padStart(6, '0');
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}

// Export singleton
export const mfaService = new MFAService();

// Export class for testing
export { MFAService };
