'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import {
  Plus,
  Trash2,
  Save,
  X,
  Search,
  Upload,
  ExternalLink,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { BulkRankingsImporter } from '@/components/admin/BulkRankingsImporter';

interface RankingEntry {
  /** Appwrite document id — present for rows loaded from the database */
  id?: string;
  rank: number;
  playerName: string;
  university: string;
  points: number;
  wins: number;
  losses: number;
  image?: string;
}

interface GameCategory {
  id: string;
  name: string;
}

const emptyEntry = (rank: number): RankingEntry => ({
  rank,
  playerName: '',
  university: '',
  points: 0,
  wins: 0,
  losses: 0,
});

export default function AdminRankingsPage() {
  const { profile, loading } = useAuth();
  const [categories, setCategories] = useState<GameCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showImporter, setShowImporter] = useState(false);

  // Load game categories from the tournaments collection
  useEffect(() => {
    if (!loading && profile?.isAdmin) {
      loadGameCategories();
    }
  }, [loading, profile?.isAdmin]);

  // Load rankings when the selected category changes
  useEffect(() => {
    if (selectedCategory) {
      loadRankings(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const loadGameCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { Client, Databases, Query } = await import('appwrite');
      const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
      const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
      const dbId = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;

      if (!endpoint || !projectId || !dbId) {
        setError('Appwrite configuration is missing — cannot load game categories.');
        return;
      }

      const client = new Client().setEndpoint(endpoint).setProject(projectId);
      const databases = new Databases(client);

      const response = await databases.listDocuments(dbId, 'tournaments', [
        Query.equal('status', 'published'),
        Query.orderAsc('$createdAt'),
        Query.limit(100),
      ]);

      const uniqueGames = new Map<string, GameCategory>();
      for (const tournament of response.documents as any[]) {
        const id = tournament.slug || String(tournament.gameName || '').toLowerCase().replace(/\s+/g, '-');
        if (id && !uniqueGames.has(id)) {
          uniqueGames.set(id, { id, name: tournament.gameName || tournament.title || id });
        }
      }

      const gamesList = Array.from(uniqueGames.values());
      setCategories(gamesList);
      if (gamesList.length > 0) {
        setSelectedCategory(gamesList[0].id);
      } else {
        setError('No published tournaments found — create a tournament first, then add rankings.');
      }
    } catch (err) {
      console.error('Error loading game categories:', err);
      setError('Failed to load game categories from tournaments.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadRankings = async (categoryId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/rankings?categoryId=${encodeURIComponent(categoryId)}`);
      const result = await response.json();

      if (result.success) {
        setRankings(
          (result.data || []).map((row: any) => ({
            id: row.id,
            rank: row.rank,
            playerName: row.playerName,
            university: row.university,
            points: row.points,
            wins: row.wins,
            losses: row.losses,
            image: row.image || undefined,
          }))
        );
      } else {
        setError(result.error || 'Failed to load rankings');
      }
    } catch (err) {
      console.error('Error loading rankings:', err);
      setError('Failed to load rankings');
    } finally {
      setIsLoading(false);
    }
  };

  const validate = (): string | null => {
    for (const [index, row] of rankings.entries()) {
      if (!row.playerName.trim()) return `Row ${index + 1}: player name is required.`;
      if (!row.university.trim()) return `Row ${index + 1}: university is required.`;
    }
    return null;
  };

  const handleSave = async () => {
    if (!selectedCategory) {
      setError('Please select a game category');
      return;
    }

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (rankings.length === 0) {
      const categoryName = categories.find((c) => c.id === selectedCategory)?.name || selectedCategory;
      const confirmed = window.confirm(
        `This will remove ALL ranking entries for ${categoryName}. Continue?`
      );
      if (!confirmed) return;
    }

    try {
      setIsSaving(true);
      setError(null);

      // Sort by rank before saving so the stored order is stable
      const sorted = [...rankings].sort((a, b) => a.rank - b.rank);
      setRankings(sorted);

      const response = await fetch('/api/admin/rankings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: selectedCategory,
          rankings: sorted.map((r) => ({
            id: r.id,
            rank: r.rank,
            playerName: r.playerName.trim(),
            university: r.university.trim(),
            points: r.points,
            wins: r.wins,
            losses: r.losses,
            image: r.image || '',
          })),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage(result.message || `Saved ${result.count} entries`);
        await loadRankings(selectedCategory);
      } else {
        setError(result.error || 'Failed to save rankings');
      }
    } catch (err) {
      console.error('Error saving rankings:', err);
      setError('Failed to save rankings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddRanking = () => {
    const maxRank = rankings.length > 0 ? Math.max(...rankings.map((r) => r.rank)) : 0;
    setRankings([...rankings, emptyEntry(maxRank + 1)]);
  };

  const handleDeleteRanking = (index: number) => {
    const row = rankings[index];
    if (row.playerName) {
      const confirmed = window.confirm(
        `Remove ${row.playerName} from the list? The change is published when you save.`
      );
      if (!confirmed) return;
    }
    setRankings(rankings.filter((_, i) => i !== index));
  };

  const handleUpdateRanking = (
    index: number,
    field: 'rank' | 'playerName' | 'university' | 'points' | 'wins' | 'losses',
    value: string
  ) => {
    const updated = [...rankings];
    if (field === 'playerName' || field === 'university') {
      updated[index][field] = value;
    } else {
      updated[index][field] = parseInt(value, 10) || 0;
    }
    setRankings(updated);
  };

  const handleBulkImport = (entries: {
    rank: number;
    playerName: string;
    university: string;
    wins: number;
    losses: number;
    points: number;
    image?: string;
  }[]) => {
    setRankings(
      entries.map((entry) => ({
        rank: entry.rank,
        playerName: entry.playerName,
        university: entry.university,
        points: entry.points,
        wins: entry.wins,
        losses: entry.losses,
        image: entry.image,
      }))
    );
    setShowImporter(false);
    setSuccessMessage(
      `Imported ${entries.length} entries into the editor — click "Save Rankings" to publish them.`
    );
  };

  const filteredRankings = useMemo(
    () =>
      rankings
        .map((row, originalIndex) => ({ row, originalIndex }))
        .filter(
          ({ row }) =>
            row.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.university.toLowerCase().includes(searchTerm.toLowerCase())
        ),
    [rankings, searchTerm]
  );

  const selectedGameName = categories.find((c) => c.id === selectedCategory)?.name;

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
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Game Rankings Management</h1>
            <p className="text-gray-400">
              Manage the player standings shown on the public <span className="text-gray-200 font-semibold">/rankings</span> page.
            </p>
          </div>
          <div className="flex gap-3">
            {selectedCategory && (
              <a
                href={`/rankings?game=${encodeURIComponent(selectedCategory)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View Public Page
              </a>
            )}
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
          <div className="mb-6 p-4 bg-green-600 text-white rounded-lg flex justify-between items-center">
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-600 text-white rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Category Selection */}
        <div className="mb-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Select Game Category</h2>
          {categories.length === 0 ? (
            <p className="text-gray-400">
              No published tournaments found. Rankings are organized per game title — create a
              tournament first.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-lg font-semibold transition-all ${
                    selectedCategory === category.id
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Rankings Management */}
        {selectedCategory && (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold">
                Rankings for {selectedGameName}
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowImporter(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Bulk Import
                </button>
                <button
                  onClick={handleAddRanking}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Entry
                </button>
              </div>
            </div>

            {/* Info note */}
            <div className="mb-6 flex items-start gap-3 p-4 bg-gray-700/50 border border-gray-600 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300">
                Entries appear on the public rankings page exactly as shown here — rank, player,
                university, points, wins and losses. Players on the board are ordered by rank.
              </p>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by player name or university..."
                  className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 w-full"
                />
              </div>
            </div>

            {/* Rankings Table */}
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                </div>
              ) : filteredRankings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">
                    {rankings.length === 0
                      ? 'No rankings yet for this game. Add entries or use Bulk Import.'
                      : 'No entries match your search.'}
                  </p>
                </div>
              ) : (
                <table className="w-full min-w-[720px]">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase w-20">Rank</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Player Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">University</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase w-24">Points</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase w-20">Wins</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase w-20">Losses</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase w-20">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredRankings.map(({ row, originalIndex }) => (
                      <tr key={row.id || `new-${originalIndex}`} className="hover:bg-gray-700">
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={row.rank}
                            onChange={(e) => handleUpdateRanking(originalIndex, 'rank', e.target.value)}
                            className="w-16 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white"
                            min="1"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={row.playerName}
                            onChange={(e) => handleUpdateRanking(originalIndex, 'playerName', e.target.value)}
                            placeholder="Player name"
                            className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={row.university}
                            onChange={(e) => handleUpdateRanking(originalIndex, 'university', e.target.value)}
                            placeholder="University"
                            className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={row.points}
                            onChange={(e) => handleUpdateRanking(originalIndex, 'points', e.target.value)}
                            className="w-20 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-center"
                            min="0"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={row.wins}
                            onChange={(e) => handleUpdateRanking(originalIndex, 'wins', e.target.value)}
                            className="w-16 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-center"
                            min="0"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={row.losses}
                            onChange={(e) => handleUpdateRanking(originalIndex, 'losses', e.target.value)}
                            className="w-16 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-center"
                            min="0"
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDeleteRanking(originalIndex)}
                            className="text-red-400 hover:text-red-300 p-1"
                            title="Remove entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-4 justify-end">
              <button
                onClick={() => loadRankings(selectedCategory)}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4" />
                Discard Changes
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Rankings'}
              </button>
            </div>
          </div>
        )}

        {/* Bulk Import Modal */}
        {showImporter && (
          <BulkRankingsImporter onImport={handleBulkImport} onClose={() => setShowImporter(false)} />
        )}
      </div>
    </div>
  );
}
