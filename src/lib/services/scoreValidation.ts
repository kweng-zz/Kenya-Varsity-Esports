// src/lib/services/scoreValidation.ts
/**
 * Score Validation Service
 * Handles score submission validation, anti-cheat checks, and score history
 */

import { cache, CACHE_KEYS } from '@/lib/cache';
import { leaderboardService } from './leaderboard';
import { notificationService, NotificationType } from './notification';
import type { Match } from './bracketGeneration';

export interface ScoreSubmission {
  matchId: string;
  tournamentId: string;
  participantId: string;
  score: number;
  metadata?: {
    gameVersion?: string;
    mapId?: string;
    duration?: number;
    kills?: number;
    deaths?: number;
    assists?: number;
  };
  submittedAt: string;
  submittedBy: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  flags: string[];
}

export interface ScoreHistory {
  matchId: string;
  submissions: ScoreSubmission[];
  finalScore?: number;
  validatedAt?: string;
  validatedBy?: string;
}

class ScoreValidationService {
  // Score history storage
  private scoreHistory: Map<string, ScoreHistory> = new Map();
  
  // Suspicious activity tracking
  private suspiciousActivity: Map<string, number> = new Map();

  /**
   * Validate and submit a score
   */
  async submitScore(submission: ScoreSubmission): Promise<{
    success: boolean;
    validation: ValidationResult;
    error?: string;
  }> {
    // Validate the submission
    const validation = await this.validateScore(submission);

    if (!validation.valid) {
      return {
        success: false,
        validation,
        error: validation.errors.join(', '),
      };
    }

    // Store in history
    this.addToHistory(submission);

    // Update leaderboard if not suspicious
    if (validation.flags.length === 0) {
      await leaderboardService.submitScore({
        tournamentId: submission.tournamentId,
        participantId: submission.participantId,
        playerName: submission.submittedBy,
        score: submission.score,
      });
    }

    // Log warnings for review
    if (validation.warnings.length > 0 || validation.flags.length > 0) {
      console.warn('[ScoreValidation] Submission flagged:', {
        matchId: submission.matchId,
        warnings: validation.warnings,
        flags: validation.flags,
      });
    }

    return { success: true, validation };
  }

  /**
   * Validate a score submission
   */
  async validateScore(submission: ScoreSubmission): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const flags: string[] = [];

    // Basic validation
    if (!submission.matchId) {
      errors.push('Match ID is required');
    }

    if (!submission.tournamentId) {
      errors.push('Tournament ID is required');
    }

    if (!submission.participantId) {
      errors.push('Participant ID is required');
    }

    if (typeof submission.score !== 'number' || submission.score < 0) {
      errors.push('Score must be a non-negative number');
    }

    // Score range validation
    if (submission.score > 1000000) {
      warnings.push('Unusually high score');
      flags.push('HIGH_SCORE');
    }

    // Rapid submission detection
    const recentSubmissions = await this.getRecentSubmissions(
      submission.participantId,
      5 * 60 * 1000 // Last 5 minutes
    );

    if (recentSubmissions.length > 10) {
      warnings.push('High submission frequency');
      flags.push('RAPID_SUBMISSION');
    }

    // Score jump detection
    const previousScore = await this.getPreviousScore(
      submission.tournamentId,
      submission.participantId
    );

    if (previousScore !== null) {
      const increase = submission.score - previousScore;
      const percentIncrease = (increase / previousScore) * 100;

      if (percentIncrease > 500) {
        warnings.push(`Large score increase: ${percentIncrease.toFixed(0)}%`);
        flags.push('SCORE_JUMP');
      }
    }

    // Track suspicious activity
    if (flags.length > 0) {
      this.trackSuspiciousActivity(submission.participantId);
    }

