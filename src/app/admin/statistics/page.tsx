'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// --- Types ---
interface StatItem {
  id: string;
  number: string;
  label: string;
}

interface StatisticsData {
  seasonTitle: string;
  image: string;
  seasonNumber: number;
  stats: StatItem[];
}

export default function AdminStatisticsPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [stats, setStats] = useState<StatItem[]>([]);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [seasonNumber, setSeasonNumber] = useState<number>(3);
  const [seasonTitle, setSeasonTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form states
  const [editingStatId, setEditingStatId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ number: '', label: '' });
  const [newSeasonTitle, setNewSeasonTitle] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Check if user is admin
  useEffect(() => {
    if (!loading && (!user || !profile?.isAdmin)) {
      router.push('/login');
    }
  }, [user, profile, loading, router]);

  // Fetch statistics
  useEffect(() => {
    if (user && profile?.isAdmin) {
      fetchData();
    }
  }, [user, profile]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/statistics');
      const data = await response.json();
      
      if (data.success && data.data) {
        setStats(data.data.stats);
        setImageUrl(data.data.image);
        setSeasonNumber(data.data.seasonNumber);
        setSeasonTitle(data.data.seasonTitle);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load statistics data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditStat = (stat: StatItem) => {
    setEditingStatId(stat.id);
    setEditForm({ number: stat.number, label: stat.label });
  };

  const handleSaveStat = async (statId: string) => {
    try {
      setIsSaving(true);
      
      // Update the local state first (optimistic update)
      const updatedStats = stats.map(stat => 
        stat.id === statId ? { ...stat, ...editForm } : stat
      );
      setStats(updatedStats);
      
      // Save to markdown file via API
      const response = await fetch('/api/statistics', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stats: updatedStats,
          image: imageUrl,
          seasonNumber,
          seasonTitle,
        }),
      });
      
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      
      setMessage('Statistic updated successfully!');
      setEditingStatId(null);
    } catch (err) {
      console.error('Error updating statistic:', err);
      setError('Failed to update statistic');
      fetchData(); // Revert on error
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      
      let eventImageUrl = imageUrl;
      
      if (selectedFile) {
        // For file upload, we'd need an upload endpoint
        // For now, just show a message that file upload isn't implemented
        // In production, you'd upload to a storage service
        setError('File upload not yet implemented. Please use image URL for now.');
        return;
      }
      
      // For now, just use the image URL
      eventImageUrl = newImageUrl || imageUrl;
      
      const updatedStats = stats;
      
      const response = await fetch('/api/statistics', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stats: updatedStats,
          image: eventImageUrl,
          seasonNumber,
          seasonTitle: newSeasonTitle || `STATISTICS OF SEASON ${seasonNumber}`,
        }),
      });
      
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      
      setMessage('Settings updated successfully!');
      setPreviewUrl(eventImageUrl);
      setImageUrl(eventImageUrl);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Error updating settings:', err);
      setError('Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user || !profile?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-[#961c18] mb-6 sm:mb-8">
          Statistics Management
        </h1>
        
        {/* Messages */}
        {message && (
          <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-6 text-sm sm:text-base">
            {message}
          </div>
        )}
        
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm sm:text-base">
            {error}
          </div>
        )}

        {/* Season Settings */}
        <div className="bg-gray-900 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#961c18] mb-4">
            Season Settings
          </h2>
          
          <div className="space-y-6">
            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium mb-3">Event Image URL</label>
              <div className="space-y-2">
                <input
                  type="url"
                  value={newImageUrl || ''}
                  onChange={(e) => {
                    setNewImageUrl(e.target.value);
                    setPreviewUrl(e.target.value);
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 bg-black border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#961c18]"
                />
                <p className="text-xs text-gray-400">
                  Enter the URL of an image hosted online (imgur, Google Drive, etc.)
                </p>
              </div>
            </div>

            {/* Season Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Season Helper Title (e.g. STATISTICS OF SEASON 3)</label>
              <input
                type="text"
                value={newSeasonTitle || ''}
                onChange={(e) => setNewSeasonTitle(e.target.value)}
                placeholder="STATISTICS OF SEASON 3"
                className="w-full px-3 py-2 bg-black border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#961c18]"
              />
              <p className="text-xs text-gray-400 mt-1">This text will be displayed as the main title of the Statistics section.</p>
            </div>

            {/* Image Preview */}
            {previewUrl && (
              <div>
                <label className="block text-sm font-medium mb-2">Image Preview</label>
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Event preview"
                    className="w-full max-w-md h-48 sm:h-64 object-cover rounded-lg border border-gray-600"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://placehold.co/600x400/111111/FFFFFF?text=Image+Error';
                    }}
                  />
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="w-full sm:w-auto px-6 py-3 bg-[#961c18] hover:bg-[#7a1514] disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
              >
                {isSaving ? 'Updating...' : 'Update Season Settings'}
              </button>
            </div>
          </div>
        </div>

        {/* Statistics List */}
        <div className="bg-gray-900 rounded-lg p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#961c18] mb-4">
            Season Statistics
          </h2>
          
          <div className="space-y-4">
            {stats.map((stat) => (
              <div key={stat.id} className="bg-black rounded-lg p-4 border border-gray-700">
                {editingStatId === stat.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Number</label>
                        <input
                          type="text"
                          value={editForm.number}
                          onChange={(e) => setEditForm({ ...editForm, number: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-[#961c18]"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Label</label>
                        <input
                          type="text"
                          value={editForm.label}
                          onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-[#961c18]"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleSaveStat(stat.id)}
                        disabled={isSaving}
                        className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded font-medium transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingStatId(null)}
                        className="w-full sm:w-auto px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-white">{stat.number}</div>
                      <div className="text-gray-400 text-sm sm:text-base">{stat.label}</div>
                    </div>
                    
                    <button
                      onClick={() => handleEditStat(stat)}
                      className="w-full sm:w-auto px-4 py-2 bg-[#961c18] hover:bg-[#7a1514] text-white rounded font-medium transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}