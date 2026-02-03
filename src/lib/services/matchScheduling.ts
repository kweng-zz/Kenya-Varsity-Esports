// src/lib/services/matchScheduling.ts
/**
 * Match Scheduling Service
 * Handles match timing, venue assignment, and schedule conflicts
 */

import { cache } from '@/lib/cache';
import { notificationService, NotificationType } from './notification';
import type { Match } from './bracketGeneration';

export interface ScheduleSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  venue?: string;
  matchId?: string;
  available: boolean;
}

export interface SchedulingOptions {
  matchDurationMinutes: number;
  breakBetweenMatchesMinutes: number;
  maxConcurrentMatches: number;
  startTime: Date;
  endTime: Date;
  venues?: string[];
}

export interface ScheduleResult {
  scheduledMatches: Array<Match & { scheduledAt: string; venue?: string }>;
  unscheduledMatches: Match[];
  conflicts: Array<{ matchId: string; reason: string }>;
}

class MatchSchedulingService {
  // Store scheduled slots
  private scheduleSlots: Map<string, ScheduleSlot[]> = new Map();

  /**
   * Auto-schedule matches for a tournament
   */
  async autoSchedule(
    tournamentId: string,
    matches: Match[],
    options: SchedulingOptions
  ): Promise<ScheduleResult> {
    const {
      matchDurationMinutes,
      breakBetweenMatchesMinutes,
      maxConcurrentMatches,
      startTime,
      endTime,
      venues = ['Main Stage'],
    } = options;

    const scheduledMatches: Array<Match & { scheduledAt: string; venue?: string }> = [];
    const unscheduledMatches: Match[] = [];
    const conflicts: Array<{ matchId: string; reason: string }> = [];

    // Group matches by round
    const matchesByRound = new Map<number, Match[]>();
    matches.forEach(match => {
      const round = match.round;
      if (!matchesByRound.has(round)) {
        matchesByRound.set(round, []);
      }
      matchesByRound.get(round)!.push(match);
    });

    // Sort rounds
    const sortedRounds = Array.from(matchesByRound.keys()).sort((a, b) => a - b);

    let currentTime = new Date(startTime);
    const slotDuration = matchDurationMinutes + breakBetweenMatchesMinutes;

    for (const round of sortedRounds) {
      const roundMatches = matchesByRound.get(round)!;
      let matchesInSlot = 0;
      let venueIndex = 0;

      for (const match of roundMatches) {
        // Check if we're within the allowed time window
        if (currentTime >= endTime) {
          unscheduledMatches.push(match);
          conflicts.push({
            matchId: match.id,
            reason: 'No available time slots',
          });
          continue;
        }

        // Schedule the match
        const venue = venues[venueIndex % venues.length];
        const scheduledMatch = {
          ...match,
          scheduledAt: currentTime.toISOString(),
          venue,
        };

        scheduledMatches.push(scheduledMatch);
        matchesInSlot++;
        venueIndex++;

        // Move to next time slot if max concurrent reached
        if (matchesInSlot >= Math.min(maxConcurrentMatches, venues.length)) {
          currentTime = new Date(currentTime.getTime() + slotDuration * 60000);
          matchesInSlot = 0;
          venueIndex = 0;
        }
      }

      // Add break between rounds
      if (matchesInSlot > 0) {
        currentTime = new Date(currentTime.getTime() + slotDuration * 60000);
      }
    }

    // Store the schedule
    this.storeSchedule(tournamentId, scheduledMatches);

    return {
      scheduledMatches,
      unscheduledMatches,
      conflicts,
    };
  }

