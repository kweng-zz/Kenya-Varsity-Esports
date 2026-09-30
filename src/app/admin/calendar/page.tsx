'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { CalendarEvent } from '@/lib/services/calendarService';
import { tournamentService } from '@/lib/services/tournamentService';
import { gamesData, GameRules } from '@/lib/gamesData';

// Client-side calendar service for admin operations
import { Client, Databases, Query, ID, Permission, Role } from 'appwrite';

// Lazy initialization to avoid build-time issues
let client: Client | null = null;
let databases: Databases | null = null;

const initializeAppwrite = () => {
  if (!client) {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

    if (!endpoint || !projectId) {
      console.warn('Appwrite configuration missing for admin calendar');
      return null;
    }

    if (typeof endpoint !== 'string' || endpoint.trim() === '') {
      console.warn('Appwrite endpoint is invalid for admin calendar');
      return null;
    }

    try {
      client = new Client()
        .setEndpoint(endpoint)
        .setProject(projectId);

      databases = new Databases(client);
    } catch (error) {
      console.error('Failed to initialize Appwrite client for admin calendar:', error);
      return null;
    }
  }
  return databases;
};

interface TicketTypeConfig {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  quantityTotal: string;
  maxPerOrder: string;
  minPerOrder: string;
  benefits: string;
  color: string;
  isFeatured: boolean;
}

interface CalendarEventForm {
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'registration' | 'match' | 'tournament' | 'deadline' | 'announcement' | 'event';
  status: 'upcoming' | 'live' | 'completed';
  gameSlug: string;
  tournamentId: string;
  location: string;
  registrationDeadline: string;
  maxParticipants: string;
  prizePool: string;
  teams: string;
  isImportant: boolean;
  // Ticket configuration
  enableTickets: boolean;
  ticketCurrency: string;
  taxRate: string;
  serviceFee: string;
  serviceFeeType: 'fixed' | 'percentage';
  maxTicketsPerUser: string;
  requiresApproval: boolean;
  salesStartDate: string;
  salesEndDate: string;
  ticketTypes: TicketTypeConfig[];
  refundPolicy: string;
  contactEmail: string;
}

const initialTicketType: TicketTypeConfig = {
  name: '',
  description: '',
  price: '',
  originalPrice: '',
  quantityTotal: '',
  maxPerOrder: '5',
  minPerOrder: '1',
  benefits: '',
  color: '#8c110d',
  isFeatured: false
};

const initialFormData: CalendarEventForm = {
  title: '',
  description: '',
  date: '',
  time: '',
  type: 'event',
  status: 'upcoming',
  gameSlug: '',
  tournamentId: '',
  location: '',
  registrationDeadline: '',
  maxParticipants: '',
  prizePool: '',
  teams: '',
  isImportant: false,
  enableTickets: false,
  ticketCurrency: 'KES',
  taxRate: '0',
  serviceFee: '0',
  serviceFeeType: 'fixed',
  maxTicketsPerUser: '5',
  requiresApproval: false,
  salesStartDate: '',
  salesEndDate: '',
  ticketTypes: [],
  refundPolicy: '',
  contactEmail: ''
};

