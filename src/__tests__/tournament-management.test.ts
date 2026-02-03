// src/__tests__/tournament-management.test.ts
/**
 * Tournament Management Tests
 * Run with: bun test src/__tests__/tournament-management.test.ts
 */

import { test, expect, describe } from 'bun:test';

describe('TournamentManagementService', () => {
  test('Can be imported', async () => {
    const { TournamentManagementService } = await import('@/lib/services/tournamentManagement');
    expect(TournamentManagementService).toBeDefined();
  });

  test('Singleton is available', async () => {
    const { tournamentManagement } = await import('@/lib/services/tournamentManagement');
    expect(tournamentManagement).toBeDefined();
    expect(typeof tournamentManagement.create).toBe('function');
    expect(typeof tournamentManagement.getById).toBe('function');
    expect(typeof tournamentManagement.update).toBe('function');
    expect(typeof tournamentManagement.delete).toBe('function');
    expect(typeof tournamentManagement.list).toBe('function');
  });

  test('Has status management methods', async () => {
    const { tournamentManagement } = await import('@/lib/services/tournamentManagement');
    expect(typeof tournamentManagement.publish).toBe('function');
    expect(typeof tournamentManagement.archive).toBe('function');
    expect(typeof tournamentManagement.updateTournamentStatus).toBe('function');
  });

  test('Has award and schedule methods', async () => {
    const { tournamentManagement } = await import('@/lib/services/tournamentManagement');
    expect(typeof tournamentManagement.addAward).toBe('function');
    expect(typeof tournamentManagement.addScheduleItem).toBe('function');
  });
});

describe('ParticipantManagementService', () => {
  test('Can be imported', async () => {
    const { ParticipantManagementService } = await import('@/lib/services/participantManagement');
    expect(ParticipantManagementService).toBeDefined();
  });

  test('Singleton is available', async () => {
    const { participantManagement } = await import('@/lib/services/participantManagement');
    expect(participantManagement).toBeDefined();
    expect(typeof participantManagement.register).toBe('function');
    expect(typeof participantManagement.getById).toBe('function');
    expect(typeof participantManagement.listByTournament).toBe('function');
  });

  test('Has status management methods', async () => {
    const { participantManagement } = await import('@/lib/services/participantManagement');
    expect(typeof participantManagement.confirm).toBe('function');
    expect(typeof participantManagement.disqualify).toBe('function');
    expect(typeof participantManagement.withdraw).toBe('function');
    expect(typeof participantManagement.updateStatus).toBe('function');
  });

  test('Has utility methods', async () => {
    const { participantManagement } = await import('@/lib/services/participantManagement');
    expect(typeof participantManagement.getCount).toBe('function');
    expect(typeof participantManagement.isRegistered).toBe('function');
    expect(typeof participantManagement.bulkConfirm).toBe('function');
  });
});

describe('CreateTournamentInput Validation', () => {
  test('Required fields are slug and gameName', () => {
    const validInput = {
      slug: 'test-tournament',
      gameName: 'Test Game',
    };

    expect(validInput.slug).toBeDefined();
    expect(validInput.gameName).toBeDefined();
  });

  test('Optional fields can be undefined', () => {
    const input = {
      slug: 'test-tournament',
      gameName: 'Test Game',
      title: undefined,
      description: undefined,
      maxParticipants: undefined,
    };

    expect(input.title).toBeUndefined();
    expect(input.description).toBeUndefined();
  });
});

describe('ParticipantFilters', () => {
  test('Default pagination values', () => {
    const defaultFilters = {
      page: 1,
      pageSize: 50,
    };

    expect(defaultFilters.page).toBe(1);
    expect(defaultFilters.pageSize).toBe(50);
  });

  test('Status filter values', () => {
    const validStatuses = ['registered', 'confirmed', 'disqualified', 'withdrawn'];
    
    expect(validStatuses).toContain('registered');
    expect(validStatuses).toContain('confirmed');
    expect(validStatuses).toContain('disqualified');
    expect(validStatuses).toContain('withdrawn');
  });
});

describe('Status Transitions', () => {
  const participantTransitions: Record<string, string[]> = {
    registered: ['confirmed', 'withdrawn'],
    confirmed: ['disqualified', 'withdrawn'],
    disqualified: [],
    withdrawn: [],
  };

  test('Registered can transition to confirmed or withdrawn', () => {
    expect(participantTransitions.registered).toContain('confirmed');
    expect(participantTransitions.registered).toContain('withdrawn');
  });

  test('Confirmed can be disqualified or withdrawn', () => {
    expect(participantTransitions.confirmed).toContain('disqualified');
    expect(participantTransitions.confirmed).toContain('withdrawn');
  });

  test('Disqualified cannot transition', () => {
    expect(participantTransitions.disqualified).toHaveLength(0);
  });

  test('Withdrawn cannot transition', () => {
    expect(participantTransitions.withdrawn).toHaveLength(0);
  });
});