  /**
   * Schedule a single match
   */
  async scheduleMatch(
    tournamentId: string,
    match: Match,
    scheduledAt: Date,
    venue?: string
  ): Promise<{
    success: boolean;
    conflict?: string;
  }> {
    // Check for conflicts
    const conflict = await this.checkConflict(
      tournamentId,
      match.participant1Id,
      match.participant2Id,
      scheduledAt,
      30 // Default 30 min duration
    );

    if (conflict) {
      return { success: false, conflict };
    }

    // Store the scheduled match
    const slots = this.scheduleSlots.get(tournamentId) || [];
    slots.push({
      id: `slot_${Date.now()}`,
      startTime: scheduledAt,
      endTime: new Date(scheduledAt.getTime() + 30 * 60000),
      venue,
      matchId: match.id,
      available: false,
    });
    this.scheduleSlots.set(tournamentId, slots);

    return { success: true };
  }

  /**
   * Reschedule a match
   */
  async rescheduleMatch(
    tournamentId: string,
    matchId: string,
    newTime: Date,
    newVenue?: string
  ): Promise<{ success: boolean; error?: string }> {
    const slots = this.scheduleSlots.get(tournamentId) || [];
    const slotIndex = slots.findIndex(s => s.matchId === matchId);

    if (slotIndex === -1) {
      return { success: false, error: 'Match not found in schedule' };
    }

    // Update the slot
    slots[slotIndex] = {
      ...slots[slotIndex],
      startTime: newTime,
      endTime: new Date(newTime.getTime() + 30 * 60000),
      venue: newVenue || slots[slotIndex].venue,
    };

    return { success: true };
  }

  /**
   * Check for scheduling conflicts
   */
  async checkConflict(
    tournamentId: string,
    participant1Id?: string,
    participant2Id?: string,
    scheduledAt?: Date,
    durationMinutes: number = 30
  ): Promise<string | null> {
    if (!scheduledAt) return null;

    // In production, check against stored schedules
    // For now, return no conflict
    return null;
  }

  /**
   * Get schedule for a tournament
   */
  async getSchedule(
    tournamentId: string,
    options?: {
      date?: Date;
      venue?: string;
      participantId?: string;
    }
  ): Promise<ScheduleSlot[]> {
    let slots = this.scheduleSlots.get(tournamentId) || [];

    if (options?.date) {
      const dateStr = options.date.toISOString().split('T')[0];
      slots = slots.filter(s => 
        s.startTime.toISOString().split('T')[0] === dateStr
      );
    }

    if (options?.venue) {
      slots = slots.filter(s => s.venue === options.venue);
    }

    // Sort by start time
    return slots.sort((a, b) => 
      a.startTime.getTime() - b.startTime.getTime()
    );
  }

  /**
   * Send match reminders
   */
  async sendMatchReminders(
    tournamentId: string,
    minutesBefore: number = 30
  ): Promise<number> {
    const now = new Date();
    const reminderTime = new Date(now.getTime() + minutesBefore * 60000);

    const slots = this.scheduleSlots.get(tournamentId) || [];
    let remindersSent = 0;

    for (const slot of slots) {
      // Check if match is within reminder window
      if (slot.startTime >= now && slot.startTime <= reminderTime && slot.matchId) {
        // In production, would look up participant IDs and notify them
        remindersSent++;
      }
    }

    return remindersSent;
  }

  /**
   * Get next match for a participant
   */
  async getNextMatchForParticipant(
    tournamentId: string,
    participantId: string
  ): Promise<ScheduleSlot | null> {
    const now = new Date();
    const slots = await this.getSchedule(tournamentId);
    
    // In production, would filter by participant ID
    const upcoming = slots.filter(s => s.startTime > now);
    
    return upcoming[0] || null;
  }

  // Private methods

  private storeSchedule(
    tournamentId: string,
    matches: Array<Match & { scheduledAt: string; venue?: string }>
  ): void {
    const slots: ScheduleSlot[] = matches.map(match => ({
      id: `slot_${match.id}`,
      startTime: new Date(match.scheduledAt),
      endTime: new Date(new Date(match.scheduledAt).getTime() + 30 * 60000),
      venue: match.venue,
      matchId: match.id,
      available: false,
    }));

    this.scheduleSlots.set(tournamentId, slots);
  }
}

// Export singleton
export const matchScheduling = new MatchSchedulingService();

// Export class for testing
export { MatchSchedulingService };
