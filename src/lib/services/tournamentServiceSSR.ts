// src/lib/services/tournamentServiceSSR.ts
import { Client, Databases, Query } from 'appwrite';
import { Tournament, TournamentAward, TournamentSchedule, TournamentSponsor } from '@/types/tournament';

// Lazy initialization to avoid build-time issues
let client: Client | null = null;
let databases: Databases | null = null;

const initializeAppwrite = () => {
  if (!client) {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

    // During build time, environment variables might not be available
    // Return null to gracefully handle this case
    if (!endpoint || !projectId) {
      console.warn('Appwrite configuration missing for tournament service, using fallback data');
      return null;
    }

    // Additional validation to ensure endpoint is a valid string
    if (typeof endpoint !== 'string' || endpoint.trim() === '') {
      console.warn('Appwrite endpoint is invalid for tournament service, using fallback data');
      return null;
    }

    try {
      client = new Client()
        .setEndpoint(endpoint)
        .setProject(projectId);

      databases = new Databases(client);
    } catch (error) {
      console.error('Failed to initialize Appwrite client for tournament service:', error);
      return null;
    }
  }
  return databases;
};

class TournamentServiceSSR {
  private databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';
  private tournamentsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENTS_COLLECTION_ID || 'tournaments';
  private awardsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_AWARDS_COLLECTION_ID || 'tournament_awards';

  async getTournamentBySlug(slug: string): Promise<Tournament | null> {
    try {
      console.log(`🔍 Fetching tournament by slug: ${slug}`);
      
      const db = initializeAppwrite();
      if (!db) {
        console.warn('Appwrite not configured for tournament service, returning null tournament');
        return null;
      }
      
      const response = await db.listDocuments(
        this.databaseId,
        this.tournamentsCollectionId,
        [
          Query.equal('slug', slug),
          Query.equal('status', 'published'),
          Query.limit(1)
        ]
      );

      if (response.documents.length === 0) {
        console.log(`❌ No tournament found for slug: ${slug}`);
        return null;
      }

      const doc = response.documents[0];
      console.log(`✅ Found tournament for slug ${slug}:`, doc);

      // Fetch awards only (simplified structure)
      const awards = await this.getTournamentAwards(doc.$id);

      return this.mapDocumentToTournament(doc, awards);
    } catch (error) {
      console.error(`❌ Error fetching tournament by slug ${slug}:`, error);
      return null;
    }
  }

  async getPublishedTournaments(): Promise<Tournament[]> {
    try {
      console.log('🔍 Fetching all published tournaments');
      
      const db = initializeAppwrite();
      if (!db) {
        console.warn('Appwrite not configured for tournament service, returning empty tournaments list');
        return [];
      }
      
      const response = await db.listDocuments(
        this.databaseId,
        this.tournamentsCollectionId,
        [
          Query.equal('status', 'published'),
          Query.orderDesc('$createdAt')
        ]
      );

      console.log(`✅ Found ${response.documents.length} published tournaments`);

      const tournaments = await Promise.all(
        response.documents.map(async (doc) => {
          const awards = await this.getTournamentAwards(doc.$id);
          return this.mapDocumentToTournament(doc, awards);
        })
      );

      return tournaments;
    } catch (error) {
      console.error('❌ Error fetching published tournaments:', error);
      return [];
    }
  }

  async getTournamentAwards(tournamentId: string): Promise<TournamentAward[]> {
    try {
      const db = initializeAppwrite();
      if (!db) {
        console.warn('Appwrite not configured for tournament service, returning empty awards list');
        return [];
      }

      const response = await db.listDocuments(
        this.databaseId,
        this.awardsCollectionId,
        [
          Query.equal('tournamentId', tournamentId),
          Query.orderAsc('position')
        ]
      );

      return response.documents.map((doc: any) => ({
        id: doc.$id,
        position: doc.position,
        title: doc.title,
        description: doc.description,
        prize: doc.prize,
        currency: doc.currency,
        imageUrl: doc.imageUrl || null
      }));
    } catch (error) {
      console.error(`❌ Error fetching awards for tournament ${tournamentId}:`, error);
      return [];
    }
  }

  private mapDocumentToTournament(
    doc: any, 
    awards: TournamentAward[]
  ): Tournament {
    return {
      id: doc.$id,
      slug: doc.slug,
      gameName: doc.gameName,
      title: doc.title,
      description: doc.description,
      detailedDescription: doc.detailedDescription,
      category: doc.category,
      featuredImageUrl: doc.featuredImageUrl,
      bannerImageUrl: doc.bannerImageUrl || doc.featuredImageUrl, // Use featuredImageUrl as fallback
      status: doc.status,
      tournamentStatus: doc.tournamentStatus,
      startDate: doc.startDate || null,
      endDate: doc.endDate || null,
      registrationStartDate: doc.registrationStartDate || null,
      registrationEndDate: doc.registrationEndDate || null,
      registrationDeadline: doc.registrationDeadline,
      format: doc.format || null,
      maxParticipants: doc.maxParticipants || null,
      currentParticipants: doc.currentParticipants || 0,
      prizePool: doc.prizePool,
      currency: doc.currency,
      rules: [], // Empty array for simplified structure
      requirements: [], // Empty array for simplified structure
      rulesTitle: doc.rulesTitle || null,
      pdfUrls: doc.pdfUrls ? doc.pdfUrls.map((pdfString: string) => {
        try {
          return JSON.parse(pdfString);
        } catch (error) {
          console.error('Error parsing PDF URL:', error);
          return { title: '', url: '' };
        }
      }) : [],
      awards,
      schedule: [], // Empty array for simplified structure
      sponsors: [], // Empty array for simplified structure
      createdAt: doc.$createdAt,
      updatedAt: doc.$updatedAt
    };
  }
}

export const tournamentServiceSSR = new TournamentServiceSSR();