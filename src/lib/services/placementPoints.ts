// src/lib/services/placementPoints.ts
/**
 * Placement Points Calculation Service
 * Handles various scoring systems for tournaments
 */

export type ScoringSystem = 
  | 'standard'      // 1st=100, 2nd=75, 3rd=50...
  | 'exponential'   // Points decrease exponentially
  | 'linear'        // Points decrease linearly
  | 'f1'            // F1-style: 25, 18, 15, 12, 10...
  | 'battle_royale' // BR-style with kill points
  | 'custom';

export interface ScoringConfig {
  system: ScoringSystem;
  customPoints?: number[]; // For custom system
  killMultiplier?: number; // For battle royale
  basePoints?: number;
  decayRate?: number;
}

export interface PlacementResult {
  participantId: string;
  placement: number;
  placementPoints: number;
  killPoints?: number;
  totalPoints: number;
}

export interface TournamentStandings {
  tournamentId: string;
  standings: PlacementResult[];
  lastUpdated: string;
}

// Predefined scoring tables
const SCORING_TABLES: Record<string, number[]> = {
  standard: [100, 75, 50, 40, 30, 25, 20, 15, 10, 8, 6, 5, 4, 3, 2, 1],
  f1: [25, 18, 15, 12, 10, 8, 6, 4, 2, 1],
  battle_royale: [15, 12, 10, 8, 7, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 0],
};

class PlacementPointsService {
  // Tournament standings cache
  private standings: Map<string, TournamentStandings> = new Map();

  /**
   * Calculate points for a single placement
   */
  calculatePlacementPoints(
    placement: number,
    config: ScoringConfig
  ): number {
    if (placement < 1) return 0;

    switch (config.system) {
      case 'standard':
        return this.getFromTable(placement, SCORING_TABLES.standard);
      
      case 'f1':
        return this.getFromTable(placement, SCORING_TABLES.f1);
      
      case 'battle_royale':
        return this.getFromTable(placement, SCORING_TABLES.battle_royale);
      
      case 'exponential':
        return this.calculateExponential(placement, config);
      
      case 'linear':
        return this.calculateLinear(placement, config);
      
      case 'custom':
        return config.customPoints?.[placement - 1] || 0;
      
      default:
        return 0;
    }
  }

  /**
   * Calculate total points including kills (for BR-style)
   */
  calculateTotalPoints(
    placement: number,
    kills: number,
    config: ScoringConfig
  ): { placementPoints: number; killPoints: number; totalPoints: number } {
    const placementPoints = this.calculatePlacementPoints(placement, config);
    const killPoints = kills * (config.killMultiplier || 1);
    const totalPoints = placementPoints + killPoints;

    return { placementPoints, killPoints, totalPoints };
  }

  /**
   * Calculate standings for multiple participants
   */
  calculateStandings(
    tournamentId: string,
    results: Array<{
      participantId: string;
      placement: number;
      kills?: number;
    }>,
    config: ScoringConfig
  ): TournamentStandings {
    const standings: PlacementResult[] = results.map(result => {
      const { placementPoints, killPoints, totalPoints } = 
        this.calculateTotalPoints(
          result.placement,
          result.kills || 0,
          config
        );

      return {
        participantId: result.participantId,
        placement: result.placement,
        placementPoints,
        killPoints: result.kills ? killPoints : undefined,
        totalPoints,
      };
    });

    // Sort by total points descending
    standings.sort((a, b) => b.totalPoints - a.totalPoints);

    const tournamentStandings: TournamentStandings = {
      tournamentId,
      standings,
      lastUpdated: new Date().toISOString(),
    };

    // Cache standings
    this.standings.set(tournamentId, tournamentStandings);

    return tournamentStandings;
  }

  /**
   * Aggregate standings across multiple matches/rounds
   */
  aggregateStandings(
    tournamentId: string,
    matchResults: Array<{
      matchId: string;
      results: Array<{
        participantId: string;
        placement: number;
        kills?: number;
      }>;
    }>,
    config: ScoringConfig
  ): TournamentStandings {
    // Accumulate points per participant
    const pointsMap = new Map<string, {
      placementPoints: number;
      killPoints: number;
      totalPoints: number;
      bestPlacement: number;
      matchesPlayed: number;
    }>();

    for (const match of matchResults) {
      for (const result of match.results) {
        const current = pointsMap.get(result.participantId) || {
          placementPoints: 0,
          killPoints: 0,
          totalPoints: 0,
          bestPlacement: Infinity,
          matchesPlayed: 0,
        };

        const { placementPoints, killPoints, totalPoints } = 
          this.calculateTotalPoints(
            result.placement,
            result.kills || 0,
            config
          );

        pointsMap.set(result.participantId, {
          placementPoints: current.placementPoints + placementPoints,
          killPoints: current.killPoints + killPoints,
          totalPoints: current.totalPoints + totalPoints,
          bestPlacement: Math.min(current.bestPlacement, result.placement),
          matchesPlayed: current.matchesPlayed + 1,
        });
      }
    }

    // Convert to standings array
    const standings: PlacementResult[] = [];
    let rank = 1;

    // Sort by total points
    const sorted = Array.from(pointsMap.entries())
      .sort((a, b) => b[1].totalPoints - a[1].totalPoints);

    for (const [participantId, data] of sorted) {
      standings.push({
        participantId,
        placement: rank++,
        placementPoints: data.placementPoints,
        killPoints: data.killPoints > 0 ? data.killPoints : undefined,
        totalPoints: data.totalPoints,
      });
    }

    const tournamentStandings: TournamentStandings = {
      tournamentId,
      standings,
      lastUpdated: new Date().toISOString(),
    };

    this.standings.set(tournamentId, tournamentStandings);

    return tournamentStandings;
  }

  /**
   * Get current standings
   */
  getStandings(tournamentId: string): TournamentStandings | null {
    return this.standings.get(tournamentId) || null;
  }

  /**
   * Get participant rank
   */
  getParticipantRank(
    tournamentId: string,
    participantId: string
  ): { rank: number; points: number } | null {
    const standings = this.standings.get(tournamentId);
    if (!standings) return null;

    const entry = standings.standings.find(
      s => s.participantId === participantId
    );

    if (!entry) return null;

    return {
      rank: entry.placement,
      points: entry.totalPoints,
    };
  }

  // Private calculation methods

  private getFromTable(placement: number, table: number[]): number {
    const index = placement - 1;
    if (index < 0 || index >= table.length) {
      return 0;
    }
    return table[index];
  }

  private calculateExponential(
    placement: number,
    config: ScoringConfig
  ): number {
    const base = config.basePoints || 100;
    const decay = config.decayRate || 0.5;
    return Math.floor(base * Math.pow(decay, placement - 1));
  }

  private calculateLinear(
    placement: number,
    config: ScoringConfig
  ): number {
    const base = config.basePoints || 100;
    const decay = config.decayRate || 5;
    return Math.max(0, base - (placement - 1) * decay);
  }
}

// Export singleton
export const placementPoints = new PlacementPointsService();

// Export class for testing
export { PlacementPointsService };
