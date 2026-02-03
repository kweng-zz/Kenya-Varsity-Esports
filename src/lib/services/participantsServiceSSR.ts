import { Client, Databases, Query } from 'node-appwrite';

// Lazy initialization to avoid build-time issues
let client: Client | null = null;
let databases: Databases | null = null;

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
    } catch (error) {
      console.error('Failed to initialize Appwrite client:', error);
      return null;
    }
  }
  return databases;
};

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';
const PARTICIPANTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENT_REGISTRATIONS_COLLECTION_ID || 'tournament_registrations';

export interface Participant {
  $id?: string;
  tournamentId: string;
  tournamentSlug: string;
  teamName: string;
  teamLeader: string;
  teamLeaderEmail: string;
  teamLeaderPhone?: string;
  university?: string;
  members: TeamMember[] | string; // Can be either parsed array or JSON string
  registrationDate: string;
  status: 'registered' | 'pending' | 'approved' | 'rejected';
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

class ParticipantsServiceSSR {
  // Get all participants for a tournament (server-side)
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

      const response = await db.listDocuments(
        DB_ID,
        PARTICIPANTS_COLLECTION_ID,
        [
          Query.equal('tournamentSlug', tournamentSlug),
          Query.orderDesc('registrationDate')
        ]
      );

      const teams = response.documents.map((doc: any) => ({
        ...doc,
        tournamentId: doc.tournamentId || '',
        tournamentSlug: doc.tournamentSlug || tournamentSlug,
        members: typeof doc.members === 'string' ? JSON.parse(doc.members) : doc.members
      })) as Participant[];
      
      const totalParticipants = teams.reduce((sum, team) => sum + team.totalMembers, 0);
      const approvedTeams = teams.filter(team => team.status === 'approved').length;
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

  // Get approved participants only (for public display) - server-side
  // Now accepts tournamentId (Appwrite document ID) instead of slug
  async getApprovedParticipants(tournamentId: string): Promise<Participant[]> {
    try {
      console.log(`🔍 ParticipantsServiceSSR: Querying for tournamentId="${tournamentId}"`);
      console.log(`🔍 ParticipantsServiceSSR: Using DB_ID="${DB_ID}", COLLECTION_ID="${PARTICIPANTS_COLLECTION_ID}"`);
      
      const db = initializeAppwrite();
      if (!db) {
        console.warn('Appwrite not configured, returning empty participants list');
        return [];
      }

      // Query the tournament_registrations collection using tournamentId
      const REGISTRATIONS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENT_REGISTRATIONS_COLLECTION_ID || 'tournament_registrations';
      
      const response = await db.listDocuments(
        DB_ID,
        REGISTRATIONS_COLLECTION_ID,
        [
          Query.equal('tournamentId', tournamentId),
          Query.equal('status', 'approved'),
          Query.orderDesc('$createdAt')
        ]
      );

      console.log(`📊 ParticipantsServiceSSR: Found ${response.documents.length} approved participants`);

      return response.documents.map((doc: any) => {
        try {
          // Map registration fields to participant fields
          return {
            ...doc,
            teamName: doc.teamName || doc.playerName,
            teamLeader: doc.playerName,
            teamLeaderEmail: doc.email,
            tournamentId: doc.tournamentId || tournamentId,
            tournamentSlug: doc.tournamentSlug || '',
            members: doc.players || '{"players":[],"substitutes":[]}',
          };
        } catch (parseError) {
          console.error(`❌ Error parsing members for participant ${doc.$id}:`, parseError);
          return {
            ...doc,
            members: []
          };
        }
      }) as Participant[];
    } catch (error) {
      console.error('❌ ParticipantsServiceSSR: Error fetching approved participants:', error);
      console.error('❌ ParticipantsServiceSSR: Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code,
        type: (error as any)?.type,
        tournamentId,
        DB_ID,
        PARTICIPANTS_COLLECTION_ID
      });
      return [];
    }
  }

