// src/app/api/tournaments/[id]/status/route.ts
/**
 * Tournament Status API Endpoint
 * GET: Get current tournament status
 * PATCH: Update tournament status (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { broadcastTournamentStatusChange } from '@/lib/realtime/tournament-subscription';
import { cache, CACHE_KEYS, CACHE_TTL } from '@/lib/cache';

// Valid status transitions
const VALID_STATUS_TRANSITIONS: Record<string, string[]> = {
  'draft': ['published'],
  'published': ['registration_open', 'archived'],
  'registration_open': ['registration_closed', 'archived'],
  'registration_closed': ['ongoing', 'archived'],
  'ongoing': ['completed', 'archived'],
  'completed': ['archived'],
  'archived': [],
};

const VALID_TOURNAMENT_STATUSES = [
  'draft',
  'published', 
  'registration_open',
  'registration_closed',
  'ongoing',
  'completed',
  'archived',
];

/**
 * GET /api/tournaments/[id]/status
 * Get current tournament status
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tournamentId } = await params;

    if (!tournamentId) {
      return NextResponse.json(
        { success: false, error: 'INVALID_TOURNAMENT_ID' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `${CACHE_KEYS.tournament(tournamentId)}:status`;
    const cachedStatus = await cache.get<{ 
      status: string; 
      updatedAt: number;
      message?: string;
    }>(cacheKey);

    if (cachedStatus) {
      return NextResponse.json({
        success: true,
        data: {
          tournamentId,
          ...cachedStatus,
        },
        cached: true,
      });
    }

    // TODO: Fetch from database
    // For now, return a placeholder
    return NextResponse.json({
      success: true,
      data: {
        tournamentId,
        status: 'published',
        updatedAt: Date.now(),
      },
      cached: false,
    });

  } catch (error) {
    console.error('[Status API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/tournaments/[id]/status
 * Update tournament status
 */
export async function PATCH(
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
    const { status: newStatus, message } = body;

    if (!newStatus || !VALID_TOURNAMENT_STATUSES.includes(newStatus)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'INVALID_STATUS', 
          message: `Status must be one of: ${VALID_TOURNAMENT_STATUSES.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Get current status from cache/database
    const cacheKey = `${CACHE_KEYS.tournament(tournamentId)}:status`;
    const currentData = await cache.get<{ status: string }>(cacheKey);
    const currentStatus = currentData?.status || 'draft';

    // Validate transition
    const allowedTransitions = VALID_STATUS_TRANSITIONS[currentStatus] || [];
    if (!allowedTransitions.includes(newStatus)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'INVALID_TRANSITION',
          message: `Cannot transition from '${currentStatus}' to '${newStatus}'. Allowed: ${allowedTransitions.join(', ') || 'none'}`,
        },
        { status: 400 }
      );
    }

    // Update status in cache
    const statusData = {
      status: newStatus,
      updatedAt: Date.now(),
      message,
    };
    await cache.set(cacheKey, statusData, CACHE_TTL.TOURNAMENT_DETAIL);

    // TODO: Update in database
    // await updateTournamentStatus(tournamentId, newStatus);

    // Broadcast status change via WebSocket
    broadcastTournamentStatusChange(tournamentId, currentStatus, newStatus, message);

    // Invalidate tournament cache
    await cache.invalidateTournamentCache(tournamentId);

    return NextResponse.json({
      success: true,
      data: {
        tournamentId,
        previousStatus: currentStatus,
        newStatus,
        message,
        updatedAt: statusData.updatedAt,
      },
    });

  } catch (error) {
    console.error('[Status API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