    // Check if participant is flagged
    const activityCount = this.suspiciousActivity.get(submission.participantId) || 0;
    if (activityCount >= 3) {
      flags.push('REPEATED_SUSPICIOUS_ACTIVITY');
      warnings.push('Multiple suspicious submissions detected');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      flags,
    };
  }

  /**
   * Submit match result with both scores
   */
  async submitMatchResult(
    matchId: string,
    tournamentId: string,
    participant1Id: string,
    participant1Score: number,
    participant2Id: string,
    participant2Score: number,
    submittedBy: string
  ): Promise<{
    success: boolean;
    winnerId?: string;
    error?: string;
  }> {
    const now = new Date().toISOString();

    // Submit both scores
    const p1Result = await this.submitScore({
      matchId,
      tournamentId,
      participantId: participant1Id,
      score: participant1Score,
      submittedAt: now,
      submittedBy,
    });

    if (!p1Result.success) {
      return { success: false, error: `Participant 1: ${p1Result.error}` };
    }

    const p2Result = await this.submitScore({
      matchId,
      tournamentId,
      participantId: participant2Id,
      score: participant2Score,
      submittedAt: now,
      submittedBy,
    });

    if (!p2Result.success) {
      return { success: false, error: `Participant 2: ${p2Result.error}` };
    }

    // Determine winner
    const winnerId = participant1Score > participant2Score 
      ? participant1Id 
      : participant2Id;

    return { success: true, winnerId };
  }

  /**
   * Dispute a score
   */
  async disputeScore(
    matchId: string,
    disputedBy: string,
    reason: string
  ): Promise<{ success: boolean; disputeId: string }> {
    const disputeId = `dispute_${Date.now()}`;

    // Mark score as disputed in history
    const history = this.scoreHistory.get(matchId);
    if (history) {
      // In production, would store dispute details
      console.log('[ScoreValidation] Score disputed:', {
        matchId,
        disputedBy,
        reason,
        disputeId,
      });
    }

    // Notify admins
    await notificationService.sendToUser('admin', {
      type: NotificationType.SYSTEM_ALERT,
      title: 'Score Dispute',
      message: `Match ${matchId} score disputed: ${reason}`,
      data: { matchId, disputeId, disputedBy, reason },
    });

    return { success: true, disputeId };
  }

  /**
   * Verify and finalize match score
   */
  async verifyScore(
    matchId: string,
    verifiedBy: string
  ): Promise<{ success: boolean }> {
    const history = this.scoreHistory.get(matchId);
    if (!history) {
      return { success: false };
    }

    history.validatedAt = new Date().toISOString();
    history.validatedBy = verifiedBy;

    return { success: true };
  }

  /**
   * Get score history for a match
   */
  async getScoreHistory(matchId: string): Promise<ScoreHistory | null> {
    return this.scoreHistory.get(matchId) || null;
  }

  // Private helpers

  private addToHistory(submission: ScoreSubmission): void {
    let history = this.scoreHistory.get(submission.matchId);
    
    if (!history) {
      history = {
        matchId: submission.matchId,
        submissions: [],
      };
      this.scoreHistory.set(submission.matchId, history);
    }

    history.submissions.push(submission);
    history.finalScore = submission.score;
  }

  private async getRecentSubmissions(
    participantId: string,
    windowMs: number
  ): Promise<ScoreSubmission[]> {
    const cutoff = Date.now() - windowMs;
    const recent: ScoreSubmission[] = [];

    for (const history of this.scoreHistory.values()) {
      for (const submission of history.submissions) {
        if (
          submission.participantId === participantId &&
          new Date(submission.submittedAt).getTime() > cutoff
        ) {
          recent.push(submission);
        }
      }
    }

    return recent;
  }

  private async getPreviousScore(
    tournamentId: string,
    participantId: string
  ): Promise<number | null> {
    // Would query leaderboard or score history
    return null;
  }

  private trackSuspiciousActivity(participantId: string): void {
    const current = this.suspiciousActivity.get(participantId) || 0;
    this.suspiciousActivity.set(participantId, current + 1);
  }
}

// Export singleton
export const scoreValidation = new ScoreValidationService();

// Export class for testing
export { ScoreValidationService };