  // Get participant by ID (server-side)
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
        tournamentId: response.tournamentId || '',
        tournamentSlug: response.tournamentSlug || '',
        members: typeof response.members === 'string' ? JSON.parse(response.members) : response.members
      } as unknown as Participant;
    } catch (error) {
      console.error('Error fetching participant:', error);
      return null;
    }
  }

  // Search participants (server-side)
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
          Query.equal('tournamentSlug', tournamentSlug),
          Query.search('teamName', searchTerm)
        ]
      );

      return response.documents.map((doc: any) => ({
        ...doc,
        tournamentId: doc.tournamentId || '',
        tournamentSlug: doc.tournamentSlug || tournamentSlug,
        members: typeof doc.members === 'string' ? JSON.parse(doc.members) : doc.members
      })) as Participant[];
    } catch (error) {
      console.error('Error searching participants:', error);
      return [];
    }
  }

  // Get combined list of approved participants and pending registrations
  async getTournamentParticipants(tournamentSlug: string): Promise<Participant[]> {
    try {
      const db = initializeAppwrite();
      if (!db) return [];

      const TOURNAMENTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENTS_COLLECTION_ID || 'tournaments';
      const REGISTRATIONS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENT_REGISTRATIONS_COLLECTION_ID || 'tournament_registrations';

      console.log(`🔍 getTournamentParticipants: Looking up tournament with slug="${tournamentSlug}"`);
      console.log(`🔍 Using collections: TOURNAMENTS="${TOURNAMENTS_COLLECTION_ID}", REGISTRATIONS="${REGISTRATIONS_COLLECTION_ID}"`);

      // 1. Get Tournament ID from Slug - try multiple approaches
      let tournamentId: string | undefined;
      
      // First try: published tournaments (preferred)
      const publishedTournamentResp = await db.listDocuments(
        DB_ID,
        TOURNAMENTS_COLLECTION_ID,
        [Query.equal('slug', tournamentSlug), Query.equal('status', 'published'), Query.limit(1)]
      );
      
      if (publishedTournamentResp.documents.length > 0) {
        tournamentId = publishedTournamentResp.documents[0].$id;
        console.log(`✅ Found published tournament: ${tournamentId}`);
      } else {
        console.log(`⚠️ No published tournament found for slug="${tournamentSlug}", trying all statuses...`);
        // Second try: any tournament with matching slug
        const allTournamentsResp = await db.listDocuments(
          DB_ID,
          TOURNAMENTS_COLLECTION_ID,
          [Query.equal('slug', tournamentSlug), Query.limit(5)]
        );
        
        if (allTournamentsResp.documents.length > 0) {
          tournamentId = allTournamentsResp.documents[0].$id;
          console.log(`✅ Found tournament (any status): ${tournamentId}`);
        } else {
          console.log(`❌ No tournament found with slug="${tournamentSlug}"`);
        }
      }

      // 2. Fetch Approved Participants (using tournamentId)
      let approvedTeams: Participant[] = [];
      if (tournamentId) {
        approvedTeams = await this.getApprovedParticipants(tournamentId);
      }

      // 3. Fetch Pending Registrations
      let pendingRegistrations: Participant[] = [];
      if (tournamentId) {
        // Query for 'registered' status (from new registrations) and 'pending' status (legacy)
        const registrationsResp = await db.listDocuments(
          DB_ID,
          REGISTRATIONS_COLLECTION_ID,
          [
            Query.equal('tournamentId', tournamentId),
            Query.equal('status', ['registered', 'pending']),
            Query.orderDesc('registrationDate')
          ]
        );

        console.log(`📝 ParticipantsServiceSSR: Found ${registrationsResp.documents.length} registrations (pending/registered) for tournamentId="${tournamentId}"`);

        pendingRegistrations = registrationsResp.documents.map((doc: any) => {
          let totalMembersCount = 1; // Default to 1 (captain)
          try {
            if (doc.players) {
              const teamData = JSON.parse(doc.players);
              totalMembersCount = (teamData.players?.length || 0) + (teamData.substitutes?.length || 0) + 1;
            }
          } catch (e) {
            console.error('Error parsing players JSON for count:', doc.$id);
          }

          return {
            $id: doc.$id,
            tournamentId: tournamentId || doc.tournamentId || '',
            tournamentSlug,
            teamName: doc.teamName || doc.playerName,
            teamLeader: doc.playerName,
            teamLeaderEmail: doc.email,
            university: doc.university,
            members: doc.players || '{"players":[],"substitutes":[]}',
            registrationDate: doc.registrationDate,
            status: 'pending',
            paymentStatus: 'pending',
            totalMembers: totalMembersCount
          } as Participant;
        });
      } else {
        // Fallback: Try to find any registrations that might match by checking tournament references
        try {
          // Query for 'registered' and 'pending' statuses
          const allRegistrationsResp = await db.listDocuments(
            DB_ID,
            REGISTRATIONS_COLLECTION_ID,
            [Query.equal('status', ['registered', 'pending']), Query.orderDesc('registrationDate'), Query.limit(20)]
          );
          
          // Try to match registrations by fetching their tournament references
          for (const doc of allRegistrationsResp.documents) {
            if (doc.tournamentId) {
              try {
                const referencedTournament = await db.getDocument(DB_ID, TOURNAMENTS_COLLECTION_ID, doc.tournamentId);
                
                // Check if this tournament matches the slug we're looking for
                if (referencedTournament.slug === tournamentSlug) {
                  let totalMembersCount = 1;
                  try {
                    if (doc.players) {
                      const teamData = JSON.parse(doc.players);
                      totalMembersCount = (teamData.players?.length || 0) + (teamData.substitutes?.length || 0) + 1;
                    }
                  } catch (e) {
                    console.error('Error parsing players JSON for count:', doc.$id);
                  }

                  pendingRegistrations.push({
                    $id: doc.$id,
                    tournamentId: doc.tournamentId || '',
                    tournamentSlug,
                    teamName: doc.teamName || doc.playerName,
                    teamLeader: doc.playerName,
                    teamLeaderEmail: doc.email,
                    university: doc.university,
                    members: doc.players || '{"players":[],"substitutes":[]}',
                    registrationDate: doc.registrationDate,
                    status: 'pending',
                    paymentStatus: 'pending',
                    totalMembers: totalMembersCount
                  } as Participant);
                }
              } catch (tournamentError) {
                // Tournament might not exist or user doesn't have access - continue silently
              }
            }
          }
        } catch (fallbackError) {
          console.error('Fallback search for tournament registrations failed:', fallbackError);
        }
      }

      // Combine and return
      return [...approvedTeams, ...pendingRegistrations];
    } catch (error) {
      console.error('Error getting unified tournament participants:', error);
      return [];
    }
  }
}

export const participantsServiceSSR = new ParticipantsServiceSSR();