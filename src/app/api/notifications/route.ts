// src/app/api/notifications/route.ts
/**
 * Notifications API
 * GET: Get user's notifications
 * POST: Send notification (admin/system only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { notificationService, NotificationType } from '@/lib/services/notification';
import { checkRateLimit } from '@/lib/redis-rate-limit';

/**
 * GET /api/notifications
 * Get current user's notifications
 */
export async function GET(request: NextRequest) {
  try {
    // Get user ID from session/auth
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'UNAUTHORIZED', message: 'User ID required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '50', 10));

    const notifications = await notificationService.getUserNotifications(userId, {
      unreadOnly,
      limit,
    });

    const unreadCount = await notificationService.getUnreadCount(userId);

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        unreadCount,
        total: notifications.length,
      },
    });

  } catch (error) {
    console.error('[Notifications API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notifications
 * Send notification (admin/system use)
 */
export async function POST(request: NextRequest) {
  // Rate limit
  const rateLimitResponse = await checkRateLimit(request, 'ADMIN');
  if (rateLimitResponse) return rateLimitResponse;

  try {
    // TODO: Add admin authentication
    // const isAdmin = await checkAdminAuth(request);
    // if (!isAdmin) {
    //   return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 });
    // }

    const body = await request.json();
    const { userId, userIds, type, title, message, data, broadcast } = body;

    // Validate type
    if (!type || !Object.values(NotificationType).includes(type)) {
      return NextResponse.json(
        { success: false, error: 'INVALID_TYPE', message: 'Valid notification type required' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!title || !message) {
      return NextResponse.json(
        { success: false, error: 'VALIDATION_ERROR', message: 'title and message required' },
        { status: 400 }
      );
    }

    // Global broadcast
    if (broadcast) {
      await notificationService.broadcastAnnouncement(title, message, body.priority || 'normal');
      return NextResponse.json({
        success: true,
        data: { broadcast: true },
      });
    }

    // Send to multiple users
    if (Array.isArray(userIds) && userIds.length > 0) {
      const result = await notificationService.sendToUsers(userIds, {
        type,
        title,
        message,
        data,
      });

      return NextResponse.json({
        success: true,
        data: { sentCount: result.sentCount },
      });
    }

    // Send to single user
    if (userId) {
      const result = await notificationService.sendToUser(userId, {
        type,
        title,
        message,
        data,
      });

      return NextResponse.json({
        success: result.success,
        data: { notificationId: result.notificationId },
      });
    }

    return NextResponse.json(
      { success: false, error: 'VALIDATION_ERROR', message: 'userId, userIds, or broadcast required' },
      { status: 400 }
    );

  } catch (error) {
    console.error('[Notifications API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
