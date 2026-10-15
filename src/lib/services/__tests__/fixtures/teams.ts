import type { TournamentRegistration, TournamentParticipant } from '@/types/tournament';
import { ParticipantManagementService } from '../../participantManagement';

// Mock data generator for testing complex team structures

export interface TestTeamConfig {
  name?: string;
  university?: string;
  email?: string;
  playerName?: string;
  teamName?: string;
}

let tournamentCounter = 0;
let participantCounter = 0;

/**
 * Create a test tournament ID for isolated testing
 */
export function createTestTournament(): string {
  tournamentCounter++;
  return `test-tournament-${tournamentCounter}`;
}

/**
 * Create a test registration with customizable fields
 */
export function createTestRegistration(overrides: TestTeamConfig = {}): TournamentRegistration & { studentId: string; players?: string; userId?: string } {
  participantCounter++;
  
  const studentId = `STU${String(participantCounter).padStart(6, '0')}`;
  const defaults = {
    playerName: `Test Player ${participantCounter}`,
    email: `test${participantCounter}@example.com`,
    university: 'Test University',
    teamName: `Test Team ${participantCounter}`,
    additionalInfo: 'Test participant for unit testing',
    studentId: studentId,
    players: JSON.stringify({
      players: [{ name: `Test Player ${participantCounter}`, studentId: studentId, university: 'Test University', inGameId: `Player${participantCounter}` }],
      substitutes: []
    })
  };

  return {
    ...defaults,
    ...overrides,
    tournamentId: '', // Will be set when registering
  } as TournamentRegistration & { studentId: string; players?: string; userId?: string };
}

/**
 * Create multiple test registrations for complex team structures
 */
export function createTestTeam(size: number, baseConfig: TestTeamConfig = {}): TournamentRegistration[] {
  const team: TournamentRegistration[] = [];
  
  for (let i = 1; i <= size; i++) {
    team.push(createTestRegistration({
      ...baseConfig,
      playerName: baseConfig.playerName ? 
        `${baseConfig.playerName} ${i}` : 
        `Team Player ${i}`,
      email: baseConfig.email ? 
        baseConfig.email.replace('@', `+${i}@`) : 
        `teammember${i}@example.com`,
      teamName: baseConfig.teamName || `Test Team ${participantCounter}`
    }));
  }
  
  return team;
}

/**
 * Create realistic university team data
 */
export function createUniversityTeamConfig(university: string, teamCount: number = 1): TestTeamConfig[] {
  const teams: TestTeamConfig[] = [];
  
  for (let i = 1; i <= teamCount; i++) {
    const teamNum = String(i);
    teams.push({
      university,
      teamName: `${university} Team ${i}`,
      email: `team${teamNum.toLowerCase().replace(/\s+/g, '')}@${university.toLowerCase().replace(/\s+/g, '')}.edu`
    });
  }
  
  return teams;
}

/**
 * Create tournament with diverse team structures
 */
export function createDiverseTestSet(): {
  tournamentId: string;
  registrations: TournamentRegistration[];
} {
  const tournamentId = createTestTournament();
  const registrations: TournamentRegistration[] = [];
  
  // Individual participants
  registrations.push(createTestRegistration({
    playerName: 'Solo Player One',
    teamName: undefined,
    university: 'Independent University'
  }));
  
  registrations.push(createTestRegistration({
    playerName: 'Solo Player Two', 
    teamName: undefined,
    university: 'Another University'
  }));
  
  // Small team (2 players)
  registrations.push(...createTestTeam(2, {
    teamName: 'Small Team Alpha',
    university: 'Team University'
  }));
  
  // Large team (5 players)
  registrations.push(...createTestTeam(5, {
    teamName: 'Large Team Beta',
    university: 'Big University'
  }));
  
  // University teams
  const universityTeams = createUniversityTeamConfig('Elite Technical University', 2);
  for (const teamConfig of universityTeams) {
    registrations.push(...createTestTeam(3, teamConfig));
  }
  
  return { tournamentId, registrations };
}

/**
 * Test data cleanup utilities
 */
export class TestDataManager {
  private createdTournaments: string[] = [];
  private createdParticipants: string[] = [];
  private service: ParticipantManagementService;

  constructor(service: ParticipantManagementService) {
    this.service = service;
  }

  /**
   * Register all participants and track them for cleanup
   */
  async registerParticipants(tournamentId: string, registrations: TournamentRegistration[]): Promise<string[]> {
    const participantIds: string[] = [];
    
    for (const registration of registrations) {
      const result = await this.service.register(tournamentId, registration);
      if (result.success && result.participant) {
        participantIds.push(result.participant.id);
        this.createdParticipants.push(result.participant.id);
      }
    }
    
    if (!this.createdTournaments.includes(tournamentId)) {
      this.createdTournaments.push(tournamentId);
    }
    
    return participantIds;
  }

  /**
   * Clean up all created test data
   */
  async cleanup(): Promise<void> {
    // Delete all created participants
    for (const participantId of this.createdParticipants) {
      try {
        await this.service.delete(participantId);
      } catch (error) {
        console.warn(`Failed to delete participant ${participantId}:`, error);
      }
    }
    
    this.createdParticipants = [];
    this.createdTournaments = [];
  }

  /**
   * Get count of created items for verification
   */
  getStats(): { tournaments: number; participants: number } {
    return {
      tournaments: this.createdTournaments.length,
      participants: this.createdParticipants.length
    };
  }
}

/**
 * Global cleanup function for test teardown
 */
export async function cleanupTestData(service: ParticipantManagementService): Promise<void> {
  try {
    // Get all registrations and delete them
    const allRegistrations = await service.getAllRegistrations();
    
    // Delete all created participants
    for (const participant of allRegistrations) {
      try {
        await service.delete(participant.id);
      } catch (error) {
        // Ignore deletion errors during cleanup
      }
    }
    
    // Clear cache related to test tournaments
    const { cache } = await import('@/lib/cache');
    // Note: In real implementation, we'd clear specific cache keys
  } catch (error) {
    console.warn('Error during test cleanup:', error);
  }
}

/**
 * Mock Appwrite test environment utilities
 */
export class MockAppwriteEnvironment {
  private collections: Map<string, any[]> = new Map();
  
  /**
   * Create an isolated test collection
   */
  createCollection(name: string): void {
    this.collections.set(name, []);
  }
  
  /**
   * Add document to collection
   */
  addDocument(collectionName: string, document: any): void {
    const collection = this.collections.get(collectionName) || [];
    collection.push({ ...document, $id: this.generateId() });
    this.collections.set(collectionName, collection);
  }
  
  /**
   * Query collection with filters
   */
  queryCollection(collectionName: string, filters: any = {}): any[] {
    const collection = this.collections.get(collectionName) || [];
    let results = [...collection];
    
    if (filters.equal) {
      for (const [field, value] of Object.entries(filters.equal)) {
        results = results.filter(doc => doc[field] === value);
      }
    }
    
    return results;
  }
  
  /**
   * Clear all test data
   */
  clearAll(): void {
    this.collections.clear();
  }
  
  private generateId(): string {
    return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton for easy access in tests
export const mockAppwriteEnv = new MockAppwriteEnvironment();