// src/app/api/admin/tournaments/[id]/route.ts
/**
 * Individual Tournament Management API (Admin)
 * GET: Get tournament by ID
 * PATCH: Update tournament
 * DELETE: Delete tournament
 */

import { NextRequest, NextResponse } from 'next/server';
import { tournamentManagement } from '@/lib/services/tournamentManagement';
import { checkRateLimit } from '@/lib/redis-rate-limit';

/**
 * GET /api/admin/tournaments/[id]
 * Get tournament by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const tournament = await tournamentManagement.getById(id);

    if (!tournament) {
      return NextResponse.json(
        { success: false, error: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: tournament,
    });

  } catch (error) {
    console.error('[Admin Tournament API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/tournaments/[id]
 * Update tournament
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimitResponse = await checkRateLimit(request, 'ADMIN');
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { id } = await params;
    const body = await request.json();

    const result = await tournamentManagement.update(id, body);

    if (!result.success) {
      const status = result.error === 'Tournament not found' ? 404 : 400;
      return NextResponse.json(
        { success: false, error: 'UPDATE_FAILED', message: result.error },
        { status }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.tournament,
    });

  } catch (error) {
    console.error('[Admin Tournament API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/tournaments/[id]
 * Delete tournament (draft only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimitResponse = await checkRateLimit(request, 'ADMIN');
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { id } = await params;

    const result = await tournamentManagement.delete(id);

    if (!result.success) {
      const status = result.error === 'Tournament not found' ? 404 : 400;
      return NextResponse.json(
        { success: false, error: 'DELETE_FAILED', message: result.error },
        { status }
      );
    }

    return NextResponse.json({
      success: true,
      data: { deleted: true },
    });

  } catch (error) {
    console.error('[Admin Tournament API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
