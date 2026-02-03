// src/lib/services/tournamentManagement.ts
/**
 * Tournament Management Service
 * Full CRUD operations for tournaments with validation and caching
 */

import { cache, CACHE_KEYS, CACHE_TTL } from '@/lib/cache';
import { broadcastTournamentStatusChange } from '@/lib/realtime/tournament-subscription';
import { calendarService } from './calendarService';
import type { Tournament, TournamentAward, TournamentSchedule, TournamentSponsor } from '@/types/tournament';

export interface CreateTournamentInput {
  slug: string;
  gameName: string;
  title?: string;
  description?: string;
  detailedDescription?: string;
  category?: string;
  featuredImageUrl?: string;
  bannerImageUrl?: string;
  startDate?: string;
  endDate?: string;
  registrationStartDate?: string;
  registrationEndDate?: string;
  format?: string;
  maxParticipants?: number;
  prizePool?: number;
  currency?: string;
  rules?: string[];
  requirements?: string[];
}

export interface UpdateTournamentInput extends Partial<CreateTournamentInput> {
  status?: Tournament['status'];
  tournamentStatus?: Tournament['tournamentStatus'];
  awards?: TournamentAward[];
  schedule?: TournamentSchedule[];
  sponsors?: TournamentSponsor[];
}

export interface TournamentFilters {
  status?: Tournament['status'];
  tournamentStatus?: Tournament['tournamentStatus'];
  gameName?: string;
  category?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface TournamentListResult {
  tournaments: Tournament[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

class TournamentManagementService {
  // In-memory storage for development (replace with Appwrite in production)
  private tournaments: Map<string, Tournament> = new Map();

  /**
   * Create a new tournament
   */
  async create(input: CreateTournamentInput): Promise<{
    success: boolean;
    tournament?: Tournament;
    error?: string;
  }> {
    try {
      // Validate slug uniqueness
      const existing = await this.getBySlug(input.slug);
      if (existing) {
        return { success: false, error: 'Tournament slug already exists' };
      }

      // Validate required fields
      if (!input.slug || !input.gameName) {
        return { success: false, error: 'slug and gameName are required' };
      }

      // Normalize slug
      const slug = this.normalizeSlug(input.slug);

      const now = new Date().toISOString();
      const tournament: Tournament = {
        id: `tournament_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        slug,
        gameName: input.gameName,
        title: input.title,
        description: input.description,
        detailedDescription: input.detailedDescription,
        category: input.category,
        featuredImageUrl: input.featuredImageUrl,
        bannerImageUrl: input.bannerImageUrl,
        status: 'draft',
        tournamentStatus: 'upcoming',
        startDate: input.startDate,
        endDate: input.endDate,
        registrationStartDate: input.registrationStartDate,
        registrationEndDate: input.registrationEndDate,
        format: input.format,
        maxParticipants: input.maxParticipants,
        currentParticipants: 0,
        prizePool: input.prizePool,
        currency: input.currency || 'USD',
        rules: input.rules,
        requirements: input.requirements,
        awards: [],
        schedule: [],
        sponsors: [],
        createdAt: now,
        updatedAt: now,
      };

      // Store tournament
      this.tournaments.set(tournament.id, tournament);

      // TODO: Save to Appwrite database
      // await this.saveTournamentToDatabase(tournament);

      // Invalidate list cache
      await cache.delete(CACHE_KEYS.tournamentList());

      return { success: true, tournament };
    } catch (error) {
      console.error('[TournamentManagement] Create error:', error);
      return { success: false, error: 'Failed to create tournament' };
    }
  }

  /**
   * Get tournament by ID
   */
  async getById(id: string): Promise<Tournament | null> {
    // Check cache first
    const cached = await cache.get<Tournament>(CACHE_KEYS.tournament(id));
    if (cached) return cached;

    // Get from storage
    const tournament = this.tournaments.get(id);
    if (!tournament) return null;

    // Cache for future requests
    await cache.set(CACHE_KEYS.tournament(id), tournament, CACHE_TTL.TOURNAMENT_DETAIL);

    return tournament;
  }

  /**
   * Get tournament by slug
   */
  async getBySlug(slug: string): Promise<Tournament | null> {
    const normalized = this.normalizeSlug(slug);
    
    // Search through tournaments
    for (const tournament of this.tournaments.values()) {
      if (tournament.slug === normalized) {
        return tournament;
      }
    }

    return null;
  }

/**
    * Update tournament
    */
  async update(
    id: string,
    input: UpdateTournamentInput
  ): Promise<{
    success: boolean;
    tournament?: Tournament;
    error?: string;
  }> {
    try {
      const existing = await this.getById(id);
      if (!existing) {
        return { success: false, error: 'Tournament not found' };
      }

      // Check slug uniqueness if changing
      if (input.slug && input.slug !== existing.slug) {
        const slugExists = await this.getBySlug(input.slug);
        if (slugExists) {
          return { success: false, error: 'Slug already in use' };
        }
      }

      // Track status change for broadcasting
      const statusChanged = input.status && input.status !== existing.status;
      const previousStatus = existing.status;

      // Merge updates
      const updated: Tournament = {
        ...existing,
        ...input,
        slug: input.slug ? this.normalizeSlug(input.slug) : existing.slug,
        updatedAt: new Date().toISOString(),
      };

      // Store updated tournament
      this.tournaments.set(id, updated);

      // TODO: Update in Appwrite
      // await this.updateTournamentInDatabase(id, updated);

      // Invalidate caches
      await cache.invalidateTournamentCache(id);

      // Broadcast status change if applicable
      if (statusChanged && input.status) {
        broadcastTournamentStatusChange(id, previousStatus, input.status);
      }

      // Update calendar event if tournament is published
      if (updated.status === 'published') {
        try {
          await this.createCalendarEventForTournament(updated);
          console.log(`📅 CalendarService: Updated calendar event for tournament ${id}`);
        } catch (error) {
          console.error('❌ TournamentManagement: Error updating calendar event for tournament:', error);
          // Don't fail the update operation if calendar event creation fails
        }
      }

      return { success: true, tournament: updated };
    } catch (error) {
      console.error('[TournamentManagement] Update error:', error);
      return { success: false, error: 'Failed to update tournament' };
    }
  }

  /**
   * Delete tournament
   */
  async delete(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const existing = await this.getById(id);
      if (!existing) {
        return { success: false, error: 'Tournament not found' };
      }

      // Only allow deleting draft tournaments
      if (existing.status !== 'draft') {
        return { success: false, error: 'Can only delete draft tournaments' };
      }

      // Remove from storage
      this.tournaments.delete(id);

      // TODO: Delete from Appwrite
      // await this.deleteTournamentFromDatabase(id);

      // Invalidate caches
      await cache.invalidateTournamentCache(id);
      await cache.delete(CACHE_KEYS.tournamentList());

      return { success: true };
    } catch (error) {
      console.error('[TournamentManagement] Delete error:', error);
      return { success: false, error: 'Failed to delete tournament' };
    }
  }

  /**
   * List tournaments with filters
   */
  async list(filters: TournamentFilters = {}): Promise<TournamentListResult> {
    const { page = 1, pageSize = 20 } = filters;

    // Get all tournaments
    let tournaments = Array.from(this.tournaments.values());

    // Apply filters
    if (filters.status) {
      tournaments = tournaments.filter((t) => t.status === filters.status);
    }

    if (filters.tournamentStatus) {
      tournaments = tournaments.filter((t) => t.tournamentStatus === filters.tournamentStatus);
    }

    if (filters.gameName) {
      tournaments = tournaments.filter((t) => 
        t.gameName.toLowerCase().includes(filters.gameName!.toLowerCase())
      );
    }

    if (filters.category) {
      tournaments = tournaments.filter((t) => t.category === filters.category);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      tournaments = tournaments.filter((t) =>
        t.title?.toLowerCase().includes(searchLower) ||
        t.gameName.toLowerCase().includes(searchLower) ||
        t.description?.toLowerCase().includes(searchLower)
      );
    }

    // Sort by created date (newest first)
    tournaments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const total = tournaments.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const paged = tournaments.slice(start, start + pageSize);

    return {
      tournaments: paged,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

/**
    * Publish a tournament
    */
  async publish(id: string): Promise<{ success: boolean; error?: string }> {
    const result = await this.update(id, { status: 'published' });
    
    // Automatically create calendar event when tournament is published
    if (result.success && result.tournament) {
      try {
        await this.createCalendarEventForTournament(result.tournament);
        console.log(`📅 CalendarService: Created calendar event for published tournament ${id}`);
      } catch (error) {
        console.error('❌ TournamentManagement: Error creating calendar event for tournament:', error);
        // Don't fail the publish operation if calendar event creation fails
      }
    }
    
    return { success: result.success, error: result.error };
  }

  /**
    * Create calendar event for tournament
    */
  private async createCalendarEventForTournament(tournament: Tournament): Promise<void> {
    try {
      const gameSlug = tournament.gameName.toLowerCase().replace(/\s+/g, '-');
      
      let status: 'upcoming' | 'live' | 'completed' = 'upcoming';
      if (tournament.tournamentStatus === 'ongoing') {
        status = 'live';
      } else if (tournament.tournamentStatus === 'completed') {
        status = 'completed';
      }

      const eventData = {
        title: tournament.title || `${tournament.gameName} Tournament`,
        description: tournament.description || `Tournament for ${tournament.gameName}`,
        date: tournament.startDate || tournament.registrationStartDate || new Date().toISOString().split('T')[0],
        time: tournament.startDate ? new Date(tournament.startDate).toTimeString().slice(0, 5) : undefined,
        type: 'tournament' as const,
        status,
        gameSlug,
        tournamentId: tournament.id,
        location: tournament.format || 'Online',
        registrationDeadline: tournament.registrationDeadline,
        maxParticipants: tournament.maxParticipants,
        currentParticipants: tournament.currentParticipants || 0,
        prizePool: tournament.prizePool ? `${tournament.prizePool} ${tournament.currency || 'USD'}` : undefined,
        isImportant: true
      };

      // Check if calendar event already exists for this tournament
      const existingEvents = await calendarService.getEventsByDateRange(
        gameSlug,
        eventData.date,
        eventData.date
      );
      
      const existingTournamentEvent = existingEvents.find(event => event.tournamentId === tournament.id);
      
      if (existingTournamentEvent) {
        // Update existing event
        await calendarService.updateEvent(existingTournamentEvent.id, eventData);
      } else {
        // Create new event
        await calendarService.createEvent(eventData);
      }
    } catch (error) {
      console.error('❌ TournamentManagement: Error creating calendar event:', error);
      throw error;
    }
  }

  /**
   * Archive a tournament
   */
  async archive(id: string): Promise<{ success: boolean; error?: string }> {
    const result = await this.update(id, { status: 'archived' });
    return { success: result.success, error: result.error };
  }

/**
    * Update tournament status
    */
  async updateTournamentStatus(
    id: string,
    status: Tournament['tournamentStatus']
  ): Promise<{ success: boolean; error?: string }> {
    const result = await this.update(id, { tournamentStatus: status });
    
    // Update calendar event status if tournament is published
    if (result.success && result.tournament && result.tournament.status === 'published') {
      try {
        await this.createCalendarEventForTournament(result.tournament);
        console.log(`📅 CalendarService: Updated calendar event status for tournament ${id}`);
      } catch (error) {
        console.error('❌ TournamentManagement: Error updating calendar event status:', error);
        // Don't fail the status update operation if calendar event creation fails
      }
    }
    
    return { success: result.success, error: result.error };
  }

  /**
   * Add award to tournament
   */
  async addAward(id: string, award: Omit<TournamentAward, 'id'>): Promise<{
    success: boolean;
    award?: TournamentAward;
    error?: string;
  }> {
    const tournament = await this.getById(id);
    if (!tournament) {
      return { success: false, error: 'Tournament not found' };
    }

    const newAward: TournamentAward = {
      ...award,
      id: `award_${Date.now()}`,
    };

    const awards = [...(tournament.awards || []), newAward];
    const result = await this.update(id, { awards });

    return { success: result.success, award: newAward, error: result.error };
  }

  /**
   * Add schedule item to tournament
   */
  async addScheduleItem(id: string, item: Omit<TournamentSchedule, 'id'>): Promise<{
    success: boolean;
    item?: TournamentSchedule;
    error?: string;
  }> {
    const tournament = await this.getById(id);
    if (!tournament) {
      return { success: false, error: 'Tournament not found' };
    }

    const newItem: TournamentSchedule = {
      ...item,
      id: `schedule_${Date.now()}`,
    };

    const schedule = [...(tournament.schedule || []), newItem];
    const result = await this.update(id, { schedule });

    return { success: result.success, item: newItem, error: result.error };
  }

  // Private helpers

  private normalizeSlug(slug: string): string {
    return slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}

// Export singleton
export const tournamentManagement = new TournamentManagementService();

// Export class for testing
export { TournamentManagementService };
