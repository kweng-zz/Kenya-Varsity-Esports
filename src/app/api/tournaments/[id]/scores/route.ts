// src/app/api/tournaments/[id]/scores/route.ts
/**
 * Live Scoring API Endpoint
 * POST: Submit score for a tournament participant
 * GET: Get scores for a tournament
 */

import { NextRequest, NextResponse } from 'next/server';
import { leaderboardService } from '@/lib/services/leaderboard';
import { checkRateLimit } from '@/lib/redis-rate-limit';

// Validation helpers
function validateScoreSubmission(body: unknown): {
  valid: boolean;
  error?: string;
  data?: {
    participantId: string;
    playerName: string;
    score: number;
    teamName?: string;
    matchId?: string;
  };
} {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body is required' };
  }

  const data = body as Record<string, unknown>;

  // Required fields
  if (!data.participantId || typeof data.participantId !== 'string') {
    return { valid: false, error: 'participantId is required' };
  }

  if (!data.playerName || typeof data.playerName !== 'string') {
    return { valid: false, error: 'playerName is required' };
  }

  if (typeof data.score !== 'number' || isNaN(data.score)) {
    return { valid: false, error: 'score must be a valid number' };
  }

  // Score bounds validation
  if (data.score < 0 || data.score > 999999999) {
    return { valid: false, error: 'score must be between 0 and 999999999' };
  }

  return {
    valid: true,
    data: {
      participantId: data.participantId,
      playerName: data.playerName,
      score: data.score,
      teamName: typeof data.teamName === 'string' ? data.teamName : undefined,
      matchId: typeof data.matchId === 'string' ? data.matchId : undefined,
    },
  };
}

/**
 * POST /api/tournaments/[id]/scores
 * Submit a score for a participant
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Rate limiting
  const rateLimitResponse = await checkRateLimit(request, 'AUTHENTICATED');
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { id: tournamentId } = await params;

    if (!tournamentId) {
      return NextResponse.json(
        { success: false, error: 'INVALID_TOURNAMENT_ID', message: 'Tournament ID is required' },
        { status: 400 }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const validation = validateScoreSubmission(body);

    if (!validation.valid || !validation.data) {
      return NextResponse.json(
        { success: false, error: 'VALIDATION_ERROR', message: validation.error },
        { status: 400 }
      );
    }

    // Submit score
    const result = await leaderboardService.submitScore({
      tournamentId,
      participantId: validation.data.participantId,
      playerName: validation.data.playerName,
      teamName: validation.data.teamName,
      score: validation.data.score,
      matchId: validation.data.matchId,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'SCORE_SUBMISSION_FAILED', message: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        tournamentId,
        participantId: validation.data.participantId,
        score: validation.data.score,
        newRank: result.newRank,
        previousRank: result.previousRank,
        rankChange: result.previousRank 
          ? result.previousRank - (result.newRank ?? 0) 
          : undefined,
      },
    });

  } catch (error) {
    console.error('[Scores API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR', message: 'Failed to submit score' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/tournaments/[id]/scores
 * Get participant scores/position
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tournamentId } = await params;
    const { searchParams } = new URL(request.url);
    const participantId = searchParams.get('participantId');

    if (!tournamentId) {
      return NextResponse.json(
        { success: false, error: 'INVALID_TOURNAMENT_ID' },
        { status: 400 }
      );
    }

    // If participantId provided, get their specific position
    if (participantId) {
      const position = await leaderboardService.getParticipantPosition(
        tournamentId,
        participantId
      );

      if (!position) {
        return NextResponse.json(
          { success: false, error: 'PARTICIPANT_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          tournamentId,
          participantId,
          rank: position.rank,
          score: position.score,
          totalParticipants: position.totalParticipants,
        },
      });
    }

    // Otherwise return top scores (redirect to leaderboard)
    return NextResponse.json({
      success: true,
      message: 'Use /api/tournaments/[id]/leaderboard for full rankings',
      redirect: `/api/tournaments/${tournamentId}/leaderboard`,
    });

  } catch (error) {
    console.error('[Scores API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
