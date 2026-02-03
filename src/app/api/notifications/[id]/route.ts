// src/app/api/notifications/[id]/route.ts
/**
 * Individual Notification API
 * PATCH: Mark as read
 * DELETE: Delete notification
 */

import { NextRequest, NextResponse } from 'next/server';
import { notificationService } from '@/lib/services/notification';

/**
 * PATCH /api/notifications/[id]
 * Mark notification as read
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const { id: notificationId } = await params;

    // Handle "all" for marking all as read
    if (notificationId === 'all') {
      const success = await notificationService.markAllAsRead(userId);
      return NextResponse.json({ success });
    }

    const success = await notificationService.markAsRead(userId, notificationId);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[Notification API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notifications/[id]
 * Delete a notification
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const { id: notificationId } = await params;

    const success = await notificationService.deleteNotification(userId, notificationId);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[Notification API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
