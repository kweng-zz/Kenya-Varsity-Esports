'use client';

import React, { useState, useEffect } from 'react';
import { Client, Databases, ID, Permission, Role } from 'appwrite';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Play, X } from 'lucide-react';

// --- Types ---
interface VideoHighlight {
  $id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
  badge?: string;
  duration?: string;
  order: number;
  isActive: boolean;
  isFeatured: boolean;
}

// --- Appwrite Setup with lazy initialization ---
let client: Client | null = null;
let databases: Databases | null = null;

const initializeAppwrite = () => {
  if (!client) {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

    if (!endpoint || !projectId) {
      console.warn('Appwrite configuration missing for admin highlights');
      return null;
    }

    if (typeof endpoint !== 'string' || endpoint.trim() === '') {
      console.warn('Appwrite endpoint is invalid for admin highlights');
      return null;
    }

    try {
      client = new Client()
        .setEndpoint(endpoint)
        .setProject(projectId);

      databases = new Databases(client);
    } catch (error) {
      console.error('Failed to initialize Appwrite client for admin highlights:', error);
      return null;
    }
  }
  return { databases };
};

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const COLLECTION_ID = 'video-highlights';

// Utility functions
const extractYouTubeVideoId = (url: string): string => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : '';
};

const getYouTubeThumbnail = (videoId: string, quality: 'default' | 'hqdefault' | 'maxresdefault' = 'maxresdefault'): string => {
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};

const isValidYouTubeUrl = (url: string): boolean => {
    return extractYouTubeVideoId(url) !== '';
};

