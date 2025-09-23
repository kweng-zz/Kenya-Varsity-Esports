'use client';
import { Client, Databases, ID, Permission, Role, Query } from 'appwrite';
// Lazy initialization to avoid build-time issues
let client = null;
let databases = null;
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
        }
        catch (error) {
            console.error('Failed to initialize Appwrite client for participants service:', error);
            return null;
        }
    }
    return databases;
};
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';
const PARTICIPANTS_COLLECTION_ID = 'participants';
class ParticipantsService {
    // Get all participants for a tournament
    async getParticipantsByTournament(tournamentSlug) {
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
            const response = await db.listDocuments(DB_ID, PARTICIPANTS_COLLECTION_ID, [
                Query.equal('tournamentSlug', tournamentSlug),
                Query.orderDesc('registrationDate')
            ]);
            const teams = response.documents.map((doc) => ({
                ...doc,
                members: typeof doc.members === 'string' ? JSON.parse(doc.members) : doc.members
            }));
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
        }
        catch (error) {
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
    async getApprovedParticipants(tournamentSlug) {
        try {
            const db = initializeAppwrite();
            if (!db) {
                return [];
            }
            const response = await db.listDocuments(DB_ID, PARTICIPANTS_COLLECTION_ID, [
                Query.equal('tournamentSlug', tournamentSlug),
                Query.equal('status', 'approved'),
                Query.orderDesc('registrationDate')
            ]);
            return response.documents.map((doc) => ({
                ...doc,
                members: typeof doc.members === 'string' ? JSON.parse(doc.members) : doc.members
            }));
        }
        catch (error) {
            console.error('Error fetching approved participants:', error);
            return [];
        }
    }
    // Create a new participant registration
    async createParticipant(participantData) {
        try {
            const db = initializeAppwrite();
            if (!db) {
                return null;
            }
            const response = await db.createDocument(DB_ID, PARTICIPANTS_COLLECTION_ID, ID.unique(), {
                ...participantData,
                members: JSON.stringify(participantData.members), // Convert to JSON string
                registrationDate: new Date().toISOString(),
                status: 'pending',
                paymentStatus: 'pending'
            }, [
                Permission.read(Role.any()),
                Permission.update(Role.users()),
                Permission.delete(Role.users())
            ]);
            return {
                ...response,
                members: participantData.members // Return original members array
            };
        }
        catch (error) {
            console.error('Error creating participant:', error);
            return null;
        }
    }
    // Update participant status
    async updateParticipantStatus(participantId, status) {
        try {
            const db = initializeAppwrite();
            if (!db) {
                return false;
            }
            await db.updateDocument(DB_ID, PARTICIPANTS_COLLECTION_ID, participantId, { status });
            return true;
        }
        catch (error) {
            console.error('Error updating participant status:', error);
            return false;
        }
    }
    // Update payment status
    async updatePaymentStatus(participantId, paymentStatus) {
        try {
            const db = initializeAppwrite();
            if (!db) {
                return false;
            }
            await db.updateDocument(DB_ID, PARTICIPANTS_COLLECTION_ID, participantId, { paymentStatus });
            return true;
        }
        catch (error) {
            console.error('Error updating payment status:', error);
            return false;
        }
    }
    // Update participant data
    async updateParticipant(participantId, updateData) {
        try {
            const db = initializeAppwrite();
            if (!db) {
                return false;
            }
            await db.updateDocument(DB_ID, PARTICIPANTS_COLLECTION_ID, participantId, updateData);
            return true;
        }
        catch (error) {
            console.error('Error updating participant:', error);
            return false;
        }
    }
    // Delete participant
    async deleteParticipant(participantId) {
        try {
            const db = initializeAppwrite();
            if (!db) {
                return false;
            }
            await db.deleteDocument(DB_ID, PARTICIPANTS_COLLECTION_ID, participantId);
            return true;
        }
        catch (error) {
            console.error('Error deleting participant:', error);
            return false;
        }
    }
    // Get participant by ID
    async getParticipantById(participantId) {
        try {
            const db = initializeAppwrite();
            if (!db) {
                return null;
            }
            const response = await db.getDocument(DB_ID, PARTICIPANTS_COLLECTION_ID, participantId);
            return {
                ...response,
                members: typeof response.members === 'string' ? JSON.parse(response.members) : response.members
            };
        }
        catch (error) {
            console.error('Error fetching participant:', error);
            return null;
        }
    }
    // Search participants
    async searchParticipants(tournamentSlug, searchTerm) {
        try {
            const db = initializeAppwrite();
            if (!db) {
                return [];
            }
            const response = await db.listDocuments(DB_ID, PARTICIPANTS_COLLECTION_ID, [
                Query.equal('tournamentSlug', tournamentSlug),
                Query.search('teamName', searchTerm)
            ]);
            return response.documents.map((doc) => ({
                ...doc,
                members: typeof doc.members === 'string' ? JSON.parse(doc.members) : doc.members
            }));
        }
        catch (error) {
            console.error('Error searching participants:', error);
            return [];
        }
    }
}
export const participantsService = new ParticipantsService();
