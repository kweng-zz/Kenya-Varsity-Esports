// src/lib/services/tournamentService.ts - Client-side tournament service
import { Client, Databases, Query } from 'appwrite';
import { Tournament, TournamentAward } from '@/types/tournament';

class TournamentService {
  private client: Client;
  private databases: Databases;
  private databaseId = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
  private tournamentsCollectionId = 'tournaments';
  private awardsCollectionId = 'tournament_awards';

  constructor() {
    this.client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
    
    this.databases = new Databases(this.client);
  }

  async getTournamentBySlug(slug: string): Promise<Tournament | null> {
    try {
      console.log(`🔍 Fetching tournament by slug: ${slug}`);
      
      const response = await this.databases.listDocuments(
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

      // Fetch awards
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
      
      const response = await this.databases.listDocuments(
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
      const response = await this.databases.listDocuments(
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
      bannerImageUrl: doc.bannerImageUrl || doc.featuredImageUrl,
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
      rules: [],
      requirements: [],
      awards,
      schedule: [],
      sponsors: [],
      createdAt: doc.$createdAt,
      updatedAt: doc.$updatedAt
    };
  }
}

export const tournamentService = new TournamentService();