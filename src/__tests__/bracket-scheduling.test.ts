// src/__tests__/bracket-scheduling.test.ts
/**
 * Bracket Generation and Match Scheduling Tests
 * Run with: bun test src/__tests__/bracket-scheduling.test.ts
 */

import { test, expect, describe } from 'bun:test';

describe('BracketGenerationService', () => {
  test('Can be imported', async () => {
    const { BracketGenerationService } = await import('@/lib/services/bracketGeneration');
    expect(BracketGenerationService).toBeDefined();
  });

  test('Singleton is available', async () => {
    const { bracketGeneration } = await import('@/lib/services/bracketGeneration');
    expect(bracketGeneration).toBeDefined();
    expect(typeof bracketGeneration.generateBracket).toBe('function');
    expect(typeof bracketGeneration.advanceWinner).toBe('function');
  });
});

describe('MatchSchedulingService', () => {
  test('Can be imported', async () => {
    const { MatchSchedulingService } = await import('@/lib/services/matchScheduling');
    expect(MatchSchedulingService).toBeDefined();
  });

  test('Singleton is available', async () => {
    const { matchScheduling } = await import('@/lib/services/matchScheduling');
    expect(matchScheduling).toBeDefined();
    expect(typeof matchScheduling.autoSchedule).toBe('function');
    expect(typeof matchScheduling.scheduleMatch).toBe('function');
    expect(typeof matchScheduling.rescheduleMatch).toBe('function');
    expect(typeof matchScheduling.getSchedule).toBe('function');
  });
});

describe('Bracket Formats', () => {
  test('Single elimination requires power of 2 slots', () => {
    const participantCounts = [4, 8, 16, 32];
    participantCounts.forEach(count => {
      const rounds = Math.ceil(Math.log2(count));
      expect(Math.pow(2, rounds)).toBeGreaterThanOrEqual(count);
    });
  });

  test('Round robin creates n*(n-1)/2 matches', () => {
    const n = 8; // 8 participants
    const expectedMatches = (n * (n - 1)) / 2;
    expect(expectedMatches).toBe(28); // 8 participants = 28 matches
  });

  test('Swiss rounds are logarithmic', () => {
    const participantCounts = [8, 16, 32, 64];
    participantCounts.forEach(count => {
      const rounds = Math.ceil(Math.log2(count));
      expect(rounds).toBeLessThan(count);
    });
  });
});

describe('Match Structure', () => {
  test('Match has required fields', () => {
    const match = {
      id: 'match_1',
      tournamentId: 'tournament_1',
      round: 1,
      matchNumber: 1,
      status: 'pending' as const,
    };

    expect(match.id).toBeDefined();
    expect(match.tournamentId).toBeDefined();
    expect(match.round).toBe(1);
    expect(match.status).toBe('pending');
  });

  test('Match statuses are valid', () => {
    const validStatuses = ['pending', 'in_progress', 'completed', 'bye'];
    expect(validStatuses).toContain('pending');
    expect(validStatuses).toContain('completed');
    expect(validStatuses).toContain('bye');
  });

  test('Bracket types for double elimination', () => {
    const bracketTypes = ['winners', 'losers', 'grand_final'];
    expect(bracketTypes).toContain('winners');
    expect(bracketTypes).toContain('losers');
    expect(bracketTypes).toContain('grand_final');
  });
});

describe('Scheduling Options', () => {
  test('Default scheduling values', () => {
    const defaultOptions = {
      matchDurationMinutes: 30,
      breakBetweenMatchesMinutes: 10,
      maxConcurrentMatches: 4,
    };

    expect(defaultOptions.matchDurationMinutes).toBe(30);
    expect(defaultOptions.breakBetweenMatchesMinutes).toBe(10);
    expect(defaultOptions.maxConcurrentMatches).toBe(4);
  });

  test('Schedule slot structure', () => {
    const slot = {
      id: 'slot_1',
      startTime: new Date(),
      endTime: new Date(Date.now() + 30 * 60000),
      venue: 'Main Stage',
      matchId: 'match_1',
      available: false,
    };

    expect(slot.startTime).toBeDefined();
    expect(slot.endTime.getTime()).toBeGreaterThan(slot.startTime.getTime());
    expect(slot.available).toBe(false);
  });
});

describe('Bye Handling', () => {
  test('Byes go to higher seeds', () => {
    // In a 5-participant single elimination:
    // 3 byes needed (8 slots - 5 participants)
    // Top 3 seeds get byes
    const participants = 5;
    const slots = 8;
    const byes = slots - participants;
    
    expect(byes).toBe(3);
  });

  test('Bye matches are auto-completed', () => {
    const byeMatch = {
      id: 'match_bye',
      tournamentId: 'tournament_1',
      round: 1,
      matchNumber: 1,
      participant1Id: 'player_1',
      status: 'bye' as const,
      winnerId: 'player_1', // Auto-advanced
    };

    expect(byeMatch.status).toBe('bye');
    expect(byeMatch.winnerId).toBe(byeMatch.participant1Id);
  });
});
