'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { databases, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite';
import { ID } from 'appwrite';
import { Pencil, Trash2, Plus, Search, Filter, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { kenyanUniversities, universityHasBranches, getUniversityBranches } from '@/types/universities';

interface Ranking {
    $id: string;
    universityName: string;
    gameCategory: string | null;
    region: string;
    placementPoints: number;
    participationPoints: number;
    socialMediaPoints: number;
    bonusPoints: number;
    totalPoints: number;
    season: string;
    $createdAt: string;
    $updatedAt: string;
}

interface GameCategory {
    $id: string;
    name: string;
    slug: string;
    season: string;
}

// Region mapping for universities
const getUniversityRegion = (universityName: string): string => {
    // Nairobi region universities
    const nairobiUniversities = [
        'University Of Nairobi',
        'Kenyatta University',
        'Technical University of Kenya',
        'Strathmore University',
        'United States International University',
        'Daystar University',
        'Jomo Kenyatta University of Agriculture and Technology',
        'KCA University',
        'Zetech University',
        'Management University of Africa',
        'Multimedia University',
        'Riara University',
        'The Catholic University of Eastern Africa',
        'Africa Nazarene University',
        'Pan African Christian University',
        'Adventist University of Africa',
        'Africa International University',
        'Aga Khan University, Kenya',
        'Amref International University',
        'International Leadership University, Kenya',
        'Kiriri Women\'s University of Science and Technology',
        'Lukenya University',
        'St. Paul\'s University',
        'Tangaza University'
    ];

    // Western region universities
    const westernUniversities = [
        'Masinde Muliro University of Science and Technology',
        'Maseno University',
        'Moi University',
        'Kibabii University',
        'Kaimosi Friends University',
        'Great Lakes University of Kisumu',
        'Jaramogi Oginga Odinga University of Science and Technology',
        'Rongo University',
        'Masaai Mara University'
    ];

    // Central region universities
    const centralUniversities = [
        'Dedan Kimathi University of Technology',
        'Egerton University',
        'Karatina University',
        'Kirinyaga University',
        'Murang\'a University of Technology',
        'Chuka University',
        'Mt Kenya University',
        'Kabarak University'
    ];

    // Eastern region universities
    const easternUniversities = [
        'Meru University of Science and Technology',
        'Kenya Methodist University',
        'South Eastern Kenya University',
        'Machakos University',
        'University Of Embu',
        'Chuka University'
    ];

    // Coastal region universities
    const coastalUniversities = [
        'Technical University of Mombasa',
        'Pwani University',
        'Islamic University of Kenya',
        'Umma University'
    ];

    // Rift Valley region universities
    const riftValleyUniversities = [
        'University Of Eldoret',
        'University of Kabianga',
        'Bomet University College',
        'Laikipia University',
        'University of East African, Baraton'
    ];

    if (nairobiUniversities.includes(universityName)) return 'nairobi';
    if (westernUniversities.includes(universityName)) return 'western';
    if (centralUniversities.includes(universityName)) return 'central';
    if (easternUniversities.includes(universityName)) return 'eastern';
    if (coastalUniversities.includes(universityName)) return 'coastal';
    if (riftValleyUniversities.includes(universityName)) return 'rift-valley';
    
    return 'other'; // Default region
};

export default function AdminRankings() {
    const { user, profile, loading: authLoading } = useAuth();
    const [rankings, setRankings] = useState<Ranking[]>([]);
    const [gameCategories, setGameCategories] = useState<GameCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingRanking, setEditingRanking] = useState<Ranking | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSeason, setFilterSeason] = useState('september');
    const [filterCategory, setFilterCategory] = useState('all');

    const [formData, setFormData] = useState({
        universityName: '',
        gameCategory: '',
        region: '',
        placementPoints: 0,
        participationPoints: 0,
        socialMediaPoints: 0,
        bonusPoints: 0,
        season: 'september'
    });

    useEffect(() => {
        if (!authLoading && profile?.isAdmin) {
            fetchRankings();
            fetchGameCategories();
        }
    }, [authLoading, profile?.isAdmin, filterSeason, filterCategory]);

    const fetchRankings = async () => {
        try {
            setLoading(true);
            
            const queries = [
                Query.equal('season', filterSeason),
                Query.orderDesc('totalPoints'),
                Query.limit(100)
            ];

            if (filterCategory !== 'all') {
                if (filterCategory === 'general') {
                    queries.push(Query.isNull('gameCategory'));
                } else {
                    queries.push(Query.equal('gameCategory', filterCategory));
                }
            }

            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.RANKINGS,
                queries
            );

            setRankings(response.documents as unknown as Ranking[]);
        } catch (error) {
            console.error('Error fetching rankings:', error);
            alert('Error loading rankings. Please check your Appwrite configuration.');
        } finally {
            setLoading(false);
        }
    };

    
    const fetchGameCategories = async () => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.GAME_CATEGORIES,
                [Query.orderAsc('name'), Query.limit(100)]
            );
            setGameCategories(response.documents as unknown as GameCategory[]);
        } catch (error) {
            console.error('Error fetching game categories:', error);
        }
    };

    const calculateTotalPoints = () => {
        return formData.placementPoints + formData.participationPoints + 
               formData.socialMediaPoints + formData.bonusPoints;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.universityName) {
            alert('Please select a university');
            return;
        }

        const totalPoints = calculateTotalPoints();
        const region = formData.region || getUniversityRegion(formData.universityName);

        const rankingData = {
            universityName: formData.universityName,
            gameCategory: formData.gameCategory || null,
            region: region,
            placementPoints: formData.placementPoints,
            participationPoints: formData.participationPoints,
            socialMediaPoints: formData.socialMediaPoints,
            bonusPoints: formData.bonusPoints,
            totalPoints: totalPoints,
            season: formData.season
        };

        try {
            if (editingRanking) {
                // Update existing ranking
                await databases.updateDocument(
                    DATABASE_ID,
                    COLLECTIONS.RANKINGS,
                    editingRanking.$id,
                    rankingData
                );
                alert('Ranking updated successfully!');
            } else {
                // Create new ranking
                await databases.createDocument(
                    DATABASE_ID,
                    COLLECTIONS.RANKINGS,
                    ID.unique(),
                    rankingData
                );
                alert('Ranking created successfully!');
            }
            
            // Reset form
            resetForm();
            
            // Refresh rankings
            fetchRankings();
        } catch (error: any) {
            console.error('Error saving ranking:', error);
            alert(`Error saving ranking: ${error.message || 'Unknown error'}`);
        }
    };

    const resetForm = () => {
        setFormData({
            universityName: '',
            gameCategory: '',
            region: '',
            placementPoints: 0,
            participationPoints: 0,
            socialMediaPoints: 0,
            bonusPoints: 0,
            season: 'september'
        });
        setShowAddForm(false);
        setEditingRanking(null);
    };

    const handleEdit = (ranking: Ranking) => {
        setEditingRanking(ranking);
        setFormData({
            universityName: ranking.universityName,
            gameCategory: ranking.gameCategory || '',
            region: ranking.region,
            placementPoints: ranking.placementPoints,
            participationPoints: ranking.participationPoints,
            socialMediaPoints: ranking.socialMediaPoints,
            bonusPoints: ranking.bonusPoints,
            season: ranking.season
        });
        setShowAddForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this ranking? This action cannot be undone.')) {
            return;
        }

        try {
            await databases.deleteDocument(
                DATABASE_ID,
                COLLECTIONS.RANKINGS,
                id
            );
            alert('Ranking deleted successfully!');
            fetchRankings();
        } catch (error: any) {
            console.error('Error deleting ranking:', error);
            alert(`Error deleting ranking: ${error.message || 'Unknown error'}`);
        }
    };

    const handleDeleteAll = async () => {
        const confirmMessage = `⚠️ WARNING: DELETE ALL RANKINGS\n\nThis will permanently delete ALL ${filteredRankings.length} rankings in the current view.\n\nThis action CANNOT be undone!\n\nType "DELETE ALL" to confirm:`;
        
        const userInput = prompt(confirmMessage);
        
        if (userInput !== 'DELETE ALL') {
            if (userInput !== null) {
                alert('Deletion cancelled. You must type "DELETE ALL" exactly to confirm.');
            }
            return;
        }

        try {
            setLoading(true);
            let deletedCount = 0;
            let failedCount = 0;

            // Delete all rankings in the current filtered view
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

            alert(`Deletion complete!\n\nDeleted: ${deletedCount}\nFailed: ${failedCount}`);
            fetchRankings();
        } catch (error: any) {
            console.error('Error during bulk delete:', error);
            alert(`Error deleting rankings: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const filteredRankings = rankings.filter(ranking => 
        ranking.universityName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Loading state
    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
        );
    }

    // Unauthorized access
    if (!profile?.isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
                <p className="text-gray-600">You must be an admin to view this page.</p>
                <Link href="/admin">
                    <Button>Back to Admin</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Rankings Management</h1>
                        <p className="text-gray-600 mt-2">Manage university rankings and scores</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/admin">
                            <Button variant="outline">Back to Admin</Button>
                        </Link>
                        <Button
                            onClick={() => setShowAddForm(true)}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Ranking
                        </Button>
                    </div>
                </div>

                {/* Filters and Bulk Actions */}
                <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-semibold text-gray-700">Filters</h3>
                        {filteredRankings.length > 0 && (
                            <Button
                                onClick={handleDeleteAll}
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
                                size="sm"
                            >
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Delete All ({filteredRankings.length})
                            </Button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Search className="w-4 h-4 inline mr-1" />
                                Search University
                            </label>
                            <Input
                                type="text"
                                placeholder="Search by university name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Filter className="w-4 h-4 inline mr-1" />
                                Season
                            </label>
                            <select
                                value={filterSeason}
                                onChange={(e) => setFilterSeason(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="september">September</option>
                                <option value="january">January</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Filter className="w-4 h-4 inline mr-1" />
                                Category
                            </label>
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="all">All Categories</option>
                                <option value="general">General Ranking</option>
                                {gameCategories.map((category) => (
                                    <option key={category.$id} value={category.slug}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Add/Edit Form */}
                {showAddForm && (
                    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            {editingRanking ? 'Edit Ranking' : 'Add New Ranking'}
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    University *
                                </label>
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
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                >
                                    <option value="">Select University</option>
                                    {kenyanUniversities.map((university) => (
                                        <option key={university.id} value={university.name}>
                                            {university.name}
                                        </option>
                                    ))}
                                </select>
                                {formData.universityName && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Region: <span className="font-medium capitalize">{formData.region || getUniversityRegion(formData.universityName)}</span>
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Game Category
                                </label>
                                <select
                                    value={formData.gameCategory}
                                    onChange={(e) => setFormData({ ...formData, gameCategory: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">General Ranking</option>
                                    {gameCategories.map((category) => (
                                        <option key={category.$id} value={category.slug}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Placement Points
                                </label>
                                <Input
                                    type="number"
                                    value={formData.placementPoints}
                                    onChange={(e) => setFormData({ ...formData, placementPoints: parseInt(e.target.value) || 0 })}
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Participation Points
                                </label>
                                <Input
                                    type="number"
                                    value={formData.participationPoints}
                                    onChange={(e) => setFormData({ ...formData, participationPoints: parseInt(e.target.value) || 0 })}
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Social Media Points
                                </label>
                                <Input
                                    type="number"
                                    value={formData.socialMediaPoints}
                                    onChange={(e) => setFormData({ ...formData, socialMediaPoints: parseInt(e.target.value) || 0 })}
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bonus Points
                                </label>
                                <Input
                                    type="number"
                                    value={formData.bonusPoints}
                                    onChange={(e) => setFormData({ ...formData, bonusPoints: parseInt(e.target.value) || 0 })}
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Season *
                                </label>
                                <select
                                    value={formData.season}
                                    onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                >
                                    <option value="september">September</option>
                                    <option value="january">January</option>
                                </select>
                            </div>

                            <div className="flex items-end">
                                <div className="w-full p-3 bg-gray-100 rounded-md">
                                    <span className="text-sm text-gray-600">Total Points: </span>
                                    <span className="text-lg font-bold text-green-600">
                                        {calculateTotalPoints()}
                                    </span>
                                </div>
                            </div>

                            <div className="md:col-span-2 flex gap-4">
                                <Button type="submit" className="bg-red-600 hover:bg-red-700">
                                    {editingRanking ? 'Update Ranking' : 'Add Ranking'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Rankings Table */}
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                        </div>
                    ) : filteredRankings.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No rankings found</p>
                            <Button
                                onClick={() => setShowAddForm(true)}
                                className="mt-4 bg-red-600 hover:bg-red-700"
                            >
                                Add First Ranking
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Rank
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            University
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Region
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Placement
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Participation
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Social
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Bonus
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredRankings.map((ranking, index) => (
                                        <tr key={ranking.$id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                #{index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {ranking.universityName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                    {ranking.gameCategory || 'General'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                                {ranking.region}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {ranking.placementPoints}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {ranking.participationPoints}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {ranking.socialMediaPoints}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {ranking.bonusPoints}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                                                {ranking.totalPoints}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(ranking)}
                                                        className="text-blue-600 hover:text-blue-900 p-1"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(ranking.$id)}
                                                        className="text-red-600 hover:text-red-900 p-1"
                                                        title="Delete"
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

                {/* Summary Stats */}
                {filteredRankings.length > 0 && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg shadow-sm border p-4">
                            <p className="text-sm text-gray-600">Total Rankings</p>
                            <p className="text-2xl font-bold text-gray-900">{filteredRankings.length}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border p-4">
                            <p className="text-sm text-gray-600">Total Universities</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {new Set(filteredRankings.map(r => r.universityName)).size}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border p-4">
                            <p className="text-sm text-gray-600">Highest Score</p>
                            <p className="text-2xl font-bold text-green-600">
                                {Math.max(...filteredRankings.map(r => r.totalPoints))}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border p-4">
                            <p className="text-sm text-gray-600">Average Score</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {Math.round(filteredRankings.reduce((sum, r) => sum + r.totalPoints, 0) / filteredRankings.length)}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
