import { Client, Databases, Query, ID } from 'node-appwrite';

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
      console.warn('Appwrite configuration missing for calendar service, using fallback data');
      return null;
    }

    // Additional validation to ensure endpoint is a valid string
    if (typeof endpoint !== 'string' || endpoint.trim() === '') {
      console.warn('Appwrite endpoint is invalid for calendar service, using fallback data');
      return null;
    }

    try {
      client = new Client()
        .setEndpoint(endpoint)
        .setProject(projectId)
        .setKey(apiKey);

      databases = new Databases(client);
    } catch (error) {
      console.error('Failed to initialize Appwrite client for calendar service:', error);
      return null;
    }
  }
  return databases;
};

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';
const CALENDAR_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_CALENDAR_COLLECTION_ID || 'calendar_events';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO date string
  time?: string;
  type: 'registration' | 'match' | 'tournament' | 'deadline' | 'announcement' | 'event';
  status?: 'upcoming' | 'live' | 'completed';
  gameSlug?: string;
  tournamentId?: string;
  location?: string;
  registrationDeadline?: string;
  maxParticipants?: number;
  currentParticipants?: number;
  prizePool?: string;
  teams?: string[];
  isImportant?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CalendarData {
  events: CalendarEvent[];
  totalEvents: number;
  upcomingEvents: number;
  liveEvents: number;
  completedEvents: number;
}

// Helper function to map Appwrite document to CalendarEvent
const mapDocumentToEvent = (doc: any): CalendarEvent => ({
  id: doc.$id,
  title: doc.title,
  description: doc.description || '',
  date: doc.date,
  time: doc.time,
  type: doc.type || 'event',
  status: doc.status || 'upcoming',
  gameSlug: doc.gameSlug,
  tournamentId: doc.tournamentId,
  location: doc.location,
  registrationDeadline: doc.registrationDeadline,
  maxParticipants: doc.maxParticipants,
  currentParticipants: doc.currentParticipants || 0,
  prizePool: doc.prizePool,
  teams: doc.teams ? (Array.isArray(doc.teams) ? doc.teams : JSON.parse(doc.teams)) : undefined,
  isImportant: doc.isImportant || false,
  createdAt: doc.$createdAt,
  updatedAt: doc.$updatedAt
});

