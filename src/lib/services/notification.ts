// src/lib/services/notification.ts
/**
 * Notification Service
 * Handles in-app real-time notifications with persistence and preferences
 */

import { cache, CACHE_KEYS, CACHE_TTL } from '@/lib/cache';
import { sendUserNotification, broadcastGlobalAnnouncement } from '@/lib/realtime/tournament-subscription';

export enum NotificationType {
  // Tournament events
  TOURNAMENT_START = 'tournament_start',
  TOURNAMENT_END = 'tournament_end',
  TOURNAMENT_REMINDER = 'tournament_reminder',
  REGISTRATION_OPEN = 'registration_open',
  REGISTRATION_CLOSING = 'registration_closing',
  
  // Match events
  MATCH_SCHEDULED = 'match_scheduled',
  MATCH_STARTING = 'match_starting',
  MATCH_RESULT = 'match_result',
  
  // Score events
  SCORE_UPDATE = 'score_update',
  RANK_CHANGE = 'rank_change',
  
  // System events
  ANNOUNCEMENT = 'announcement',
  SYSTEM_ALERT = 'system_alert',
  
  // User events
  TEAM_INVITE = 'team_invite',
  REGISTRATION_CONFIRMED = 'registration_confirmed',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: number;
  expiresAt?: number;
}

export interface NotificationPreferences {
  userId: string;
  enabledTypes: NotificationType[];
  emailNotifications: boolean;
  pushNotifications: boolean;
  tournamentReminders: boolean;
  matchReminders: boolean;
}

const DEFAULT_PREFERENCES: Omit<NotificationPreferences, 'userId'> = {
  enabledTypes: Object.values(NotificationType),
  emailNotifications: true,
  pushNotifications: false,
  tournamentReminders: true,
  matchReminders: true,
};

class NotificationService {
  private readonly NOTIFICATION_TTL = 7 * 24 * 60 * 60; // 7 days in seconds

  /**
   * Send notification to a specific user
   */
  async sendToUser(
    userId: string,
    notification: Omit<Notification, 'id' | 'userId' | 'read' | 'createdAt'>
  ): Promise<{ success: boolean; notificationId?: string }> {
    try {
      // Check user preferences
      const preferences = await this.getUserPreferences(userId);
      if (!preferences.enabledTypes.includes(notification.type)) {
        return { success: true }; // User has disabled this notification type
      }

      // Generate notification ID
      const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create full notification object
      const fullNotification: Notification = {
        id: notificationId,
        userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        read: false,
        createdAt: Date.now(),
        expiresAt: notification.expiresAt,
      };

      // Store in cache
      await this.storeNotification(userId, fullNotification);

      // Send real-time notification
      sendUserNotification(userId, {
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: {
          ...notification.data,
          notificationId,
        },
      });

      return { success: true, notificationId };
    } catch (error) {
      console.error('[Notification] Error sending to user:', error);
      return { success: false };
    }
  }

  /**
   * Send notification to multiple users
   */
  async sendToUsers(
    userIds: string[],
    notification: Omit<Notification, 'id' | 'userId' | 'read' | 'createdAt'>
  ): Promise<{ success: boolean; sentCount: number }> {
    let sentCount = 0;

    await Promise.all(
      userIds.map(async (userId) => {
        const result = await this.sendToUser(userId, notification);
        if (result.success) sentCount++;
      })
    );

    return { success: true, sentCount };
  }

  /**
   * Broadcast global announcement
   */
  async broadcastAnnouncement(
    title: string,
    message: string,
    priority: 'low' | 'normal' | 'high' = 'normal'
  ): Promise<void> {
    broadcastGlobalAnnouncement({ title, message, priority });
  }

