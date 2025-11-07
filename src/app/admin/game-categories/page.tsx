'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, Search, Filter, X } from 'lucide-react';

interface RankingEntry {
  rank: number;
  playerName: string;
  university: string;
  points: number;
  wins: number;
  losses: number;
}

interface GameCategory {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
  isActive: boolean;
  type: 'main' | 'added';
  order: number;
  rankings?: RankingEntry[];
}

export default function AdminGameCategoriesPage() {
  const { user, profile, loading } = useAuth();
  const [categories, setCategories] = useState<GameCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingRankings, setEditingRankings] = useState<RankingEntry[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && profile?.isAdmin) {
      loadGameCategories();
    }
  }, [loading, profile?.isAdmin]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const loadGameCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Always try to fetch from Appwrite first (don't use localStorage cache)
      try {
        const { Client, Databases } = await import('appwrite');
        const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
        const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
        const dbId = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;

        console.log('Fetching tournaments from Appwrite...', { endpoint, projectId, dbId });

        if (endpoint && projectId && dbId) {
          const client = new Client()
            .setEndpoint(endpoint)
            .setProject(projectId);
          const databases = new Databases(client);

          const response = await databases.listDocuments(dbId, 'tournaments');
          const tournaments = response.documents as any[];

          console.log('Tournaments fetched:', tournaments);

          // Extract unique games from tournaments
          const uniqueGames = new Map<string, any>();
          tournaments.forEach((tournament, index) => {
            if (!uniqueGames.has(tournament.gameName)) {
              uniqueGames.set(tournament.gameName, {
                id: tournament.slug || tournament.gameName.toLowerCase().replace(/\s+/g, '-'),
                name: tournament.gameName,
                title: `${tournament.gameName.toUpperCase()} RANKINGS`,
                description: tournament.description || `Current standings for ${tournament.gameName} tournament`,
                image: tournament.featuredImageUrl || `/images/${tournament.gameName.replace(/\s+/g, '')}.png`,
                isActive: true,
                type: "main",
                order: index + 1,
                rankings: []
              });
            }
          });

          const categories = Array.from(uniqueGames.values());
          console.log('Categories created:', categories);

          if (categories.length > 0) {
            setCategories(categories);
            // Clear old cache and save new data
            localStorage.removeItem('gameCategories');
            localStorage.setItem('gameCategories', JSON.stringify(categories));
            return;
          }
        }
      } catch (appwriteError) {
        console.warn('Could not fetch from Appwrite:', appwriteError);
      }

      // Fallback: Load from localStorage if Appwrite fails
      const savedCategories = localStorage.getItem('gameCategories');
      if (savedCategories) {
        console.log('Loading from localStorage');
        setCategories(JSON.parse(savedCategories));
        return;
      }

      // Final fallback: Use default data
      console.log('Using fallback data');
      const fallbackCategories: GameCategory[] = [
        {
          id: "pubgm",
          name: "PUBG Mobile",
          title: "PUBGM RANKINGS",
          description: "Current standings for PUBGM tournament",
          image: "/images/PUBGM.jpeg",
          isActive: true,
          type: "main",
          order: 1,
          rankings: []
        },
        {
          id: "codm",
          name: "Call of Duty Mobile",
          title: "CODM RANKINGS",
          description: "Current standings for CODM tournament",
          image: "/images/CODM-BR.png",
          isActive: true,
          type: "main",
          order: 2,
          rankings: []
        },
        {
          id: "efootball",
          name: "eFootball Mobile",
          title: "EFOOTBALL RANKINGS",
          description: "Current standings for eFootball tournament",
          image: "/images/EFootball-Mobile.png",
          isActive: true,
          type: "main",
          order: 3,
          rankings: []
        }
      ];
      setCategories(fallbackCategories);
      localStorage.removeItem('gameCategories');
      localStorage.setItem('gameCategories', JSON.stringify(fallbackCategories));
    } catch (error) {
      console.error('Error loading game categories:', error);
      setError('Failed to load game categories.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRankings = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setEditingCategoryId(categoryId);
      setEditingRankings(category.rankings || []);
    }
  };

  const handleAddRankingEntry = () => {
    const newRank = editingRankings.length + 1;
    setEditingRankings([
      ...editingRankings,
      { rank: newRank, playerName: '', university: '', points: 0, wins: 0, losses: 0 }
    ]);
  };

  const handleUpdateRankingEntry = (index: number, field: keyof RankingEntry, value: string | number) => {
    const updated = [...editingRankings];
    if (field === 'rank' || field === 'points' || field === 'wins' || field === 'losses') {
      updated[index][field] = typeof value === 'string' ? parseInt(value) || 0 : value;
    } else {
      updated[index][field] = value as string;
    }
    setEditingRankings(updated);
  };

  const handleDeleteRankingEntry = (index: number) => {
    setEditingRankings(editingRankings.filter((_, i) => i !== index));
  };

  const handleSaveRankings = () => {
    if (!editingCategoryId) return;

    const updatedCategories = categories.map(cat => 
      cat.id === editingCategoryId 
        ? { ...cat, rankings: editingRankings }
        : cat
    );

    setCategories(updatedCategories);
    localStorage.setItem('gameCategories', JSON.stringify(updatedCategories));
    setSuccessMessage('Rankings updated successfully!');
    setEditingCategoryId(null);
    setEditingRankings([]);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading admin panel...
      </div>
    );
  }

  // Unauthorized access
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
            <h1 className="text-4xl font-bold mb-2">Game Categories Management</h1>
            <p className="text-gray-400">Manage your game categories and rankings</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Back to Admin
            </Link>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-600 text-white rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search categories..."
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 w-full"
            />
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No game categories found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Rankings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-750">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={category.image}
                              alt={category.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">
                              {category.name}
                            </div>
                            <div className="text-sm text-gray-400">
                              {category.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          category.type === 'main' 
                            ? 'bg-blue-900 text-blue-200' 
                            : 'bg-purple-900 text-purple-200'
                        }`}>
                          {category.type === 'main' ? 'Main Game' : 'Added Game'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {category.rankings?.length || 0} entries
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          category.isActive 
                            ? 'bg-green-900 text-green-200' 
                            : 'bg-red-900 text-red-200'
                        }`}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditRankings(category.id)}
                          className="text-yellow-400 hover:text-yellow-300 p-1 inline-flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          Edit Rankings
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-yellow-900 border border-yellow-700 rounded-lg">
            <p className="text-yellow-200">{error}</p>
          </div>
        )}
      </div>

      {/* Rankings Editor Modal */}
      {editingCategoryId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-700 px-6 py-4 flex justify-between items-center border-b border-gray-600">
              <h2 className="text-2xl font-bold">
                Edit Rankings - {categories.find(c => c.id === editingCategoryId)?.name}
              </h2>
              <button
                onClick={() => {
                  setEditingCategoryId(null);
                  setEditingRankings([]);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Rankings Table */}
              <div className="mb-6 overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-300">Rank</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-300">Player Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-300">University</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-300">Points</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-300">Wins</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-300">Losses</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-300">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {editingRankings.map((entry, index) => (
                      <tr key={index} className="hover:bg-gray-700">
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={entry.rank}
                            onChange={(e) => handleUpdateRankingEntry(index, 'rank', e.target.value)}
                            className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"
                            min="1"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={entry.playerName}
                            onChange={(e) => handleUpdateRankingEntry(index, 'playerName', e.target.value)}
                            placeholder="Player name"
                            className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={entry.university}
                            onChange={(e) => handleUpdateRankingEntry(index, 'university', e.target.value)}
                            placeholder="University"
                            className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={entry.points}
                            onChange={(e) => handleUpdateRankingEntry(index, 'points', e.target.value)}
                            className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"
                            min="0"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={entry.wins}
                            onChange={(e) => handleUpdateRankingEntry(index, 'wins', e.target.value)}
                            className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"
                            min="0"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={entry.losses}
                            onChange={(e) => handleUpdateRankingEntry(index, 'losses', e.target.value)}
                            className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"
                            min="0"
                          />
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => handleDeleteRankingEntry(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add New Entry Button */}
              <button
                onClick={handleAddRankingEntry}
                className="mb-6 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Ranking Entry
              </button>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => {
                    setEditingCategoryId(null);
                    setEditingRankings([]);
                  }}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveRankings}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  Save Rankings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
