 'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Client, Databases, ID, Permission, Role, Query, Storage } from 'appwrite';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { gamesData } from '@/lib/gamesData';

// Appwrite Setup with lazy initialization
let client: Client | null = null;
let databases: Databases | null = null;
let storage: Storage | null = null;

const initializeAppwrite = () => {
  if (!client) {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

    if (!endpoint || !projectId) {
      console.warn('Appwrite configuration missing for admin tournaments');
      return null;
    }

    if (typeof endpoint !== 'string' || endpoint.trim() === '') {
      console.warn('Appwrite endpoint is invalid for admin tournaments');
      return null;
    }

    try {
      client = new Client()
        .setEndpoint(endpoint)
        .setProject(projectId);

      databases = new Databases(client);
      storage = new Storage(client);
    } catch (error) {
      console.error('Failed to initialize Appwrite client for admin tournaments:', error);
      return null;
    }
  }
  return { databases, storage };
};

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const TOURNAMENTS_COLLECTION_ID = 'tournaments';
const AWARDS_COLLECTION_ID = 'tournament_awards';
const EXTERNAL_EVENTS_COLLECTION_ID = 'external_events';
const BUCKET_ID = 'season-images';

interface ExternalEventFormData {
  title: string;
  description: string;
  imageUrl: string;
  externalUrl: string;
  eventDate: string;
  venue: string;
  status: string;
  tags: string;
  isFeatured: boolean;
  enableTickets: boolean;
  ticketCurrency: string;
  maxTicketsPerUser: string;
  platformFee: string;
  platformFeeType: 'fixed' | 'percentage';
  ticketTypes: TicketTypeConfig[];
}

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

interface TournamentFormData {
  slug: string;
  gameName: string;
  title: string;
  description: string;
  detailedDescription: string;
  category: string;
  featuredImageUrl: string;
  status: string;
  tournamentStatus: string;
  registrationDeadline: string;
  startDate: string;
  endDate: string;
  currency: string;
  // Awards for top 4 positions
  firstPrize: number;
  secondPrize: number;
  thirdPrize: number;
  fourthPrize: number;
  // Events page visibility
  showInEvents: boolean;
  isFeatured: boolean;
}

interface AwardFormData {
  position: number;
  title: string;
  description: string;
  prize: number;
  currency: string;
}

