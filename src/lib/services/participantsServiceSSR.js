import { Client, Databases, Query } from 'node-appwrite';
// Lazy initialization to avoid build-time issues
let client = null;
let databases = null;
const initializeAppwrite = () => {
    if (!client) {
        const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
        const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
        const apiKey = process.env.APPWRITE_API_KEY;
        // During build time, environment variables might not be available
        // Return null to gracefully handle this case
        if (!endpoint || !projectId || !apiKey) {
            console.warn('Appwrite configuration missing, using fallback data');
            return null;
        }
        // Additional validation to ensure endpoint is a valid string
        if (typeof endpoint !== 'string' || endpoint.trim() === '') {
            console.warn('Appwrite endpoint is invalid, using fallback data');
            return null;
        }
        try {
            client = new Client()
                .setEndpoint(endpoint)
                .setProject(projectId)
                .setKey(apiKey);
            databases = new Databases(client);
        }
        catch (error) {
            console.error('Failed to initialize Appwrite client:', error);
            return null;
        }
    }
    return databases;
};
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';
const PARTICIPANTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PARTICIPANTS_COLLECTION_ID || 'participants';
class ParticipantsServiceSSR {
    // Get all participants for a tournament (server-side)
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
    // Get approved participants only (for public display) - server-side
    async getApprovedParticipants(tournamentSlug) {
        try {
            console.log(`🔍 ParticipantsServiceSSR: Querying for tournamentSlug="${tournamentSlug}"`);
            console.log(`🔍 ParticipantsServiceSSR: Using DB_ID="${DB_ID}", COLLECTION_ID="${PARTICIPANTS_COLLECTION_ID}"`);
            const db = initializeAppwrite();
            if (!db) {
                console.warn('Appwrite not configured, returning empty participants list');
                return [];
            }
            const response = await db.listDocuments(DB_ID, PARTICIPANTS_COLLECTION_ID, [
                Query.equal('tournamentSlug', tournamentSlug),
                Query.equal('status', 'approved'),
                Query.orderDesc('registrationDate')
            ]);
            console.log(`📊 ParticipantsServiceSSR: Found ${response.documents.length} approved participants`);
            return response.documents.map((doc) => {
                try {
                    return {
                        ...doc,
                        members: typeof doc.members === 'string' ? JSON.parse(doc.members) : doc.members
                    };
                }
                catch (parseError) {
                    console.error(`❌ Error parsing members for participant ${doc.$id}:`, parseError);
                    return {
                        ...doc,
                        members: []
                    };
                }
            });
        }
        catch (error) {
            console.error('❌ ParticipantsServiceSSR: Error fetching approved participants:', error);
            console.error('❌ ParticipantsServiceSSR: Error details:', {
                message: error instanceof Error ? error.message : 'Unknown error',
                code: error?.code,
                type: error?.type,
                tournamentSlug,
                DB_ID,
                PARTICIPANTS_COLLECTION_ID
            });
            return [];
        }
    }
    // Get participant by ID (server-side)
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
    // Search participants (server-side)
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
export const participantsServiceSSR = new ParticipantsServiceSSR();
