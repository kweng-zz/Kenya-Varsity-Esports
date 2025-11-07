'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Plus, Edit, Trash2, MapPin, Users, Search, Eye, X } from 'lucide-react';

interface Region {
  id: string;
  name: string;
  slug: string;
  image: string;
  isActive: boolean;
  universities: number;
  backgroundImage: string;
  description: string;
}

export default function AdminRegionsPage() {
  const { user, profile, loading } = useAuth();
  const [regions, setRegions] = useState<Region[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRegion, setNewRegion] = useState<Partial<Region>>({
    name: '',
    slug: '',
    image: '/images/Uganda.png',
    backgroundImage: '/images/Uganda.png',
    description: '',
    isActive: true
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [backgroundImagePreview, setBackgroundImagePreview] = useState<string>('');
  const [editImagePreview, setEditImagePreview] = useState<string>('');
  const [editBackgroundImagePreview, setEditBackgroundImagePreview] = useState<string>('');

  useEffect(() => {
    if (!loading && profile?.isAdmin) {
      loadRegions();
    }
  }, [loading, profile?.isAdmin]);

  const loadRegions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/admin/regions');
      const result = await response.json();

      if (result.success) {
        setRegions(result.data);
      } else {
        throw new Error(result.error || 'Failed to load regions');
      }
    } catch (error) {
      console.error('Error loading regions:', error);
      setError('Failed to load regions. Using fallback data.');
      
      // Fallback data
      const fallbackRegions: Region[] = [
        {
          id: "1",
          name: "NAIROBI",
          slug: "nairobi",
          image: "/images/Uganda.png",
          isActive: true,
          universities: 15,
          backgroundImage: "/images/nairobi-bg.jpg",
          description: "Nairobi region universities competing in KUER"
        },
        {
          id: "2",
          name: "CENTRAL KENYA",
          slug: "central-kenya",
          image: "/images/Uganda.png",
          isActive: false,
          universities: 0,
          backgroundImage: "/images/central-bg.jpg",
          description: "Central Kenya region universities"
        },
        {
          id: "3",
          name: "WESTERN KENYA",
          slug: "western-kenya",
          image: "/images/Uganda.png",
          isActive: false,
          universities: 0,
          backgroundImage: "/images/western-bg.jpg",
          description: "Western Kenya region universities"
        }
      ];
      setRegions(fallbackRegions);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRegions = regions.filter(region =>
    region.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (region: Region) => {
    setEditingRegion({ ...region });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingRegion) return;

    try {
      setIsSaving(true);
      const response = await fetch('/api/admin/regions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingRegion)
      });

      const result = await response.json();

      if (result.success) {
        setRegions(regions.map(r => r.id === editingRegion.id ? editingRegion : r));
        setShowEditModal(false);
        setEditingRegion(null);
      } else {
        setError(result.error || 'Failed to update region');
      }
    } catch (error) {
      console.error('Error saving region:', error);
      setError('Failed to save region');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (regionId: string) => {
    setDeleteConfirm(regionId);
  };

  const handleConfirmDelete = async (regionId: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch('/api/admin/regions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: regionId })
      });

      const result = await response.json();

      if (result.success) {
        setRegions(regions.filter(r => r.id !== regionId));
        setDeleteConfirm(null);
      } else {
        setError(result.error || 'Failed to delete region');
      }
    } catch (error) {
      console.error('Error deleting region:', error);
      setError('Failed to delete region');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateClick = () => {
    setNewRegion({
      name: '',
      slug: '',
      image: '/images/Uganda.png',
      backgroundImage: '/images/Uganda.png',
      description: '',
      isActive: true
    });
    setShowCreateModal(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isBackground: boolean, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      
      if (isEdit) {
        if (isBackground) {
          setEditingRegion({ ...editingRegion!, backgroundImage: base64String });
          setEditBackgroundImagePreview(base64String);
        } else {
          setEditingRegion({ ...editingRegion!, image: base64String });
          setEditImagePreview(base64String);
        }
      } else {
        if (isBackground) {
          setNewRegion({ ...newRegion, backgroundImage: base64String });
          setBackgroundImagePreview(base64String);
        } else {
          setNewRegion({ ...newRegion, image: base64String });
          setImagePreview(base64String);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCreate = async () => {
    if (!newRegion.name || !newRegion.slug) {
      setError('Region name and slug are required');
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch('/api/regions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRegion)
      });

      const result = await response.json();

      if (result.success) {
        setRegions([...regions, result.data]);
        setShowCreateModal(false);
        setNewRegion({
          name: '',
          slug: '',
          image: '/images/Uganda.png',
          backgroundImage: '/images/Uganda.png',
          description: '',
          isActive: true
        });
        setImagePreview('');
        setBackgroundImagePreview('');
      } else {
        setError(result.error || 'Failed to create region');
      }
    } catch (error) {
      console.error('Error creating region:', error);
      setError('Failed to create region');
    } finally {
      setIsSaving(false);
    }
  };

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
            <h1 className="text-4xl font-bold mb-2">Regions Management</h1>
            <p className="text-gray-400">Manage tournament regions and universities</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Back to Admin
            </Link>
            <button 
              onClick={handleCreateClick}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Region
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search regions..."
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 w-full"
            />
          </div>
          <select className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Regions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
          ) : filteredRegions.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400">No regions found</p>
            </div>
          ) : (
            filteredRegions.map((region) => (
              <div key={region.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors">
                <div 
                  className="h-32 bg-cover bg-center"
                  style={{ backgroundImage: `url(${region.backgroundImage})` }}
                >
                  <div className="h-full bg-black bg-opacity-50 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{region.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      region.isActive 
                        ? 'bg-green-900 text-green-200' 
                        : 'bg-red-900 text-red-200'
                    }`}>
                      {region.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{region.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-300">
                      <Users className="w-4 h-4 mr-1" />
                      {region.universities} universities
                    </div>
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/rankings/region/${region.slug}`}
                        className="text-blue-400 hover:text-blue-300 p-1"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleEditClick(region)}
                        className="text-yellow-400 hover:text-yellow-300 p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(region.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-yellow-900 border border-yellow-700 rounded-lg">
            <p className="text-yellow-200">{error}</p>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingRegion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-8 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Edit Region</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Region Name
                  </label>
                  <input
                    type="text"
                    value={editingRegion.name}
                    onChange={(e) => setEditingRegion({ ...editingRegion, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={editingRegion.slug}
                    onChange={(e) => setEditingRegion({ ...editingRegion, slug: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingRegion.description}
                    onChange={(e) => setEditingRegion({ ...editingRegion, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={editingRegion.image}
                    onChange={(e) => setEditingRegion({ ...editingRegion, image: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Background Image URL
                  </label>
                  <input
                    type="text"
                    value={editingRegion.backgroundImage}
                    onChange={(e) => setEditingRegion({ ...editingRegion, backgroundImage: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={editingRegion.isActive}
                    onChange={(e) => setEditingRegion({ ...editingRegion, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-600 text-red-600 focus:ring-red-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-300">
                    Active
                  </label>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 rounded-lg transition-colors text-white font-medium"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-md w-full p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4">Delete Region?</h2>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this region? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleConfirmDelete(deleteConfirm)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 rounded-lg transition-colors text-white font-medium"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Region Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-8 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Create New Region</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Region Name *
                  </label>
                  <input
                    type="text"
                    value={newRegion.name || ''}
                    onChange={(e) => setNewRegion({ ...newRegion, name: e.target.value })}
                    placeholder="e.g., NAIROBI"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={newRegion.slug || ''}
                    onChange={(e) => setNewRegion({ ...newRegion, slug: e.target.value })}
                    placeholder="e.g., nairobi"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newRegion.description || ''}
                    onChange={(e) => setNewRegion({ ...newRegion, description: e.target.value })}
                    placeholder="Region description"
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Region Image
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, false, false)}
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500 file:bg-red-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:cursor-pointer"
                    />
                  </div>
                  {imagePreview && (
                    <div className="mt-2">
                      <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Background Image
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true, false)}
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500 file:bg-red-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:cursor-pointer"
                    />
                  </div>
                  {backgroundImagePreview && (
                    <div className="mt-2">
                      <img src={backgroundImagePreview} alt="Preview" className="h-20 w-20 object-cover rounded" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="createIsActive"
                    checked={newRegion.isActive || false}
                    onChange={(e) => setNewRegion({ ...newRegion, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-600 text-red-600 focus:ring-red-500"
                  />
                  <label htmlFor="createIsActive" className="text-sm font-medium text-gray-300">
                    Active
                  </label>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCreate}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 rounded-lg transition-colors text-white font-medium"
                >
                  {isSaving ? 'Creating...' : 'Create Region'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}