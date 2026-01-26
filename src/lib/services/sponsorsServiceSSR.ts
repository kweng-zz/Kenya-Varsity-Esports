import { Client, Databases, Query, ID } from 'node-appwrite';

let client: Client | null = null;
let databases: Databases | null = null;

const initializeAppwrite = () => {
  if (!client) {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    const apiKey = process.env.APPWRITE_API_KEY;

    if (!endpoint || !projectId || !apiKey) {
      return null;
    }

    try {
      client = new Client()
        .setEndpoint(endpoint)
        .setProject(projectId)
        .setKey(apiKey);

      databases = new Databases(client);
    } catch (error) {
      console.error('Failed to initialize Appwrite server client in SponsorsServiceSSR:', error);
      return null;
    }
  }
  return databases;
};

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';
const SPONSORS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_SPONSORS_COLLECTION_ID || 'sponsors';

export interface Sponsor {
  $id: string;
  name: string;
  logo: string;
  website: string;
  isActive: boolean;
  order: number;
  tier: string;
}

class SponsorsServiceSSR {
  async getAllSponsors(): Promise<Sponsor[]> {
    try {
      const db = initializeAppwrite();
      if (!db) return [];

      const response = await db.listDocuments(
        DATABASE_ID,
        SPONSORS_COLLECTION_ID,
        [Query.orderAsc('order')]
      );
      return response.documents as unknown as Sponsor[];
    } catch (error) {
      console.error('Error fetching all sponsors SSR:', error);
      throw error;
    }
  }

  async getActiveSponsors(): Promise<Sponsor[]> {
    try {
      const db = initializeAppwrite();
      if (!db) return [];

      const response = await db.listDocuments(
        DATABASE_ID,
        SPONSORS_COLLECTION_ID,
        [
          Query.equal('isActive', true),
          Query.orderAsc('order')
        ]
      );
      return response.documents as unknown as Sponsor[];
    } catch (error) {
      console.error('Error fetching active sponsors SSR:', error);
      return [];
    }
  }

  async createSponsor(data: Omit<Sponsor, '$id'>): Promise<Sponsor> {
    try {
      const db = initializeAppwrite();
      if (!db) throw new Error('Appwrite server not initialized');

      const response = await db.createDocument(
        DATABASE_ID,
        SPONSORS_COLLECTION_ID,
        ID.unique(),
        data
      );
      return response as unknown as Sponsor;
    } catch (error) {
      console.error('Error creating sponsor SSR:', error);
      throw error;
    }
  }

  async updateSponsor(id: string, data: Partial<Sponsor>): Promise<Sponsor> {
    try {
      const db = initializeAppwrite();
      if (!db) throw new Error('Appwrite server not initialized');

      // Sanitize: remove $ fields
      const sanitizedData = Object.keys(data).reduce((acc: any, key) => {
        if (!key.startsWith('$')) acc[key] = (data as any)[key];
        return acc;
      }, {});

      const response = await db.updateDocument(
        DATABASE_ID,
        SPONSORS_COLLECTION_ID,
        id,
        sanitizedData
      );
      return response as unknown as Sponsor;
    } catch (error) {
      console.error('Error updating sponsor SSR:', error);
      throw error;
    }
  }

  async deleteSponsor(id: string): Promise<void> {
    try {
      const db = initializeAppwrite();
      if (!db) throw new Error('Appwrite server not initialized');

      await db.deleteDocument(DATABASE_ID, SPONSORS_COLLECTION_ID, id);
    } catch (error) {
      console.error('Error deleting sponsor SSR:', error);
      throw error;
    }
  }
}

export const sponsorsServiceSSR = new SponsorsServiceSSR();
