// src/lib/realtime/types.ts
/**
 * Real-time event types and interfaces for tournament system
 */

export enum RealtimeEventType {
  // Connection events
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  ERROR = 'error',
  
  // Subscription events
  SUBSCRIBE = 'subscribe',
  UNSUBSCRIBE = 'unsubscribe',
  SUBSCRIBED = 'subscribed',
  
  // Tournament events
  TOURNAMENT_UPDATE = 'tournament:update',
  TOURNAMENT_STATUS_CHANGE = 'tournament:status_change',
  
  // Scoring events
  SCORE_UPDATE = 'score:update',
  SCORE_SUBMITTED = 'score:submitted',
  
  // Leaderboard events
  LEADERBOARD_UPDATE = 'leaderboard:update',
  LEADERBOARD_POSITION_CHANGE = 'leaderboard:position_change',
  
  // Match events
  MATCH_START = 'match:start',
  MATCH_END = 'match:end',
  MATCH_UPDATE = 'match:update',
  
  // Notification events
  NOTIFICATION = 'notification',
}

export interface RealtimeMessage<T = unknown> {
  type: RealtimeEventType;
  channel?: string;
  payload: T;
  timestamp: number;
  userId?: string;
}

export interface SubscriptionRequest {
  channel: string;
  tournamentId?: string;
  options?: {
    includeHistory?: boolean;
    historyLimit?: number;
  };
}

export interface SubscriptionResponse {
  success: boolean;
  channel: string;
  message?: string;
}

export interface ScoreUpdate {
  tournamentId: string;
  participantId: string;
  score: number;
  matchId?: string;
  metadata?: Record<string, unknown>;
}

export interface LeaderboardEntry {
  rank: number;
  participantId: string;
  playerName: string;
  teamName?: string;
  score: number;
  wins?: number;
  losses?: number;
  gamesPlayed?: number;
  previousRank?: number;
}

export interface LeaderboardUpdate {
  tournamentId: string;
  entries: LeaderboardEntry[];
  updatedAt: number;
  totalParticipants: number;
}

export interface TournamentStatusUpdate {
  tournamentId: string;
  previousStatus: string;
  newStatus: string;
  updatedAt: number;
  message?: string;
}

export interface ConnectionState {
  connected: boolean;
  reconnecting: boolean;
  reconnectAttempts: number;
  lastConnected?: number;
  error?: string;
}

// Channel naming conventions
export const CHANNELS = {
  tournament: (id: string) => `tournament:${id}`,
  leaderboard: (id: string) => `leaderboard:${id}`,
  match: (tournamentId: string, matchId: string) => `match:${tournamentId}:${matchId}`,
  user: (userId: string) => `user:${userId}`,
  global: 'global',
} as const;
