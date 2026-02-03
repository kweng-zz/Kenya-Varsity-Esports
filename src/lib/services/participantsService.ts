'use client';

import { Client, Databases, ID, Permission, Role, Query } from 'appwrite';

// Lazy initialization to avoid build-time issues
let client: Client | null = null;
let databases: Databases | null = null;

const initializeAppwrite = () => {
  if (!client) {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

    if (!endpoint || !projectId) {
      console.warn('Appwrite configuration missing for participants service');
      return null;
    }

    if (typeof endpoint !== 'string' || endpoint.trim() === '') {
      console.warn('Appwrite endpoint is invalid for participants service');
      return null;
    }

    try {
      client = new Client()
        .setEndpoint(endpoint)
        .setProject(projectId);

      databases = new Databases(client);
    } catch (error) {
      console.error('Failed to initialize Appwrite client for participants service:', error);
      return null;
    }
  }
  return databases;
};

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';
// Use the same collection as the registration API (participantManagement service)
const PARTICIPANTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENT_REGISTRATIONS_COLLECTION_ID || 'tournament_registrations';

export interface Participant {
  $id?: string;
  tournamentId: string; // Changed from tournamentSlug to match registration data
  tournamentSlug?: string; // Keep for backwards compatibility
  teamName: string;
  playerName?: string; // Captain name from registration
  teamLeader?: string; // Alias
  email?: string; // Captain email
  teamLeaderEmail?: string; // Alias
  teamLeaderPhone?: string;
  university?: string;
  studentId?: string;
  members?: TeamMember[] | string; // Can be either parsed array or JSON string
  players?: string; // JSON string from registration
  registrationDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'registered' | 'confirmed';
  paymentStatus?: 'pending' | 'paid' | 'failed';
  totalMembers?: number;
  userId?: string;
}

export interface TeamMember {
  name: string;
  ign: string; // In-Game Name
  email?: string;
  phone?: string;
  role?: string;
}

export interface ParticipantsData {
  teams: Participant[];
  totalTeams: number;
  totalParticipants: number;
  approvedTeams: number;
  pendingTeams: number;
}

class ParticipantsService {
  // Get all participants for a tournament
  async getParticipantsByTournament(tournamentSlug: string): Promise<ParticipantsData> {
    try {
      const db = initializeAppwrite();
      if (!db) {
        return {
          teams: [],
          totalTeams: 0,
          totalParticipants: 0,
          approvedTeams: 0,
          pendingTeams: 0
        };
      }
      console.log(`🔍 participantsService: Querying registrations for tournamentId="${tournamentSlug}"`);
      
      const response = await db.listDocuments(
        DB_ID,
        PARTICIPANTS_COLLECTION_ID,
        [
          Query.equal('tournamentId', tournamentSlug), // tournamentSlug param is actually tournamentId now
          Query.orderDesc('registrationDate')
        ]
      );

      console.log(`📊 participantsService: Found ${response.documents.length} registrations`);

      const teams = response.documents.map((doc: any) => ({
        ...doc,
        // Map players field to members for display compatibility
        members: doc.players || doc.members || '{"players":[],"substitutes":[]}',
        teamLeader: doc.playerName || doc.teamLeader,
        teamLeaderEmail: doc.email || doc.teamLeaderEmail,
        teamName: doc.teamName || doc.playerName,
      })) as Participant[];
      
      const totalParticipants = teams.reduce((sum, team) => sum + (team.totalMembers || 1), 0);
      const approvedTeams = teams.filter(team => team.status === 'approved').length;
      // Count both 'pending' and 'registered' as pending teams
      const pendingTeams = teams.filter(team => team.status === 'pending' || team.status === 'registered').length;

      return {
        teams,
        totalTeams: teams.length,
        totalParticipants,
        approvedTeams,
        pendingTeams
      };
    } catch (error) {
      console.error('Error fetching participants:', error);
      return {
        teams: [],
        totalTeams: 0,
        totalParticipants: 0,
        approvedTeams: 0,
        pendingTeams: 0
      };
    }
  }

