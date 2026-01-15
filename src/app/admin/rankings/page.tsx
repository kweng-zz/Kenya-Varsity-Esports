'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Plus, Edit, Trash2, Save, X, Search, Filter } from 'lucide-react';

interface RankingEntry {
    id?: string;
    rank: number;
    playerName: string;
    university: string;
    wins: number;
    losses: number;
    total: number;
    points?: number;
    image?: string;
    game?: string;
}

interface GameCategory {
    id: string;
    name: string;
    slug?: string;
}

export default function AdminRankingsPage() {
    const { profile, loading } = useAuth();
    const [categories, setCategories] = useState<GameCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [rankings, setRankings] = useState<RankingEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newRanking, setNewRanking] = useState<RankingEntry>({
        rank: 0,
        playerName: '',
        university: '',
        wins: 0,
        losses: 0,
        total: 0,
        points: 0
    });

    // Load game categories on mount
    useEffect(() => {
        if (!loading && profile?.isAdmin) {
            loadGameCategories();
        }
    }, [loading, profile?.isAdmin]);

    // Load rankings when category changes
    useEffect(() => {
        if (selectedCategory) {
            loadRankings(selectedCategory);
        }
    }, [selectedCategory]);

    // Clear success message after 3 seconds
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

            // Fetch tournaments from Appwrite to get game categories
            const { Client, Databases } = await import('appwrite');
            const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
            const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
            const dbId = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;

            console.log('Loading categories with:', { endpoint, projectId, dbId });

            if (endpoint && projectId && dbId) {
                const client = new Client()
                    .setEndpoint(endpoint)
                    .setProject(projectId);
                const databases = new Databases(client);

                try {
                    const response = await databases.listDocuments(dbId, 'tournaments');
                    const tournaments = response.documents as any[];

                    console.log('Tournaments fetched:', tournaments.length);

                    // Extract unique games
                    const uniqueGames = new Map<string, GameCategory>();
                    tournaments.forEach((tournament) => {
                        const categoryId = tournament.slug || tournament.gameName.toLowerCase().replace(/\s+/g, '-');
                        if (!uniqueGames.has(categoryId)) {
                            uniqueGames.set(categoryId, {
                                id: categoryId,
                                name: tournament.gameName,
                                slug: categoryId
                            });
                        }
                    });

                    const gamesList = Array.from(uniqueGames.values());
                    console.log('Games extracted:', gamesList.length);
                    
                    if (gamesList.length > 0) {
                        setCategories(gamesList);
                        setSelectedCategory(gamesList[0].id);
                    } else {
                        // Fallback to default games if no tournaments found
                        loadDefaultCategories();
                    }
                } catch (appwriteErr) {
                    console.error('Appwrite error:', appwriteErr);
                    // Fallback to default categories
                    loadDefaultCategories();
                }
            } else {
                console.warn('Appwrite config missing, using default categories');
                loadDefaultCategories();
            }
        } catch (err) {
            console.error('Error loading game categories:', err);
            setError('Failed to load game categories');
            loadDefaultCategories();
        } finally {
            setIsLoading(false);
        }
    };

    const loadDefaultCategories = () => {
        const defaultCategories: GameCategory[] = [
            { id: 'pubg-mobile', name: 'PUBG Mobile', slug: 'pubg-mobile' },
            { id: 'codm-multiplayer', name: 'CODM - Multiplayer', slug: 'codm-multiplayer' },
            { id: 'efootball-mobile', name: 'eFootball Mobile', slug: 'efootball-mobile' },
            { id: 'eafc-1v1', name: 'EAFC 1v1', slug: 'eafc-1v1' },
            { id: 'fighting-games', name: 'Fighting Games', slug: 'fighting-games' }
        ];
        
        setCategories(defaultCategories);
        if (defaultCategories.length > 0) {
            setSelectedCategory(defaultCategories[0].id);
        }
    };

    const loadRankings = async (categoryId: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`/api/admin/rankings?categoryId=${categoryId}`);
            const result = await response.json();

            if (result.success) {
                setRankings(result.data || []);
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

    const handleSaveRankings = async () => {
        if (!selectedCategory) {
            setError('Please select a game category');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/admin/rankings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    categoryId: selectedCategory,
                    rankings: rankings.map(r => ({
                        rank: r.rank,
                        playerName: r.playerName,
                        university: r.university,
                        wins: r.wins,
                        losses: r.losses,
                        total: r.total,
                        points: r.points || r.total,
                        image: r.image || '',
                        game: r.game || selectedCategory
                    })),
                    replaceAll: true
                })
            });

            const result = await response.json();

            if (result.success) {
                setSuccessMessage(`Successfully saved ${result.count} rankings!`);
                setShowAddForm(false);
                // Reload rankings to confirm
                await loadRankings(selectedCategory);
            } else {
                setError(result.error || 'Failed to save rankings');
            }
        } catch (err) {
            console.error('Error saving rankings:', err);
            setError('Failed to save rankings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddRanking = () => {
        const maxRank = rankings.length > 0 ? Math.max(...rankings.map(r => r.rank)) : 0;
        setNewRanking({
            rank: maxRank + 1,
            playerName: '',
            university: '',
            wins: 0,
            losses: 0,
            total: 0,
            points: 0
        });
        setShowAddForm(true);
    };

    const handleConfirmAddRanking = () => {
        if (!newRanking.playerName || !newRanking.university) {
            setError('Player name and university are required');
            return;
        }

        setRankings([...rankings, newRanking]);
        setShowAddForm(false);
        setNewRanking({
            rank: 0,
            playerName: '',
            university: '',
            wins: 0,
            losses: 0,
            total: 0,
            points: 0
        });
    };

    const handleDeleteRanking = async (index: number) => {
        const rankingToDelete = rankings[index];
        
        // If the ranking has an ID, delete it from the database
        if (rankingToDelete.id) {
            try {
                const response = await fetch(`/api/admin/rankings?rankingId=${rankingToDelete.id}`, {
                    method: 'DELETE'
                });
                
                const result = await response.json();
                
                if (!result.success) {
                    setError('Failed to delete ranking from database');
                    return;
                }
            } catch (err) {
                console.error('Error deleting ranking:', err);
                setError('Failed to delete ranking');
                return;
            }
        }
        
        // Remove from local state
        setRankings(rankings.filter((_, i) => i !== index));
    };

    const handleUpdateRanking = (index: number, field: keyof RankingEntry, value: string | number) => {
        const updated = [...rankings];
        if (field === 'rank' || field === 'wins' || field === 'losses' || field === 'total' || field === 'points') {
            updated[index][field] = typeof value === 'string' ? parseInt(value) || 0 : value;
        } else {
            updated[index][field] = value as string;
        }
        setRankings(updated);
    };

    const filteredRankings = rankings.filter(ranking =>
        ranking.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ranking.university.toLowerCase().includes(searchTerm.toLowerCase())
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
                        <h1 className="text-4xl font-bold mb-2">Game Rankings Management</h1>
                        <p className="text-gray-400">Manage rankings for each game category</p>
                    </div>
                    <Link
                        href="/admin"
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                        Back to Admin
                    </Link>
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
                </div>

                {/* Rankings Management */}
                {selectedCategory && (
                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">
                                Rankings for {categories.find(c => c.id === selectedCategory)?.name}
                            </h2>
                            <button
                                onClick={handleAddRanking}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Ranking
                            </button>
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
                                    <p className="text-gray-400">No rankings found. Add one to get started!</p>
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead className="bg-gray-700">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Rank</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Player Name</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">University</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase">Points</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase">Wins</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase">Losses</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase">Total</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {filteredRankings.map((ranking, index) => (
                                            <tr key={index} className="hover:bg-gray-700">
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        value={ranking.rank}
                                                        onChange={(e) => handleUpdateRanking(index, 'rank', e.target.value)}
                                                        className="w-16 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white"
                                                        min="1"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        value={ranking.playerName}
                                                        onChange={(e) => handleUpdateRanking(index, 'playerName', e.target.value)}
                                                        className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        value={ranking.university}
                                                        onChange={(e) => handleUpdateRanking(index, 'university', e.target.value)}
                                                        className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        value={ranking.points || ranking.total}
                                                        onChange={(e) => handleUpdateRanking(index, 'points', e.target.value)}
                                                        className="w-20 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-center"
                                                        min="0"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        value={ranking.wins}
                                                        onChange={(e) => handleUpdateRanking(index, 'wins', e.target.value)}
                                                        className="w-16 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-center"
                                                        min="0"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        value={ranking.losses}
                                                        onChange={(e) => handleUpdateRanking(index, 'losses', e.target.value)}
                                                        className="w-16 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-center"
                                                        min="0"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        value={ranking.total}
                                                        onChange={(e) => handleUpdateRanking(index, 'total', e.target.value)}
                                                        className="w-16 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-center"
                                                        min="0"
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        onClick={() => handleDeleteRanking(index)}
                                                        className="text-red-400 hover:text-red-300 p-1"
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
                        <div className="mt-6 flex gap-4 justify-end">
                            <button
                                onClick={() => loadRankings(selectedCategory)}
                                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                            >
                                Discard Changes
                            </button>
                            <button
                                onClick={handleSaveRankings}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                Save Rankings
                            </button>
                        </div>
                    </div>
                )}

                {/* Add Ranking Modal */}
                {showAddForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">Add New Ranking</h3>
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Player Name *</label>
                                    <input
                                        type="text"
                                        value={newRanking.playerName}
                                        onChange={(e) => setNewRanking({ ...newRanking, playerName: e.target.value })}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                                        placeholder="Enter player name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">University *</label>
                                    <input
                                        type="text"
                                        value={newRanking.university}
                                        onChange={(e) => setNewRanking({ ...newRanking, university: e.target.value })}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                                        placeholder="Enter university"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Wins</label>
                                        <input
                                            type="number"
                                            value={newRanking.wins}
                                            onChange={(e) => setNewRanking({ ...newRanking, wins: parseInt(e.target.value) || 0 })}
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-red-500"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Losses</label>
                                        <input
                                            type="number"
                                            value={newRanking.losses}
                                            onChange={(e) => setNewRanking({ ...newRanking, losses: parseInt(e.target.value) || 0 })}
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-red-500"
                                            min="0"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Total Points</label>
                                    <input
                                        type="number"
                                        value={newRanking.total}
                                        onChange={(e) => setNewRanking({ ...newRanking, total: parseInt(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-red-500"
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex gap-4 justify-end">
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmAddRanking}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                >
                                    Add Ranking
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
