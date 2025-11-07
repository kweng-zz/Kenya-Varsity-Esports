'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Plus, Edit, Trash2, X, Search, AlertTriangle } from 'lucide-react';
import { databases, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite';
import { ID } from 'appwrite';
import { kenyanUniversities } from '@/types/universities';

interface GameCategory {
  slug: string;
  name: string;
  id?: string;
}

interface Ranking {
  $id: string;
  universityName: string;
  region: string;
  season: string;
  [key: string]: any;
}

// Region mapping for universities
const getUniversityRegion = (universityName: string): string => {
  const nairobiUniversities = [
    'University Of Nairobi', 'Kenyatta University', 'Technical University of Kenya',
    'Strathmore University', 'United States International University', 'Daystar University',
    'Jomo Kenyatta University of Agriculture and Technology', 'KCA University', 'Zetech University',
    'Management University of Africa', 'Multimedia University', 'Riara University',
    'The Catholic University of Eastern Africa', 'Africa Nazarene University',
    'Pan African Christian University', 'Adventist University of Africa',
    'Africa International University', 'Aga Khan University, Kenya', 'Amref International University',
    'International Leadership University, Kenya', 'Kiriri Women\'s University of Science and Technology',
    'Lukenya University', 'St. Paul\'s University', 'Tangaza University'
  ];

  const westernUniversities = [
    'Masinde Muliro University of Science and Technology', 'Maseno University', 'Moi University',
    'Kibabii University', 'Kaimosi Friends University', 'Great Lakes University of Kisumu',
    'Jaramogi Oginga Odinga University of Science and Technology', 'Rongo University', 'Masaai Mara University'
  ];

  const centralUniversities = [
    'Dedan Kimathi University of Technology', 'Egerton University', 'Karatina University',
    'Kirinyaga University', 'Murang\'a University of Technology', 'Chuka University',
    'Mt Kenya University', 'Kabarak University'
  ];

  const easternUniversities = [
    'Meru University of Science and Technology', 'Kenya Methodist University',
    'South Eastern Kenya University', 'Machakos University', 'University Of Embu', 'Chuka University'
  ];

  const coastalUniversities = [
    'Technical University of Mombasa', 'Pwani University', 'Islamic University of Kenya', 'Umma University'
  ];

  const riftValleyUniversities = [
    'University Of Eldoret', 'University of Kabianga', 'Bomet University College',
    'Laikipia University', 'University of East African, Baraton'
  ];

  if (nairobiUniversities.includes(universityName)) return 'nairobi';
  if (westernUniversities.includes(universityName)) return 'western';
  if (centralUniversities.includes(universityName)) return 'central';
  if (easternUniversities.includes(universityName)) return 'eastern';
  if (coastalUniversities.includes(universityName)) return 'coastal';
  if (riftValleyUniversities.includes(universityName)) return 'rift-valley';
  
  return 'other';
};

export default function AdminRankings() {
  const { user, profile, loading: authLoading } = useAuth();
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [gameCategories, setGameCategories] = useState<GameCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeason, setFilterSeason] = useState('september');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRanking, setEditingRanking] = useState<Ranking | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<{
    universityName: string;
    region: string;
    season: string;
    [key: string]: any;
  }>({
    universityName: '',
    region: '',
    season: 'september'
  });

  useEffect(() => {
    if (!authLoading && profile?.isAdmin) {
      loadData();
    }
  }, [authLoading, profile?.isAdmin]);

  useEffect(() => {
    if (!authLoading && profile?.isAdmin) {
      loadRankings();
    }
  }, [filterSeason]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load game categories from tournaments database
      try {
        const tournamentsResponse = await fetch('/api/rankings/categories');
        const tournamentsResult = await tournamentsResponse.json();
        
        if (tournamentsResult.success && tournamentsResult.data) {
          const allCategories = new Map<string, GameCategory>();
          
          const addCategories = (categoryList: any[]) => {
            if (Array.isArray(categoryList)) {
              categoryList.forEach((cat: any) => {
                if (cat.id && !allCategories.has(cat.id)) {
                  allCategories.set(cat.id, {
                    slug: cat.id,
                    name: cat.name || cat.title || '',
                    id: cat.id
                  });
                }
              });
            }
          };

          if (tournamentsResult.data.septemberMain) addCategories(tournamentsResult.data.septemberMain);
          if (tournamentsResult.data.septemberAdded) addCategories(tournamentsResult.data.septemberAdded);
          if (tournamentsResult.data.januaryMain) addCategories(tournamentsResult.data.januaryMain);
          if (tournamentsResult.data.januaryAdded) addCategories(tournamentsResult.data.januaryAdded);

          const categories = Array.from(allCategories.values());
          setGameCategories(categories);
          console.log('✅ Loaded game categories:', categories);
        }
      } catch (err) {
        console.error('❌ Failed to load game categories:', err);
        setGameCategories([]);
      }

      await loadRankings();
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadRankings = async () => {
    try {
      const queries = [
        Query.equal('season', filterSeason),
        Query.orderDesc('total'),
        Query.limit(100)
      ];

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.RANKINGS,
        queries
      );

      setRankings(response.documents as unknown as Ranking[]);
    } catch (err) {
      console.error('Error loading rankings:', err);
      setError('Failed to load rankings');
    }
  };

  const calculateTotal = () => {
    let total = 0;
    gameCategories.forEach(cat => {
      const score = formData[cat.slug] || 0;
      total += typeof score === 'number' ? score : 0;
    });
    return total;
  };

  const handleSave = async () => {
    if (!formData.universityName) {
      setError('Please select a university');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const total = calculateTotal();
      const region = formData.region || getUniversityRegion(formData.universityName);
      
      // Generate universityId from university name (convert to lowercase and replace spaces with hyphens)
      const universityId = formData.universityName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      // Calculate rank based on total score (will be updated after save)
      const rank = 0;
      const now = new Date().toISOString();

      const rankingData: any = {
        universityId: universityId,
        universityName: formData.universityName,
        region: region,
        season: formData.season,
        rank: rank,
        placementPoints: 0,
        participationPoints: 0,
        socialMediaPoints: 0,
        bonusPoints: 0,
        totalPoints: total,
        createdAt: now,
        updatedAt: now
      };

      if (editingRanking) {
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.RANKINGS,
          editingRanking.$id,
          rankingData
        );
      } else {
        await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.RANKINGS,
          ID.unique(),
          rankingData
        );
      }

      await loadRankings();
      resetForm();
    } catch (err) {
      console.error('Error saving ranking:', err);
      setError(err instanceof Error ? err.message : 'Failed to save ranking');
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    const newFormData: any = {
      universityName: '',
      region: '',
      season: 'september'
    };
    gameCategories.forEach(cat => {
      newFormData[cat.slug] = 0;
    });
    setFormData(newFormData);
    setShowAddModal(false);
    setEditingRanking(null);
  };

  const handleEdit = (ranking: Ranking) => {
    setEditingRanking(ranking);
    const newFormData: any = {
      universityName: ranking.universityName,
      region: ranking.region,
      season: ranking.season
    };
    gameCategories.forEach(cat => {
      newFormData[cat.slug] = ranking[cat.slug] || 0;
    });
    setFormData(newFormData);
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ranking?')) return;

    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.RANKINGS,
        id
      );
      await loadRankings();
    } catch (err) {
      console.error('Error deleting ranking:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete ranking');
    }
  };

  const handleDeleteAll = async () => {
    const confirmMessage = `⚠️ WARNING: DELETE ALL RANKINGS\n\nThis will permanently delete ALL ${filteredRankings.length} rankings in the current view.\n\nThis action CANNOT be undone!\n\nType "DELETE ALL" to confirm:`;
    
    const userInput = prompt(confirmMessage);
    
    if (userInput !== 'DELETE ALL') {
      if (userInput !== null) {
        setError('Deletion cancelled. You must type "DELETE ALL" exactly to confirm.');
      }
      return;
    }

    try {
      setIsLoading(true);
      let deletedCount = 0;
      let failedCount = 0;

      for (const ranking of filteredRankings) {
        try {
          await databases.deleteDocument(
            DATABASE_ID,
            COLLECTIONS.RANKINGS,
            ranking.$id
          );
          deletedCount++;
        } catch (error) {
          console.error(`Failed to delete ranking ${ranking.$id}:`, error);
          failedCount++;
        }
      }

      setError(`Deletion complete! Deleted: ${deletedCount}, Failed: ${failedCount}`);
      await loadRankings();
    } catch (err) {
      console.error('Error during bulk delete:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete rankings');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRankings = rankings.filter(ranking => 
    ranking.universityName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading admin panel...
      </div>
    );
  }

  if (!profile?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white gap-4">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p>You must be an admin to view this page.</p>
        <Link href="/admin" className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
          Back to Admin
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Rankings Management</h1>
            <p className="text-gray-400">Manage university rankings and scores for each season</p>
            {gameCategories.length > 0 && (
              <p className="text-sm text-green-400 mt-2">✅ {gameCategories.length} game categories loaded</p>
            )}
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Back to Admin
            </Link>
            <button 
              onClick={() => {
                const newFormData: any = {
                  universityName: '',
                  region: '',
                  season: 'september'
                };
                gameCategories.forEach(cat => {
                  newFormData[cat.slug] = 0;
                });
                setFormData(newFormData);
                setEditingRanking(null);
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Ranking
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Search className="w-4 h-4 inline mr-2" />
                Search University
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by university name..."
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Season</label>
              <select
                value={filterSeason}
                onChange={(e) => setFilterSeason(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
              >
                <option value="september">September</option>
                <option value="january">January</option>
              </select>
            </div>
            <div className="flex items-end">
              {filteredRankings.length > 0 && (
                <button
                  onClick={handleDeleteAll}
                  className="w-full px-4 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-600/50 text-red-400 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Delete All ({filteredRankings.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-8 border border-gray-700 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingRanking ? 'Edit Ranking' : 'Add New Ranking'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">University *</label>
                    <select
                      value={formData.universityName}
                      onChange={(e) => {
                        const selectedName = e.target.value;
                        const region = getUniversityRegion(selectedName);
                        setFormData({ 
                          ...formData, 
                          universityName: selectedName,
                          region: region
                        });
                      }}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="">Select University</option>
                      {kenyanUniversities.map((university) => (
                        <option key={university.id} value={university.name}>
                          {university.name}
                        </option>
                      ))}
                    </select>
                    {formData.universityName && (
                      <p className="text-xs text-gray-400 mt-1">
                        Region: <span className="font-medium capitalize">{formData.region}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Season *</label>
                    <select
                      value={formData.season}
                      onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="september">September</option>
                      <option value="january">January</option>
                    </select>
                  </div>
                </div>

                {/* Game Category Scores */}
                <div className="border-t border-gray-700 pt-4">
                  <h3 className="text-sm font-medium text-gray-300 mb-4">Game Category Scores</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {gameCategories.map(cat => (
                      <div key={cat.slug}>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          {cat.name}
                        </label>
                        <input
                          type="number"
                          value={formData[cat.slug] || 0}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            [cat.slug]: parseInt(e.target.value) || 0 
                          })}
                          min="0"
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg flex items-center justify-between border border-gray-600">
                  <span className="text-sm text-gray-300">Total Points:</span>
                  <span className="text-2xl font-bold text-green-400">{calculateTotal()}</span>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 rounded-lg transition-colors text-white font-medium"
                >
                  {isSaving ? 'Saving...' : editingRanking ? 'Update Ranking' : 'Add Ranking'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rankings Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
          ) : filteredRankings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No rankings found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">Rank</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">University</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">Region</th>
                    <th className="text-center py-3 px-4 text-gray-300 font-semibold">Total Points</th>
                    <th className="text-right py-3 px-4 text-gray-300 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRankings.map((ranking, index) => (
                    <tr key={ranking.$id} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="py-3 px-4 text-white font-bold">#{index + 1}</td>
                      <td className="py-3 px-4 text-white">{ranking.universityName}</td>
                      <td className="py-3 px-4 text-gray-300 capitalize">{ranking.region}</td>
                      <td className="text-center py-3 px-4 text-green-400 font-bold">{ranking.totalPoints || 0}</td>
                      <td className="text-right py-3 px-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(ranking)}
                            className="text-yellow-400 hover:text-yellow-300 p-1 hover:bg-gray-700 rounded"
                            title="Edit ranking"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(ranking.$id)}
                            className="text-red-400 hover:text-red-300 p-1 hover:bg-gray-700 rounded"
                            title="Delete ranking"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-900 border border-red-700 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Summary Stats */}
        {filteredRankings.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
              <p className="text-sm text-gray-400">Total Rankings</p>
              <p className="text-2xl font-bold text-white">{filteredRankings.length}</p>
            </div>
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
              <p className="text-sm text-gray-400">Total Universities</p>
              <p className="text-2xl font-bold text-white">
                {new Set(filteredRankings.map(r => r.universityName)).size}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
              <p className="text-sm text-gray-400">Highest Score</p>
              <p className="text-2xl font-bold text-green-400">
                {Math.max(...filteredRankings.map(r => r.total || 0))}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
              <p className="text-sm text-gray-400">Average Score</p>
              <p className="text-2xl font-bold text-blue-400">
                {Math.round(filteredRankings.reduce((sum, r) => sum + (r.total || 0), 0) / filteredRankings.length)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