  // Get approved participants only (for public display)
  async getApprovedParticipants(tournamentSlug: string): Promise<Participant[]> {
    try {
      const db = initializeAppwrite();
      if (!db) {
        return [];
      }

      const response = await db.listDocuments(
        DB_ID,
        PARTICIPANTS_COLLECTION_ID,
        [
          Query.equal('tournamentId', tournamentSlug), // tournamentSlug param is actually tournamentId now
          Query.equal('status', 'approved'),
          Query.orderDesc('registrationDate')
        ]
      );

      return response.documents.map((doc: any) => ({
        ...doc,
        members: typeof doc.members === 'string' ? JSON.parse(doc.members) : doc.members
      })) as Participant[];
    } catch (error) {
      console.error('Error fetching approved participants:', error);
      return [];
    }
  }

  // Create a new participant registration
  async createParticipant(participantData: Omit<Participant, '$id'>): Promise<Participant | null> {
    try {
      const db = initializeAppwrite();
      if (!db) {
        return null;
      }

      const response = await db.createDocument(
        DB_ID,
        PARTICIPANTS_COLLECTION_ID,
        ID.unique(),
        {
          ...participantData,
          members: JSON.stringify(participantData.members), // Convert to JSON string
          registrationDate: new Date().toISOString(),
          status: 'pending',
          paymentStatus: 'pending'
        },
        [
          Permission.read(Role.any()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ]
      );

      return {
        ...response,
        members: participantData.members // Return original members array
      } as unknown as Participant;
    } catch (error) {
      console.error('Error creating participant:', error);
      return null;
    }
  }

  // Update participant status
  async updateParticipantStatus(participantId: string, status: 'pending' | 'approved' | 'rejected'): Promise<boolean> {
    try {
      const db = initializeAppwrite();
      if (!db) {
        return false;
      }

      await db.updateDocument(
        DB_ID,
        PARTICIPANTS_COLLECTION_ID,
        participantId,
        { status }
      );
      return true;
    } catch (error) {
      console.error('Error updating participant status:', error);
      return false;
    }
  }

  // Update payment status
  async updatePaymentStatus(participantId: string, paymentStatus: 'pending' | 'paid' | 'failed'): Promise<boolean> {
    try {
      const db = initializeAppwrite();
      if (!db) {
        return false;
      }

      await db.updateDocument(
        DB_ID,
        PARTICIPANTS_COLLECTION_ID,
        participantId,
        { paymentStatus }
      );
      return true;
    } catch (error) {
      console.error('Error updating payment status:', error);
      return false;
    }
  }

  // Update participant data
  async updateParticipant(participantId: string, updateData: Partial<Participant>): Promise<boolean> {
    try {
      const db = initializeAppwrite();
      if (!db) {
        return false;
      }

      await db.updateDocument(
        DB_ID,
        PARTICIPANTS_COLLECTION_ID,
        participantId,
        updateData
      );
      return true;
    } catch (error) {
      console.error('Error updating participant:', error);
      return false;
    }
  }

  // Delete participant
  async deleteParticipant(participantId: string): Promise<boolean> {
    try {
      const db = initializeAppwrite();
      if (!db) {
        return false;
      }

      await db.deleteDocument(DB_ID, PARTICIPANTS_COLLECTION_ID, participantId);
      return true;
    } catch (error) {
      console.error('Error deleting participant:', error);
      return false;
    }
  }

  // Get participant by ID
  async getParticipantById(participantId: string): Promise<Participant | null> {
    try {
      const db = initializeAppwrite();
      if (!db) {
        return null;
      }

      const response = await db.getDocument(
        DB_ID,
        PARTICIPANTS_COLLECTION_ID,
        participantId
      );
      return {
        ...response,
        members: typeof response.members === 'string' ? JSON.parse(response.members) : response.members
      } as unknown as Participant;
    } catch (error) {
      console.error('Error fetching participant:', error);
      return null;
    }
  }

  // Search participants
  async searchParticipants(tournamentSlug: string, searchTerm: string): Promise<Participant[]> {
    try {
      const db = initializeAppwrite();
      if (!db) {
        return [];
      }

      const response = await db.listDocuments(
        DB_ID,
        PARTICIPANTS_COLLECTION_ID,
        [
          Query.equal('tournamentId', tournamentSlug),
          Query.search('teamName', searchTerm)
        ]
      );

      return response.documents.map((doc: any) => ({
        ...doc,
        members: typeof doc.members === 'string' ? JSON.parse(doc.members) : doc.members
      })) as Participant[];
    } catch (error) {
      console.error('Error searching participants:', error);
      return [];
    }
  }
}

export const participantsService = new ParticipantsService();