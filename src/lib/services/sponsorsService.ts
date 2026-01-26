import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { Query, ID } from 'appwrite';

const databaseId = DATABASE_ID;
const sponsorsCollectionId = COLLECTIONS.SPONSORS || 'sponsors';

export interface Sponsor {
  $id: string;
  name: string;
  logo: string;
  website: string;
  isActive: boolean;
  order: number;
  tier: string;
  $createdAt: string;
  $updatedAt: string;
}

export const sponsorsService = {
  // Get all active sponsors
  async getActiveSponsors(): Promise<Sponsor[]> {
    try {
      const response = await databases.listDocuments(
        databaseId,
        sponsorsCollectionId,
        [
          Query.equal('isActive', true),
          Query.orderAsc('order'),
          Query.limit(100)
        ]
      );
      return response.documents as unknown as Sponsor[];
    } catch (error) {
      console.error('Error fetching active sponsors:', error);
      throw error;
    }
  },

  // Get all sponsors (admin)
  async getAllSponsors(): Promise<Sponsor[]> {
    try {
      const response = await databases.listDocuments(
        databaseId,
        sponsorsCollectionId,
        [Query.orderAsc('order'), Query.limit(100)]
      );
      return response.documents as unknown as Sponsor[];
    } catch (error) {
      console.error('Error fetching all sponsors:', error);
      throw error;
    }
  }
};
