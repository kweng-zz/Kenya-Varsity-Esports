import { Client, Databases, Query, ID } from 'node-appwrite';
import { tournamentService } from './tournamentService';
import { tournamentManagement } from './tournamentManagement';

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
  // Convert tournament to calendar event
  private tournamentToCalendarEvent = (tournament: any): CalendarEvent => {
    const now = new Date().toISOString();
    let status: 'upcoming' | 'live' | 'completed' = 'upcoming';
    
    // Determine tournament status for calendar
    if (tournament.tournamentStatus === 'ongoing') {
      status = 'live';
    } else if (tournament.tournamentStatus === 'completed') {
      status = 'completed';
    }

    // Use tournament dates for calendar events
    const date = tournament.startDate || tournament.registrationStartDate || now;
    const time = tournament.startDate ? new Date(tournament.startDate).toTimeString().slice(0, 5) : undefined;

    return {
      id: `tournament_${tournament.id}`,
      title: tournament.title || `${tournament.gameName} Tournament`,
      description: tournament.description || `Tournament for ${tournament.gameName}`,
      date,
      time,
      type: 'tournament',
      status,
      gameSlug: tournament.gameName.toLowerCase().replace(/\s+/g, '-'),
      tournamentId: tournament.id,
      location: tournament.format || 'Online',
      registrationDeadline: tournament.registrationDeadline,
      maxParticipants: tournament.maxParticipants,
      currentParticipants: tournament.currentParticipants || 0,
      prizePool: tournament.prizePool ? `${tournament.prizePool} ${tournament.currency || 'USD'}` : undefined,
      teams: [],
      isImportant: true,
      createdAt: tournament.createdAt,
      updatedAt: tournament.updatedAt
    };
  };

  // Get all calendar events for a specific game
  async getCalendarData(gameSlug: string): Promise<CalendarData> {
    try {
console.log('=== CALENDAR FETCH START ===');
      console.log('GameSlug:', gameSlug);
      
      console.log('📊 CalendarService: Step 1 - Fetching calendar events...');
      
      let events: CalendarEvent[] = [];
      
      // Add a test event immediately to verify display logic works
      console.log('🧪 Adding immediate test event for debugging...');
      // Fetch regular calendar events
      const db = initializeAppwrite();
      
      // Add a test event immediately to verify display logic works
      console.log('🧪 Adding immediate test event for debugging...');
      
      if (db) {
        try {
          const response = await db.listDocuments(
            DB_ID,
            CALENDAR_COLLECTION_ID,
            [
              Query.equal('gameSlug', gameSlug),
              Query.orderAsc('date'),
              Query.limit(100)
            ]
          );

          console.log(`📊 CalendarService: Found ${response.documents.length} calendar events`);
          events = response.documents.map(mapDocumentToEvent);
        } catch (error) {
          console.error('❌ CalendarService: Error fetching calendar events:', error);
          
          // Handle specific Appwrite document not found errors
          if ((error as any)?.type === 'document_not_found' || (error as any)?.message?.includes('could not be found')) {
            console.log('🔍 CalendarService: Calendar event not found, continuing without calendar events...');
            events = []; // Just use empty calendar events array
          } else {
            console.error('❌ CalendarService: Unexpected calendar error:', error);
            events = []; // Continue with empty events to avoid crashes
          }
        }
      } else {
        console.warn('Appwrite not configured for calendar service, skipping calendar events');
      }

      console.log('🏆 CalendarService: Step 2 - Fetching tournaments...');
      
      // Fetch tournaments and convert to calendar events
      try {
        console.log(`🏆 CalendarService: About to start tournament fetching for gameSlug="${gameSlug}"`);
        
        // Add a simple test to verify we reach this point
        console.log('🧪 TEST: If you see this, we reached tournament fetching code');
        
        console.log(`🏆 CalendarService: Fetching tournaments for gameSlug="${gameSlug}"`);
        
        // Normalize game slug for comparison
        const normalizedGameSlug = gameSlug.toLowerCase();
        let tournaments: any[] = [];
        
        console.log('🏆 CalendarService: Step 2 - Getting tournaments from Appwrite (persisted data)...');
        
        // Priority 1: Fetch from Appwrite (persisted data)
        try {
          const publishedTournaments = await tournamentService.getPublishedTournaments();
          tournaments = publishedTournaments;
          console.log(`🏆 CalendarService: Found ${tournaments.length} tournaments from Appwrite`);
          
          // Log all tournaments for debugging
          tournaments.forEach((t, i) => {
            console.log(`   Appwrite Tournament ${i+1}: "${t.title}" (${t.gameName}) - ${t.status}`);
          });
        } catch (appwriteError) {
          console.error('🏆 CalendarService: Appwrite fetch failed:', appwriteError);
          
          // Priority 2: Fall back to in-memory storage if Appwrite fails
          console.log('🏆 CalendarService: Trying in-memory storage as fallback...');
          try {
            const result = await tournamentManagement.list({ status: 'published' });
            tournaments = result.tournaments;
            console.log(`🏆 CalendarService: Found ${tournaments.length} tournaments from in-memory storage (fallback)`);
          } catch (memoryError) {
            console.error('🏆 CalendarService: In-memory fallback also failed:', memoryError);
          }
        }

        console.log(`🏆 CalendarService: Step 2c - Filtering tournaments for "${gameSlug}"...`);
// Filter tournaments by game name/slug
        const matchingTournaments = tournaments.filter(tournament => {
          const tournamentGameSlug = tournament.gameName.toLowerCase().replace(/\s+/g, '-');
          const isExactMatch = tournamentGameSlug === normalizedGameSlug;
          const isPartialMatch = tournament.gameName.toLowerCase().includes(normalizedGameSlug.replace('-', ' '));
          const isReverseMatch = normalizedGameSlug.includes(tournamentGameSlug);
          
          if (tournaments.length > 0) {
            console.log(`   Checking: "${tournament.gameName}" -> "${tournamentGameSlug}" vs "${normalizedGameSlug}"`);
            console.log(`   Matches: exact=${isExactMatch}, partial=${isPartialMatch}, reverse=${isReverseMatch}`);
          }
          return isExactMatch || isPartialMatch || isReverseMatch;
        });

console.log(`🏆 CalendarService: Found ${matchingTournaments.length} matching tournaments for game "${gameSlug}"`);

        // Log details for debugging
        matchingTournaments.forEach((tournament, index) => {
          console.log(`   Matching Tournament ${index + 1}: "${tournament.title}" (${tournament.gameName}) - ${tournament.status}`);
        });

        console.log('🏆 CalendarService: Step 2d - Converting tournaments to calendar events...');
        // Convert tournaments to calendar events
        const tournamentEvents = matchingTournaments.map(this.tournamentToCalendarEvent);
        
        console.log(`🏆 CalendarService: Created ${tournamentEvents.length} tournament events`);
        tournamentEvents.forEach((event, i) => {
          console.log(`   Tournament Event ${i+1}: "${event.title}" on ${event.date} (${event.status})`);
        });
        
        // Merge calendar events and tournament events
        events = [...events, ...tournamentEvents];
        
        console.log(`📅 CalendarService: Total events after merging: ${events.length} (${events.length - tournamentEvents.length} calendar + ${tournamentEvents.length} tournament)`);
        console.log('🏁 CalendarService: Process completed successfully!');
      } catch (error) {
        console.error('❌ CalendarService: Error fetching tournaments:', error);
        console.error('❌ CalendarService: Error details:', JSON.stringify(error, null, 2));
      }

      // Sort all events by date
      events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Calculate statistics
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
      let events: CalendarEvent[] = [];

      // Fetch regular calendar events
      const db = initializeAppwrite();
      if (db) {
        try {
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

          events = response.documents.map(mapDocumentToEvent);
        } catch (error) {
          console.error('❌ CalendarService: Error fetching upcoming calendar events:', error);
        }
      }

      // Fetch tournaments and convert to calendar events
      try {
        const publishedTournaments = await tournamentService.getPublishedTournaments();
        
        // Filter tournaments by game and status
        const normalizedGameSlug = gameSlug.toLowerCase();
        const matchingTournaments = publishedTournaments.filter(tournament => {
          const tournamentGameSlug = tournament.gameName.toLowerCase().replace(/\s+/g, '-');
          const isUpcoming = tournament.tournamentStatus === 'upcoming' || tournament.tournamentStatus === 'registration_open';
          return tournamentGameSlug === normalizedGameSlug && isUpcoming;
        });

        // Convert tournaments to calendar events
        const tournamentEvents = matchingTournaments.map(this.tournamentToCalendarEvent);
        
        // Merge events
        events = [...events, ...tournamentEvents];
        
      } catch (error) {
        console.error('❌ CalendarService: Error fetching upcoming tournaments:', error);
      }

      // Sort by date and limit
      events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      return events.slice(0, limit);
    } catch (error) {
      console.error('❌ CalendarService: Error fetching upcoming events:', error);
      return [];
    }
  }

  // Get events by date range
  async getEventsByDateRange(gameSlug: string, startDate: string, endDate: string): Promise<CalendarEvent[]> {
    try {
      let events: CalendarEvent[] = [];

      // Fetch regular calendar events
      const db = initializeAppwrite();
      if (db) {
        try {
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

          events = response.documents.map(mapDocumentToEvent);
        } catch (error) {
          console.error('❌ CalendarService: Error fetching calendar events by date range:', error);
        }
      }

      // Fetch tournaments and convert to calendar events
      try {
        const publishedTournaments = await tournamentService.getPublishedTournaments();
        
        // Filter tournaments by game and date range
        const normalizedGameSlug = gameSlug.toLowerCase();
        const matchingTournaments = publishedTournaments.filter(tournament => {
          const tournamentGameSlug = tournament.gameName.toLowerCase().replace(/\s+/g, '-');
          
          // Check if tournament falls within date range
          const tournamentDate = tournament.startDate || tournament.registrationStartDate;
          if (!tournamentDate) return false;
          
          const isDateInRange = tournamentDate >= startDate && tournamentDate <= endDate;
          return tournamentGameSlug === normalizedGameSlug && isDateInRange;
        });

        // Convert tournaments to calendar events
        const tournamentEvents = matchingTournaments.map(this.tournamentToCalendarEvent);
        
        // Merge events
        events = [...events, ...tournamentEvents];
        
      } catch (error) {
        console.error('❌ CalendarService: Error fetching tournaments by date range:', error);
      }

      // Sort by date
      events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      return events;
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