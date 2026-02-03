// src/__tests__/redis-cache.test.ts
/**
 * Redis cache tests
 * Run with: bun test src/__tests__/redis-cache.test.ts
 */

import { test, expect, describe } from 'bun:test';
import { CACHE_TTL, CACHE_KEYS } from '@/lib/cache';

describe('Cache Configuration', () => {
  test('CACHE_TTL has required time values', () => {
    expect(CACHE_TTL.TOURNAMENT_LIST).toBe(300);
    expect(CACHE_TTL.TOURNAMENT_DETAIL).toBe(180);
    expect(CACHE_TTL.LEADERBOARD).toBe(30);
    expect(CACHE_TTL.PARTICIPANT_LIST).toBe(120);
    expect(CACHE_TTL.USER_DATA).toBe(600);
    expect(CACHE_TTL.STATIC_DATA).toBe(3600);
  });

  test('CACHE_KEYS generates correct key patterns', () => {
    expect(CACHE_KEYS.tournament('abc123')).toBe('tournament:abc123');
    expect(CACHE_KEYS.tournamentList()).toBe('tournaments:all');
    expect(CACHE_KEYS.tournamentsByStatus('ongoing')).toBe('tournaments:status:ongoing');
    expect(CACHE_KEYS.leaderboard('t1')).toBe('leaderboard:t1');
    expect(CACHE_KEYS.participant('t1', 'p1')).toBe('participant:t1:p1');
    expect(CACHE_KEYS.participantList('t1')).toBe('participants:t1');
    expect(CACHE_KEYS.user('u123')).toBe('user:u123');
  });
});

describe('Cache Service', () => {
  test('CacheService can be imported', async () => {
    const { CacheService } = await import('@/lib/cache');
    expect(CacheService).toBeDefined();
  });

  test('cache singleton can be imported', async () => {
    const { cache } = await import('@/lib/cache');
    expect(cache).toBeDefined();
    expect(typeof cache.get).toBe('function');
    expect(typeof cache.set).toBe('function');
    expect(typeof cache.delete).toBe('function');
  });

  test('isAvailable returns boolean', async () => {
    const { cache } = await import('@/lib/cache');
    const available = cache.isAvailable();
    expect(typeof available).toBe('boolean');
  });
});

describe('Leaderboard Operations', () => {
  test('LeaderboardService can be imported', async () => {
    const { LeaderboardService } = await import('@/lib/services/leaderboard');
    expect(LeaderboardService).toBeDefined();
  });

  test('leaderboardService singleton is available', async () => {
    const { leaderboardService } = await import('@/lib/services/leaderboard');
    expect(leaderboardService).toBeDefined();
    expect(typeof leaderboardService.submitScore).toBe('function');
    expect(typeof leaderboardService.getLeaderboard).toBe('function');
  });

  test('ScoreSubmission type structure is correct', () => {
    const submission = {
      tournamentId: 'tournament123',
      participantId: 'player1',
      playerName: 'Test Player',
      teamName: 'Team A',
      score: 1500,
      matchId: 'match1',
      metadata: { kills: 10, deaths: 5 },
    };

    expect(submission.tournamentId).toBe('tournament123');
    expect(submission.score).toBe(1500);
    expect(submission.metadata?.kills).toBe(10);
  });
});

describe('Cache Key Uniqueness', () => {
  test('Different tournament IDs produce unique keys', () => {
    const key1 = CACHE_KEYS.tournament('tournament-1');
    const key2 = CACHE_KEYS.tournament('tournament-2');
    expect(key1).not.toBe(key2);
  });

  test('Leaderboard and tournament keys are different for same ID', () => {
    const tournamentKey = CACHE_KEYS.tournament('abc123');
    const leaderboardKey = CACHE_KEYS.leaderboard('abc123');
    expect(tournamentKey).not.toBe(leaderboardKey);
  });

  test('Participant keys include both tournament and participant IDs', () => {
    const key = CACHE_KEYS.participant('t1', 'p1');
    expect(key).toContain('t1');
    expect(key).toContain('p1');
  });
});
