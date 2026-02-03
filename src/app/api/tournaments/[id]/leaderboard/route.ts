// src/app/api/tournaments/[id]/leaderboard/route.ts
/**
 * Leaderboard API Endpoint
 * GET: Get tournament leaderboard with pagination
 */

import { NextRequest, NextResponse } from 'next/server';
import { leaderboardService } from '@/lib/services/leaderboard';
import { cache, CACHE_KEYS, CACHE_TTL } from '@/lib/cache';

/**
 * GET /api/tournaments/[id]/leaderboard
 * Get paginated leaderboard for a tournament
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tournamentId } = await params;
    const { searchParams } = new URL(request.url);
    
    // Parse pagination params
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '50', 10)));

    if (!tournamentId) {
      return NextResponse.json(
        { success: false, error: 'INVALID_TOURNAMENT_ID', message: 'Tournament ID is required' },
        { status: 400 }
      );
    }

    // Check cache for this specific page
    const cacheKey = `${CACHE_KEYS.leaderboard(tournamentId)}:page:${page}:${pageSize}`;
    const cachedResult = await cache.get<{
      entries: unknown[];
      totalParticipants: number;
      totalPages: number;
    }>(cacheKey);

    if (cachedResult) {
      return NextResponse.json({
        success: true,
        data: {
          tournamentId,
          ...cachedResult,
          page,
          pageSize,
        },
        cached: true,
      }, {
        headers: {
          'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
          'X-Cache': 'HIT',
        },
      });
    }

    // Fetch leaderboard
    const result = await leaderboardService.getLeaderboard(tournamentId, {
      page,
      pageSize,
    });

    // Cache the result
    await cache.set(cacheKey, {
      entries: result.entries,
      totalParticipants: result.totalParticipants,
      totalPages: result.totalPages,
    }, CACHE_TTL.LEADERBOARD);

    return NextResponse.json({
      success: true,
      data: {
        tournamentId,
        entries: result.entries,
        totalParticipants: result.totalParticipants,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: result.totalPages,
      },
      cached: false,
    }, {
      headers: {
        'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
        'X-Cache': 'MISS',
      },
    });

  } catch (error) {
    console.error('[Leaderboard API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR', message: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tournaments/[id]/leaderboard
 * Initialize leaderboard with participants (admin only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tournamentId } = await params;

    // TODO: Add admin authentication check
    // const isAdmin = await checkAdminAuth(request);
    // if (!isAdmin) {
    //   return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 });
    // }

    const body = await request.json();

    if (!Array.isArray(body.participants)) {
      return NextResponse.json(
        { success: false, error: 'VALIDATION_ERROR', message: 'participants array is required' },
        { status: 400 }
      );
    }

    // Validate participants
    const participants = body.participants.map((p: any) => ({
      participantId: String(p.participantId || p.id),
      playerName: String(p.playerName || p.name || 'Unknown'),
      teamName: p.teamName ? String(p.teamName) : undefined,
      initialScore: typeof p.score === 'number' ? p.score : 0,
    }));

    const success = await leaderboardService.initializeLeaderboard(tournamentId, participants);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'INITIALIZATION_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        tournamentId,
        participantsAdded: participants.length,
      },
    });

  } catch (error) {
    console.error('[Leaderboard API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tournaments/[id]/leaderboard
 * Clear leaderboard (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tournamentId } = await params;

    // TODO: Add admin authentication check

    const success = await leaderboardService.clearLeaderboard(tournamentId);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'CLEAR_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { tournamentId, cleared: true },
    });

  } catch (error) {
    console.error('[Leaderboard API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
