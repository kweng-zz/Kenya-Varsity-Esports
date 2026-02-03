// src/lib/services/registrationEnhancement.ts
/**
 * Enhanced Registration Service
 * Handles team registration, waitlist, and registration windows
 */

import { participantManagement } from './participantManagement';
import { tournamentManagement } from './tournamentManagement';
import { notificationService, NotificationType } from './notification';
import { cache, CACHE_KEYS } from '@/lib/cache';
import type { TournamentParticipant, TournamentRegistration } from '@/types/tournament';

export interface TeamRegistration {
  teamName: string;
  captainEmail: string;
  captainName: string;
  members: Array<{
    playerName: string;
    email: string;
    university?: string;
  }>;
}

export interface RegistrationWindow {
  tournamentId: string;
  isOpen: boolean;
  opensAt?: Date;
  closesAt?: Date;
  spotsRemaining: number;
  waitlistEnabled: boolean;
  waitlistCount: number;
}

class RegistrationEnhancementService {
  // Waitlist storage
  private waitlist: Map<string, TournamentRegistration[]> = new Map();

  /**
   * Check registration window status
   */
  async getRegistrationWindow(tournamentId: string): Promise<RegistrationWindow> {
    const tournament = await tournamentManagement.getById(tournamentId);
    
    if (!tournament) {
      return {
        tournamentId,
        isOpen: false,
        spotsRemaining: 0,
        waitlistEnabled: false,
        waitlistCount: 0,
      };
    }

    const now = new Date();
    const opensAt = tournament.registrationStartDate 
      ? new Date(tournament.registrationStartDate) 
      : undefined;
    const closesAt = tournament.registrationEndDate 
      ? new Date(tournament.registrationEndDate) 
      : undefined;

    const isOpen = Boolean(
      tournament.tournamentStatus === 'registration_open' ||
      (opensAt && closesAt && now >= opensAt && now <= closesAt)
    );

    const participantCount = await participantManagement.getCount(tournamentId);
    const maxParticipants = tournament.maxParticipants || Infinity;
    const spotsRemaining = Math.max(0, maxParticipants - participantCount);

    const waitlistQueue = this.waitlist.get(tournamentId) || [];

    return {
      tournamentId,
      isOpen,
      opensAt,
      closesAt,
      spotsRemaining,
      waitlistEnabled: spotsRemaining === 0,
      waitlistCount: waitlistQueue.length,
    };
  }

  /**
   * Register with waitlist support
   */
  async registerWithWaitlist(
    tournamentId: string,
    registration: TournamentRegistration
  ): Promise<{
    success: boolean;
    status: 'registered' | 'waitlisted';
    position?: number;
    error?: string;
  }> {
    const window = await this.getRegistrationWindow(tournamentId);

    if (!window.isOpen) {
      return { 
        success: false, 
        status: 'registered',
        error: 'Registration is not open' 
      };
    }

    // Check if already registered or on waitlist
    const isRegistered = await participantManagement.isRegistered(
      tournamentId,
      registration.email
    );
    if (isRegistered) {
      return { 
        success: false, 
        status: 'registered',
        error: 'Already registered' 
      };
    }

    // If spots available, register normally
    if (window.spotsRemaining > 0) {
      const result = await participantManagement.register(tournamentId, registration);
      if (result.success) {
        return { success: true, status: 'registered' };
      }
      return { success: false, status: 'registered', error: result.error };
    }

    // Add to waitlist
    const position = await this.addToWaitlist(tournamentId, registration);
    
    return { 
      success: true, 
      status: 'waitlisted', 
      position 
    };
  }

