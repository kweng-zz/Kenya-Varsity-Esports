// src/app/api/tournaments/[id]/participants/[participantId]/route.ts
/**
 * Individual Participant API
 * GET: Get participant details
 * PATCH: Update participant status
 * DELETE: Remove participant
 */

import { NextRequest, NextResponse } from 'next/server';
import { participantManagement } from '@/lib/services/participantManagement';

/**
 * GET /api/tournaments/[id]/participants/[participantId]
 * Get participant details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; participantId: string }> }
) {
  try {
    const { participantId } = await params;

    const participant = await participantManagement.getById(participantId);

    if (!participant) {
      return NextResponse.json(
        { success: false, error: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: participant,
    });

  } catch (error) {
    console.error('[Participant API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/tournaments/[id]/participants/[participantId]
 * Update participant (status changes)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; participantId: string }> }
) {
  try {
    const { participantId } = await params;
    const body = await request.json();

    // Handle status updates
    if (body.status) {
      let result;
      
      switch (body.status) {
        case 'confirmed':
          result = await participantManagement.confirm(participantId);
          break;
        case 'disqualified':
          result = await participantManagement.disqualify(participantId, body.reason);
          break;
        case 'withdrawn':
          result = await participantManagement.withdraw(participantId);
          break;
        default:
          return NextResponse.json(
            { success: false, error: 'INVALID_STATUS' },
            { status: 400 }
          );
      }

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: 'UPDATE_FAILED', message: result.error },
          { status: 400 }
        );
      }
    }

    const updated = await participantManagement.getById(participantId);

    return NextResponse.json({
      success: true,
      data: updated,
    });

  } catch (error) {
    console.error('[Participant API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tournaments/[id]/participants/[participantId]
 * Remove participant
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; participantId: string }> }
) {
  try {
    const { participantId } = await params;

    const result = await participantManagement.delete(participantId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'DELETE_FAILED', message: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { deleted: true },
    });

  } catch (error) {
    console.error('[Participant API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