class CalendarService {
  // Get all calendar events for a specific game
  async getCalendarData(gameSlug: string): Promise<CalendarData> {
    try {
      console.log(`🔍 CalendarService: Fetching calendar data for gameSlug="${gameSlug}"`);
      
      const db = initializeAppwrite();
      if (!db) {
        console.warn('Appwrite not configured for calendar service, returning empty calendar data');
        return {
          events: [],
          totalEvents: 0,
          upcomingEvents: 0,
          liveEvents: 0,
          completedEvents: 0
        };
      }
      
      const response = await db.listDocuments(
        DB_ID,
        CALENDAR_COLLECTION_ID,
        [
          Query.equal('gameSlug', gameSlug),
          Query.orderAsc('date'),
          Query.limit(100)
        ]
      );

      console.log(`📊 CalendarService: Found ${response.documents.length} events`);

      const events = response.documents.map(mapDocumentToEvent);

      const upcomingEvents = events.filter(event => event.status === 'upcoming').length;
      const liveEvents = events.filter(event => event.status === 'live').length;
      const completedEvents = events.filter(event => event.status === 'completed').length;

      return {
        events,
        totalEvents: events.length,
        upcomingEvents,
        liveEvents,
        completedEvents
      };
    } catch (error) {
      console.error('❌ CalendarService: Error fetching calendar data:', error);
      console.error('❌ CalendarService: Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code,
        type: (error as any)?.type,
        gameSlug,
        DB_ID,
        CALENDAR_COLLECTION_ID
      });
      return {
        events: [],
        totalEvents: 0,
        upcomingEvents: 0,
        liveEvents: 0,
        completedEvents: 0
      };
    }
  }

  // Get upcoming events for a specific game
  async getUpcomingEvents(gameSlug: string, limit: number = 10): Promise<CalendarEvent[]> {
    try {
      const db = initializeAppwrite();
      if (!db) {
        console.warn('Appwrite not configured for calendar service, returning empty upcoming events');
        return [];
      }

      const currentDate = new Date().toISOString().split('T')[0];
      
      const response = await db.listDocuments(
        DB_ID,
        CALENDAR_COLLECTION_ID,
        [
          Query.equal('gameSlug', gameSlug),
          Query.equal('status', 'upcoming'),
          Query.greaterThanEqual('date', currentDate),
          Query.orderAsc('date'),
          Query.limit(limit)
        ]
      );

      return response.documents.map(mapDocumentToEvent);
    } catch (error) {
      console.error('❌ CalendarService: Error fetching upcoming events:', error);
      return [];
    }
  }

  // Get events by date range
  async getEventsByDateRange(gameSlug: string, startDate: string, endDate: string): Promise<CalendarEvent[]> {
    try {
      const db = initializeAppwrite();
      if (!db) {
        console.warn('Appwrite not configured for calendar service, returning empty events by date range');
        return [];
      }

      const response = await db.listDocuments(
        DB_ID,
        CALENDAR_COLLECTION_ID,
        [
          Query.equal('gameSlug', gameSlug),
          Query.greaterThanEqual('date', startDate),
          Query.lessThanEqual('date', endDate),
          Query.orderAsc('date')
        ]
      );

      return response.documents.map(mapDocumentToEvent);
    } catch (error) {
      console.error('❌ CalendarService: Error fetching events by date range:', error);
      return [];
    }
  }

  // Create a new calendar event (for admin use)
  async createEvent(eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<CalendarEvent | null> {
    try {
      const db = initializeAppwrite();
      if (!db) {
        console.warn('Appwrite not configured for calendar service, cannot create event');
        return null;
      }

      const response = await db.createDocument(
        DB_ID,
        CALENDAR_COLLECTION_ID,
        ID.unique(),
        {
          title: eventData.title,
          description: eventData.description,
          date: eventData.date,
          time: eventData.time,
          type: eventData.type,
          status: eventData.status,
          gameSlug: eventData.gameSlug,
          tournamentId: eventData.tournamentId,
          location: eventData.location,
          registrationDeadline: eventData.registrationDeadline,
          maxParticipants: eventData.maxParticipants,
          currentParticipants: eventData.currentParticipants || 0,
          prizePool: eventData.prizePool,
          teams: eventData.teams ? JSON.stringify(eventData.teams) : undefined,
          isImportant: eventData.isImportant || false
        }
      );

      return mapDocumentToEvent(response);
    } catch (error) {
      console.error('❌ CalendarService: Error creating event:', error);
      return null;
    }
  }

  // Update an existing calendar event (for admin use)
  async updateEvent(eventId: string, eventData: Partial<Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>>): Promise<CalendarEvent | null> {
    try {
      const db = initializeAppwrite();
      if (!db) {
        console.warn('Appwrite not configured for calendar service, cannot update event');
        return null;
      }

      const updateData: any = { ...eventData };
      if (updateData.teams) {
        updateData.teams = JSON.stringify(updateData.teams);
      }

      const response = await db.updateDocument(
        DB_ID,
        CALENDAR_COLLECTION_ID,
        eventId,
        updateData
      );

      return mapDocumentToEvent(response);
    } catch (error) {
      console.error('❌ CalendarService: Error updating event:', error);
      return null;
    }
  }

  // Delete a calendar event (for admin use)
  async deleteEvent(eventId: string): Promise<boolean> {
    try {
      const db = initializeAppwrite();
      if (!db) {
        console.warn('Appwrite not configured for calendar service, cannot delete event');
        return false;
      }

      await db.deleteDocument(
        DB_ID,
        CALENDAR_COLLECTION_ID,
        eventId
      );
      return true;
    } catch (error) {
      console.error('❌ CalendarService: Error deleting event:', error);
      return false;
    }
  }

  // Get event by ID
  async getEventById(eventId: string): Promise<CalendarEvent | null> {
    try {
      const db = initializeAppwrite();
      if (!db) {
        console.warn('Appwrite not configured for calendar service, cannot get event by ID');
        return null;
      }

      const response = await db.getDocument(
        DB_ID,
        CALENDAR_COLLECTION_ID,
        eventId
      );

      return mapDocumentToEvent(response);
    } catch (error) {
      console.error('❌ CalendarService: Error fetching event by ID:', error);
      return null;
    }
  }
}

export const calendarService = new CalendarService();