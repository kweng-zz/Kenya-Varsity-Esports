import { test, expect, describe, beforeEach, afterEach } from 'bun:test';
import { ParticipantManagementService, ExtendedTournamentRegistration } from '../participantManagement';
import type { TournamentRegistration, TournamentParticipant } from '@/types/tournament';
import { createTestTournament, createTestRegistration, cleanupTestData } from './fixtures/teams';

describe('ParticipantManagementService', () => {
  let service: ParticipantManagementService;
  let tournamentId: string;

  beforeEach(async () => {
    // Create isolated service instance for testing
    service = new ParticipantManagementService();
    tournamentId = createTestTournament();
  });

  afterEach(async () => {
    // Clean up test data
    await cleanupTestData(service);
  });

  describe('Service Instantiation', () => {
    test('should create service instance successfully', () => {
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(ParticipantManagementService);
    });

    test('should initialize with empty participants', async () => {
      const initialCount = await service.getCount(tournamentId);
      expect(initialCount).toBe(0);
    });
  });

  describe('Basic CRUD Operations', () => {
    test('should register a new participant successfully', async () => {
      const registration: ExtendedTournamentRegistration = createTestRegistration();
      
      const result = await service.register(tournamentId, registration);
      
      expect(result.success).toBe(true);
      expect(result.participant).toBeDefined();
      expect(result.participant?.playerName).toBe(registration.playerName);
      expect(result.participant?.email).toBe(registration.email);
      expect(result.participant?.tournamentId).toBe(tournamentId);
      expect(result.participant?.status).toBe('registered');
    });

    test('should get participant by ID after registration', async () => {
      const registration: ExtendedTournamentRegistration = createTestRegistration();
      
      const registerResult = await service.register(tournamentId, registration);
      expect(registerResult.success).toBe(true);
      
      const participant = await service.getById(registerResult.participant!.id);
      
      expect(participant).toBeDefined();
      expect(participant?.id).toBe(registerResult.participant?.id);
      expect(participant?.email).toBe(registration.email);
    });

    test('should prevent duplicate email registration for same tournament', async () => {
      const registration: ExtendedTournamentRegistration = createTestRegistration();
      
      const firstResult = await service.register(tournamentId, registration);
      expect(firstResult.success).toBe(true);
      
      const secondResult = await service.register(tournamentId, registration);
      expect(secondResult.success).toBe(false);
      expect(secondResult.error).toContain('already registered');
    });

    test('should update participant status', async () => {
      const registration: ExtendedTournamentRegistration = createTestRegistration();
      
      const registerResult = await service.register(tournamentId, registration);
      expect(registerResult.success).toBe(true);
      
      const updateResult = await service.updateStatus(
        registerResult.participant!.id,
        'confirmed'
      );
      
      expect(updateResult.success).toBe(true);
      
      const participant = await service.getById(registerResult.participant!.id);
      expect(participant?.status).toBe('confirmed');
    });

    test('should delete participant', async () => {
      const registration: ExtendedTournamentRegistration = createTestRegistration();
      
      const registerResult = await service.register(tournamentId, registration);
      expect(registerResult.success).toBe(true);
      
      const deleteResult = await service.delete(registerResult.participant!.id);
      expect(deleteResult.success).toBe(true);
      
      const participant = await service.getById(registerResult.participant!.id);
      expect(participant).toBeNull();
    });

    test('should return error for invalid participant ID', async () => {
      const result = await service.getById('invalid-id');
      expect(result).toBeNull();
    });

    test('should return error for non-existent participant update', async () => {
      const result = await service.updateStatus('invalid-id', 'confirmed');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Participant not found');
    });

    test('should return error for non-existent participant deletion', async () => {
      const result = await service.delete('invalid-id');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Participant not found');
    });
  });

  describe('Status Transitions', () => {
    test('should allow valid status transitions', async () => {
      const registration: ExtendedTournamentRegistration = createTestRegistration();
      
      const registerResult = await service.register(tournamentId, registration);
      const participantId = registerResult.participant!.id;
      
      // registered -> confirmed
      let result = await service.updateStatus(participantId, 'confirmed');
      expect(result.success).toBe(true);
      
      // confirmed -> disqualified
      result = await service.updateStatus(participantId, 'disqualified');
      expect(result.success).toBe(true);
    });

    test('should reject invalid status transitions', async () => {
      const registration: ExtendedTournamentRegistration = createTestRegistration();
      
      const registerResult = await service.register(tournamentId, registration);
      const participantId = registerResult.participant!.id;
      
      // Try to jump from registered to disqualified (invalid)
      const result = await service.updateStatus(participantId, 'disqualified');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Cannot transition');
    });
  });

  describe('List Operations', () => {
    beforeEach(async () => {
      // Add multiple test participants
      const participants = [
        createTestRegistration({ playerName: 'Player One', email: 'one@test.com' }),
        createTestRegistration({ playerName: 'Player Two', email: 'two@test.com' }),
        createTestRegistration({ playerName: 'Player Three', email: 'three@test.com' }),
      ];

      for (const registration of participants) {
        await service.register(tournamentId, registration);
      }
    });

    test('should list all participants for tournament', async () => {
      const result = await service.listByTournament(tournamentId);
      
      expect(result.participants).toHaveLength(3);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(50);
      expect(result.totalPages).toBe(1);
    });

    test('should filter participants by status', async () => {
      // Update one participant to confirmed
      const participants = await service.listByTournament(tournamentId);
      await service.updateStatus(participants.participants[0].id, 'confirmed');
      
      const confirmedResult = await service.listByTournament(tournamentId, {
        status: 'confirmed'
      });
      
      expect(confirmedResult.participants).toHaveLength(1);
      expect(confirmedResult.participants[0].status).toBe('confirmed');
    });

    test('should search participants by name', async () => {
      const searchResult = await service.listByTournament(tournamentId, {
        search: 'Player One'
      });
      
      expect(searchResult.participants).toHaveLength(1);
      expect(searchResult.participants[0].playerName).toBe('Player One');
    });

    test('should paginate results', async () => {
      const paginatedResult = await service.listByTournament(tournamentId, {
        page: 1,
        pageSize: 2
      });
      
      expect(paginatedResult.participants).toHaveLength(2);
      expect(paginatedResult.total).toBe(3);
      expect(paginatedResult.totalPages).toBe(2);
    });
  });

  describe('Utility Methods', () => {
    test('should check if user is registered', async () => {
      const registration: ExtendedTournamentRegistration = createTestRegistration();
      
      const isRegisteredBefore = await service.isRegistered(tournamentId, registration.email);
      expect(isRegisteredBefore).toBe(false);
      
      await service.register(tournamentId, registration);
      
      const isRegisteredAfter = await service.isRegistered(tournamentId, registration.email);
      expect(isRegisteredAfter).toBe(true);
    });

    test('should get participant count for tournament', async () => {
      expect(await service.getCount(tournamentId)).toBe(0);
      
      await service.register(tournamentId, createTestRegistration());
      expect(await service.getCount(tournamentId)).toBe(1);
      
      await service.register(tournamentId, createTestRegistration({ email: 'different@test.com' }));
      expect(await service.getCount(tournamentId)).toBe(2);
    });

    test('should exclude withdrawn participants from count', async () => {
      const registration = createTestRegistration();
      const result = await service.register(tournamentId, registration);
      
      expect(await service.getCount(tournamentId)).toBe(1);
      
      await service.withdraw(result.participant!.id);
      expect(await service.getCount(tournamentId)).toBe(0);
    });
  });

  describe('Bulk Operations', () => {
    test('should bulk confirm participants', async () => {
      const participants = [];
      
      // Register 3 participants
      for (let i = 0; i < 3; i++) {
        const registration = createTestRegistration({
          email: `test${i}@example.com`,
          playerName: `Player ${i}`
        });
        const result = await service.register(tournamentId, registration);
        participants.push(result.participant!.id);
      }
      
      const bulkResult = await service.bulkConfirm(participants);
      
      expect(bulkResult.success).toBe(true);
      expect(bulkResult.confirmed).toBe(3);
      expect(bulkResult.failed).toBe(0);
      
      // Verify all are confirmed
      for (const id of participants) {
        const participant = await service.getById(id);
        expect(participant?.status).toBe('confirmed');
      }
    });
  });

  describe('Error Handling', () => {
    test('should handle registration errors gracefully', async () => {
      // Test with invalid data that might cause errors
      const invalidRegistration = {
        playerName: '',
        email: 'invalid-email',
        tournamentId: ''
      } as ExtendedTournamentRegistration;
      
      const result = await service.register(tournamentId, invalidRegistration);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});