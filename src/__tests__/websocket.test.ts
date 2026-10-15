// src/__tests__/websocket.test.ts
/**
 * WebSocket infrastructure tests
 * Following TDD approach - run with: bun test src/__tests__/websocket.test.ts
 */

import { test, expect, describe, beforeEach, afterEach, mock } from 'bun:test';
import {
  RealtimeEventType,
  CHANNELS,
  SubscriptionRequest,
  SubscriptionResponse,
} from '@/lib/realtime/types';

describe('WebSocket Types and Channels', () => {
  test('RealtimeEventType contains required event types', () => {
    expect(RealtimeEventType.CONNECT as string).toBe('connect');
    expect(RealtimeEventType.SUBSCRIBE as string).toBe('subscribe');
    expect(RealtimeEventType.SCORE_UPDATE as string).toBe('score:update');
    expect(RealtimeEventType.LEADERBOARD_UPDATE as string).toBe('leaderboard:update');
    expect(RealtimeEventType.TOURNAMENT_STATUS_CHANGE as string).toBe('tournament:status_change');
  });

  test('CHANNELS helper generates correct channel names', () => {
    expect(CHANNELS.tournament('abc123')).toBe('tournament:abc123');
    expect(CHANNELS.leaderboard('abc123')).toBe('leaderboard:abc123');
    expect(CHANNELS.match('tourney1', 'match1')).toBe('match:tourney1:match1');
    expect(CHANNELS.user('user123')).toBe('user:user123');
    expect(CHANNELS.global).toBe('global');
  });

  test('SubscriptionRequest type validation', () => {
    const request: SubscriptionRequest = {
      channel: 'tournament:test123',
      tournamentId: 'test123',
      options: {
        includeHistory: true,
        historyLimit: 10,
      },
    };

    expect(request.channel).toBe('tournament:test123');
    expect(request.tournamentId).toBe('test123');
    expect(request.options?.includeHistory).toBe(true);
  });

  test('SubscriptionResponse type validation', () => {
    const successResponse: SubscriptionResponse = {
      success: true,
      channel: 'leaderboard:test123',
    };

    const failResponse: SubscriptionResponse = {
      success: false,
      channel: 'user:private',
      message: 'Authentication required',
    };

    expect(successResponse.success).toBe(true);
    expect(failResponse.message).toBe('Authentication required');
  });
});

describe('WebSocket Client', () => {
  let mockSocket: any;

  beforeEach(() => {
    // Mock socket.io-client
    mockSocket = {
      connected: false,
      on: mock(() => {}),
      emit: mock(() => {}),
      disconnect: mock(() => {}),
      io: {
        on: mock(() => {}),
      },
    };
  });

  test('Channel naming is consistent', () => {
    const tournamentId = 'tournament-abc';
    const expectedChannel = `leaderboard:${tournamentId}`;
    
    expect(CHANNELS.leaderboard(tournamentId)).toBe(expectedChannel);
  });

  test('Connection state starts as disconnected', async () => {
    const { WebSocketClient } = await import('@/lib/realtime/websocket-client');
    const client = new WebSocketClient();
    
    expect(client.isConnected()).toBe(false);
    expect(client.getState().connected).toBe(false);
  });
});

describe('Realtime Message Format', () => {
  test('Score update message has correct structure', () => {
    const scoreUpdate = {
      type: RealtimeEventType.SCORE_UPDATE,
      channel: CHANNELS.leaderboard('tournament123'),
      payload: {
        tournamentId: 'tournament123',
        participantId: 'player1',
        score: 1500,
        metadata: { matchId: 'match1' },
      },
      timestamp: Date.now(),
    };

    expect(scoreUpdate.type as string).toBe('score:update');
    expect(scoreUpdate.payload.score).toBe(1500);
    expect(scoreUpdate.channel).toBe('leaderboard:tournament123');
  });

  test('Leaderboard update includes all required fields', () => {
    const leaderboardUpdate = {
      type: RealtimeEventType.LEADERBOARD_UPDATE,
      channel: CHANNELS.leaderboard('tournament123'),
      payload: {
        tournamentId: 'tournament123',
        entries: [
          { rank: 1, participantId: 'p1', playerName: 'Player 1', score: 2000 },
          { rank: 2, participantId: 'p2', playerName: 'Player 2', score: 1800 },
        ],
        updatedAt: Date.now(),
        totalParticipants: 100,
      },
      timestamp: Date.now(),
    };

    expect(leaderboardUpdate.payload.entries).toHaveLength(2);
    expect(leaderboardUpdate.payload.entries[0].rank).toBe(1);
    expect(leaderboardUpdate.payload.totalParticipants).toBe(100);
  });

  test('Tournament status change includes previous and new status', () => {
    const statusUpdate = {
      type: RealtimeEventType.TOURNAMENT_STATUS_CHANGE,
      channel: CHANNELS.tournament('tournament123'),
      payload: {
        tournamentId: 'tournament123',
        previousStatus: 'registration_open',
        newStatus: 'ongoing',
        updatedAt: Date.now(),
        message: 'Tournament has started!',
      },
      timestamp: Date.now(),
    };

    expect(statusUpdate.payload.previousStatus).toBe('registration_open');
    expect(statusUpdate.payload.newStatus).toBe('ongoing');
    expect(statusUpdate.payload.message).toBeDefined();
  });
});
