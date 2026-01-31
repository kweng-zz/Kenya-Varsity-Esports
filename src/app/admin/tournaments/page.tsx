 'use client';

import React, { useState, useEffect } from 'react';
import { Client, Databases, ID, Permission, Role, Query } from 'appwrite';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

// Appwrite Setup with lazy initialization
let client: Client | null = null;
let databases: Databases | null = null;

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
    } catch (error) {
      console.error('Failed to initialize Appwrite client for admin tournaments:', error);
      return null;
    }
  }
  return { databases };
};

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const TOURNAMENTS_COLLECTION_ID = 'tournaments';
const AWARDS_COLLECTION_ID = 'tournament_awards';

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
  currency: string;
  // Awards for top 4 positions
  firstPrize: number;
  secondPrize: number;
  thirdPrize: number;
  fourthPrize: number;
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
    currency: 'KES',
    firstPrize: 0,
    secondPrize: 0,
    thirdPrize: 0,
    fourthPrize: 0
  });

  const [awardFormData, setAwardFormData] = useState<AwardFormData>({
    position: 1,
    title: '',
    description: '',
    prize: 0,
    currency: 'KES'
  });

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
  }, []);

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
      
      const tournamentData = {
        slug: formData.slug,
        gameName: formData.gameName,
        title: formData.title,
        description: formData.description,
        detailedDescription: formData.detailedDescription,
        category: formData.category,
        featuredImageUrl: formData.featuredImageUrl,
        status: formData.status,
        tournamentStatus: formData.tournamentStatus,
        registrationDeadline: formData.registrationDeadline ? new Date(formData.registrationDeadline).toISOString() : null,
        currency: formData.currency,
        prizePool: totalPrizePool
      };

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
      currency: 'KES',
      firstPrize: 0,
      secondPrize: 0,
      thirdPrize: 0,
      fourthPrize: 0
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
      currency: tournament.currency || 'KES',
      firstPrize,
      secondPrize,
      thirdPrize,
      fourthPrize
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

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tournament Management</h1>
          <div className="flex gap-4">
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
          </div>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Tournament Form */}
        {showForm && (
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingTournament ? 'Edit Tournament' : 'Create New Tournament'}
            </h2>
            
            <form onSubmit={handleTournamentSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                    placeholder="e.g., pubg-mobile"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">Used in URL: /games/{formData.slug}/information</p>
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
      </div>
    </div>
  );
}