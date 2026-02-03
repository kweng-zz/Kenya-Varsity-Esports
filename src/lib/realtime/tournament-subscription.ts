// src/lib/realtime/tournament-subscription.ts
/**
 * Tournament Subscription Manager
 * Handles channel management, permissions, and event broadcasting for tournaments
 */

import 'server-only';
import { 
  RealtimeEventType, 
  CHANNELS, 
  TournamentStatusUpdate,
  LeaderboardUpdate,
  ScoreUpdate 
} from './types';
import { 
  broadcastToChannel, 
  broadcastLeaderboardUpdate as serverBroadcastLeaderboard,
  broadcastTournamentStatus as serverBroadcastStatus,
  getIO 
} from './websocket-server';

// Track active subscriptions per tournament for analytics
const tournamentSubscriptions = new Map<string, Set<string>>();

/**
 * Subscribe a socket to a tournament's channels
 */
export async function subscribeTournament(
  socketId: string,
  tournamentId: string,
  options: {
    includeLeaderboard?: boolean;
    includeMatches?: boolean;
    authenticated?: boolean;
  } = {}
): Promise<{
  success: boolean;
  channels: string[];
  error?: string;
}> {
  const io = getIO();
  if (!io) {
    return { success: false, channels: [], error: 'WebSocket server not initialized' };
  }

  const socket = io.sockets.sockets.get(socketId);
  if (!socket) {
    return { success: false, channels: [], error: 'Socket not found' };
  }

  const channels: string[] = [];
  const { includeLeaderboard = true, includeMatches = false } = options;

  try {
    // Main tournament channel (status updates, announcements)
    const tournamentChannel = CHANNELS.tournament(tournamentId);
    await socket.join(tournamentChannel);
    channels.push(tournamentChannel);

    // Leaderboard channel (score updates, ranking changes)
    if (includeLeaderboard) {
      const leaderboardChannel = CHANNELS.leaderboard(tournamentId);
      await socket.join(leaderboardChannel);
      channels.push(leaderboardChannel);
    }

    // Track subscription
    if (!tournamentSubscriptions.has(tournamentId)) {
      tournamentSubscriptions.set(tournamentId, new Set());
    }
    tournamentSubscriptions.get(tournamentId)!.add(socketId);

    console.log(`[Subscription] Socket ${socketId} subscribed to tournament ${tournamentId}`);

    return { success: true, channels };
  } catch (error) {
    console.error('[Subscription] Error:', error);
    return { success: false, channels: [], error: 'Subscription failed' };
  }
}

/**
 * Unsubscribe a socket from a tournament's channels
 */
export async function unsubscribeTournament(
  socketId: string,
  tournamentId: string
): Promise<void> {
  const io = getIO();
  if (!io) return;

  const socket = io.sockets.sockets.get(socketId);
  if (!socket) return;

  // Leave all tournament-related channels
  await socket.leave(CHANNELS.tournament(tournamentId));
  await socket.leave(CHANNELS.leaderboard(tournamentId));

  // Remove from tracking
  tournamentSubscriptions.get(tournamentId)?.delete(socketId);

  console.log(`[Subscription] Socket ${socketId} unsubscribed from tournament ${tournamentId}`);
}

/**
 * Broadcast tournament status change to all subscribers
 */
export function broadcastTournamentStatusChange(
  tournamentId: string,
  previousStatus: string,
  newStatus: string,
  message?: string
): void {
  serverBroadcastStatus(tournamentId, previousStatus, newStatus, message);
  
  console.log(`[Broadcast] Tournament ${tournamentId} status: ${previousStatus} -> ${newStatus}`);
}

/**
 * Broadcast leaderboard update to all subscribers
 */
export function broadcastLeaderboardChange(
  tournamentId: string,
  entries: Array<{
    rank: number;
    participantId: string;
    playerName: string;
    score: number;
    teamName?: string;
  }>
): void {
  serverBroadcastLeaderboard(tournamentId, entries);
  
  console.log(`[Broadcast] Leaderboard update for tournament ${tournamentId}, ${entries.length} entries`);
}

/**
 * Broadcast match event
 */
export function broadcastMatchEvent(
  tournamentId: string,
  matchId: string,
  event: 'start' | 'end' | 'update',
  data: Record<string, unknown>
): void {
  const channel = CHANNELS.match(tournamentId, matchId);
  
  const eventType = {
    'start': RealtimeEventType.MATCH_START,
    'end': RealtimeEventType.MATCH_END,
    'update': RealtimeEventType.MATCH_UPDATE,
  }[event];

  broadcastToChannel(channel, eventType, {
    tournamentId,
    matchId,
    event,
    ...data,
    timestamp: Date.now(),
  });
}

/**
 * Send notification to specific user
 */
export function sendUserNotification(
  userId: string,
  notification: {
    type: string;
    title: string;
    message: string;
    data?: Record<string, unknown>;
  }
): void {
  const channel = CHANNELS.user(userId);
  
  broadcastToChannel(channel, RealtimeEventType.NOTIFICATION, {
    ...notification,
    timestamp: Date.now(),
  });
}

/**
 * Broadcast global announcement
 */
export function broadcastGlobalAnnouncement(
  announcement: {
    title: string;
    message: string;
    priority?: 'low' | 'normal' | 'high';
  }
): void {
  broadcastToChannel(CHANNELS.global, RealtimeEventType.NOTIFICATION, {
    type: 'announcement',
    ...announcement,
    timestamp: Date.now(),
  });
}

/**
 * Get subscription statistics for a tournament
 */
export function getTournamentSubscriptionStats(tournamentId: string): {
  subscriberCount: number;
  subscribers: string[];
} {
  const subscribers = tournamentSubscriptions.get(tournamentId) || new Set();
  return {
    subscriberCount: subscribers.size,
    subscribers: Array.from(subscribers),
  };
}

/**
 * Get all active tournament subscriptions
 */
export function getAllSubscriptionStats(): Map<string, number> {
  const stats = new Map<string, number>();
  tournamentSubscriptions.forEach((subscribers, tournamentId) => {
    stats.set(tournamentId, subscribers.size);
  });
  return stats;
}

/**
 * Clean up disconnected sockets from subscriptions
 */
export function cleanupDisconnectedSocket(socketId: string): void {
  tournamentSubscriptions.forEach((subscribers) => {
    subscribers.delete(socketId);
  });
}