export default function AdminCalendarPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [formData, setFormData] = useState<CalendarEventForm>(initialFormData);
  const [submitting, setSubmitting] = useState(false);

  // Game options for the dropdown - dynamically loaded from tournaments data
  const [gameOptions, setGameOptions] = useState<{ value: string; label: string }[]>([]);
  
  // Selected game's format info
  const [selectedGameFormat, setSelectedGameFormat] = useState<GameRules | null>(null);
  const [showTicketConfig, setShowTicketConfig] = useState(false);

  // Load game options from tournaments data
  useEffect(() => {
    const loadGameOptions = async () => {
      try {
        // Import the tournaments data
        const { getAllActiveGames } = await import('@/lib/pagedata/tournaments');
        const activeGames = getAllActiveGames();
        
        // Convert to dropdown options
        const options = activeGames.map(game => ({
          value: game.slug,
          label: game.name
        }));
        
        setGameOptions(options);
      } catch (error) {
        console.error('Error loading game options:', error);
        // Fallback to static options if dynamic loading fails
        setGameOptions([
          { value: 'pubg-mobile', label: 'PUBG Mobile' },
          { value: 'call-of-duty-mobile-br', label: 'Call of Duty Mobile BR' },
          { value: 'efootball-mobile', label: 'eFootball Mobile' },
          { value: 'free-fire', label: 'Free Fire' },
          { value: 'bloodstrike', label: 'Bloodstrike' },
          { value: 'chess', label: 'Chess' },
          { value: 'ea-fc-2v2', label: 'EA-FC 2V2' }
        ]);
      }
    };

    loadGameOptions();
  }, []);

  // Detect game format when gameSlug changes
  useEffect(() => {
    if (formData.gameSlug) {
      const game = gamesData[formData.gameSlug];
      if (game && game.rules) {
        setSelectedGameFormat(game.rules);
        // Auto-enable tickets for tournaments and events
        if (formData.type === 'tournament' || formData.type === 'event') {
          setShowTicketConfig(true);
        }
      } else {
        setSelectedGameFormat(null);
      }
    } else {
      setSelectedGameFormat(null);
    }
  }, [formData.gameSlug]);

  // Auto-populate ticket types based on game format
  useEffect(() => {
    if (showTicketConfig && selectedGameFormat && formData.ticketTypes.length === 0) {
      const defaultTypes = getDefaultTicketTypes(selectedGameFormat.tournamentType);
      setFormData(prev => ({ ...prev, ticketTypes: defaultTypes }));
    }
  }, [showTicketConfig, selectedGameFormat]);

  const getDefaultTicketTypes = (tournamentType: GameRules['tournamentType']): TicketTypeConfig[] => {
    const baseTypes: TicketTypeConfig[] = [];
    
    if (tournamentType === 'individual') {
      // 1v1 games like eFootball - individual pricing
      baseTypes.push({
        ...initialTicketType,
        name: 'Standard Entry',
        description: 'Single player entry for 1v1 tournament',
        price: '500',
        originalPrice: '500',
        quantityTotal: '64',
        maxPerOrder: '1',
        minPerOrder: '1',
        benefits: 'Tournament entry, Live streaming access, Discord access',
        color: '#8c110d',
        isFeatured: true
      });
      baseTypes.push({
        ...initialTicketType,
        name: 'Early Bird',
        description: 'Discounted early registration for 1v1 tournament',
        price: '350',
        originalPrice: '500',
        quantityTotal: '16',
        maxPerOrder: '1',
        minPerOrder: '1',
        benefits: 'Tournament entry, Live streaming access, Discord access, Early bird badge',
        color: '#fbbf24',
        isFeatured: false
      });
    } else {
      // Squad/team games like PUBG, CODM - team pricing
      baseTypes.push({
        ...initialTicketType,
        name: 'Team Entry (Standard)',
        description: `Full team entry for ${tournamentType === 'duo' ? '2v2' : '4v4'} tournament`,
        price: '2000',
        originalPrice: '2000',
        quantityTotal: '32',
        maxPerOrder: '1',
        minPerOrder: '1',
        benefits: `Full team (${tournamentType === 'duo' ? '2' : '4'} players) entry, Live streaming access, Discord access, Team profile page`,
        color: '#8c110d',
        isFeatured: true
      });
      baseTypes.push({
        ...initialTicketType,
        name: 'Team Entry (Early Bird)',
        description: `Discounted early registration for ${tournamentType === 'duo' ? '2v2' : '4v4'} tournament`,
        price: '1500',
        originalPrice: '2000',
        quantityTotal: '8',
        maxPerOrder: '1',
        minPerOrder: '1',
        benefits: `Full team (${tournamentType === 'duo' ? '2' : '4'} players) entry, Live streaming access, Discord access, Team profile page, Early bird badge`,
        color: '#fbbf24',
        isFeatured: false
      });
      baseTypes.push({
        ...initialTicketType,
        name: 'Spectator Pass',
        description: 'Watch-only access for non-participants',
        price: '200',
        originalPrice: '200',
        quantityTotal: '100',
        maxPerOrder: '5',
        minPerOrder: '1',
        benefits: 'Live streaming access, Discord spectator channel, Event highlights',
        color: '#6b7280',
        isFeatured: false
      });
    }
    
    return baseTypes;
  };

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!user || !profile?.isAdmin)) {
      router.push('/admin');
    }
  }, [user, profile, loading, router]);

