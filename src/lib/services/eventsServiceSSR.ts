import { Client, Databases, Query, ID } from 'node-appwrite';

// Lazy initialization to avoid build-time issues
let client: Client | null = null;
let databases: Databases | null = null;

const initializeAppwrite = () => {
  if (!client) {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    const apiKey = process.env.APPWRITE_API_KEY;

    if (!endpoint || !projectId || !apiKey) {
      console.warn('Appwrite server configuration missing');
      return null;
    }

    try {
      client = new Client()
        .setEndpoint(endpoint)
        .setProject(projectId)
        .setKey(apiKey);

      databases = new Databases(client);
    } catch (error) {
      console.error('Failed to initialize Appwrite server client:', error);
      return null;
    }
  }
  return databases;
};

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';
const EVENTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_EVENTS_COLLECTION_ID || '';

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
  isFeatured: boolean;
  $createdAt: string;
  $updatedAt: string;
}

class EventsServiceSSR {
  // Get all active events
  async getActiveEvents(): Promise<Event[]> {
    try {
      const db = initializeAppwrite();
      if (!db) return [];

      const response = await db.listDocuments(
        DATABASE_ID,
        EVENTS_COLLECTION_ID,
        [
          Query.equal('isActive', true),
          Query.orderDesc('date'),
          Query.limit(100)
        ]
      );
      return response.documents as unknown as Event[];
    } catch (error) {
      console.error('Error fetching active events SSR:', error);
      return [];
    }
  }

  // Get current featured event
  async getFeaturedEvent(): Promise<Event | null> {
    try {
      const db = initializeAppwrite();
      if (!db) return null;

      const response = await db.listDocuments(
        DATABASE_ID,
        EVENTS_COLLECTION_ID,
        [
          Query.equal('isActive', true),
          Query.equal('isFeatured', true),
          Query.orderDesc('$updatedAt'),
          Query.limit(1)
        ]
      );
      return response.documents.length > 0 ? (response.documents[0] as unknown as Event) : null;
    } catch (error) {
      console.error('Error fetching featured event SSR:', error);
      return null;
    }
  }

  // Get all events (admin)
  async getAllEvents(): Promise<Event[]> {
    try {
      const db = initializeAppwrite();
      if (!db) return [];

      const response = await db.listDocuments(
        DATABASE_ID,
        EVENTS_COLLECTION_ID,
        [Query.orderDesc('$createdAt'), Query.limit(100)]
      );
      return response.documents as unknown as Event[];
    } catch (error) {
      console.error('Error fetching all events SSR:', error);
      throw error;
    }
  }

  // Create event (admin)
  async createEvent(eventData: Omit<Event, '$id' | '$createdAt' | '$updatedAt' | '$databaseId' | '$collectionId'>): Promise<Event> {
    try {
      const db = initializeAppwrite();
      if (!db) throw new Error('Appwrite server not initialized');

      // Sanitize data: remove system fields and undefined/null values
      const sanitizedData = Object.keys(eventData).reduce((acc: any, key) => {
        const value = (eventData as any)[key];
        if (!key.startsWith('$') && value !== undefined && value !== null) {
          acc[key] = value;
        }
        return acc;
      }, {});

      const response = await db.createDocument(
        DATABASE_ID,
        EVENTS_COLLECTION_ID,
        ID.unique(),
        sanitizedData
      );
      return response as unknown as Event;
    } catch (error) {
      console.error('Error creating event SSR:', error);
      throw error;
    }
  }

  // Update event (admin)
  async updateEvent(eventId: string, eventData: Partial<Event>): Promise<Event> {
    try {
      const db = initializeAppwrite();
      if (!db) throw new Error('Appwrite server not initialized');

      // Sanitize data: remove system fields and undefined/null values
      const sanitizedData = Object.keys(eventData).reduce((acc: any, key) => {
        const value = (eventData as any)[key];
        // For updates, we allow null if we want to unset (though our schema is mostly required)
        // But we definitely strip $ fields
        if (!key.startsWith('$') && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {});

      const response = await db.updateDocument(
        DATABASE_ID,
        EVENTS_COLLECTION_ID,
        eventId,
        sanitizedData
      );
      return response as unknown as Event;
    } catch (error) {
      console.error('Error updating event SSR:', error);
      throw error;
    }
  }

  // Delete event (admin)
  async deleteEvent(eventId: string): Promise<void> {
    try {
      const db = initializeAppwrite();
      if (!db) throw new Error('Appwrite server not initialized');

      await db.deleteDocument(DATABASE_ID, EVENTS_COLLECTION_ID, eventId);
    } catch (error) {
      console.error('Error deleting event SSR:', error);
      throw error;
    }
  }
}

export const eventsServiceSSR = new EventsServiceSSR();