  /**
   * Register a team
   */
  async registerTeam(
    tournamentId: string,
    teamRegistration: TeamRegistration
  ): Promise<{
    success: boolean;
    participants?: TournamentParticipant[];
    error?: string;
  }> {
    const window = await this.getRegistrationWindow(tournamentId);

    if (!window.isOpen) {
      return { success: false, error: 'Registration is not open' };
    }

    const teamSize = teamRegistration.members.length + 1; // +1 for captain
    if (window.spotsRemaining < teamSize) {
      return { success: false, error: 'Not enough spots for team' };
    }

    const registeredParticipants: TournamentParticipant[] = [];

    try {
      // Register captain
      const captainResult = await participantManagement.register(tournamentId, {
        tournamentId,
        playerName: teamRegistration.captainName,
        email: teamRegistration.captainEmail,
        teamName: teamRegistration.teamName,
      });

      if (!captainResult.success || !captainResult.participant) {
        return { success: false, error: `Failed to register captain: ${captainResult.error}` };
      }
      registeredParticipants.push(captainResult.participant);

      // Register team members
      for (const member of teamRegistration.members) {
        const memberResult = await participantManagement.register(tournamentId, {
          tournamentId,
          playerName: member.playerName,
          email: member.email,
          university: member.university,
          teamName: teamRegistration.teamName,
        });

        if (memberResult.success && memberResult.participant) {
          registeredParticipants.push(memberResult.participant);
        }
      }

      return { success: true, participants: registeredParticipants };
    } catch (error) {
      console.error('[RegistrationEnhancement] Team registration error:', error);
      return { success: false, error: 'Team registration failed' };
    }
  }

  /**
   * Add to waitlist
   */
  private async addToWaitlist(
    tournamentId: string,
    registration: TournamentRegistration
  ): Promise<number> {
    if (!this.waitlist.has(tournamentId)) {
      this.waitlist.set(tournamentId, []);
    }

    const queue = this.waitlist.get(tournamentId)!;
    queue.push(registration);

    // Notify user
    await notificationService.sendToUser(`user_${registration.email}`, {
      type: NotificationType.SYSTEM_ALERT,
      title: 'Added to Waitlist',
      message: `You are #${queue.length} on the waitlist. We'll notify you if a spot opens up.`,
      data: { tournamentId, position: queue.length },
    });

    return queue.length;
  }

  /**
   * Process waitlist when spot opens
   */
  async processWaitlist(tournamentId: string): Promise<{
    promoted: number;
    remaining: number;
  }> {
    const window = await this.getRegistrationWindow(tournamentId);
    const queue = this.waitlist.get(tournamentId) || [];
    let promoted = 0;

    while (queue.length > 0 && window.spotsRemaining > promoted) {
      const next = queue.shift();
      if (!next) break;

      const result = await participantManagement.register(tournamentId, next);
      
      if (result.success) {
        promoted++;
        
        // Notify promoted user
        await notificationService.sendToUser(`user_${next.email}`, {
          type: NotificationType.REGISTRATION_CONFIRMED,
          title: 'Waitlist Promotion!',
          message: 'A spot opened up and you have been registered!',
          data: { tournamentId },
        });
      } else {
        // Put back in queue if failed
        queue.unshift(next);
        break;
      }
    }

    return { promoted, remaining: queue.length };
  }

  /**
   * Get waitlist position for user
   */
  async getWaitlistPosition(
    tournamentId: string,
    email: string
  ): Promise<number | null> {
    const queue = this.waitlist.get(tournamentId) || [];
    const index = queue.findIndex(
      (r) => r.email.toLowerCase() === email.toLowerCase()
    );
    return index >= 0 ? index + 1 : null;
  }

  /**
   * Remove from waitlist
   */
  async removeFromWaitlist(
    tournamentId: string,
    email: string
  ): Promise<boolean> {
    const queue = this.waitlist.get(tournamentId) || [];
    const index = queue.findIndex(
      (r) => r.email.toLowerCase() === email.toLowerCase()
    );
    
    if (index >= 0) {
      queue.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Validate registration eligibility
   */
  async validateRegistration(
    tournamentId: string,
    registration: TournamentRegistration
  ): Promise<{
    eligible: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];

    // Check required fields
    if (!registration.playerName?.trim()) {
      errors.push('Player name is required');
    }

    if (!registration.email?.trim()) {
      errors.push('Email is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registration.email)) {
        errors.push('Invalid email format');
      }
    }

    // Check registration window
    const window = await this.getRegistrationWindow(tournamentId);
    if (!window.isOpen) {
      errors.push('Registration is not currently open');
    }

    // Check duplicate registration
    if (registration.email) {
      const isRegistered = await participantManagement.isRegistered(
        tournamentId,
        registration.email
      );
      if (isRegistered) {
        errors.push('Email already registered');
      }
    }

    return {
      eligible: errors.length === 0,
      errors,
    };
  }
}

// Export singleton
export const registrationEnhancement = new RegistrationEnhancementService();

// Export class for testing
export { RegistrationEnhancementService };
