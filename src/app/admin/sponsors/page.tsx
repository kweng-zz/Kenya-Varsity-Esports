'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Plus, Edit, Trash2, ExternalLink, Search, Award } from 'lucide-react';

interface Sponsor {
  id: string;
  name: string;
  logo: string;
  website: string;
  isActive: boolean;
  description?: string;
}

export default function AdminSponsorsPage() {
  const { user, profile, loading } = useAuth();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
        setSponsors(result.data);
      } else {
        throw new Error(result.error || 'Failed to load sponsors');
      }
    } catch (error) {
      console.error('Error loading sponsors:', error);
      setError('Failed to load sponsors. Using fallback data.');
      
      // Fallback data
      const fallbackSponsors: Sponsor[] = [
        {
          id: "1",
          name: "Sample Sponsor",
          logo: "/images/sponsor-placeholder.png",
          website: "https://example.com",
          isActive: true,
          description: "Official tournament sponsor"
        }
      ];
      setSponsors(fallbackSponsors);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSponsors = sponsors.filter(sponsor =>
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
            <h1 className="text-4xl font-bold mb-2">Sponsors Management</h1>
            <p className="text-gray-400">Manage tournament sponsors and partners</p>
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
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 w-full"
            />
          </div>
          <select className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
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
              <div key={sponsor.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mr-3">
                        {sponsor.logo ? (
                          <img 
                            src={sponsor.logo} 
                            alt={sponsor.name}
                            className="w-10 h-10 object-contain"
                          />
                        ) : (
                          <Award className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{sponsor.name}</h3>
                        <a 
                          href={sponsor.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                        >
                          {sponsor.website.replace('https://', '')}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
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
                  
                  {sponsor.description && (
                    <p className="text-gray-400 text-sm mb-4">{sponsor.description}</p>
                  )}
                  
                  <div className="flex items-center justify-end gap-2">
                    <button className="text-yellow-400 hover:text-yellow-300 p-1">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-400 hover:text-red-300 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
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