export default function TournamentsAdminPage() {
  const { user, profile } = useAuth();

  const [tournaments, setTournaments] = useState<any[]>([]);
  const [awards, setAwards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showAwardsForm, setShowAwardsForm] = useState(false);
  const [editingTournament, setEditingTournament] = useState<any | null>(null);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tournaments' | 'external'>('tournaments');

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

  // External Event Ticket Configuration Functions
  const addExternalTicketType = () => {
    setExternalFormData(prev => ({ ...prev, ticketTypes: [...prev.ticketTypes, { ...initialTicketType }] }));
  };

  const removeExternalTicketType = (index: number) => {
    setExternalFormData(prev => ({
      ...prev,
      ticketTypes: prev.ticketTypes.filter((_, i) => i !== index)
    }));
  };

  const updateExternalTicketType = (index: number, field: keyof TicketTypeConfig, value: string | boolean) => {
    setExternalFormData(prev => ({
      ...prev,
      ticketTypes: prev.ticketTypes.map((t, i) => i === index ? { ...t, [field]: value } : t)
    }));
  };

  const updateExternalPricePreview = () => {
    if (typeof window === 'undefined') return;
    
    const basePrice = 200;
    const platformFee = parseFloat(externalFormData.platformFee) || 0;
    const feeType = externalFormData.platformFeeType;
    const currency = externalFormData.ticketCurrency;
    const vatRate = 16;

    const vatAmount = basePrice * (vatRate / 100);
    const platformFeeAmount = feeType === 'percentage' ? basePrice * (platformFee / 100) : platformFee;
    const subtotal = basePrice + vatAmount + platformFeeAmount;
    
    const paystackRate = 0.025;
    const paystackFixedFee = 10;
    const paystackFee = subtotal * paystackRate + paystackFixedFee;
    const total = subtotal + paystackFee;
    const net = basePrice - (total * 0.025 + 10);

    const fmt = (n: number) => new Intl.NumberFormat('en-KE', { style: 'currency', currency, minimumFractionDigits: 0 }).format(n);

    const baseEl = document.getElementById('calc-base-ext');
    const vatEl = document.getElementById('calc-vat-ext');
    const feeEl = document.getElementById('calc-fee-ext');
    const paystackEl = document.getElementById('calc-paystack-ext');
    const totalEl = document.getElementById('calc-total-ext');
    const netEl = document.getElementById('calc-net-ext');

    if (baseEl) baseEl.textContent = fmt(basePrice);
    if (vatEl) vatEl.textContent = fmt(vatAmount);
    if (feeEl) feeEl.textContent = fmt(platformFeeAmount);
    if (paystackEl) paystackEl.textContent = fmt(paystackFee);
    if (totalEl) totalEl.textContent = fmt(total);
    if (netEl) netEl.textContent = fmt(Math.max(0, net));
  };

  const createExternalTicketConfiguration = async (eventId: string, formData: ExternalEventFormData) => {
    try {
      const appwrite = initializeAppwrite();
      if (!appwrite?.databases) return;

      const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
      const EVENT_TICKETS_COLLECTION = 'event_tickets';
      const EVENT_TICKET_TYPES_COLLECTION = 'event_ticket_types';

      const eventSlug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const eventTicketResponse = await appwrite.databases.createDocument(
        DB_ID,
        'event_tickets',
        ID.unique(),
        {
          eventId: eventId,
          eventTitle: formData.title,
          eventSlug: eventSlug,
          isActive: true,
          maxTicketsPerUser: parseInt(formData.maxTicketsPerUser) || 5,
          currency: formData.ticketCurrency,
          taxRate: 16,
          serviceFee: parseFloat(formData.platformFee) || 0,
          serviceFeeType: formData.platformFeeType,
          description: formData.description,
          totalSold: 0,
          totalRevenue: 0,
        },
        [
          Permission.read(Role.any()),
          Permission.create(Role.team('admins')),
          Permission.update(Role.team('admins')),
          Permission.delete(Role.team('admins'))
        ]
      );

      const eventTicketId = eventTicketResponse.$id;

      for (let i = 0; i < formData.ticketTypes.length; i++) {
        const tt = formData.ticketTypes[i];
        const price = parseFloat(tt.price);
        const originalPrice = parseFloat(tt.originalPrice) || price;
        
        await appwrite.databases.createDocument(
          DB_ID,
          'event_ticket_types',
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
            benefits: tt.benefits.split('\n').filter(b => b.trim()),
            color: tt.color,
            isFeatured: tt.isFeatured,
          },
          [
            Permission.read(Role.any()),
            Permission.create(Role.team('admins')),
            Permission.update(Role.team('admins')),
            Permission.delete(Role.team('admins'))
          ]
        );
      }

      console.log('✅ Ticket configuration created successfully for external event:', eventId);
    } catch (error) {
      console.error('Error creating ticket configuration:', error);
    }
  };

  // External events state
  const [externalEvents, setExternalEvents] = useState<any[]>([]);
  const [showExternalForm, setShowExternalForm] = useState(false);
  const [editingExternalEvent, setEditingExternalEvent] = useState<any | null>(null);
  const [showTicketConfig, setShowTicketConfig] = useState(false);
  const [externalFormData, setExternalFormData] = useState<ExternalEventFormData>({
    title: '',
    description: '',
    imageUrl: '',
    externalUrl: '',
    eventDate: '',
    venue: '',
    status: 'draft',
    tags: '',
    isFeatured: false,
    enableTickets: false,
    ticketCurrency: 'KES',
    maxTicketsPerUser: '5',
    platformFee: '0',
    platformFeeType: 'fixed',
    ticketTypes: []
  });
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const externalFileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<TournamentFormData>({
    slug: '',
    gameName: '',
    title: '',
    description: '',
    detailedDescription: '',
    category: '',
    featuredImageUrl: '',
    status: 'draft',
    tournamentStatus: 'upcoming',
    registrationDeadline: '',
    startDate: '',
    endDate: '',
    currency: 'KES',
    firstPrize: 0,
    secondPrize: 0,
    thirdPrize: 0,
    fourthPrize: 0,
    showInEvents: false,
    isFeatured: false
  });

  // Game selection handler
  const handleGameSelection = (gameSlug: string) => {
    const selectedGame = gamesData[gameSlug];
    if (selectedGame) {
      setFormData(prev => ({
        ...prev,
        gameName: selectedGame.name,
        slug: selectedGame.slug
      }));
    }
  };

  const [awardFormData, setAwardFormData] = useState<AwardFormData>({
    position: 1,
    title: '',
    description: '',
    prize: 0,
    currency: 'KES'
  });

  // Fetch tournaments
  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const appwrite = initializeAppwrite();
      if (!appwrite?.databases) {
        console.warn('Appwrite not configured, skipping tournaments fetch');
        setLoading(false);
        return;
      }

      const response = await appwrite.databases.listDocuments(DB_ID, TOURNAMENTS_COLLECTION_ID);
      setTournaments(response.documents);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching tournaments:', err);
      setError(err.message || 'Failed to fetch tournaments');
    } finally {
      setLoading(false);
    }
  };

  // Fetch awards for a tournament
  const fetchAwards = async (tournamentId: string) => {
    try {
      const appwrite = initializeAppwrite();
      if (!appwrite?.databases) {
        console.warn('Appwrite not configured, skipping awards fetch');
        return;
      }

      const response = await appwrite.databases.listDocuments(
        DB_ID, 
        AWARDS_COLLECTION_ID,
        [Query.equal('tournamentId', tournamentId), Query.orderAsc('position')]
      );
      setAwards(response.documents);
    } catch (err: any) {
      console.error('Error fetching awards:', err);
      setError(err.message || 'Failed to fetch awards');
    }
  };

  useEffect(() => {
    fetchTournaments();
    fetchExternalEvents();
  }, []);

  // --- External Events Handlers ---
  const fetchExternalEvents = async () => {
    try {
      const res = await fetch('/api/external-events');
      const data = await res.json();
      if (data.success) {
        setExternalEvents(data.data);
      }
    } catch (err: any) {
      console.error('Error fetching external events:', err);
    }
  };

  const handleImageFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleExternalEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      let imageUrl = externalFormData.imageUrl;

      // Upload file to Appwrite Storage if a file was selected
      if (selectedImageFile) {
        const appwrite = initializeAppwrite();
        if (!appwrite?.storage) {
          setError('Storage not configured. Please try again.');
          setIsUploading(false);
          return;
        }
        try {
          const fileResponse = await appwrite.storage.createFile(
            BUCKET_ID,
            ID.unique(),
            selectedImageFile
          );
          imageUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileResponse.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
        } catch (uploadError) {
          console.error('Error uploading file:', uploadError);
          setError('Failed to upload image. Please try again.');
          setIsUploading(false);
          return;
        }
      }

      if (!imageUrl && !selectedImageFile) {
        setError('Please select an image file');
        setIsUploading(false);
        return;
      }

      const payload = {
        ...externalFormData,
        imageUrl,
        tags: externalFormData.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      };

      let data;
      if (editingExternalEvent) {
        const res = await fetch(`/api/external-events/${editingExternalEvent.$id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        data = await res.json();
        if (!data.success) throw new Error(data.error);
      } else {
        const res = await fetch('/api/external-events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        data = await res.json();
        if (!data.success) throw new Error(data.error);
      }

      let eventId;
      if (editingExternalEvent) {
        eventId = editingExternalEvent.$id;
      } else {
        eventId = data.data.$id;
      }

      // Create ticket configuration if enabled
      if (externalFormData.enableTickets && externalFormData.ticketTypes.length > 0) {
        await createExternalTicketConfiguration(eventId, externalFormData);
      }

      resetExternalForm();
      await fetchExternalEvents();
    } catch (err: any) {
      console.error('Error saving external event:', err);
      setError(err.message || 'Failed to save external event');
    } finally {
      setIsUploading(false);
    }
  };

  const resetExternalForm = () => {
    setExternalFormData({
      title: '',
      description: '',
      imageUrl: '',
      externalUrl: '',
      eventDate: '',
      venue: '',
      status: 'draft',
      tags: '',
      isFeatured: false,
      enableTickets: false,
      ticketCurrency: 'KES',
      maxTicketsPerUser: '5',
      platformFee: '0',
      platformFeeType: 'fixed',
      ticketTypes: []
    });
    setSelectedImageFile(null);
    setImagePreviewUrl('');
    if (externalFileInputRef.current) externalFileInputRef.current.value = '';
    setShowExternalForm(false);
    setEditingExternalEvent(null);
  };

  const handleEditExternalEvent = async (event: any) => {
    setEditingExternalEvent(event);
    
    // Load existing ticket configuration if any
    let ticketConfig = null;
    const appwrite = initializeAppwrite();
    if (appwrite?.databases) {
      try {
        const response = await appwrite.databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
          'event_tickets',
          [Query.equal('eventId', event.$id), Query.limit(1)]
        );
        if (response.documents.length > 0) {
          const et = response.documents[0];
          const typesResponse = await appwrite.databases.listDocuments(
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

    setExternalFormData({
      title: event.title || '',
      description: event.description || '',
      imageUrl: event.imageUrl || '',
      externalUrl: event.externalUrl || '',
      eventDate: event.eventDate ? event.eventDate.split('T')[0] : '',
      venue: event.venue || '',
      status: event.status || 'draft',
      tags: (event.tags || []).join(', '),
      isFeatured: event.isFeatured || false,
      enableTickets: !!ticketConfig,
      ticketCurrency: ticketConfig?.eventTicket?.currency || 'KES',
      maxTicketsPerUser: ticketConfig?.eventTicket?.maxTicketsPerUser?.toString() || '5',
      platformFee: ticketConfig?.eventTicket?.serviceFee?.toString() || '0',
      platformFeeType: ticketConfig?.eventTicket?.serviceFeeType || 'fixed',
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
      })) || []
    });
    
    if (ticketConfig) {
      setShowTicketConfig(true);
    }
    setSelectedImageFile(null);
    setImagePreviewUrl(event.imageUrl || '');
    if (externalFileInputRef.current) externalFileInputRef.current.value = '';
    setShowExternalForm(true);
  };

  const handleDeleteExternalEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this external event?')) return;
    try {
      const res = await fetch(`/api/external-events/${eventId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      await fetchExternalEvents();
    } catch (err: any) {
      console.error('Error deleting external event:', err);
      setError(err.message || 'Failed to delete external event');
    }
  };

  // Handle tournament form submission
  const handleTournamentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const appwrite = initializeAppwrite();
      if (!appwrite?.databases) {
        setError('Appwrite not configured. Please try again.');
        return;
      }

      // Calculate total prize pool
      const totalPrizePool = formData.firstPrize + formData.secondPrize + formData.thirdPrize + formData.fourthPrize;
      
      // Helper to check if string is valid URL
      const isValidUrl = (str: string) => {
        if (!str || str.trim() === '') return false;
        try {
          new URL(str);
          return true;
        } catch {
          return false;
        }
      };
      
      const tournamentData: Record<string, any> = {
        slug: formData.slug,
        gameName: formData.gameName,
        title: formData.title,
        description: formData.description,
        detailedDescription: formData.detailedDescription,
        category: formData.category,
        status: formData.status,
        tournamentStatus: formData.tournamentStatus,
        registrationDeadline: formData.registrationDeadline ? new Date(formData.registrationDeadline).toISOString() : null,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        currency: formData.currency,
        prizePool: totalPrizePool,
        showInEvents: formData.showInEvents,
        isFeatured: formData.isFeatured
      };
      
      // Only include featuredImageUrl if it's a valid URL
      if (isValidUrl(formData.featuredImageUrl)) {
        tournamentData.featuredImageUrl = formData.featuredImageUrl;
      }

      let tournamentId;

      if (editingTournament) {
        // Update existing tournament
        await appwrite.databases.updateDocument(
          DB_ID,
          TOURNAMENTS_COLLECTION_ID,
          editingTournament.$id,
          tournamentData
        );
        tournamentId = editingTournament.$id;
      } else {
        // Create new tournament
        const tournament = await appwrite.databases.createDocument(
          DB_ID,
          TOURNAMENTS_COLLECTION_ID,
          ID.unique(),
          tournamentData,
          [
            Permission.read(Role.any()),
            Permission.update(Role.users()),
            Permission.delete(Role.users())
          ]
        );
        tournamentId = tournament.$id;
      }

      // Create/Update awards for top 4 positions
      const awards = [
        { position: 1, title: 'Champion', prize: formData.firstPrize, description: 'First place winner' },
        { position: 2, title: 'Runner-up', prize: formData.secondPrize, description: 'Second place winner' },
        { position: 3, title: 'Third Place', prize: formData.thirdPrize, description: 'Third place winner' },
        { position: 4, title: 'Fourth Place', prize: formData.fourthPrize, description: 'Fourth place winner' }
      ];

      // Remove existing awards for this tournament
      const existingAwards = await appwrite.databases.listDocuments(
        DB_ID,
        AWARDS_COLLECTION_ID,
        [Query.equal('tournamentId', tournamentId)]
      );

      for (const award of existingAwards.documents) {
        await appwrite.databases.deleteDocument(DB_ID, AWARDS_COLLECTION_ID, award.$id);
      }

      // Create new awards (only if prize > 0)
      for (const award of awards) {
        if (award.prize > 0) {
          await appwrite.databases.createDocument(
            DB_ID,
            AWARDS_COLLECTION_ID,
            ID.unique(),
            {
              tournamentId,
              position: award.position,
              title: award.title,
              description: award.description,
              prize: award.prize,
              currency: formData.currency
            },
            [
              Permission.read(Role.any()),
              Permission.update(Role.users()),
              Permission.delete(Role.users())
            ]
          );
        }
      }

      // Reset form and refresh list
      resetTournamentForm();
      await fetchTournaments();
      
    } catch (err: any) {
      console.error('Error saving tournament:', err);
      setError(err.message || 'Failed to save tournament');
    }
  };

  // Handle award form submission
  const handleAwardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTournamentId) return;

    try {
      const appwrite = initializeAppwrite();
      if (!appwrite?.databases) {
        setError('Appwrite not configured. Please try again.');
        return;
      }

      await appwrite.databases.createDocument(
        DB_ID,
        AWARDS_COLLECTION_ID,
        ID.unique(),
        {
          ...awardFormData,
          tournamentId: selectedTournamentId
        },
        [
          Permission.read(Role.any()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ]
      );

      // Reset form and refresh awards
      setAwardFormData({
        position: 1,
        title: '',
        description: '',
        prize: 0,
        currency: 'KES'
      });
      await fetchAwards(selectedTournamentId);
      
    } catch (err: any) {
      console.error('Error saving award:', err);
      setError(err.message || 'Failed to save award');
    }
  };

  // Reset tournament form
  const resetTournamentForm = (hideForm = true) => {
    setFormData({
      slug: '',
      gameName: '',
      title: '',
      description: '',
      detailedDescription: '',
      category: '',
      featuredImageUrl: '',
      status: 'draft',
      tournamentStatus: 'upcoming',
      registrationDeadline: '',
      startDate: '',
      endDate: '',
      currency: 'KES',
      firstPrize: 0,
      secondPrize: 0,
      thirdPrize: 0,
      fourthPrize: 0,
      showInEvents: false,
      isFeatured: false
    });
    if (hideForm) {
      setShowForm(false);
    }
    setEditingTournament(null);
  };

  // Handle edit tournament
  const handleEditTournament = async (tournament: any) => {
    setEditingTournament(tournament);
    
    // Fetch existing awards to populate prize fields
    let firstPrize = 0, secondPrize = 0, thirdPrize = 0, fourthPrize = 0;
    
    try {
      const appwrite = initializeAppwrite();
      if (appwrite?.databases) {
        const awardsResponse = await appwrite.databases.listDocuments(
          DB_ID,
          AWARDS_COLLECTION_ID,
          [Query.equal('tournamentId', tournament.$id), Query.orderAsc('position')]
        );
        
        awardsResponse.documents.forEach((award: any) => {
          switch (award.position) {
            case 1: firstPrize = award.prize || 0; break;
            case 2: secondPrize = award.prize || 0; break;
            case 3: thirdPrize = award.prize || 0; break;
            case 4: fourthPrize = award.prize || 0; break;
          }
        });
      }
    } catch (error) {
      console.error('Error fetching awards for edit:', error);
    }
    
    setFormData({
      slug: tournament.slug || '',
      gameName: tournament.gameName || '',
      title: tournament.title || '',
      description: tournament.description || '',
      detailedDescription: tournament.detailedDescription || '',
      category: tournament.category || '',
      featuredImageUrl: tournament.featuredImageUrl || '',
      status: tournament.status || 'draft',
      tournamentStatus: tournament.tournamentStatus || 'upcoming',
      registrationDeadline: tournament.registrationDeadline ? tournament.registrationDeadline.split('T')[0] : '',
      startDate: tournament.startDate ? tournament.startDate.split('T')[0] : '',
      endDate: tournament.endDate ? tournament.endDate.split('T')[0] : '',
      currency: tournament.currency || 'KES',
      firstPrize,
      secondPrize,
      thirdPrize,
      fourthPrize,
      showInEvents: tournament.showInEvents || false,
      isFeatured: tournament.isFeatured || false
    });
    setShowForm(true);
  };

  // Handle delete tournament
  const handleDeleteTournament = async (tournamentId: string) => {
    if (!confirm('Are you sure you want to delete this tournament? This will also delete all associated awards.')) return;
    
    try {
      const appwrite = initializeAppwrite();
      if (!appwrite?.databases) {
        setError('Appwrite not configured. Please try again.');
        return;
      }

      // Delete associated awards first
      const awardsResponse = await appwrite.databases.listDocuments(
        DB_ID, 
        AWARDS_COLLECTION_ID,
        [Query.equal('tournamentId', tournamentId)]
      );
      
      for (const award of awardsResponse.documents) {
        await appwrite.databases.deleteDocument(DB_ID, AWARDS_COLLECTION_ID, award.$id);
      }

      // Delete tournament
      await appwrite.databases.deleteDocument(DB_ID, TOURNAMENTS_COLLECTION_ID, tournamentId);
      await fetchTournaments();
    } catch (err: any) {
      console.error('Error deleting tournament:', err);
      setError(err.message || 'Failed to delete tournament');
    }
  };

  // Handle delete award
  const handleDeleteAward = async (awardId: string) => {
    if (!confirm('Are you sure you want to delete this award?')) return;
    
    try {
      const appwrite = initializeAppwrite();
      if (!appwrite?.databases) {
        setError('Appwrite not configured. Please try again.');
        return;
      }

      await appwrite.databases.deleteDocument(DB_ID, AWARDS_COLLECTION_ID, awardId);
      if (selectedTournamentId) {
        await fetchAwards(selectedTournamentId);
      }
    } catch (err: any) {
      console.error('Error deleting award:', err);
      setError(err.message || 'Failed to delete award');
    }
  };

  // Handle manage awards
  const handleManageAwards = (tournament: any) => {
    setSelectedTournamentId(tournament.$id);
    setShowAwardsForm(true);
    fetchAwards(tournament.$id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8c110d] mx-auto mb-4"></div>
          <p>Loading tournaments...</p>
        </div>
      </div>
    );
  }

  // Check if user is admin
  if (!user || !profile?.isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Event & Tournament Management</h1>
          <div className="flex gap-4">
            {activeTab === 'tournaments' && (
              <>
                <Link
                  href="/admin/tournaments/rules"
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Manage Rules
                </Link>
                <button
                  onClick={() => {
                    setShowForm(true);
                    setEditingTournament(null);
                    resetTournamentForm(false);
                  }}
                  className="bg-[#8c110d] hover:bg-[#7a0f0b] px-6 py-2 rounded-lg font-semibold"
                >
                  Create Tournament
                </button>
              </>
            )}
            {activeTab === 'external' && (
              <button
                onClick={() => {
                  setEditingExternalEvent(null);
                  setExternalFormData({
                    title: '',
                    description: '',
                    imageUrl: '',
                    externalUrl: '',
                    eventDate: '',
                    venue: '',
                    status: 'draft',
                    tags: '',
                    isFeatured: false,
                    enableTickets: false,
                    ticketCurrency: 'KES',
                    maxTicketsPerUser: '5',
                    platformFee: '0',
                    platformFeeType: 'fixed',
                    ticketTypes: []
                  });
                  setSelectedImageFile(null);
                  setImagePreviewUrl('');
                  if (externalFileInputRef.current) externalFileInputRef.current.value = '';
                  setShowExternalForm(true);
                  setShowTicketConfig(false);
                }}
                className="bg-[#8c110d] hover:bg-[#7a0f0b] px-6 py-2 rounded-lg font-semibold transition-all hover:scale-105"
              >
                Create External Event
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('tournaments')}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              activeTab === 'tournaments'
                ? 'bg-[#8c110d] text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            🎮 Tournaments
          </button>
          <button
            onClick={() => setActiveTab('external')}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              activeTab === 'external'
                ? 'bg-[#8c110d] text-white shadow-lg shadow-[#8c110d]/20'
                : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            🔗 External Events
          </button>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-6">
            {error}
            <button onClick={() => setError(null)} className="ml-4 text-red-300 hover:text-white">✕</button>
          </div>
        )}

        {/* ===== TOURNAMENTS TAB ===== */}
        {activeTab === 'tournaments' && (<>

        {/* Tournament Form */}
        {showForm && (
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingTournament ? 'Edit Tournament' : 'Create New Tournament'}
            </h2>
            
            <form onSubmit={handleTournamentSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Game *</label>
                  <select
                    value={formData.slug}
                    onChange={(e) => handleGameSelection(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                    required
                  >
                    <option value="">Select a game...</option>
                    {Object.entries(gamesData).map(([slug, game]) => (
                      <option key={slug} value={slug}>
                        {game.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    Game: {formData.gameName || 'None selected'} | Slug: {formData.slug || 'None'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Game Name *</label>
                  <input
                    type="text"
                    value={formData.gameName}
                    onChange={(e) => setFormData(prev => ({ ...prev, gameName: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                    placeholder="e.g., PUBG Mobile"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                    placeholder="e.g., PUBG Mobile Championship"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                    placeholder="e.g., Battle Royale"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Tournament Status</label>
                  <select
                    value={formData.tournamentStatus}
                    onChange={(e) => setFormData(prev => ({ ...prev, tournamentStatus: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="registration_open">Registration Open</option>
                    <option value="registration_closed">Registration Closed</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Registration Deadline</label>
                  <input
                    type="date"
                    value={formData.registrationDeadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, registrationDeadline: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Currency</label>
                  <input
                    type="text"
                    value={formData.currency}
                    onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                    placeholder="e.g., KES, USD"
                  />
                </div>
              </div>

              {/* Awards Section */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Tournament Awards (Top 4 Positions)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">🥇 1st Position Prize</label>
                    <input
                      type="number"
                      value={formData.firstPrize || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstPrize: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                      min="0"
                      step="50"
                      placeholder="e.g., 25000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">🥈 2nd Position Prize</label>
                    <input
                      type="number"
                      value={formData.secondPrize || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, secondPrize: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                      min="0"
                      step="50"
                      placeholder="e.g., 15000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">🥉 3rd Position Prize</label>
                    <input
                      type="number"
                      value={formData.thirdPrize || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, thirdPrize: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                      min="0"
                      step="50"
                      placeholder="e.g., 10000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">🏅 4th Position Prize</label>
                    <input
                      type="number"
                      value={formData.fourthPrize || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, fourthPrize: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                      min="0"
                      step="50"
                      placeholder="e.g., 5000"
                    />
                  </div>
                </div>
                
                {/* Short Description Preview */}
                <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-300">Short Description Preview:</div>
                  <div className="text-sm text-white mt-2">
                    {formData.description || 'Enter a short description above to see preview here...'}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Featured Image URL</label>
                <input
                  type="url"
                  value={formData.featuredImageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, featuredImageUrl: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-400 mt-1">Image displayed in the hero section</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Short Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 h-24"
                  placeholder="Brief tournament description..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Detailed Description</label>
                <textarea
                  value={formData.detailedDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, detailedDescription: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 h-32"
                  placeholder="Detailed tournament description displayed on the information page..."
                />
              </div>

              {/* Events Page Visibility */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Events Page Visibility</h3>
                <p className="text-sm text-gray-400 mb-4">Control whether this tournament appears on the public Events page.</p>
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showInEvents}
                      onChange={(e) => setFormData(prev => ({ ...prev, showInEvents: e.target.checked }))}
                      className="w-5 h-5 rounded border-gray-600 text-[#8c110d] focus:ring-[#8c110d] bg-gray-700"
                    />
                    <div>
                      <span className="text-sm font-medium text-white">Show in Events Page</span>
                      <p className="text-xs text-gray-400">Display this tournament as an event card</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked, showInEvents: e.target.checked ? true : prev.showInEvents }))}
                      className="w-5 h-5 rounded border-gray-600 text-[#8c110d] focus:ring-[#8c110d] bg-gray-700"
                    />
                    <div>
                      <span className="text-sm font-medium text-white">Featured (Hero)</span>
                      <p className="text-xs text-gray-400">Show in the Events page hero section</p>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-[#8c110d] hover:bg-[#7a0f0b] px-6 py-2 rounded-lg font-semibold"
                >
                  {editingTournament ? 'Update Tournament' : 'Create Tournament'}
                </button>
                <button
                  type="button"
                  onClick={() => resetTournamentForm()}
                  className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Awards Management Modal */}
        {showAwardsForm && selectedTournamentId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Awards</h2>
                <button
                  onClick={() => {
                    setShowAwardsForm(false);
                    setSelectedTournamentId(null);
                    setAwards([]);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Add Award Form */}
              <form onSubmit={handleAwardSubmit} className="mb-8 p-4 bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Add New Award</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Position *</label>
                    <input
                      type="number"
                      value={awardFormData.position}
                      onChange={(e) => setAwardFormData(prev => ({ ...prev, position: parseInt(e.target.value) || 1 }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                      min="1"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <input
                      type="text"
                      value={awardFormData.title}
                      onChange={(e) => setAwardFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                      placeholder="e.g., Champion, Runner-up"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Prize Amount</label>
                    <input
                      type="number"
                      value={awardFormData.prize || ''}
                      onChange={(e) => setAwardFormData(prev => ({ ...prev, prize: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                      min="0"
                      step="50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Currency</label>
                    <input
                      type="text"
                      value={awardFormData.currency}
                      onChange={(e) => setAwardFormData(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                      placeholder="e.g., KES, USD"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={awardFormData.description}
                    onChange={(e) => setAwardFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 h-20"
                    placeholder="Award description..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="mt-4 bg-[#8c110d] hover:bg-[#7a0f0b] px-4 py-2 rounded-lg font-semibold"
                >
                  Add Award
                </button>
              </form>

              {/* Awards List */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Current Awards</h3>
                {awards.length > 0 ? (
                  <div className="space-y-3">
                    {awards.map((award) => (
                      <div key={award.$id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                          <div className="font-semibold">
                            #{award.position} - {award.title}
                          </div>
                          {award.description && (
                            <div className="text-sm text-gray-400">{award.description}</div>
                          )}
                          {award.prize > 0 && (
                            <div className="text-sm text-green-400">
                              {award.currency} {award.prize.toLocaleString()}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteAward(award.$id)}
                          className="text-red-400 hover:text-red-300 px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No awards added yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tournaments List */}
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Tournament
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Game
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Prize Pool
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Events
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {tournaments.map((tournament) => (
                  <tr key={tournament.$id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {tournament.title || tournament.gameName}
                        </div>
                        <div className="text-sm text-gray-400">/{tournament.slug}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {tournament.gameName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        tournament.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : tournament.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {tournament.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {tournament.prizePool ? `${tournament.currency || 'KES'} ${tournament.prizePool.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {tournament.showInEvents ? (
                        <span className="inline-flex items-center gap-1">
                          <span className="text-green-400">✓</span>
                          {tournament.isFeatured && <span className="text-yellow-400 ml-1">★</span>}
                        </span>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEditTournament(tournament)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Edit
                      </button>
                      
                      <button
                        onClick={() => handleDeleteTournament(tournament.$id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                      <a
                        href={`/games/${tournament.slug}/information`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {tournaments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No tournaments found. Create your first tournament!</p>
            </div>
          )}
        </div>
        </>)}

        {/* ===== EXTERNAL EVENTS TAB ===== */}
        {activeTab === 'external' && (
          <>
            {/* External Event Form */}
            {showExternalForm && (
              <div className="bg-gray-900 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">
                  {editingExternalEvent ? 'Edit External Event' : 'Create External Event'}
                </h2>
                <form onSubmit={handleExternalEventSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title *</label>
                      <input
                        type="text"
                        value={externalFormData.title}
                        onChange={(e) => setExternalFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                        placeholder="e.g., Nairobi Gaming Meetup"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">External URL *</label>
                      <input
                        type="url"
                        value={externalFormData.externalUrl}
                        onChange={(e) => setExternalFormData(prev => ({ ...prev, externalUrl: e.target.value }))}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                        placeholder="https://www.sherehe.co.ke/events/..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Event Image *</label>
                      <input
                        ref={externalFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileSelect}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-[#8c110d] file:text-white hover:file:bg-[#7a0f0b]"
                      />
                      {editingExternalEvent && externalFormData.imageUrl && !selectedImageFile && (
                        <p className="text-xs text-gray-400 mt-1">Current image will be kept unless you choose a new one.</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Venue</label>
                      <input
                        type="text"
                        value={externalFormData.venue}
                        onChange={(e) => setExternalFormData(prev => ({ ...prev, venue: e.target.value }))}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                        placeholder="e.g., KICC, Nairobi"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Event Date</label>
                      <input
                        type="date"
                        value={externalFormData.eventDate}
                        onChange={(e) => setExternalFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <select
                        value={externalFormData.status}
                        onChange={(e) => setExternalFormData(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Tags</label>
                      <input
                        type="text"
                        value={externalFormData.tags}
                        onChange={(e) => setExternalFormData(prev => ({ ...prev, tags: e.target.value }))}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                        placeholder="COMMUNITY, PARTNER (comma-separated)"
                      />
                    </div>
                    <div className="flex items-center gap-3 pt-6">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={externalFormData.isFeatured}
                          onChange={(e) => setExternalFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                          className="w-5 h-5 rounded border-gray-600 text-[#8c110d] focus:ring-[#8c110d] bg-gray-700"
                        />
                        <div>
                          <span className="text-sm font-medium text-white">Featured</span>
                          <p className="text-xs text-gray-400">Highlight this event</p>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={externalFormData.description}
                      onChange={(e) => setExternalFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 h-24"
                      placeholder="Brief event description..."
                    />
                  </div>

                  {/* Ticket Payment Configuration */}
                  <div className="border-t border-gray-700 pt-6 mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">Ticket Payment Configuration</h3>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={externalFormData.enableTickets}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setExternalFormData(prev => {
                              const next = { ...prev, enableTickets: checked };
                              if (checked && prev.ticketTypes.length === 0) {
                                next.ticketTypes = [{ ...initialTicketType }];
                              }
                              return next;
                            });
                            setShowTicketConfig(checked);
                          }}
                          className="w-5 h-5 text-[#8c110d] bg-gray-700 border-gray-600 rounded focus:ring-[#8c110d]"
                        />
                        <span className="text-sm font-medium">Enable Ticket Sales</span>
                      </label>
                    </div>

                    {externalFormData.enableTickets && (
                      <div className="space-y-6">
                        <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-blue-400 font-bold">💡 Simple Pricing</span>
                          </div>
                          <p className="text-blue-300 text-sm">
                            Set the <strong>base price</strong> per ticket type below. At checkout, the system automatically adds:
                          </p>
                          <ul className="text-blue-300 text-sm mt-2 space-y-1 list-disc list-inside">
                            <li>VAT (16% for Kenya)</li>
                            <li>Paystack transaction fee (~2.5% + KES 10)</li>
                            <li>Any platform fee you configure</li>
                          </ul>
                          <p className="text-blue-300 text-sm mt-2">
                            Attendees see the full breakdown before paying. You receive the base price minus Paystack fees.
                          </p>
                        </div>

                        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 mb-6">
                          <h4 className="font-medium text-white mb-3">💰 Price Calculator Preview (per ticket)</h4>
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                            <div className="bg-gray-700 p-3 rounded">
                              <div className="text-gray-400 text-xs">Base Price</div>
                              <div className="text-white font-bold" id="calc-base-ext">KES 0</div>
                            </div>
                            <div className="bg-gray-700 p-3 rounded">
                              <div className="text-gray-400 text-xs">+ VAT (16%)</div>
                              <div className="text-white font-bold" id="calc-vat-ext">KES 0</div>
                            </div>
                            <div className="bg-gray-700 p-3 rounded">
                              <div className="text-gray-400 text-xs">+ Platform Fee</div>
                              <div className="text-white font-bold" id="calc-fee-ext">KES 0</div>
                            </div>
                            <div className="bg-yellow-900/30 p-3 rounded border border-yellow-700">
                              <div className="text-yellow-300 text-xs">+ Paystack Fee</div>
                              <div className="text-white font-bold" id="calc-paystack-ext">KES 0</div>
                            </div>
                            <div className="bg-[#8c110d]/20 p-3 rounded border border-[#8c110d]">
                              <div className="text-yellow-300 text-xs">Attendee Pays</div>
                              <div className="text-white font-bold text-lg" id="calc-total-ext">KES 0</div>
                            </div>
                          </div>
                          <div className="mt-3 p-3 bg-gray-900/50 rounded border border-gray-700 text-xs text-gray-400">
                            You receive approximately: <span className="text-green-400" id="calc-net-ext">KES 0</span> per ticket (after Paystack fees).
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Currency</label>
                            <select
                              value={externalFormData.ticketCurrency}
                              onChange={(e) => setExternalFormData(prev => ({ ...prev, ticketCurrency: e.target.value }))}
                              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                            >
                              <option value="KES">KES (Kenyan Shilling)</option>
                              <option value="USD">USD (US Dollar)</option>
                              <option value="EUR">EUR (Euro)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Max Tickets Per User</label>
                            <input
                              type="number"
                              value={externalFormData.maxTicketsPerUser}
                              onChange={(e) => { setExternalFormData(prev => ({ ...prev, maxTicketsPerUser: e.target.value })); updateExternalPricePreview(); }}
                              placeholder="e.g., 5"
                              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Platform Fee (Optional)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={externalFormData.platformFee}
                              onChange={(e) => { setExternalFormData(prev => ({ ...prev, platformFee: e.target.value })); updateExternalPricePreview(); }}
                              placeholder="e.g., 50"
                              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Fee Type</label>
                            <select
                              value={externalFormData.platformFeeType}
                              onChange={(e) => { setExternalFormData(prev => ({ ...prev, platformFeeType: e.target.value as 'fixed' | 'percentage' })); updateExternalPricePreview(); }}
                              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                            >
                              <option value="fixed">Fixed KES per ticket</option>
                              <option value="percentage">Percentage of base price</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    <fieldset className="border border-gray-700 rounded-lg p-4">
                      <legend className="text-sm font-medium text-gray-300 mb-4">Ticket Types</legend>
                      {externalFormData.ticketTypes.map((ticketType, index) => (
                        <div key={index} className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-white">Ticket Type #{index + 1}</h4>
                            {externalFormData.ticketTypes.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeExternalTicketType(index)}
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
                                onChange={(e) => updateExternalTicketType(index, "name", e.target.value)}
                                placeholder="e.g., Standard Entry, VIP Pass"
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Color</label>
                              <input
                                type="color"
                                value={ticketType.color}
                                onChange={(e) => updateExternalTicketType(index, "color", e.target.value)}
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
                                onChange={(e) => { updateExternalTicketType(index, "price", e.target.value); updateExternalPricePreview(); }}
                                placeholder="e.g., 200"
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Original Price</label>
                              <input
                                type="number"
                                step="0.01"
                                value={ticketType.originalPrice}
                                onChange={(e) => updateExternalTicketType(index, "originalPrice", e.target.value)}
                                placeholder="e.g., 200 (for showing discount)"
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
                                onChange={(e) => updateExternalTicketType(index, "quantityTotal", e.target.value)}
                                placeholder="e.g., 32"
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Max Per Order</label>
                              <input
                                type="number"
                                value={ticketType.maxPerOrder}
                                onChange={(e) => updateExternalTicketType(index, "maxPerOrder", e.target.value)}
                                placeholder="e.g., 1"
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Min Per Order</label>
                              <input
                                type="number"
                                value={ticketType.minPerOrder}
                                onChange={(e) => updateExternalTicketType(index, "minPerOrder", e.target.value)}
                                placeholder="e.g., 1"
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                              />
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Benefits (one per line)</label>
                            <textarea
                              value={ticketType.benefits}
                              onChange={(e) => updateExternalTicketType(index, "benefits", e.target.value)}
                              rows={3}
                              placeholder="Event entry&#10;Live streaming access&#10;Discord access"
                              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Description</label>
                              <input
                                type="text"
                                value={ticketType.description}
                                onChange={(e) => updateExternalTicketType(index, "description", e.target.value)}
                                placeholder="Brief description of this ticket type"
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                              />
                            </div>
                            <div className="flex items-end">
                              <label className="flex items-center space-x-2 w-full">
                                <input
                                  type="checkbox"
                                  checked={ticketType.isFeatured}
                                  onChange={(e) => updateExternalTicketType(index, "isFeatured", e.target.checked)}
                                  className="w-4 h-4 text-[#8c110d] bg-gray-700 border-gray-600 rounded focus:ring-[#8c110d]"
                                />
                                <span className="text-sm font-medium">Featured (highlight in UI)</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                      {externalFormData.ticketTypes.length < 5 && (
                        <button
                          type="button"
                          onClick={addExternalTicketType}
                          className="w-full py-3 border-2 border-dashed border-gray-600 hover:border-[#8c110d] text-gray-400 hover:text-white font-medium rounded-lg transition-colors"
                        >
                          + Add Another Ticket Type
                        </button>
                      )}
                    </fieldset>
              </div>

                  {/* Image Preview */}
                  {(imagePreviewUrl || externalFormData.imageUrl) && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-400 mb-2">Image Preview:</p>
                      <div className="w-48 h-32 rounded overflow-hidden border border-gray-700">
                        <img
                          src={imagePreviewUrl || externalFormData.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="bg-[#8c110d] hover:bg-[#7a0f0b] disabled:bg-gray-600 px-6 py-2 rounded-lg font-semibold transition-all"
                    >
                      {isUploading ? 'Uploading...' : editingExternalEvent ? 'Update Event' : 'Create Event'}
                    </button>
                    <button
                      type="button"
                      onClick={resetExternalForm}
                      className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* External Events Table */}
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Event</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Venue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {externalEvents.map((event) => (
                      <tr key={event.$id} className="hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {event.imageUrl && (
                              <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 border border-gray-700">
                                <img src={event.imageUrl} alt="" className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-white">{event.title}</div>
                              <div className="text-xs text-gray-400 truncate max-w-[200px]">{event.externalUrl}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {event.venue || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            event.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {event.status}
                          </span>
                          {event.isFeatured && <span className="text-yellow-400 ml-2">★</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEditExternalEvent(event)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteExternalEvent(event.$id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                          <a
                            href={event.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-400 hover:text-green-300"
                          >
                            View ↗
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {externalEvents.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400">No external events found. Create your first external event!</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}