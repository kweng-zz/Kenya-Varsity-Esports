// src/app/api/notifications/preferences/route.ts
/**
 * Notification Preferences API
 * GET: Get user's notification preferences
 * PATCH: Update preferences
 */

import { NextRequest, NextResponse } from 'next/server';
import { notificationService, NotificationType } from '@/lib/services/notification';

/**
 * GET /api/notifications/preferences
 * Get user's notification preferences
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const preferences = await notificationService.getUserPreferences(userId);

    return NextResponse.json({
      success: true,
      data: preferences,
    });

  } catch (error) {
    console.error('[Preferences API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/notifications/preferences
 * Update notification preferences
 */
export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const allowedFields = [
      'enabledTypes',
      'emailNotifications',
      'pushNotifications',
      'tournamentReminders',
      'matchReminders',
    ];

    // Filter to only allowed fields
    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in body) {
        // Validate enabledTypes
        if (field === 'enabledTypes') {
          if (!Array.isArray(body[field])) {
            return NextResponse.json(
              { success: false, error: 'VALIDATION_ERROR', message: 'enabledTypes must be an array' },
              { status: 400 }
            );
          }
          // Filter to valid types only
          updates[field] = body[field].filter((t: string) => 
            Object.values(NotificationType).includes(t as NotificationType)
          );
        } else if (typeof body[field] === 'boolean') {
          updates[field] = body[field];
        }
      }
    }

    const success = await notificationService.updateUserPreferences(userId, updates);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    const updatedPreferences = await notificationService.getUserPreferences(userId);

    return NextResponse.json({
      success: true,
      data: updatedPreferences,
    });

  } catch (error) {
    console.error('[Preferences API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
