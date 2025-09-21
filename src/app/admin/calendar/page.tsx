'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { CalendarEvent } from '@/lib/services/calendarService';

// Client-side calendar service for admin operations
import { Client, Databases, Query, ID } from 'appwrite';

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
}

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
  isImportant: false
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

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!user || !profile?.isAdmin)) {
      router.push('/admin');
    }
  }, [user, profile, loading, router]);

  // Fetch calendar events
  useEffect(() => {
    const fetchEvents = async () => {
      if (!user || !profile?.isAdmin) return;

      try {
        const db = initializeAppwrite();
        if (!db) {
          console.warn('Appwrite not configured, skipping calendar events fetch');
          setLoadingData(false);
          return;
        }

        const response = await db.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_CALENDAR_COLLECTION_ID || 'calendar_events',
          [Query.orderDesc('date'), Query.limit(100)]
        );

        const eventsData = response.documents.map((doc: any) => ({
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

        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching calendar events:', error);
      } finally {
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
      }

      // Reset form
      setFormData(initialFormData);
      setShowForm(false);
      setEditingEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (event: CalendarEvent) => {
    setEditingEvent(event);
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
      isImportant: event.isImportant || false
    });
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Teams (comma-separated)</label>
                    <input
                      type="text"
                      name="teams"
                      value={formData.teams}
                      onChange={handleInputChange}
                      placeholder="e.g., Team A, Team B"
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="isImportant"
                        checked={formData.isImportant}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-[#961c18] bg-gray-700 border-gray-600 rounded focus:ring-[#961c18]"
                      />
                      <span className="text-sm font-medium">Mark as Important</span>
                    </label>
                  </div>
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