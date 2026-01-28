'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Plus, Edit, Trash2, ExternalLink, Search, Award, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Sponsor {
  $id?: string;
  name: string;
  logo: string;
  website: string;
  isActive: boolean;
  order: number;
  tier: string;
}

export default function AdminSponsorsPage() {
  const { user, profile, loading } = useAuth();
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSponsor, setCurrentSponsor] = useState<Partial<Sponsor>>({
    name: '',
    logo: '',
    website: '',
    isActive: true,
    order: 0,
    tier: 'partner'
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && profile?.isAdmin) {
      loadSponsors();
    }
  }, [loading, profile?.isAdmin]);

  const loadSponsors = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/admin/sponsors');
      const result = await response.json();

      if (result.success) {
        setSponsors(result.data || []);
      } else {
        throw new Error(result.error || 'Failed to load sponsors');
      }
    } catch (error: any) {
      console.error('Error loading sponsors:', error);
      setError(error.message || 'Failed to load sponsors');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucketId', 'season-images'); // Reusing existing bucket

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setCurrentSponsor({ ...currentSponsor, logo: result.data.url });
      } else {
        alert('Upload failed: ' + result.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSponsor.name || !currentSponsor.logo) {
      alert('Name and Logo are required');
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch('/api/admin/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentSponsor),
      });

      const result = await response.json();
      if (result.success) {
        setIsModalOpen(false);
        loadSponsors();
      } else {
        alert('Save failed: ' + result.error);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sponsor?')) return;

    try {
      const response = await fetch(`/api/admin/sponsors?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        loadSponsors();
      } else {
        alert('Delete failed: ' + result.error);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Delete failed');
    }
  };

  const filteredSponsors = (sponsors || []).filter(sponsor =>
    sponsor.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1 className="text-4xl font-bold mb-2 text-[#961c18]">Sponsors Management</h1>
            <p className="text-gray-400">Manage tournament sponsors and partners</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center"
            >
              Back to Admin
            </Link>
            <button 
              onClick={() => {
                setCurrentSponsor({ name: '', logo: '', website: '', isActive: true, order: 0, tier: 'partner' });
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Sponsor
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
              placeholder="Search sponsors..."
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500 w-full"
            />
          </div>
        </div>

        {/* Sponsors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
          ) : filteredSponsors.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400">No sponsors found</p>
            </div>
          ) : (
            filteredSponsors.map((sponsor) => (
              <div key={sponsor.$id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center mr-4 p-1">
                        {sponsor.logo ? (
                          <img 
                            src={sponsor.logo} 
                            alt={sponsor.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Award className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white leading-tight">{sponsor.name}</h3>
                        {sponsor.website && (
                          <a 
                            href={sponsor.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-xs flex items-center mt-1"
                          >
                            Visit Site
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      sponsor.isActive 
                        ? 'bg-green-900 text-green-200' 
                        : 'bg-red-900 text-red-200'
                    }`}>
                      {sponsor.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 border-t border-gray-700 pt-4">
                     <span className="text-xs text-gray-500 uppercase font-bold">Tier: {sponsor.tier}</span>
                     <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setCurrentSponsor(sponsor);
                            setIsModalOpen(true);
                          }}
                          className="text-yellow-400 hover:text-yellow-300 p-2 bg-yellow-400/10 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(sponsor.$id)}
                          className="text-red-400 hover:text-red-300 p-2 bg-red-400/10 rounded-lg"
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
      </div>

{/* Add/Edit Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              {currentSponsor.$id ? 'Edit Sponsor' : 'Add New Sponsor'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Add or edit sponsor information for the website.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Sponsor Name*</label>
              <input
                type="text"
                required
                value={currentSponsor.name}
                onChange={e => setCurrentSponsor({ ...currentSponsor, name: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="e.g. Truehost Kenya"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Website URL</label>
              <input
                type="url"
                value={currentSponsor.website}
                onChange={e => setCurrentSponsor({ ...currentSponsor, website: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Sponsor Logo*</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-900 border border-gray-700 rounded-lg flex items-center justify-center p-2 relative overflow-hidden">
                  {currentSponsor.logo ? (
                    <img src={currentSponsor.logo} className="w-full h-full object-contain" />
                  ) : (
                    <Upload className="w-8 h-8 text-gray-600" />
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    id="logo-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="logo-upload"
                    className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer transition-colors text-sm font-semibold"
                  >
                    {isUploading ? 'Uploading...' : 'Choose File'}
                  </label>
                  <p className="text-xs text-gray-500 mt-2">Recommended: PNG or SVG with transparent background</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Display Order</label>
                <input
                  type="number"
                  value={currentSponsor.order}
                  onChange={e => setCurrentSponsor({ ...currentSponsor, order: parseInt(e.target.value) || 0 })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Tier</label>
                <select
                  value={currentSponsor.tier}
                  onChange={e => setCurrentSponsor({ ...currentSponsor, tier: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                >
                  <option value="platinum">Platinum</option>
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="bronze">Bronze</option>
                  <option value="partner">Partner</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 py-2">
              <input
                type="checkbox"
                id="isActive"
                checked={currentSponsor.isActive}
                onChange={e => setCurrentSponsor({ ...currentSponsor, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-red-600 focus:ring-red-500 bg-gray-900 border-gray-700"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-300">Visible on Website</label>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-700">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-transparent border-gray-600 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSaving || isUploading}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {isSaving ? 'Saving...' : 'Save Sponsor'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}