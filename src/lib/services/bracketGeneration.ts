// src/lib/services/bracketGeneration.ts
/**
 * Bracket Generation Service
 * Supports Single Elimination, Double Elimination, Round Robin, and Swiss formats
 */

import type { TournamentParticipant } from '@/types/tournament';

export type BracketFormat = 
  | 'single_elimination'
  | 'double_elimination'
  | 'round_robin'
  | 'swiss';

export interface Match {
  id: string;
  tournamentId: string;
  round: number;
  matchNumber: number;
  participant1Id?: string;
  participant2Id?: string;
  participant1Name?: string;
  participant2Name?: string;
  participant1Score?: number;
  participant2Score?: number;
  winnerId?: string;
  loserId?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'bye';
  scheduledAt?: string;
  completedAt?: string;
  nextMatchId?: string; // For elimination brackets
  bracketType?: 'winners' | 'losers' | 'grand_final'; // For double elimination
}

export interface Bracket {
  id: string;
  tournamentId: string;
  format: BracketFormat;
  rounds: number;
  matches: Match[];
  createdAt: string;
  updatedAt: string;
}

export interface BracketGenerationOptions {
  seed?: boolean; // Whether to seed participants
  shuffleUnseeded?: boolean;
  thirdPlaceMatch?: boolean; // For single elimination
}

class BracketGenerationService {
  private brackets: Map<string, Bracket> = new Map();

  /**
   * Get bracket for a tournament
   */
  getBracket(tournamentId: string): Bracket | undefined {
    return this.brackets.get(tournamentId);
  }