  /**
   * Get user's notifications
   */
  async getUserNotifications(
    userId: string,
    options: { unreadOnly?: boolean; limit?: number } = {}
  ): Promise<Notification[]> {
    const { unreadOnly = false, limit = 50 } = options;

    try {
      const key = this.getUserNotificationsKey(userId);
      const notifications = await cache.get<Notification[]>(key) || [];

      let filtered = notifications.filter((n) => {
        // Filter expired notifications
        if (n.expiresAt && n.expiresAt < Date.now()) return false;
        // Filter read if requested
        if (unreadOnly && n.read) return false;
        return true;
      });

      // Sort by newest first
      filtered.sort((a, b) => b.createdAt - a.createdAt);

      return filtered.slice(0, limit);
    } catch (error) {
      console.error('[Notification] Error getting notifications:', error);
      return [];
    }
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string): Promise<number> {
    const notifications = await this.getUserNotifications(userId, { unreadOnly: true });
    return notifications.length;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(userId: string, notificationId: string): Promise<boolean> {
    try {
      const key = this.getUserNotificationsKey(userId);
      const notifications = await cache.get<Notification[]>(key) || [];

      const updated = notifications.map((n) => {
        if (n.id === notificationId) {
          return { ...n, read: true };
        }
        return n;
      });

      await cache.set(key, updated, this.NOTIFICATION_TTL);
      return true;
    } catch (error) {
      console.error('[Notification] Error marking as read:', error);
      return false;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const key = this.getUserNotificationsKey(userId);
      const notifications = await cache.get<Notification[]>(key) || [];

      const updated = notifications.map((n) => ({ ...n, read: true }));

      await cache.set(key, updated, this.NOTIFICATION_TTL);
      return true;
    } catch (error) {
      console.error('[Notification] Error marking all as read:', error);
      return false;
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(userId: string, notificationId: string): Promise<boolean> {
    try {
      const key = this.getUserNotificationsKey(userId);
      const notifications = await cache.get<Notification[]>(key) || [];

      const filtered = notifications.filter((n) => n.id !== notificationId);

      await cache.set(key, filtered, this.NOTIFICATION_TTL);
      return true;
    } catch (error) {
      console.error('[Notification] Error deleting notification:', error);
      return false;
    }
  }

  /**
   * Get user notification preferences
   */
  async getUserPreferences(userId: string): Promise<NotificationPreferences> {
    const key = `${CACHE_KEYS.user(userId)}:notification_preferences`;
    const preferences = await cache.get<NotificationPreferences>(key);
    
    return preferences || { userId, ...DEFAULT_PREFERENCES };
  }

  /**
   * Update user notification preferences
   */
  async updateUserPreferences(
    userId: string,
    updates: Partial<Omit<NotificationPreferences, 'userId'>>
  ): Promise<boolean> {
    try {
      const current = await this.getUserPreferences(userId);
      const updated = { ...current, ...updates };
      
      const key = `${CACHE_KEYS.user(userId)}:notification_preferences`;
      await cache.set(key, updated, CACHE_TTL.USER_DATA);
      
      return true;
    } catch (error) {
      console.error('[Notification] Error updating preferences:', error);
      return false;
    }
  }

  // ==================
  // Tournament-specific notifications
  // ==================

  /**
   * Notify participants of tournament start
   */
  async notifyTournamentStart(
    tournamentId: string,
    tournamentName: string,
    participantIds: string[]
  ): Promise<void> {
    await this.sendToUsers(participantIds, {
      type: NotificationType.TOURNAMENT_START,
      title: 'Tournament Starting!',
      message: `${tournamentName} is starting now. Good luck!`,
      data: { tournamentId },
    });
  }

  /**
   * Notify of upcoming match
   */
  async notifyMatchScheduled(
    userId: string,
    matchDetails: {
      tournamentId: string;
      matchId: string;
      opponent?: string;
      scheduledTime: number;
    }
  ): Promise<void> {
    const timeStr = new Date(matchDetails.scheduledTime).toLocaleString();
    
    await this.sendToUser(userId, {
      type: NotificationType.MATCH_SCHEDULED,
      title: 'Match Scheduled',
      message: matchDetails.opponent 
        ? `Your match against ${matchDetails.opponent} is scheduled for ${timeStr}`
        : `Your match is scheduled for ${timeStr}`,
      data: matchDetails,
    });
  }

  /**
   * Notify of rank change
   */
  async notifyRankChange(
    userId: string,
    tournamentId: string,
    previousRank: number,
    newRank: number
  ): Promise<void> {
    const improved = newRank < previousRank;
    
    await this.sendToUser(userId, {
      type: NotificationType.RANK_CHANGE,
      title: improved ? 'Rank Improved! 🎉' : 'Rank Changed',
      message: improved 
        ? `You moved up from #${previousRank} to #${newRank}!`
        : `Your rank changed from #${previousRank} to #${newRank}`,
      data: { tournamentId, previousRank, newRank },
    });
  }

  // Private helpers

  private getUserNotificationsKey(userId: string): string {
    return `${CACHE_KEYS.user(userId)}:notifications`;
  }

  private async storeNotification(userId: string, notification: Notification): Promise<void> {
    const key = this.getUserNotificationsKey(userId);
    const existing = await cache.get<Notification[]>(key) || [];
    
    // Add new notification and keep only last 100
    const updated = [notification, ...existing].slice(0, 100);
    
    await cache.set(key, updated, this.NOTIFICATION_TTL);
  }
}

// Export singleton
export const notificationService = new NotificationService();

// Export class for testing
export { NotificationService };
