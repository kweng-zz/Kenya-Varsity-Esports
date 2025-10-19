'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Plus, Edit, Trash2, MapPin, Users, Search, Eye } from 'lucide-react';

interface Region {
  id: string;
  name: string;
  slug: string;
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
          isActive: true,
          universities: 15,
          backgroundImage: "/images/nairobi-bg.jpg",
          description: "Nairobi region universities competing in KUER"
        },
        {
          id: "2",
          name: "CENTRAL KENYA",
          slug: "central-kenya",
          isActive: false,
          universities: 0,
          backgroundImage: "/images/central-bg.jpg",
          description: "Central Kenya region universities"
        },
        {
          id: "3",
          name: "WESTERN KENYA",
          slug: "western-kenya",
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
            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
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
                      <button className="text-yellow-400 hover:text-yellow-300 p-1">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-400 hover:text-red-300 p-1">
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
    </div>
  );
}