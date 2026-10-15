// src/__tests__/notification.test.ts
/**
 * Notification Service Tests
 * Run with: bun test src/__tests__/notification.test.ts
 */

import { test, expect, describe } from 'bun:test';
import { NotificationType } from '@/lib/services/notification';

describe('NotificationType Enum', () => {
  test('Contains tournament event types', () => {
    expect(NotificationType.TOURNAMENT_START as string).toBe('tournament_start');
    expect(NotificationType.TOURNAMENT_END as string).toBe('tournament_end');
    expect(NotificationType.TOURNAMENT_REMINDER as string).toBe('tournament_reminder');
    expect(NotificationType.REGISTRATION_OPEN as string).toBe('registration_open');
    expect(NotificationType.REGISTRATION_CLOSING as string).toBe('registration_closing');
  });

  test('Contains match event types', () => {
    expect(NotificationType.MATCH_SCHEDULED as string).toBe('match_scheduled');
    expect(NotificationType.MATCH_STARTING as string).toBe('match_starting');
    expect(NotificationType.MATCH_RESULT as string).toBe('match_result');
  });

  test('Contains score event types', () => {
    expect(NotificationType.SCORE_UPDATE as string).toBe('score_update');
    expect(NotificationType.RANK_CHANGE as string).toBe('rank_change');
  });

  test('Contains system event types', () => {
    expect(NotificationType.ANNOUNCEMENT as string).toBe('announcement');
    expect(NotificationType.SYSTEM_ALERT as string).toBe('system_alert');
  });

  test('Contains user event types', () => {
    expect(NotificationType.TEAM_INVITE as string).toBe('team_invite');
    expect(NotificationType.REGISTRATION_CONFIRMED as string).toBe('registration_confirmed');
  });
});

describe('NotificationService', () => {
  test('Can be imported', async () => {
    const { NotificationService } = await import('@/lib/services/notification');
    expect(NotificationService).toBeDefined();
  });

  test('Singleton is available', async () => {
    const { notificationService } = await import('@/lib/services/notification');
    expect(notificationService).toBeDefined();
    expect(typeof notificationService.sendToUser).toBe('function');
    expect(typeof notificationService.getUserNotifications).toBe('function');
  });

  test('Has tournament-specific methods', async () => {
    const { notificationService } = await import('@/lib/services/notification');
    expect(typeof notificationService.notifyTournamentStart).toBe('function');
    expect(typeof notificationService.notifyMatchScheduled).toBe('function');
    expect(typeof notificationService.notifyRankChange).toBe('function');
  });

  test('Has preference methods', async () => {
    const { notificationService } = await import('@/lib/services/notification');
    expect(typeof notificationService.getUserPreferences).toBe('function');
    expect(typeof notificationService.updateUserPreferences).toBe('function');
  });
});

describe('Notification Structure', () => {
  test('Notification object has required fields', () => {
    const notification = {
      id: 'notif_123',
      userId: 'user_456',
      type: NotificationType.TOURNAMENT_START,
      title: 'Test Title',
      message: 'Test message',
      read: false,
      createdAt: Date.now(),
    };

    expect(notification.id).toBeDefined();
    expect(notification.userId).toBeDefined();
    expect(notification.type as string).toBe('tournament_start');
    expect(notification.read).toBe(false);
    expect(notification.createdAt).toBeGreaterThan(0);
  });

  test('Notification can have optional data', () => {
    const notification = {
      id: 'notif_123',
      userId: 'user_456',
      type: NotificationType.MATCH_SCHEDULED,
      title: 'Match Scheduled',
      message: 'Your match is scheduled',
      data: {
        tournamentId: 'tourney_1',
        matchId: 'match_1',
        opponent: 'Player 2',
      },
      read: false,
      createdAt: Date.now(),
    };

    expect(notification.data).toBeDefined();
    expect(notification.data?.tournamentId).toBe('tourney_1');
  });

  test('Notification can have expiry', () => {
    const notification = {
      id: 'notif_123',
      userId: 'user_456',
      type: NotificationType.ANNOUNCEMENT,
      title: 'Limited Time!',
      message: 'This expires soon',
      read: false,
      createdAt: Date.now(),
      expiresAt: Date.now() + 86400000, // 24 hours
    };

    expect(notification.expiresAt).toBeDefined();
    expect(notification.expiresAt).toBeGreaterThan(notification.createdAt);
  });
});

describe('NotificationPreferences', () => {
  test('Default preferences structure', () => {
    const defaults = {
      userId: 'user_123',
      enabledTypes: Object.values(NotificationType),
      emailNotifications: true,
      pushNotifications: false,
      tournamentReminders: true,
      matchReminders: true,
    };

    expect(defaults.emailNotifications).toBe(true);
    expect(defaults.pushNotifications).toBe(false);
    expect(defaults.enabledTypes.length).toBeGreaterThan(0);
  });

  test('All notification types are included by default', () => {
    const allTypes = Object.values(NotificationType) as string[];
    
    expect(allTypes).toContain('tournament_start');
    expect(allTypes).toContain('match_scheduled');
    expect(allTypes).toContain('announcement');
    expect(allTypes.length).toBeGreaterThan(10);
  });
});