  /**
   * Generate bracket based on format
   */
  async generateBracket(
    tournamentId: string,
    format: BracketFormat,
    participants: TournamentParticipant[],
    options: BracketGenerationOptions = {}
  ): Promise<Bracket> {
    const { seed = true, shuffleUnseeded = true } = options;

    // Prepare participants (seed or shuffle)
    let orderedParticipants = seed 
      ? this.seedParticipants(participants)
      : shuffleUnseeded 
        ? this.shuffleParticipants(participants)
        : participants;

    let matches: Match[];
    let rounds: number;

    switch (format) {
      case 'single_elimination':
        ({ matches, rounds } = this.generateSingleElimination(
          tournamentId,
          orderedParticipants,
          options.thirdPlaceMatch
        ));
        break;
      case 'double_elimination':
        ({ matches, rounds } = this.generateDoubleElimination(
          tournamentId,
          orderedParticipants
        ));
        break;
      case 'round_robin':
        ({ matches, rounds } = this.generateRoundRobin(
          tournamentId,
          orderedParticipants
        ));
        break;
      case 'swiss':
        // Swiss starts with just round 1
        ({ matches, rounds } = this.generateSwissRound(
          tournamentId,
          orderedParticipants,
          1
        ));
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    const now = new Date().toISOString();
    
    return {
      id: `bracket_${Date.now()}`,
      tournamentId,
      format,
      rounds,
      matches,
      createdAt: now,
      updatedAt: now,
    };
  }

  /**
   * Generate Single Elimination bracket
   */
  private generateSingleElimination(
    tournamentId: string,
    participants: TournamentParticipant[],
    thirdPlaceMatch: boolean = false
  ): { matches: Match[]; rounds: number } {
    const matches: Match[] = [];
    const n = participants.length;
    
    // Calculate rounds needed
    const rounds = Math.ceil(Math.log2(n));
    const totalSlots = Math.pow(2, rounds);
    const byes = totalSlots - n;

    // Create first round matches
    let matchNumber = 1;
    const firstRoundMatches: Match[] = [];
    let byeCount = 0;

    for (let i = 0; i < totalSlots / 2; i++) {
      const p1Index = i * 2;
      const p2Index = i * 2 + 1;

      // Handle byes - top seeds get byes
      const isBye = byeCount < byes && p2Index >= n;
      
      const match: Match = {
        id: `match_${tournamentId}_r1_${matchNumber}`,
        tournamentId,
        round: 1,
        matchNumber: matchNumber++,
        participant1Id: participants[p1Index]?.id,
        participant1Name: participants[p1Index]?.playerName,
        participant2Id: isBye ? undefined : participants[p2Index]?.id,
        participant2Name: isBye ? undefined : participants[p2Index]?.playerName,
        status: isBye ? 'bye' : 'pending',
        winnerId: isBye ? participants[p1Index]?.id : undefined,
      };

      firstRoundMatches.push(match);
      matches.push(match);

      if (isBye) byeCount++;
    }

    // Generate subsequent rounds
    let previousRoundMatches = firstRoundMatches;
    
    for (let round = 2; round <= rounds; round++) {
      const roundMatches: Match[] = [];
      const numMatches = previousRoundMatches.length / 2;

      for (let i = 0; i < numMatches; i++) {
        const match: Match = {
          id: `match_${tournamentId}_r${round}_${matchNumber}`,
          tournamentId,
          round,
          matchNumber: matchNumber++,
          status: 'pending',
        };

        // Link previous matches to this one
        const prevMatch1 = previousRoundMatches[i * 2];
        const prevMatch2 = previousRoundMatches[i * 2 + 1];
        
        if (prevMatch1) prevMatch1.nextMatchId = match.id;
        if (prevMatch2) prevMatch2.nextMatchId = match.id;

        // If previous match was a bye, propagate winner
        if (prevMatch1?.status === 'bye') {
          match.participant1Id = prevMatch1.winnerId;
          match.participant1Name = prevMatch1.participant1Name;
        }
        if (prevMatch2?.status === 'bye') {
          match.participant2Id = prevMatch2.winnerId;
          match.participant2Name = prevMatch2.participant1Name;
        }

        roundMatches.push(match);
        matches.push(match);
      }

      previousRoundMatches = roundMatches;
    }

    // Add third place match if requested
    if (thirdPlaceMatch && rounds >= 2) {
      matches.push({
        id: `match_${tournamentId}_3rd`,
        tournamentId,
        round: rounds,
        matchNumber: matchNumber++,
        status: 'pending',
      });
    }

    return { matches, rounds };
  }

  /**
   * Generate Double Elimination bracket
   */
  private generateDoubleElimination(
    tournamentId: string,
    participants: TournamentParticipant[]
  ): { matches: Match[]; rounds: number } {
    // Generate winners bracket first
    const { matches: winnersMatches, rounds: winnersRounds } = 
      this.generateSingleElimination(tournamentId, participants);

    // Mark all as winners bracket
    winnersMatches.forEach(m => {
      m.bracketType = 'winners';
      m.id = m.id.replace('match_', 'match_w_');
    });

    // Losers bracket has more rounds
    const losersRounds = (winnersRounds - 1) * 2;
    const losersMatches: Match[] = [];
    let matchNumber = winnersMatches.length + 1;

    // Create losers bracket structure
    for (let round = 1; round <= losersRounds; round++) {
      const numMatches = Math.ceil(participants.length / Math.pow(2, Math.ceil(round / 2) + 1));
      
      for (let i = 0; i < numMatches; i++) {
        losersMatches.push({
          id: `match_l_${tournamentId}_r${round}_${matchNumber++}`,
          tournamentId,
          round: round,
          matchNumber: matchNumber,
          status: 'pending',
          bracketType: 'losers',
        });
      }
    }

    // Grand final (potentially 2 matches)
    const grandFinal: Match = {
      id: `match_gf_${tournamentId}`,
      tournamentId,
      round: winnersRounds + 1,
      matchNumber: matchNumber++,
      status: 'pending',
      bracketType: 'grand_final',
    };

    const allMatches = [...winnersMatches, ...losersMatches, grandFinal];
    const totalRounds = winnersRounds + 1; // +1 for grand final

    return { matches: allMatches, rounds: totalRounds };
  }

  /**
   * Generate Round Robin schedule
   */
  private generateRoundRobin(
    tournamentId: string,
    participants: TournamentParticipant[]
  ): { matches: Match[]; rounds: number } {
    const matches: Match[] = [];
    const n = participants.length;
    
    // Round robin needs everyone to play everyone
    const rounds = n % 2 === 0 ? n - 1 : n;
    let matchNumber = 1;

    // Create a copy for rotation
    const slots = [...participants];
    if (n % 2 !== 0) {
      slots.push(null as any); // BYE placeholder
    }

    const numSlots = slots.length;

    for (let round = 1; round <= rounds; round++) {
      // Generate pairings for this round
      for (let i = 0; i < numSlots / 2; i++) {
        const p1 = slots[i];
        const p2 = slots[numSlots - 1 - i];

        // Skip if either is a bye
        if (!p1 || !p2) continue;

        matches.push({
          id: `match_${tournamentId}_r${round}_${matchNumber}`,
          tournamentId,
          round,
          matchNumber: matchNumber++,
          participant1Id: p1.id,
          participant1Name: p1.playerName,
          participant2Id: p2.id,
          participant2Name: p2.playerName,
          status: 'pending',
        });
      }

      // Rotate participants (keep first fixed)
      const fixed = slots[0];
      const last = slots.pop()!;
      slots.splice(1, 0, last);
      slots[0] = fixed;
    }

    return { matches, rounds };
  }

  /**
   * Generate Swiss round pairings
   */
  private generateSwissRound(
    tournamentId: string,
    participants: TournamentParticipant[],
    roundNumber: number,
    standings?: Map<string, number>
  ): { matches: Match[]; rounds: number } {
    const matches: Match[] = [];
    
    // Sort by standings if provided
    let sortedParticipants = [...participants];
    if (standings) {
      sortedParticipants.sort((a, b) => 
        (standings.get(b.id) || 0) - (standings.get(a.id) || 0)
      );
    }

    // Pair adjacent participants
    let matchNumber = 1;
    for (let i = 0; i < sortedParticipants.length - 1; i += 2) {
      const p1 = sortedParticipants[i];
      const p2 = sortedParticipants[i + 1];

      if (p1 && p2) {
        matches.push({
          id: `match_${tournamentId}_r${roundNumber}_${matchNumber}`,
          tournamentId,
          round: roundNumber,
          matchNumber: matchNumber++,
          participant1Id: p1.id,
          participant1Name: p1.playerName,
          participant2Id: p2.id,
          participant2Name: p2.playerName,
          status: 'pending',
        });
      }
    }

    // Swiss typically has log2(n) rounds
    const totalRounds = Math.ceil(Math.log2(participants.length));

    return { matches, rounds: totalRounds };
  }

  // Utility methods

  private seedParticipants(participants: TournamentParticipant[]): TournamentParticipant[] {
    // For now, keep original order (assumes pre-seeded)
    // In production, would use ranking/rating data
    return [...participants];
  }

  private shuffleParticipants(participants: TournamentParticipant[]): TournamentParticipant[] {
    const shuffled = [...participants];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Advance winner to next match
   */
  advanceWinner(bracket: Bracket, matchId: string, winnerId: string): Bracket {
    const match = bracket.matches.find(m => m.id === matchId);
    if (!match) return bracket;

    match.winnerId = winnerId;
    match.loserId = match.participant1Id === winnerId 
      ? match.participant2Id 
      : match.participant1Id;
    match.status = 'completed';
    match.completedAt = new Date().toISOString();

    // Advance to next match if exists
    if (match.nextMatchId) {
      const nextMatch = bracket.matches.find(m => m.id === match.nextMatchId);
      if (nextMatch) {
        if (!nextMatch.participant1Id) {
          nextMatch.participant1Id = winnerId;
          nextMatch.participant1Name = match.winnerId === match.participant1Id 
            ? match.participant1Name 
            : match.participant2Name;
        } else {
          nextMatch.participant2Id = winnerId;
          nextMatch.participant2Name = match.winnerId === match.participant1Id 
            ? match.participant1Name 
            : match.participant2Name;
        }
      }
    }

    bracket.updatedAt = new Date().toISOString();
    return bracket;
  }
}

// Export singleton
export const bracketGeneration = new BracketGenerationService();

// Export class for testing
export { BracketGenerationService };
