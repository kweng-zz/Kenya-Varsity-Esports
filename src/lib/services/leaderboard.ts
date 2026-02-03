// src/lib/services/leaderboard.ts
/**
 * Leaderboard service with real-time updates and Redis caching
 */

import { cache, CACHE_KEYS, CACHE_TTL } from '@/lib/cache';
import { broadcastLeaderboardUpdate, broadcastScoreUpdate } from '@/lib/realtime/websocket-server';
import type { LeaderboardEntry } from '@/lib/realtime/types';

export interface LeaderboardOptions {
  page?: number;
  pageSize?: number;
  includeTies?: boolean;
}

export interface LeaderboardResult {
  entries: LeaderboardEntry[];
  totalParticipants: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ScoreSubmission {
  tournamentId: string;
  participantId: string;
  playerName: string;
  teamName?: string;
  score: number;
  matchId?: string;
  metadata?: Record<string, unknown>;
}

class LeaderboardService {
  /**
   * Submit a score and update leaderboard
   */
  async submitScore(submission: ScoreSubmission): Promise<{
    success: boolean;
    newRank?: number;
    previousRank?: number;
    error?: string;
  }> {
    try {
      const { tournamentId, participantId, playerName, score, teamName } = submission;

      // Get current rank before update
      const previousRankData = await cache.getParticipantRank(tournamentId, participantId);
      const previousRank = previousRankData?.rank;

      // Update score in Redis sorted set
      const updated = await cache.updateLeaderboardScore(tournamentId, participantId, score);
      
      if (!updated) {
        return { success: false, error: 'Failed to update leaderboard' };
      }

      // Get new rank
      const newRankData = await cache.getParticipantRank(tournamentId, participantId);
      const newRank = newRankData?.rank ?? 1;

      // Store participant metadata for display
      await this.updateParticipantMetadata(tournamentId, participantId, {
        playerName,
        teamName,
        lastScore: score,
        updatedAt: Date.now(),
      });

      // Broadcast real-time update
      broadcastScoreUpdate(tournamentId, participantId, score, {
        playerName,
        newRank,
        previousRank,
      });

      // If rank changed, also broadcast leaderboard update
      if (previousRank !== newRank) {
        const topEntries = await this.getTopEntries(tournamentId, 10);
        broadcastLeaderboardUpdate(tournamentId, topEntries);
      }

      return {
        success: true,
        newRank,
        previousRank,
      };
    } catch (error) {
      console.error('[Leaderboard] Error submitting score:', error);
      return { success: false, error: 'Internal error' };
    }
  }

  /**
   * Get leaderboard with pagination
   */
  async getLeaderboard(
    tournamentId: string,
    options: LeaderboardOptions = {}
  ): Promise<LeaderboardResult> {
    const { page = 1, pageSize = 50 } = options;
    
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    // Get rankings from Redis
    const rankings = await cache.getLeaderboard(tournamentId, start, end);
    const totalParticipants = await cache.getLeaderboardCount(tournamentId);

    // Enrich with participant metadata
    const entries = await Promise.all(
      rankings.map(async (ranking) => {
        const metadata = await this.getParticipantMetadata(tournamentId, ranking.participantId);
        return {
          rank: ranking.rank,
          participantId: ranking.participantId,
          playerName: metadata?.playerName || 'Unknown Player',
          teamName: metadata?.teamName,
          score: ranking.score,
        } as LeaderboardEntry;
      })
    );

    return {
      entries,
      totalParticipants,
      page,
      pageSize,
      totalPages: Math.ceil(totalParticipants / pageSize),
    };
  }

  /**
   * Get top N entries for broadcasting
   */
  async getTopEntries(
    tournamentId: string,
    count: number = 10
  ): Promise<Array<{ rank: number; participantId: string; playerName: string; score: number }>> {
    const rankings = await cache.getLeaderboard(tournamentId, 0, count - 1);
    
    return Promise.all(
      rankings.map(async (ranking) => {
        const metadata = await this.getParticipantMetadata(tournamentId, ranking.participantId);
        return {
          rank: ranking.rank,
          participantId: ranking.participantId,
          playerName: metadata?.playerName || 'Unknown',
          score: ranking.score,
        };
      })
    );
  }

  /**
   * Get participant's position in leaderboard
   */
  async getParticipantPosition(
    tournamentId: string,
    participantId: string
  ): Promise<{ rank: number; score: number; totalParticipants: number } | null> {
    const rankData = await cache.getParticipantRank(tournamentId, participantId);
    if (!rankData) return null;

    const totalParticipants = await cache.getLeaderboardCount(tournamentId);

    return {
      ...rankData,
      totalParticipants,
    };
  }

  /**
   * Initialize leaderboard with participants
   */
  async initializeLeaderboard(
    tournamentId: string,
    participants: Array<{ 
      participantId: string; 
      playerName: string; 
      teamName?: string; 
      initialScore?: number;
    }>
  ): Promise<boolean> {
    try {
      for (const participant of participants) {
        await cache.updateLeaderboardScore(
          tournamentId,
          participant.participantId,
          participant.initialScore ?? 0
        );
        
        await this.updateParticipantMetadata(tournamentId, participant.participantId, {
          playerName: participant.playerName,
          teamName: participant.teamName,
          updatedAt: Date.now(),
        });
      }
      return true;
    } catch (error) {
      console.error('[Leaderboard] Error initializing leaderboard:', error);
      return false;
    }
  }

  /**
   * Clear leaderboard for a tournament
   */
  async clearLeaderboard(tournamentId: string): Promise<boolean> {
    try {
      const key = CACHE_KEYS.leaderboard(tournamentId);
      await cache.delete(key);
      await cache.deletePattern(`participant:${tournamentId}:*:metadata`);
      return true;
    } catch (error) {
      console.error('[Leaderboard] Error clearing leaderboard:', error);
      return false;
    }
  }

  // Private helper methods

  private async updateParticipantMetadata(
    tournamentId: string,
    participantId: string,
    metadata: Record<string, unknown>
  ): Promise<void> {
    const key = `${CACHE_KEYS.participant(tournamentId, participantId)}:metadata`;
    await cache.set(key, metadata, CACHE_TTL.PARTICIPANT_LIST);
  }

  private async getParticipantMetadata(
    tournamentId: string,
    participantId: string
  ): Promise<{ playerName?: string; teamName?: string } | null> {
    const key = `${CACHE_KEYS.participant(tournamentId, participantId)}:metadata`;
    return cache.get(key);
  }
}

// Export singleton instance
export const leaderboardService = new LeaderboardService();

// Export class for testing
export { LeaderboardService };
