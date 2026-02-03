// src/app/api/admin/tournaments/[id]/publish/route.ts
/**
 * Tournament Publish/Archive API
 * POST: Publish or archive a tournament
 */

import { NextRequest, NextResponse } from 'next/server';
import { tournamentManagement } from '@/lib/services/tournamentManagement';

/**
 * POST /api/admin/tournaments/[id]/publish
 * Publish a tournament
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await tournamentManagement.publish(id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'PUBLISH_FAILED', message: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { published: true },
    });

  } catch (error) {
    console.error('[Publish API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