// Convert tournament to calendar event (same logic as calendar service)
  const tournamentToCalendarEvent = (tournament: any): CalendarEvent => {
    const now = new Date().toISOString();
    let status: 'upcoming' | 'live' | 'completed' = 'upcoming';
    
    if (tournament.tournamentStatus === 'ongoing') {
      status = 'live';
    } else if (tournament.tournamentStatus === 'completed') {
      status = 'completed';
    }

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

  // Fetch calendar events and tournaments
  useEffect(() => {
    const fetchEvents = async () => {
      if (!user || !profile?.isAdmin) return;

      try {
        let allEvents: CalendarEvent[] = [];

        // Fetch regular calendar events
        const db = initializeAppwrite();
        if (db) {
          try {
            const response = await db.listDocuments(
              process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
              process.env.NEXT_PUBLIC_APPWRITE_CALENDAR_COLLECTION_ID || 'calendar_events',
              [Query.orderDesc('date'), Query.limit(100)]
            );

            const calendarEventsData = response.documents.map((doc: any) => ({
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
            })) as CalendarEvent[];
            
            allEvents = [...allEvents, ...calendarEventsData];
          } catch (error) {
            console.error('Error fetching calendar events:', error);
          }
        } else {
          console.warn('Appwrite not configured, skipping calendar events fetch');
        }

        // Fetch tournaments and convert to calendar events
        try {
          console.log('🏆 AdminCalendar: Fetching tournaments...');
          const publishedTournaments = await tournamentService.getPublishedTournaments();
          console.log(`🏆 AdminCalendar: Found ${publishedTournaments.length} published tournaments`);

          const tournamentEvents = publishedTournaments.map(tournamentToCalendarEvent);
          console.log(`🏆 AdminCalendar: Created ${tournamentEvents.length} tournament events`);

          allEvents = [...allEvents, ...tournamentEvents];
        } catch (error) {
          console.error('Error fetching tournaments:', error);
        }

        // Sort all events by date (newest first)
        allEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        console.log(`📅 AdminCalendar: Total events to display: ${allEvents.length}`);
        setEvents(allEvents);
        setLoadingData(false);
      } catch (error) {
        console.error('Error fetching calendar data:', error);
        setLoadingData(false);
      }
    };

    fetchEvents();
  }, [user, profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addTicketType = () => {
    setFormData(prev => ({ ...prev, ticketTypes: [...prev.ticketTypes, { ...initialTicketType }] }));
  };

  const removeTicketType = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ticketTypes: prev.ticketTypes.filter((_, i) => i !== index)
    }));
  };

  const updateTicketType = (index: number, field: keyof TicketTypeConfig, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      ticketTypes: prev.ticketTypes.map((t, i) => i === index ? { ...t, [field]: value } : t)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const db = initializeAppwrite();
      if (!db) {
        console.error('Appwrite not configured, cannot save event');
        return;
      }

      const eventData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        type: formData.type,
        status: formData.status,
        gameSlug: formData.gameSlug,
        tournamentId: formData.tournamentId || undefined,
        location: formData.location || undefined,
        registrationDeadline: formData.registrationDeadline || undefined,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
        currentParticipants: 0,
        prizePool: formData.prizePool || undefined,
        teams: formData.teams ? formData.teams.split(',').map(team => team.trim()).filter(team => team) : undefined,
        isImportant: formData.isImportant
      };

      if (editingEvent) {
        // Update existing event
        await db.updateDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_CALENDAR_COLLECTION_ID || 'calendar_events',
          editingEvent.id,
          eventData
        );

        setEvents(prev => prev.map(event => 
          event.id === editingEvent.id 
            ? { ...event, ...eventData, id: editingEvent.id, createdAt: event.createdAt, updatedAt: new Date().toISOString() }
            : event
        ));
      } else {
        // Create new event
        const response = await db.createDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_CALENDAR_COLLECTION_ID || 'calendar_events',
          ID.unique(),
          eventData
        );

        const newEvent: CalendarEvent = {
          id: response.$id,
          title: response.title,
          description: response.description || '',
          date: response.date,
          time: response.time,
          type: response.type || 'event',
          status: response.status || 'upcoming',
          gameSlug: response.gameSlug,
          tournamentId: response.tournamentId,
          location: response.location,
          registrationDeadline: response.registrationDeadline,
          maxParticipants: response.maxParticipants,
          currentParticipants: response.currentParticipants || 0,
          prizePool: response.prizePool,
          teams: response.teams ? (Array.isArray(response.teams) ? response.teams : JSON.parse(response.teams)) : undefined,
          isImportant: response.isImportant || false,
          createdAt: response.$createdAt,
          updatedAt: response.$updatedAt
        };

        setEvents(prev => [newEvent, ...prev]);

        // Create ticket configuration if enabled
        if (formData.enableTickets && formData.ticketTypes.length > 0) {
          await createTicketConfiguration(db, response.$id, formData, selectedGameFormat);
        }
      }

      // If editing and tickets enabled, create/update ticket configuration
      if (editingEvent && formData.enableTickets && formData.ticketTypes.length > 0) {
        await createTicketConfiguration(db, editingEvent.id, formData, selectedGameFormat);
      }

      // Reset form
      setFormData(initialFormData);
      setShowForm(false);
      setEditingEvent(null);
      setSelectedGameFormat(null);
      setShowTicketConfig(false);
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const createTicketConfiguration = async (
    db: Databases,
    eventId: string,
    formData: CalendarEventForm,
    gameFormat: GameRules | null
  ) => {
    try {
      const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
      const EVENT_TICKETS_COLLECTION = 'event_tickets';
      const EVENT_TICKET_TYPES_COLLECTION = 'event_ticket_types';

      // Generate event slug from title
      const eventSlug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // Create event_tickets document
      const eventTicketResponse = await db.createDocument(
        DB_ID,
        EVENT_TICKETS_COLLECTION,
        ID.unique(),
        {
          eventId: eventId,
          eventTitle: formData.title,
          eventSlug: eventSlug,
          isActive: true,
          salesStartDate: formData.salesStartDate || undefined,
          salesEndDate: formData.salesEndDate || undefined,
          maxTicketsPerUser: parseInt(formData.maxTicketsPerUser) || 5,
          requiresApproval: formData.requiresApproval,
          currency: formData.ticketCurrency,
          taxRate: parseFloat(formData.taxRate) || 0,
          serviceFee: parseFloat(formData.serviceFee) || 0,
          serviceFeeType: formData.serviceFeeType,
          description: formData.description,
          refundPolicy: formData.refundPolicy,
          contactEmail: formData.contactEmail,
          totalSold: 0,
          totalRevenue: 0,
        },
        [
          Permission.read(Role.any()),
          Permission.write(Role.team('admins')),
          Permission.update(Role.team('admins')),
          Permission.delete(Role.team('admins'))
        ]
      );

      const eventTicketId = eventTicketResponse.$id;

      // Create ticket types
      for (let i = 0; i < formData.ticketTypes.length; i++) {
        const tt = formData.ticketTypes[i];
        const price = parseFloat(tt.price);
        const originalPrice = parseFloat(tt.originalPrice) || price;
        
        await db.createDocument(
          DB_ID,
          EVENT_TICKET_TYPES_COLLECTION,
          ID.unique(),
          {
            eventTicketId: eventTicketId,
            name: tt.name,
            description: tt.description,
            price: price,
            originalPrice: originalPrice,
            quantityTotal: parseInt(tt.quantityTotal) || 0,
            quantitySold: 0,
            quantityReserved: 0,
            maxPerOrder: parseInt(tt.maxPerOrder) || 5,
            minPerOrder: parseInt(tt.minPerOrder) || 1,
            sortOrder: i,
            isActive: true,
            salesStartDate: formData.salesStartDate || undefined,
            salesEndDate: formData.salesEndDate || undefined,
            benefits: tt.benefits.split('\n').filter(b => b.trim()),
            color: tt.color,
            isFeatured: tt.isFeatured,
          },
          [
            Permission.read(Role.any()),
            Permission.write(Role.team('admins')),
            Permission.update(Role.team('admins')),
            Permission.delete(Role.team('admins'))
          ]
        );
      }

      console.log('✅ Ticket configuration created successfully for event:', eventId);
    } catch (error) {
      console.error('Error creating ticket configuration:', error);
      // Don't throw - event was created successfully, just ticket config failed
    }
  };

  const handleEdit = async (event: CalendarEvent) => {
    setEditingEvent(event);
    
    // Load existing ticket configuration if any
    const db = initializeAppwrite();
    let ticketConfig = null;
    if (db) {
      try {
        const response = await db.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
          'event_tickets',
          [Query.equal('eventId', event.id), Query.limit(1)]
        );
        if (response.documents.length > 0) {
          const et = response.documents[0];
          // Load ticket types
          const typesResponse = await db.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
            'event_ticket_types',
            [Query.equal('eventTicketId', et.$id), Query.orderAsc('sortOrder')]
          );
          ticketConfig = {
            eventTicket: et,
            ticketTypes: typesResponse.documents
          };
        }
      } catch (error) {
        console.error('Error loading ticket config:', error);
      }
    }

    setFormData({
      title: event.title,
      description: event.description || '',
      date: event.date,
      time: event.time || '',
      type: event.type,
      status: event.status || 'upcoming',
      gameSlug: event.gameSlug || '',
      tournamentId: event.tournamentId || '',
      location: event.location || '',
      registrationDeadline: event.registrationDeadline || '',
      maxParticipants: event.maxParticipants?.toString() || '',
      prizePool: event.prizePool || '',
      teams: event.teams?.join(', ') || '',
      isImportant: event.isImportant || false,
      enableTickets: !!ticketConfig,
      ticketCurrency: ticketConfig?.eventTicket?.currency || 'KES',
      taxRate: ticketConfig?.eventTicket?.taxRate?.toString() || '0',
      serviceFee: ticketConfig?.eventTicket?.serviceFee?.toString() || '0',
      serviceFeeType: ticketConfig?.eventTicket?.serviceFeeType || 'fixed',
      maxTicketsPerUser: ticketConfig?.eventTicket?.maxTicketsPerUser?.toString() || '5',
      requiresApproval: ticketConfig?.eventTicket?.requiresApproval || false,
      salesStartDate: ticketConfig?.eventTicket?.salesStartDate ? new Date(ticketConfig.eventTicket.salesStartDate).toISOString().slice(0, 16) : '',
      salesEndDate: ticketConfig?.eventTicket?.salesEndDate ? new Date(ticketConfig.eventTicket.salesEndDate).toISOString().slice(0, 16) : '',
      ticketTypes: ticketConfig?.ticketTypes?.map((tt: any) => ({
        name: tt.name,
        description: tt.description || '',
        price: tt.price?.toString() || '',
        originalPrice: tt.originalPrice?.toString() || '',
        quantityTotal: tt.quantityTotal?.toString() || '',
        maxPerOrder: tt.maxPerOrder?.toString() || '5',
        minPerOrder: tt.minPerOrder?.toString() || '1',
        benefits: Array.isArray(tt.benefits) ? tt.benefits.join('\n') : (tt.benefits || ''),
        color: tt.color || '#8c110d',
        isFeatured: tt.isFeatured || false
      })) || [],
      refundPolicy: ticketConfig?.eventTicket?.refundPolicy || '',
      contactEmail: ticketConfig?.eventTicket?.contactEmail || ''
    });
    
    if (ticketConfig) {
      setShowTicketConfig(true);
    }
    setShowForm(true);
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const db = initializeAppwrite();
      if (!db) {
        console.error('Appwrite not configured, cannot delete event');
        return;
      }

      await db.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_CALENDAR_COLLECTION_ID || 'calendar_events',
        eventId
      );

      setEvents(prev => prev.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-green-400 bg-green-400/10';
      case 'live': return 'text-red-400 bg-red-400/10';
      case 'completed': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tournament': return 'text-red-400 bg-red-400/10';
      case 'match': return 'text-blue-400 bg-blue-400/10';
      case 'registration': return 'text-yellow-400 bg-yellow-400/10';
      case 'event': return 'text-green-400 bg-green-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#961c18] mx-auto mb-4"></div>
          <p>Loading calendar events...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile?.isAdmin) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Calendar Management</h1>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setShowForm(true);
                setEditingEvent(null);
                setFormData(initialFormData);
              }}
              className="px-4 py-2 bg-[#961c18] hover:bg-[#b91c17] text-white rounded transition-colors"
            >
              Add Event
            </button>
            <button
              onClick={() => router.push('/admin')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
            >
              Back to Admin
            </button>
          </div>
        </div>

        {/* Event Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Game *</label>
                    <select
                      name="gameSlug"
                      value={formData.gameSlug}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                    >
                      <option value="">Select Game</option>
                      {gameOptions.map(game => (
                        <option key={game.value} value={game.value}>{game.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Time</label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Type *</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                    >
                      <option value="event">Event</option>
                      <option value="tournament">Tournament</option>
                      <option value="match">Match</option>
                      <option value="registration">Registration</option>
                      <option value="deadline">Deadline</option>
                      <option value="announcement">Announcement</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Status *</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="live">Live</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tournament ID</label>
                    <input
                      type="text"
                      name="tournamentId"
                      value={formData.tournamentId}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Registration Deadline</label>
                    <input
                      type="date"
                      name="registrationDeadline"
                      value={formData.registrationDeadline}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Participants</label>
                    <input
                      type="number"
                      name="maxParticipants"
                      value={formData.maxParticipants}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Prize Pool</label>
                    <input
                      type="text"
                      name="prizePool"
                      value={formData.prizePool}
                      onChange={handleInputChange}
                      placeholder="e.g., $1000"
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                </div>

                {/* Ticket Configuration Section */}
                <div className="border-t border-gray-700 pt-6 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Ticket Payment Configuration</h3>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.enableTickets}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, enableTickets: e.target.checked }));
                          setShowTicketConfig(e.target.checked);
                        }}
                        className="w-5 h-5 text-[#961c18] bg-gray-700 border-gray-600 rounded focus:ring-[#961c18]"
                      />
                      <span className="text-sm font-medium">Enable Ticket Sales</span>
                    </label>
                  </div>

                  {formData.enableTickets && (
                    <div className="space-y-6">
                      {/* Game Format Info */}
                      {selectedGameFormat && (
                        <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-blue-400 font-bold">Game Format Detected:</span>
                            <span className="px-3 py-1 bg-blue-600 text-white text-xs font-black uppercase rounded">
                              {selectedGameFormat.tournamentType === 'individual' ? '1v1 (Individual)' : 
                               selectedGameFormat.tournamentType === 'duo' ? '2v2 (Duo)' : 
                               'Team (Squad)'}
                            </span>
                          </div>
                          <p className="text-blue-300 text-sm">
                            {selectedGameFormat.tournamentType === 'individual' 
                              ? '1v1 games (e.g., eFootball) use individual pricing per player.' 
                              : 'Squad games (e.g., PUBG, CODM) use team-based pricing per team.'}
                          </p>
                        </div>
                      )}

                      {/* General Ticket Settings */}
                      <fieldset className="border border-gray-700 rounded-lg p-4">
                        <legend className="text-sm font-medium text-gray-300 mb-4">General Settings</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Currency</label>
                            <select
                              value={formData.ticketCurrency}
                              onChange={(e) => setFormData(prev => ({ ...prev, ticketCurrency: e.target.value }))}
                              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                            >
                              <option value="KES">KES (Kenyan Shilling)</option>
                              <option value="USD">USD (US Dollar)</option>
                              <option value="EUR">EUR (Euro)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Tax Rate (%)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={formData.taxRate}
                              onChange={(e) => setFormData(prev => ({ ...prev, taxRate: e.target.value }))}
                              placeholder="e.g., 16"
                              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Service Fee</label>
                            <input
                              type="number"
                              step="0.01"
                              value={formData.serviceFee}
                              onChange={(e) => setFormData(prev => ({ ...prev, serviceFee: e.target.value }))}
                              placeholder="e.g., 50"
                              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Fee Type</label>
                            <select
                              value={formData.serviceFeeType}
                              onChange={(e) => setFormData(prev => ({ ...prev, serviceFeeType: e.target.value as 'fixed' | 'percentage' }))}
                              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                            >
                              <option value="fixed">Fixed Amount</option>
                              <option value="percentage">Percentage</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Max Tickets Per User</label>
                            <input
                              type="number"
                              value={formData.maxTicketsPerUser}
                              onChange={(e) => setFormData(prev => ({ ...prev, maxTicketsPerUser: e.target.value }))}
                              placeholder="e.g., 5"
                              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                            />
                          </div>
                          <div className="flex items-end">
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.requiresApproval}
                                onChange={(e) => setFormData(prev => ({ ...prev, requiresApproval: e.target.checked }))}
                                className="w-4 h-4 text-[#961c18] bg-gray-700 border-gray-600 rounded focus:ring-[#961c18]"
                              />
                              <span className="text-sm font-medium">Requires Admin Approval</span>
                            </label>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Sales Start Date</label>
                            <input
                              type="datetime-local"
                              value={formData.salesStartDate}
                              onChange={(e) => setFormData(prev => ({ ...prev, salesStartDate: e.target.value }))}
                              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Sales End Date</label>
                            <input
                              type="datetime-local"
                              value={formData.salesEndDate}
                              onChange={(e) => setFormData(prev => ({ ...prev, salesEndDate: e.target.value }))}
                              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Refund Policy</label>
                            <textarea
                              value={formData.refundPolicy}
                              onChange={(e) => setFormData(prev => ({ ...prev, refundPolicy: e.target.value }))}
                              rows={2}
                              placeholder="e.g., No refunds within 48 hours of event. Full refund if event cancelled."
                              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Contact Email</label>
                            <input
                              type="email"
                              value={formData.contactEmail}
                              onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                              placeholder="support@example.com"
                              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                            />
                          </div>
                        </div>
                      </fieldset>

                      {/* Ticket Types */}
                      <fieldset className="border border-gray-700 rounded-lg p-4">
                        <legend className="text-sm font-medium text-gray-300 mb-4">Ticket Types</legend>
                        {formData.ticketTypes.map((ticketType, index) => (
                     <div key={index} className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 mb-4">
                       <div className="flex items-center justify-between mb-4">
                         <h4 className="font-medium text-white">Ticket Type #{index + 1}</h4>
                         {formData.ticketTypes.length > 1 && (
                           <button
                             type="button"
                             onClick={() => removeTicketType(index)}
                             className="text-red-400 hover:text-red-300 text-sm"
                           >
                             Remove
                           </button>
                         )}
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                         <div>
                           <label className="block text-sm font-medium mb-2">Name *</label>
                           <input
                             type="text"
                             value={ticketType.name}
                             onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                             placeholder="e.g., Standard Entry, VIP Pass"
                             className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                           />
                         </div>
                         <div>
                           <label className="block text-sm font-medium mb-2">Color</label>
                           <input
                             type="color"
                             value={ticketType.color}
                             onChange={(e) => updateTicketType(index, 'color', e.target.value)}
                             className="w-full h-10 bg-gray-700 border border-gray-600 rounded cursor-pointer"
                           />
                         </div>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                         <div>
                           <label className="block text-sm font-medium mb-2">Price *</label>
                           <input
                             type="number"
                             step="0.01"
                             value={ticketType.price}
                             onChange={(e) => updateTicketType(index, 'price', e.target.value)}
                             placeholder="e.g., 500"
                             className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                           />
                         </div>
                         <div>
                           <label className="block text-sm font-medium mb-2">Original Price</label>
                           <input
                             type="number"
                             step="0.01"
                             value={ticketType.originalPrice}
                             onChange={(e) => updateTicketType(index, 'originalPrice', e.target.value)}
                             placeholder="e.g., 500 (for showing discount)"
                             className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                           />
                         </div>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                         <div>
                           <label className="block text-sm font-medium mb-2">Total Quantity *</label>
                           <input
                             type="number"
                             value={ticketType.quantityTotal}
                             onChange={(e) => updateTicketType(index, 'quantityTotal', e.target.value)}
                             placeholder="e.g., 64"
                             className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                           />
                         </div>
                         <div>
                           <label className="block text-sm font-medium mb-2">Max Per Order</label>
                           <input
                             type="number"
                             value={ticketType.maxPerOrder}
                             onChange={(e) => updateTicketType(index, 'maxPerOrder', e.target.value)}
                             placeholder="e.g., 1"
                             className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                           />
                         </div>
                         <div>
                           <label className="block text-sm font-medium mb-2">Min Per Order</label>
                           <input
                             type="number"
                             value={ticketType.minPerOrder}
                             onChange={(e) => updateTicketType(index, 'minPerOrder', e.target.value)}
                             placeholder="e.g., 1"
                             className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                           />
                         </div>
                       </div>
                       <div className="mb-4">
                         <label className="block text-sm font-medium mb-2">Benefits (one per line)</label>
                         <textarea
                           value={ticketType.benefits}
                           onChange={(e) => updateTicketType(index, 'benefits', e.target.value)}
                           rows={3}
                           placeholder="Tournament entry&#10;Live streaming access&#10;Discord access"
                           className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                         />
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                           <label className="block text-sm font-medium mb-2">Description</label>
                           <input
                             type="text"
                             value={ticketType.description}
                             onChange={(e) => updateTicketType(index, 'description', e.target.value)}
                             placeholder="Brief description of this ticket type"
                             className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                           />
                         </div>
                         <div className="flex items-end">
                           <label className="flex items-center space-x-2 w-full">
                             <input
                               type="checkbox"
                               checked={ticketType.isFeatured}
                               onChange={(e) => updateTicketType(index, 'isFeatured', e.target.checked)}
                               className="w-4 h-4 text-[#961c18] bg-gray-700 border-gray-600 rounded focus:ring-[#961c18]"
                             />
                             <span className="text-sm font-medium">Featured (highlight in UI)</span>
                           </label>
                         </div>
                       </div>
                     </div>
                   ))}
                   {formData.ticketTypes.length < 5 && (
                     <button
                       type="button"
                       onClick={addTicketType}
                       className="w-full py-3 border-2 border-dashed border-gray-600 hover:border-[#8c110d] text-gray-400 hover:text-white font-medium rounded-lg transition-colors"
                     >
+ Add Another Ticket Type
                      </button>
                    )}
                  </fieldset>
                    </div>
            )}

                </div>

                  <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingEvent(null);
                      setFormData(initialFormData);
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-[#961c18] hover:bg-[#b91c17] disabled:bg-gray-600 text-white rounded transition-colors"
                  >
                    {submitting ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Events List */}
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-400">No calendar events found. Create your first event!</p>
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(event.type)}`}>
                        {event.type.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status || 'upcoming')}`}>
                        {(event.status || 'upcoming').toUpperCase()}
                      </span>
                      {event.isImportant && (
                        <span className="px-2 py-1 bg-[#8c110d] text-white text-xs font-bold rounded-full animate-pulse">
                          IMPORTANT
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Game:</span>
                        <p className="font-medium">{gameOptions.find(g => g.value === event.gameSlug)?.label || event.gameSlug || 'Unknown'}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Date:</span>
                        <p className="font-medium">{new Date(event.date).toLocaleDateString()}</p>
                      </div>
                      {event.time && (
                        <div>
                          <span className="text-gray-400">Time:</span>
                          <p className="font-medium">{event.time}</p>
                        </div>
                      )}
                      {event.location && (
                        <div>
                          <span className="text-gray-400">Location:</span>
                          <p className="font-medium">{event.location}</p>
                        </div>
                      )}
                      {event.maxParticipants && (
                        <div>
                          <span className="text-gray-400">Participants:</span>
                          <p className="font-medium">{event.currentParticipants}/{event.maxParticipants}</p>
                        </div>
                      )}
                      {event.prizePool && (
                        <div>
                          <span className="text-gray-400">Prize Pool:</span>
                          <p className="font-medium">{event.prizePool}</p>
                        </div>
                      )}
                    </div>

                    {event.description && (
                      <div className="mt-3">
                        <span className="text-gray-400">Description:</span>
                        <p className="text-sm mt-1">{event.description}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(event)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}