'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Client, Databases, ID, Permission, Role, Storage } from 'appwrite';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// --- Types ---
interface SeasonStatsDoc {
  $id: string;
  number: string;
  label: string;
  seasonNumber?: number;
  seasonStatus?: 'active' | 'completed';
  seasonEndDate?: string;
  eventImage?: string;
}

interface SeasonSettings {
  $id: string;
  seasonNumber: number;
  seasonEndDate: string;
  eventImage: string;
  seasonStatus: 'active' | 'completed';
}

// --- Appwrite Setup ---
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);
const storage = new Storage(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const COLLECTION_ID = 'season_statistics';
const BUCKET_ID = 'season-images';

export default function AdminStatisticsPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [stats, setStats] = useState<SeasonStatsDoc[]>([]);
  const [seasonSettings, setSeasonSettings] = useState<SeasonSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form states
  const [editingStatId, setEditingStatId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ number: '', label: '' });
  const [newSeasonEndDate, setNewSeasonEndDate] = useState('');
  const [newEventImageUrl, setNewEventImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');

  // Check if user is admin
  useEffect(() => {
    if (!loading && (!user || !profile?.isAdmin)) {
      router.push('/login');
    }
  }, [user, profile, loading, router]);

  // Fetch statistics and season settings
  useEffect(() => {
    if (user && profile?.isAdmin) {
      fetchData();
    }
  }, [user, profile]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await databases.listDocuments(DB_ID, COLLECTION_ID);
      
      // Separate statistics from settings
      const statistics = response.documents.filter(doc => 
        doc.$id !== 'current_season_settings' && doc.label !== 'Current Season Info'
      );
      
      const settings = response.documents.find(doc => 
        doc.$id === 'current_season_settings' || doc.label === 'Current Season Info'
      );

      // Map documents to proper types
      setStats(statistics.map(doc => ({
        $id: doc.$id,
        number: doc.number || '',
        label: doc.label || '',
        seasonNumber: doc.seasonNumber,
        seasonStatus: doc.seasonStatus,
        seasonEndDate: doc.seasonEndDate,
        eventImage: doc.eventImage
      })));
      
      if (settings) {
        setSeasonSettings({
          $id: settings.$id,
          seasonNumber: settings.seasonNumber || 4,
          seasonEndDate: settings.seasonEndDate || '',
          eventImage: settings.eventImage || '',
          seasonStatus: settings.seasonStatus || 'active'
        });
        setPreviewUrl(settings.eventImage || '');
        setNewEventImageUrl(settings.eventImage || '');
        setNewSeasonEndDate(settings.seasonEndDate ? settings.seasonEndDate.split('T')[0] : '');
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

  const handleEditStat = (stat: SeasonStatsDoc) => {
    setEditingStatId(stat.$id);
    setEditForm({ number: stat.number, label: stat.label });
  };

  const handleSaveStat = async (statId: string) => {
    try {
      setIsSaving(true);
      await databases.updateDocument(
        DB_ID,
        COLLECTION_ID,
        statId,
        {
          number: editForm.number,
          label: editForm.label
        }
      );
      
      setMessage('Statistic updated successfully!');
      setEditingStatId(null);
      fetchData();
    } catch (err) {
      console.error('Error updating statistic:', err);
      setError('Failed to update statistic');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateSeasonSettings = async () => {
    if (!seasonSettings) return;
    
    try {
      setIsSaving(true);
      
      let eventImageUrl = seasonSettings.eventImage;
      
      if (uploadMethod === 'url' && newEventImageUrl) {
        eventImageUrl = newEventImageUrl;
        
        // Validate URL length (max 500 chars for database)
        if (eventImageUrl && eventImageUrl.length > 500) {
          setError('Image URL is too long. Please use a shorter URL (max 500 characters).');
          return;
        }
      } else if (uploadMethod === 'file' && selectedFile) {
        try {
          // Upload file to Appwrite Storage
          const fileResponse = await storage.createFile(
            BUCKET_ID,
            ID.unique(),
            selectedFile
          );
          
          // Get the file URL from Appwrite Storage
          const fileUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileResponse.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
          eventImageUrl = fileUrl;
          
          console.log('File uploaded successfully:', fileResponse.$id);
        } catch (uploadError) {
          console.error('Error uploading file:', uploadError);
          const errorMessage = uploadError instanceof Error ? uploadError.message : String(uploadError);
          if (errorMessage.includes('bucket with the requested ID could not be found')) {
            setError('Storage bucket not found. Please contact the administrator to set up the storage bucket with proper permissions.');
          } else if (errorMessage.includes('missing scopes')) {
            setError('Insufficient permissions for file upload. Please contact the administrator to update API key permissions.');
          } else {
            setError('Failed to upload image file. Please try again or use the URL method.');
          }
          return;
        }
      }
      
      const updateData: Record<string, unknown> = {
        eventImage: eventImageUrl,
        seasonEndDate: new Date(newSeasonEndDate + 'T23:59:59.000Z').toISOString()
      };

      await databases.updateDocument(
        DB_ID,
        COLLECTION_ID,
        seasonSettings.$id,
        updateData
      );

      // Also update all statistics with the new event image
      for (const stat of stats) {
        await databases.updateDocument(
          DB_ID,
          COLLECTION_ID,
          stat.$id,
          { eventImage: eventImageUrl }
        );
      }
      
      setMessage('Season settings updated successfully!');
      setSelectedFile(null);
      setNewEventImageUrl('');
      setPreviewUrl(eventImageUrl);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      fetchData();
    } catch (err) {
      console.error('Error updating season settings:', err);
      setError('Failed to update season settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTransitionSeason = async () => {
    if (!seasonSettings) return;
    
    const confirmTransition = window.confirm(
      `Are you sure you want to transition to Season ${seasonSettings.seasonNumber + 1}? This will mark the current season as completed and create a new active season.`
    );
    
    if (!confirmTransition) return;

    try {
      setIsSaving(true);
      
      // Mark current season as completed
      await databases.updateDocument(
        DB_ID,
        COLLECTION_ID,
        seasonSettings.$id,
        {
          seasonStatus: 'completed'
        }
      );

      // Create new season settings
      const newSeasonNumber = seasonSettings.seasonNumber + 1;
      const newSeasonEndDate = new Date();
      newSeasonEndDate.setFullYear(newSeasonEndDate.getFullYear() + 1); // Next year
      
      await databases.createDocument(
        DB_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          label: 'Current Season Info',
          number: newSeasonNumber.toString(),
          seasonNumber: newSeasonNumber,
          seasonStatus: 'active',
          seasonEndDate: newSeasonEndDate.toISOString(),
          eventImage: `https://placehold.co/600x400/961c18/FFFFFF?text=Season+${newSeasonNumber}+Ongoing`
        },
        [
          Permission.read(Role.any()),
          Permission.write(Role.users())
        ]
      );
      
      setMessage(`Successfully transitioned to Season ${newSeasonNumber}!`);
      fetchData();
    } catch (err) {
      console.error('Error transitioning season:', err);
      setError('Failed to transition season');
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
        {seasonSettings && (
          <div className="bg-gray-900 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#961c18] mb-4">
              Season {seasonSettings.seasonNumber} Settings
            </h2>
            
            <div className="space-y-6">
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium mb-3">Event Image</label>
                
                {/* Upload Method Toggle */}
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setUploadMethod('url')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      uploadMethod === 'url'
                        ? 'bg-[#961c18] text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMethod('file')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      uploadMethod === 'file'
                        ? 'bg-[#961c18] text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Upload File
                  </button>
                </div>

                {uploadMethod === 'url' ? (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={newEventImageUrl}
                      onChange={(e) => {
                        setNewEventImageUrl(e.target.value);
                        setPreviewUrl(e.target.value);
                      }}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 bg-black border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#961c18]"
                    />
                    <p className="text-xs text-gray-400">
                      Enter the URL of an image hosted online (max 500 characters)
                    </p>
                    <p className="text-xs text-blue-400">
                      💡 Tip: Upload your image to imgur.com, Google Drive, or any image hosting service and paste the direct link here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="w-full px-3 py-2 bg-black border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#961c18] file:text-white hover:file:bg-[#7a1514] focus:outline-none focus:border-[#961c18]"
                    />
                    <p className="text-xs text-gray-400">
                      Select an image file (JPG, PNG, GIF, WebP - max 5MB)
                    </p>
                    <p className="text-xs text-green-400">
                      ✅ File upload is ready! Images will be stored securely in Appwrite Storage.
                    </p>
                    <p className="text-xs text-yellow-400">
                      ⚠️ If upload fails, the storage bucket may need to be set up. See STORAGE_SETUP_INSTRUCTIONS.md
                    </p>
                  </div>
                )}
              </div>
              
              {/* Season End Date */}
              <div>
                <label className="block text-sm font-medium mb-2">Season End Date</label>
                <input
                  type="date"
                  value={newSeasonEndDate}
                  onChange={(e) => setNewSeasonEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-black border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#961c18]"
                />
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
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handleUpdateSeasonSettings}
                  disabled={isSaving}
                  className="w-full sm:w-auto px-6 py-3 bg-[#961c18] hover:bg-[#7a1514] disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
                >
                  {isSaving ? 'Updating...' : 'Update Season Settings'}
                </button>
                
                <button
                  onClick={handleTransitionSeason}
                  disabled={isSaving}
                  className="w-full sm:w-auto px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
                >
                  Transition to Season {seasonSettings.seasonNumber + 1}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Statistics List */}
        <div className="bg-gray-900 rounded-lg p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#961c18] mb-4">
            Season Statistics
          </h2>
          
          <div className="space-y-4">
            {stats.map((stat) => (
              <div key={stat.$id} className="bg-black rounded-lg p-4 border border-gray-700">
                {editingStatId === stat.$id ? (
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
                        onClick={() => handleSaveStat(stat.$id)}
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
                      <div className="text-xs sm:text-sm text-gray-500">
                        Season {stat.seasonNumber || 'N/A'}
                      </div>
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