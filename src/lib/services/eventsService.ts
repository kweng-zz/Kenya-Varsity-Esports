import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const eventsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_EVENTS_COLLECTION_ID!;

export interface Event {
  $id: string;
  title: string;
  gameSlug: string;
  image: string;
  date: string;
  time: string;
  prizePool: string;
  entryFee: string;
  status: 'OPEN' | 'LEAGUE' | 'PRO';
  tags: string[];
  registrationLink?: string;
  detailsLink?: string;
  isActive: boolean;
  $createdAt: string;
  $updatedAt: string;
}

export const eventsService = {
  // Get all active events
  async getActiveEvents(): Promise<Event[]> {
    try {
      const response = await databases.listDocuments(
        databaseId,
        eventsCollectionId,
        [
          Query.equal('isActive', true),
          Query.orderDesc('date'),
          Query.limit(100)
        ]
      );
      return response.documents as unknown as Event[];
    } catch (error) {
      console.error('Error fetching active events:', error);
      throw error;
    }
  },

  // Get events by status
  async getEventsByStatus(status: 'OPEN' | 'LEAGUE' | 'PRO'): Promise<Event[]> {
    try {
      const response = await databases.listDocuments(
        databaseId,
        eventsCollectionId,
        [
          Query.equal('isActive', true),
          Query.equal('status', status),
          Query.orderDesc('date')
        ]
      );
      return response.documents as unknown as Event[];
    } catch (error) {
      console.error('Error fetching events by status:', error);
      throw error;
    }
  },

  // Get all events (admin)
  async getAllEvents(): Promise<Event[]> {
    try {
      const response = await databases.listDocuments(
        databaseId,
        eventsCollectionId,
        [Query.orderDesc('$createdAt'), Query.limit(100)]
      );
      return response.documents as unknown as Event[];
    } catch (error) {
      console.error('Error fetching all events:', error);
      throw error;
    }
  },

  // Create event (admin)
  async createEvent(eventData: Omit<Event, '$id' | '$createdAt' | '$updatedAt'>): Promise<Event> {
    try {
      const response = await databases.createDocument(
        databaseId,
        eventsCollectionId,
        'unique()',
        eventData
      );
      return response as unknown as Event;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  // Update event (admin)
  async updateEvent(eventId: string, eventData: Partial<Event>): Promise<Event> {
    try {
      const response = await databases.updateDocument(
        databaseId,
        eventsCollectionId,
        eventId,
        eventData
      );
      return response as unknown as Event;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  // Delete event (admin)
  async deleteEvent(eventId: string): Promise<void> {
    try {
      await databases.deleteDocument(databaseId, eventsCollectionId, eventId);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }
};
