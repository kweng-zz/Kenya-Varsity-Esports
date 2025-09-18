'use client';

import { Client, Databases, ID, Permission, Role, Query } from 'appwrite';

// Appwrite Setup
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const PARTICIPANTS_COLLECTION_ID = 'participants';

export interface Participant {
  $id?: string;
  tournamentSlug: string;
  teamName: string;
  teamLeader: string;
  teamLeaderEmail: string;
  teamLeaderPhone?: string;
  university?: string;
  members: TeamMember[] | string; // Can be either parsed array or JSON string
  registrationDate: string;
  status: 'pending' | 'approved' | 'rejected';
  paymentStatus: 'pending' | 'paid' | 'failed';
  totalMembers: number;
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
      const response = await databases.listDocuments(
        DB_ID,
        PARTICIPANTS_COLLECTION_ID,
        [
          Query.equal('tournamentSlug', tournamentSlug),
          Query.orderDesc('registrationDate')
        ]
      );

      const teams = response.documents.map((doc: any) => ({
        ...doc,
        members: typeof doc.members === 'string' ? JSON.parse(doc.members) : doc.members
      })) as Participant[];
      const totalParticipants = teams.reduce((sum, team) => sum + team.totalMembers, 0);
      const approvedTeams = teams.filter(team => team.status === 'approved').length;
      const pendingTeams = teams.filter(team => team.status === 'pending').length;

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
      const response = await databases.listDocuments(
        DB_ID,
        PARTICIPANTS_COLLECTION_ID,
        [
          Query.equal('tournamentSlug', tournamentSlug),
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
      const response = await databases.createDocument(
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
      await databases.updateDocument(
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
      await databases.updateDocument(
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
      await databases.updateDocument(
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
      await databases.deleteDocument(DB_ID, PARTICIPANTS_COLLECTION_ID, participantId);
      return true;
    } catch (error) {
      console.error('Error deleting participant:', error);
      return false;
    }
  }

  // Get participant by ID
  async getParticipantById(participantId: string): Promise<Participant | null> {
    try {
      const response = await databases.getDocument(
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
      const response = await databases.listDocuments(
        DB_ID,
        PARTICIPANTS_COLLECTION_ID,
        [
          Query.equal('tournamentSlug', tournamentSlug),
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