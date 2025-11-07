'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Plus, Edit, Trash2, X, Search } from 'lucide-react';

interface GameCategory {
  slug: string;
  name: string;
  id?: string;
}

interface University {
  id: string;
  name: string;
  [key: string]: any;
}

interface RegionalRanking {
  $id?: string;
  region: string;
  image: string;
  universities: University[];
}

export default function AdminRegionalRankingsPage() {
  const { user, profile, loading } = useAuth();
  const [rankings, setRankings] = useState<RegionalRanking[]>([]);
  const [gameCategories, setGameCategories] = useState<GameCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRanking, setEditingRanking] = useState<RegionalRanking | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    region: '',
    image: '',
    universities: [] as University[]
  });

  useEffect(() => {
    if (!loading && profile?.isAdmin) {
      loadData();
    }
  }, [loading, profile?.isAdmin]);

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
        } else {
          console.warn('No game categories found in API response');
          setGameCategories([]);
        }
      } catch (err) {
        console.error('❌ Failed to load game categories:', err);
        setGameCategories([]);
      }

      // Load regional rankings
      const response = await fetch('/api/admin/regional-rankings');
      const result = await response.json();
      
      if (result.success) {
        const typedDocuments = result.data.map((doc: any) => {
          let universities = [];
          if (doc.universities) {
            if (typeof doc.universities === 'string') {
              try {
                universities = JSON.parse(doc.universities);
              } catch (e) {
                universities = [];
              }
            } else if (Array.isArray(doc.universities)) {
              universities = doc.universities;
            }
          }
          
          return {
            $id: doc.$id,
            region: doc.region || '',
            image: doc.image || '',
            universities
          };
        }) as RegionalRanking[];
        
        setRankings(typedDocuments);
      } else {
        setError(result.error || 'Failed to load rankings');
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load rankings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData({ ...formData, image: base64String });
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleAddUniversity = () => {
    const newUni: University = {
      id: Date.now().toString(),
      name: ''
    };
    
    // Add all game categories with 0 value
    gameCategories.forEach(cat => {
      newUni[cat.slug] = 0;
    });

    setFormData({
      ...formData,
      universities: [...formData.universities, newUni]
    });
  };

  const handleUpdateUniversity = (index: number, field: string, value: any) => {
    const updated = [...formData.universities];
    const uni = updated[index];

    if (field === 'name') {
      uni.name = value;
    } else {
      const numValue = parseInt(value) || 0;
      uni[field] = numValue;
    }

    setFormData({ ...formData, universities: updated });
  };

  const handleRemoveUniversity = (index: number) => {
    setFormData({
      ...formData,
      universities: formData.universities.filter((_, i) => i !== index)
    });
  };

  const handleSave = async () => {
    if (!formData.region || formData.universities.length === 0) {
      setError('Region name and at least one university are required');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      
      if (editingRanking && editingRanking.$id) {
        // Update existing
        const response = await fetch(`/api/admin/regional-rankings/${editingRanking.$id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            region: formData.region,
            image: formData.image,
            universities: formData.universities
          })
        });
        
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || 'Failed to update ranking');
        }
      } else {
        // Add new
        const response = await fetch('/api/admin/regional-rankings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            region: formData.region,
            image: formData.image,
            universities: formData.universities
          })
        });
        
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || 'Failed to create ranking');
        }
      }
      
      // Reload rankings
      await loadData();
      
      // Reset form
      setFormData({ region: '', image: '', universities: [] });
      setImagePreview('');
      setShowAddModal(false);
      setShowEditModal(false);
      setEditingRanking(null);
    } catch (err) {
      console.error('Error saving ranking:', err);
      setError(err instanceof Error ? err.message : 'Failed to save ranking');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (ranking: RegionalRanking) => {
    setFormData({
      region: ranking.region,
      image: ranking.image,
      universities: [...ranking.universities]
    });
    setImagePreview(ranking.image);
    setEditingRanking(ranking);
    setShowEditModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ranking?')) return;
    
    try {
      const response = await fetch(`/api/admin/regional-rankings/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete ranking');
      }
      
      await loadData();
    } catch (err) {
      console.error('Error deleting ranking:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete ranking');
    }
  };

  const filteredRankings = rankings.filter(r =>
    r.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUniversityTotal = (uni: University) => {
    let total = 0;
    gameCategories.forEach(cat => {
      const score = uni[cat.slug] || 0;
      total += typeof score === 'number' ? score : 0;
    });
    return total;
  };

  if (loading) {
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
            <h1 className="text-4xl font-bold mb-2">Regional Rankings Management</h1>
            <p className="text-gray-400">Manage rankings and images for each region</p>
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
                setFormData({ region: '', image: '', universities: [] });
                setImagePreview('');
                setEditingRanking(null);
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Regional Ranking
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search regions..."
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 w-full"
            />
          </div>
        </div>

        {/* Rankings List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
          ) : filteredRankings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No regional rankings found</p>
            </div>
          ) : (
            filteredRankings.map((ranking) => (
              <div key={ranking.$id} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-4 flex-1">
                    {ranking.image && (
                      <img 
                        src={ranking.image} 
                        alt={ranking.region}
                        className="w-24 h-24 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{ranking.region}</h3>
                      <p className="text-gray-400">{ranking.universities.length} universities</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(ranking)}
                      className="text-yellow-400 hover:text-yellow-300 p-2"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    {ranking.$id && (
                      <button
                        onClick={() => handleDelete(ranking.$id!)}
                        className="text-red-400 hover:text-red-300 p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Universities Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="text-left py-2 px-2">University</th>
                        {gameCategories.map(cat => (
                          <th key={cat.slug} className="text-center py-2 px-2">
                            {cat.name.toUpperCase()}
                          </th>
                        ))}
                        <th className="text-center py-2 px-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ranking.universities.map((uni, idx) => (
                        <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700/50">
                          <td className="py-2 px-2">{uni.name}</td>
                          {gameCategories.map(cat => (
                            <td key={cat.slug} className="text-center py-2 px-2">
                              {uni[cat.slug] || 0}
                            </td>
                          ))}
                          <td className="text-center py-2 px-2 font-bold text-green-400">
                            {getUniversityTotal(uni)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-900 border border-red-700 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Add/Edit Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-4xl w-full p-8 border border-gray-700 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingRanking ? 'Edit Regional Ranking' : 'Add Regional Ranking'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setEditingRanking(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Region Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Region Name *
                  </label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    placeholder="e.g., NAIROBI"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Region Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500 file:bg-red-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:cursor-pointer"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded" />
                    </div>
                  )}
                </div>

                {/* Universities */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-300">
                      Universities * ({gameCategories.length} game categories)
                    </label>
                    <button
                      onClick={handleAddUniversity}
                      className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add University
                    </button>
                  </div>

                  {gameCategories.length === 0 ? (
                    <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-4">
                      <p className="text-yellow-400 text-sm">⚠️ No game categories loaded. Please ensure tournaments are configured in the database.</p>
                    </div>
                  ) : null}

                  <div className="space-y-3">
                    {formData.universities.map((uni, idx) => (
                      <div key={uni.id} className="bg-gray-700 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
                          <input
                            type="text"
                            value={uni.name}
                            onChange={(e) => handleUpdateUniversity(idx, 'name', e.target.value)}
                            placeholder="University name"
                            className="lg:col-span-2 px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:border-red-500"
                          />
                          {gameCategories.map(cat => (
                            <input
                              key={cat.slug}
                              type="number"
                              value={uni[cat.slug] || 0}
                              onChange={(e) => handleUpdateUniversity(idx, cat.slug, e.target.value)}
                              placeholder={cat.name}
                              title={cat.name}
                              className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:border-red-500"
                            />
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">
                            Total: <span className="font-bold text-green-400">
                              {getUniversityTotal(uni)}
                            </span>
                          </span>
                          <button
                            onClick={() => handleRemoveUniversity(idx)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setEditingRanking(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 rounded-lg transition-colors text-white font-medium"
                >
                  {isSaving ? 'Saving...' : 'Save Ranking'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