export default function AdminVideoHighlightsPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  
  const [highlights, setHighlights] = useState<VideoHighlight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

  // Form states
  const [editingHighlightId, setEditingHighlightId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<VideoHighlight>>({});

  // Fetch highlights from Appwrite - wrapped in useCallback to prevent infinite loops
  const fetchHighlights = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const appwrite = initializeAppwrite();
      if (!appwrite?.databases) {
        console.warn('Appwrite not configured, skipping highlights fetch');
        setIsLoading(false);
        return;
      }

      const response = await appwrite.databases.listDocuments(DB_ID, COLLECTION_ID);
      
      // Map documents to VideoHighlight type and sort by order
      const mappedHighlights: VideoHighlight[] = response.documents.map(doc => ({
        $id: doc.$id,
        title: doc.title || '',
        description: doc.description || '',
        youtubeUrl: doc.youtubeUrl || '',
        thumbnailUrl: doc.thumbnailUrl,
        badge: doc.badge,
        duration: doc.duration,
        order: doc.order || 0,
        isActive: doc.isActive !== false,
        isFeatured: doc.isFeatured || false
      })).sort((a, b) => a.order - b.order);
      
      setHighlights(mappedHighlights);
      
    } catch (err) {
      console.error('Error fetching highlights:', err);
      if (err && typeof err === 'object' && 'code' in err && err.code === 404) {
        // Collection doesn't exist, show empty state
        setHighlights([]);
      } else {
        setError('Failed to load video highlights');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check if user is admin
  useEffect(() => {
    if (!loading && (!user || !profile?.isAdmin)) {
      router.push('/login');
    }
  }, [user, profile, loading, router]);

  // Fetch highlights from Appwrite - only when user/profile changes
  useEffect(() => {
    if (user && profile?.isAdmin) {
      fetchHighlights();
    }
  }, [user, profile?.isAdmin, fetchHighlights]);

  const createDefaultHighlights = async () => {
    try {
      const appwrite = initializeAppwrite();
      if (!appwrite?.databases) {
        setError('Appwrite not configured. Cannot create default highlights.');
        return;
      }

      const defaultHighlights = [
        {
          title: 'Main Season 2 Highlight',
          description: 'Season 2 championship highlights',
          youtubeUrl: 'https://youtu.be/WoSSsYqgb18?si=-FLMhxsoJ3p0-hqy',
          badge: 'FEATURED',
          order: 1,
          isActive: true,
          isFeatured: true
        },
        {
          title: 'KUER DAY 1 HIGHLIGHTS',
          description: 'Season 2 was held at KCA University and here is the highlight for day 1',
          youtubeUrl: 'https://youtu.be/bkP_yfEXW6o?si=oICSj8b72G7UVCtS',
          badge: 'DAY 1 FINALS',
          order: 2,
          isActive: true,
          isFeatured: false
        },
        {
          title: 'KUER DAY 2 HIGHLIGHTS',
          description: 'Season 2 was held at KCA University and here is the highlight for day 2',
          youtubeUrl: 'https://youtu.be/Yk-kScaNlbU?si=D8Lyafe88Km7vzzG',
          badge: 'DAY 2 FINALS',
          order: 3,
          isActive: true,
          isFeatured: false
        }
      ];

      const createdHighlights = [];
      for (const highlight of defaultHighlights) {
        const created = await appwrite.databases.createDocument(
          DB_ID,
          COLLECTION_ID,
          ID.unique(),
          highlight,
          [
            Permission.read(Role.any()),
            Permission.write(Role.users())
          ]
        );
        createdHighlights.push({
          $id: created.$id,
          ...highlight
        });
      }
      
      setHighlights(createdHighlights);
      setMessage('Default video highlights created successfully!');
    } catch (err) {
      console.error('Error creating default highlights:', err);
      setError('Failed to create default highlights. Please check if the video-highlights collection exists.');
    }
  };

  const handleEditHighlight = (highlight: VideoHighlight) => {
    setEditingHighlightId(highlight.$id);
    setEditForm(highlight);
  };

  const handleSaveHighlight = async () => {
    if (!editForm.title || !editForm.description || !editForm.youtubeUrl) {
      setError('Title, description, and YouTube URL are required');
      return;
    }

    if (!isValidYouTubeUrl(editForm.youtubeUrl)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    try {
      setIsSaving(true);
      
      const appwrite = initializeAppwrite();
      if (!appwrite?.databases) {
        setError('Appwrite not configured. Please try again.');
        setIsSaving(false);
        return;
      }
      
      const updateData = {
        title: editForm.title,
        description: editForm.description,
        youtubeUrl: editForm.youtubeUrl,
        thumbnailUrl: editForm.thumbnailUrl || '',
        badge: editForm.badge || '',
        duration: editForm.duration || '',
        order: editForm.order || 0,
        isActive: editForm.isActive !== false,
        isFeatured: editForm.isFeatured || false
      };

      await appwrite.databases.updateDocument(
        DB_ID,
        COLLECTION_ID,
        editingHighlightId!,
        updateData
      );
      
      setMessage('Video highlight updated successfully!');
      setEditingHighlightId(null);
      setEditForm({});
      fetchHighlights();
    } catch (err) {
      console.error('Error updating highlight:', err);
      setError('Failed to update video highlight');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddHighlight = async () => {
    try {
      setIsSaving(true);
      
      const appwrite = initializeAppwrite();
      if (!appwrite?.databases) {
        setError('Appwrite not configured. Please try again.');
        setIsSaving(false);
        return;
      }
      
      const newHighlight = {
        title: 'New Video Highlight',
        description: 'Add your video highlight description here',
        youtubeUrl: 'https://youtu.be/dQw4w9WgXcQ',
        badge: '',
        duration: '',
        order: highlights.length + 1,
        isActive: true,
        isFeatured: false
      };
      
      await appwrite.databases.createDocument(
        DB_ID,
        COLLECTION_ID,
        ID.unique(),
        newHighlight,
        [
          Permission.read(Role.any()),
          Permission.write(Role.users())
        ]
      );
      
      setMessage('New video highlight added successfully!');
      fetchHighlights();
    } catch (err) {
      console.error('Error adding highlight:', err);
      setError('Failed to add video highlight');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteHighlight = async (highlightId: string) => {
    if (window.confirm('Are you sure you want to delete this video highlight?')) {
      try {
        setIsSaving(true);
        const appwrite = initializeAppwrite();
        if (!appwrite?.databases) {
          setError('Appwrite not configured. Please try again.');
          return;
        }
        
        await appwrite.databases.deleteDocument(DB_ID, COLLECTION_ID, highlightId);
        setMessage('Video highlight deleted successfully!');
        fetchHighlights();
      } catch (err) {
        console.error('Error deleting highlight:', err);
        setError('Failed to delete video highlight');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleToggleActive = async (highlightId: string) => {
    try {
      const appwrite = initializeAppwrite();
      if (!appwrite?.databases) {
        setError('Appwrite not configured. Please try again.');
        return;
      }
      
      const highlight = highlights.find(h => h.$id === highlightId);
      if (!highlight) return;

      await appwrite.databases.updateDocument(
        DB_ID,
        COLLECTION_ID,
        highlightId,
        { isActive: !highlight.isActive }
      );
      
      setMessage('Video highlight status updated successfully!');
      fetchHighlights();
    } catch (err) {
      console.error('Error updating highlight status:', err);
      setError('Failed to update video highlight status');
    }
  };

  const handleToggleFeatured = async (highlightId: string) => {
    try {
      const appwrite = initializeAppwrite();
      if (!appwrite?.databases) {
        setError('Appwrite not configured. Please try again.');
        return;
      }
      
      const highlight = highlights.find(h => h.$id === highlightId);
      if (!highlight) return;

      // If making this featured, unfeatured all others first
      if (!highlight.isFeatured) {
        const featuredHighlights = highlights.filter(h => h.isFeatured);
        for (const featured of featuredHighlights) {
          await appwrite.databases.updateDocument(
            DB_ID,
            COLLECTION_ID,
            featured.$id,
            { isFeatured: false }
          );
        }
      }

      await appwrite.databases.updateDocument(
        DB_ID,
        COLLECTION_ID,
        highlightId,
        { isFeatured: !highlight.isFeatured }
      );
      
      setMessage('Featured status updated successfully!');
      fetchHighlights();
    } catch (err) {
      console.error('Error updating featured status:', err);
      setError('Failed to update featured status');
    }
  };

  const handleReorderHighlight = async (highlightId: string, direction: 'up' | 'down') => {
    const highlightIndex = highlights.findIndex(h => h.$id === highlightId);
    if (highlightIndex === -1) return;

    const newIndex = direction === 'up' ? highlightIndex - 1 : highlightIndex + 1;
    if (newIndex < 0 || newIndex >= highlights.length) return;

    try {
      setIsSaving(true);
      
      const appwrite = initializeAppwrite();
      if (!appwrite?.databases) {
        setError('Appwrite not configured. Please try again.');
        setIsSaving(false);
        return;
      }
      
      // Update the order of the two highlights
      const highlight1 = highlights[highlightIndex];
      const highlight2 = highlights[newIndex];
      
      await appwrite.databases.updateDocument(DB_ID, COLLECTION_ID, highlight1.$id, { order: highlight2.order });
      await appwrite.databases.updateDocument(DB_ID, COLLECTION_ID, highlight2.$id, { order: highlight1.order });
      
      setMessage('Video highlight order updated successfully!');
      fetchHighlights();
    } catch (err) {
      console.error('Error reordering highlight:', err);
      setError('Failed to reorder video highlight');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreviewVideo = (youtubeUrl: string) => {
    const videoId = extractYouTubeVideoId(youtubeUrl);
    if (videoId) {
      setPreviewVideo(videoId);
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
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-[#961c18]">
            Video Highlights Management
          </h1>
          <button
            onClick={handleAddHighlight}
            disabled={isSaving}
            className="px-4 py-2 bg-[#961c18] hover:bg-[#7a1514] disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {isSaving ? 'Adding...' : 'Add New Video Highlight'}
          </button>
        </div>
        
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

        {/* Setup Instructions */}
        {highlights.length === 0 && !isLoading && (
          <div className="bg-yellow-900/50 border border-yellow-500 text-yellow-200 px-4 py-3 rounded-lg mb-6 text-sm sm:text-base">
            <p className="font-medium mb-2">Collection Setup Required</p>
            <p>The &apos;video-highlights&apos; collection doesn&apos;t exist yet. Please create it in your Appwrite console with these fields:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
              <li>title (string) - Video highlight title</li>
              <li>description (string) - Video highlight description</li>
              <li>youtubeUrl (string) - YouTube video URL</li>
              <li>thumbnailUrl (string, optional) - Custom thumbnail URL</li>
              <li>badge (string, optional) - Badge text (e.g., &quot;FEATURED&quot;, &quot;DAY 1&quot;)</li>
              <li>duration (string, optional) - Video duration (e.g., &quot;5:30&quot;)</li>
              <li>order (integer) - Display order</li>
              <li>isActive (boolean) - Whether highlight is active</li>
              <li>isFeatured (boolean) - Whether highlight is featured (main video)</li>
            </ul>
          </div>
        )}

        {/* Video Highlights List */}
        <div className="space-y-6">
          {highlights.map((highlight, index) => (
            <div key={highlight.$id} className="bg-gray-900 rounded-lg p-4 sm:p-6">
              {editingHighlightId === highlight.$id ? (
                /* Edit Form */
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-[#961c18] mb-4">
                    Edit Video Highlight #{highlight.order}
                  </h3>
                  
                  {/* Form Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title *</label>
                      <input
                        type="text"
                        value={editForm.title || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 bg-black border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#961c18]"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Badge (Optional)</label>
                      <input
                        type="text"
                        value={editForm.badge || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, badge: e.target.value }))}
                        placeholder="FEATURED, DAY 1 FINALS, etc."
                        className="w-full px-3 py-2 bg-black border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#961c18]"
                      />
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-2">YouTube URL *</label>
                      <input
                        type="url"
                        value={editForm.youtubeUrl || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                        placeholder="https://youtu.be/dQw4w9WgXcQ or https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                        className="w-full px-3 py-2 bg-black border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#961c18]"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Custom Thumbnail URL (Optional)</label>
                      <input
                        type="url"
                        value={editForm.thumbnailUrl || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                        placeholder="https://example.com/thumbnail.jpg"
                        className="w-full px-3 py-2 bg-black border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#961c18]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Duration (Optional)</label>
                      <input
                        type="text"
                        value={editForm.duration || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="5:30"
                        className="w-full px-3 py-2 bg-black border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#961c18]"
                      />
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-2">Description *</label>
                      <textarea
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 bg-black border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#961c18]"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={editForm.isFeatured || false}
                            onChange={(e) => setEditForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                            className="mr-2"
                          />
                          <span className="text-sm">Featured (Main Video)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Video Preview */}
                  {editForm.youtubeUrl && isValidYouTubeUrl(editForm.youtubeUrl) && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Preview</label>
                      <div className="relative aspect-video max-w-md">
                        <img
                          src={editForm.thumbnailUrl || getYouTubeThumbnail(extractYouTubeVideoId(editForm.youtubeUrl))}
                          alt="Video thumbnail"
                          className="w-full h-full object-cover rounded-lg border border-gray-600"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://placehold.co/640x360/111111/FFFFFF?text=Video+Thumbnail';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handlePreviewVideo(editForm.youtubeUrl!)}
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-70 transition-all rounded-lg"
                        >
                          <Play className="w-12 h-12 text-white" />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={handleSaveHighlight}
                      disabled={isSaving}
                      className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded font-medium transition-colors"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingHighlightId(null);
                        setEditForm({});
                      }}
                      className="w-full sm:w-auto px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* Display Mode */
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Video Preview */}
                  <div className="lg:w-1/3">
                    <div className="relative aspect-video">
                      <img
                        src={highlight.thumbnailUrl || getYouTubeThumbnail(extractYouTubeVideoId(highlight.youtubeUrl))}
                        alt={highlight.title}
                        className="w-full h-full object-cover rounded-lg border border-gray-600"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/640x360/111111/FFFFFF?text=Video+Thumbnail';
                        }}
                      />
                      <button
                        onClick={() => handlePreviewVideo(highlight.youtubeUrl)}
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-70 transition-all rounded-lg"
                      >
                        <Play className="w-12 h-12 text-white" />
                      </button>
                      {highlight.duration && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                          {highlight.duration}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Video Info */}
                  <div className="lg:w-2/3 space-y-3">
                    <div className="flex items-center gap-4 flex-wrap">
                      <h3 className="text-xl font-bold text-white">
                        {highlight.title}
                      </h3>
                      {highlight.badge && (
                        <span className="px-2 py-1 bg-[#961c18] text-white text-xs rounded">
                          {highlight.badge}
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        highlight.isActive 
                          ? 'bg-green-900/50 text-green-200 border border-green-500'
                          : 'bg-red-900/50 text-red-200 border border-red-500'
                      }`}>
                        {highlight.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {highlight.isFeatured && (
                        <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded">
                          FEATURED
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Description:</span>
                        <p className="text-white">{highlight.description}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">YouTube URL:</span>
                        <p className="text-white break-all">{highlight.youtubeUrl}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Order:</span>
                        <p className="text-white">#{highlight.order}</p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-4">
                      <button
                        onClick={() => handleEditHighlight(highlight)}
                        className="px-3 py-1 bg-[#961c18] hover:bg-[#7a1514] text-white rounded text-sm font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleActive(highlight.$id)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          highlight.isActive
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        {highlight.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleToggleFeatured(highlight.$id)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          highlight.isFeatured
                            ? 'bg-orange-600 hover:bg-orange-700 text-white'
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                      >
                        {highlight.isFeatured ? 'Unfeature' : 'Make Featured'}
                      </button>
                      {index > 0 && (
                        <button
                          onClick={() => handleReorderHighlight(highlight.$id, 'up')}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                        >
                          Move Up
                        </button>
                      )}
                      {index < highlights.length - 1 && (
                        <button
                          onClick={() => handleReorderHighlight(highlight.$id, 'down')}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                        >
                          Move Down
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteHighlight(highlight.$id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {highlights.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No video highlights found</p>
            <button
              onClick={handleAddHighlight}
              disabled={isSaving}
              className="px-6 py-3 bg-[#961c18] hover:bg-[#7a1514] disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              {isSaving ? 'Creating...' : 'Add Your First Video Highlight'}
            </button>
          </div>
        )}
      </div>

      {/* Video Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl aspect-video">
            <button
              onClick={() => setPreviewVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-red-500 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${previewVideo}?autoplay=1&rel=0&modestbranding=1`}
              title="YouTube video player"
              style={{ border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full rounded-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}