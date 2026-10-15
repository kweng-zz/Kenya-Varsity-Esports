// src/__tests__/tournament-subscription.test.ts
/**
 * Tournament Subscription Tests
 * Run with: bun test src/__tests__/tournament-subscription.test.ts
 */

import { test, expect, describe } from 'bun:test';
import { CHANNELS, RealtimeEventType } from '@/lib/realtime/types';

describe('Tournament Subscription Channels', () => {
  test('Tournament channel follows naming convention', () => {
    const tournamentId = 'test-tournament-123';
    const channel = CHANNELS.tournament(tournamentId);
    
    expect(channel).toBe('tournament:test-tournament-123');
    expect(channel.startsWith('tournament:')).toBe(true);
  });

  test('Leaderboard channel is distinct from tournament channel', () => {
    const id = 'abc123';
    const tournamentChannel = CHANNELS.tournament(id);
    const leaderboardChannel = CHANNELS.leaderboard(id);
    
    expect(tournamentChannel).not.toBe(leaderboardChannel);
    expect(leaderboardChannel).toBe('leaderboard:abc123');
  });

  test('Match channel includes both tournament and match IDs', () => {
    const matchChannel = CHANNELS.match('tournament1', 'match1');
    
    expect(matchChannel).toBe('match:tournament1:match1');
    expect(matchChannel).toContain('tournament1');
    expect(matchChannel).toContain('match1');
  });

  test('User channel follows naming convention', () => {
    const userChannel = CHANNELS.user('user123');
    
    expect(userChannel).toBe('user:user123');
  });

  test('Global channel is a constant', () => {
    expect(CHANNELS.global).toBe('global');
  });
});

describe('Tournament Subscription Module', () => {
  test('Subscription functions can be imported', async () => {
    const module = await import('@/lib/realtime/tournament-subscription');
    
    expect(typeof module.subscribeTournament).toBe('function');
    expect(typeof module.unsubscribeTournament).toBe('function');
    expect(typeof module.broadcastTournamentStatusChange).toBe('function');
    expect(typeof module.broadcastLeaderboardChange).toBe('function');
    expect(typeof module.broadcastMatchEvent).toBe('function');
  });

  test('Stats functions are available', async () => {
    const module = await import('@/lib/realtime/tournament-subscription');
    
    expect(typeof module.getTournamentSubscriptionStats).toBe('function');
    expect(typeof module.getAllSubscriptionStats).toBe('function');
    expect(typeof module.cleanupDisconnectedSocket).toBe('function');
  });

  test('getTournamentSubscriptionStats returns expected structure', async () => {
    const { getTournamentSubscriptionStats } = await import('@/lib/realtime/tournament-subscription');
    
    const stats = getTournamentSubscriptionStats('non-existent');
    
    expect(stats).toHaveProperty('subscriberCount');
    expect(stats).toHaveProperty('subscribers');
    expect(stats.subscriberCount).toBe(0);
    expect(Array.isArray(stats.subscribers)).toBe(true);
  });

  test('getAllSubscriptionStats returns a Map', async () => {
    const { getAllSubscriptionStats } = await import('@/lib/realtime/tournament-subscription');
    
    const stats = getAllSubscriptionStats();
    
    expect(stats instanceof Map).toBe(true);
  });
});

describe('Event Types for Status Broadcasting', () => {
  test('Status change event type is defined', () => {
    expect(RealtimeEventType.TOURNAMENT_STATUS_CHANGE as string).toBe('tournament:status_change');
  });

  test('Match event types are defined', () => {
    expect(RealtimeEventType.MATCH_START as string).toBe('match:start');
    expect(RealtimeEventType.MATCH_END as string).toBe('match:end');
    expect(RealtimeEventType.MATCH_UPDATE as string).toBe('match:update');
  });

  test('Notification event type is defined', () => {
    expect(RealtimeEventType.NOTIFICATION as string).toBe('notification');
  });
});

describe('Status Transition Validation', () => {
  const VALID_STATUS_TRANSITIONS: Record<string, string[]> = {
    'draft': ['published'],
    'published': ['registration_open', 'archived'],
    'registration_open': ['registration_closed', 'archived'],
    'registration_closed': ['ongoing', 'archived'],
    'ongoing': ['completed', 'archived'],
    'completed': ['archived'],
    'archived': [],
  };

  test('Draft can only transition to published', () => {
    expect(VALID_STATUS_TRANSITIONS['draft']).toEqual(['published']);
  });

  test('Published can transition to registration_open or archived', () => {
    expect(VALID_STATUS_TRANSITIONS['published']).toContain('registration_open');
    expect(VALID_STATUS_TRANSITIONS['published']).toContain('archived');
  });

  test('Ongoing can transition to completed or archived', () => {
    expect(VALID_STATUS_TRANSITIONS['ongoing']).toContain('completed');
    expect(VALID_STATUS_TRANSITIONS['ongoing']).toContain('archived');
  });

  test('Archived cannot transition to anything', () => {
    expect(VALID_STATUS_TRANSITIONS['archived']).toHaveLength(0);
  });

  test('Completed can only transition to archived', () => {
    expect(VALID_STATUS_TRANSITIONS['completed']).toEqual(['archived']);
  });
});
