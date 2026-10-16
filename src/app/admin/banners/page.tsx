'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Client, Databases, ID, Permission, Role, Storage } from 'appwrite';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// --- Types ---
interface HeroBanner {
  $id: string;
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  order: number;
  isActive: boolean;
}

// --- Appwrite Setup with lazy initialization ---
let client: Client | null = null;
let databases: Databases | null = null;
let storage: Storage | null = null;

const initializeAppwrite = () => {
  if (!client) {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

    if (!endpoint || !projectId) {
      console.warn('Appwrite configuration missing for admin banners');
      return null;
    }

    if (typeof endpoint !== 'string' || endpoint.trim() === '') {
      console.warn('Appwrite endpoint is invalid for admin banners');
      return null;
    }

    try {
      client = new Client()
        .setEndpoint(endpoint)
        .setProject(projectId);

      databases = new Databases(client);
      storage = new Storage(client);
    } catch (error) {
      console.error('Failed to initialize Appwrite client for admin banners:', error);
      return null;
    }
  }
  return { databases, storage };
};

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const COLLECTION_ID = 'hero_banners';
const BUCKET_ID = 'season-images';

export default function AdminBannersPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form states
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<HeroBanner>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');

  // Fetch banners from Appwrite
  const fetchBanners = useCallback(async () => {
    try {
      setIsLoading(true);
      const appwrite = initializeAppwrite();
      if (!appwrite?.databases) {
        console.warn('Appwrite not configured, skipping banners fetch');
        setIsLoading(false);
        return;
      }

      const response = await appwrite.databases.listDocuments(DB_ID, COLLECTION_ID);
      
      // Map documents to HeroBanner type and sort by order
      const mappedBanners: HeroBanner[] = response.documents.map(doc => ({
        $id: doc.$id,
        src: doc.src || '',
        alt: doc.alt || '',
        title: doc.title,
        subtitle: doc.subtitle,
        ctaText: doc.ctaText,
        ctaLink: doc.ctaLink,
        order: doc.order || 0,
        isActive: doc.isActive !== false // Default to true if not specified
      })).sort((a, b) => a.order - b.order);
      
      setBanners(mappedBanners);
      
      // If no banners exist, create default ones
      if (mappedBanners.length === 0) {
        await createDefaultBanners();
      }
      
    } catch (err) {
      console.error('Error fetching banners:', err);
      if (err && typeof err === 'object' && 'code' in err && err.code === 404) {
        // Collection doesn't exist, create default banners
        await createDefaultBanners();
      } else {
        setError('Failed to load banners');
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

  // Fetch banners from Appwrite
  useEffect(() => {
    if (user && profile?.isAdmin) {
      fetchBanners();
    }
  }, [user, profile, fetchBanners]);

  const createDefaultBanners = async () => {
    try {
      const appwrite = initializeAppwrite();
      if (!appwrite?.databases) {
        setError('Appwrite not configured. Please try again.');
        return;
      }

      const defaultBanners = [
        {
          src: '/images/Join-Your-Uni.webp',
          alt: 'Join Your University',
          title: 'Join Your University',
          subtitle: 'Connect with your university esports community',
          ctaText: 'Register Now',
          ctaLink: '/register',
          order: 1,
          isActive: true
        },
        {
          src: '/images/Join our tournaments.png',
          alt: 'Join Our Tournaments',
          title: 'Join Our Tournaments',
          subtitle: 'Compete in exciting esports tournaments',
          ctaText: 'View Tournaments',
          ctaLink: '/tournaments',
          order: 2,
          isActive: true
        }
      ];

      const createdBanners = [];
      for (const banner of defaultBanners) {
        const created = await appwrite.databases.createDocument(
          DB_ID,
          COLLECTION_ID,
          ID.unique(),
          banner,
          [
            Permission.read(Role.any()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
          ]
        );
        createdBanners.push({
          $id: created.$id,
          ...banner
        });
      }
      
      setBanners(createdBanners);
      setMessage('Default banners created successfully!');
    } catch (err) {
      console.error('Error creating default banners:', err);
      setError('Failed to create default banners. Please check if the hero_banners collection exists.');
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
        const result = e.target?.result as string;
        setPreviewUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditBanner = (banner: HeroBanner) => {
    setEditingBannerId(banner.$id);
    setEditForm(banner);
    setPreviewUrl(banner.src);
    setUploadMethod(banner.src.startsWith('data:') || banner.src.startsWith('http') ? 'url' : 'file');
  };

  const handleSaveBanner = async () => {
    if (!editForm.src || !editForm.alt) {
      setError('Image source and alt text are required');
      return;
    }

    try {
      setIsSaving(true);
      
      let imageUrl = editForm.src;
      
      // Handle file upload if a file was selected
      if (uploadMethod === 'file' && selectedFile) {
        const appwrite = initializeAppwrite();
        if (!appwrite?.storage) {
          setError('Appwrite not configured. Please try again.');
          return;
        }

        try {
          const fileResponse = await appwrite.storage.createFile(
            BUCKET_ID,
            ID.unique(),
            selectedFile
          );
          
          imageUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileResponse.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
          console.log('File uploaded successfully:', fileResponse.$id);
        } catch (uploadError) {
          console.error('Error uploading file:', uploadError);
          setError('Failed to upload image file. Please try again or use the URL method.');
          return;
        }
      }
      
      const updateData = {
        src: imageUrl,
        alt: editForm.alt,
        title: editForm.title || '',
        subtitle: editForm.subtitle || '',
        ctaText: editForm.ctaText || '',
        ctaLink: editForm.ctaLink || '',
        order: editForm.order || 0,
        isActive: editForm.isActive !== false
      };

      const appwrite = initializeAppwrite();
      if (!appwrite?.databases) {
        setError('Appwrite not configured. Please try again.');
        return;
      }

      await appwrite.databases.updateDocument(
        DB_ID,
        COLLECTION_ID,
        editingBannerId!,
        updateData
      );
      
      setMessage('Banner updated successfully!');
      setEditingBannerId(null);
      setEditForm({});
      setSelectedFile(null);
      setPreviewUrl('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      fetchBanners();
    } catch (err) {
      console.error('Error updating banner:', err);
      setError('Failed to update banner');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddBanner = async () => {
    try {
      setIsSaving(true);
      
      const newBanner = {
        src: '/images/Join-Your-Uni.webp',
        alt: 'New Banner',
        title: 'New Banner',
        subtitle: 'Banner subtitle',
        ctaText: 'Click Here',
        ctaLink: '/',
        order: banners.length + 1,
        isActive: true
      };
      
      const appwrite = initializeAppwrite();
      if (!appwrite?.databases) {
        setError('Appwrite not configured. Please try again.');
        return;
      }

      await appwrite.databases.createDocument(
        DB_ID,
        COLLECTION_ID,
        ID.unique(),
        newBanner,
        [
          Permission.read(Role.any()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ]
      );
      
      setMessage('New banner added successfully!');
      fetchBanners();
    } catch (err) {
      console.error('Error adding banner:', err);
      setError('Failed to add banner');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBanner = async (bannerId: string) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        setIsSaving(true);
        const appwrite = initializeAppwrite();
        if (!appwrite?.databases) {
          setError('Appwrite not configured. Please try again.');
          return;
        }

        await appwrite.databases.deleteDocument(DB_ID, COLLECTION_ID, bannerId);
        setMessage('Banner deleted successfully!');
        fetchBanners();
      } catch (err) {
        console.error('Error deleting banner:', err);
        setError('Failed to delete banner');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleToggleActive = async (bannerId: string) => {
    try {
      const banner = banners.find(b => b.$id === bannerId);
      if (!banner) return;

      const appwrite = initializeAppwrite();
      if (!appwrite?.databases) {
        setError('Appwrite not configured. Please try again.');
        return;
      }

      await appwrite.databases.updateDocument(
        DB_ID,
        COLLECTION_ID,
        bannerId,
        { isActive: !banner.isActive }
      );
      
      setMessage('Banner status updated successfully!');
      fetchBanners();
    } catch (err) {
      console.error('Error updating banner status:', err);
      setError('Failed to update banner status');
    }
  };

  const handleReorderBanner = async (bannerId: string, direction: 'up' | 'down') => {
    const bannerIndex = banners.findIndex(b => b.$id === bannerId);
    if (bannerIndex === -1) return;

    const newIndex = direction === 'up' ? bannerIndex - 1 : bannerIndex + 1;
    if (newIndex < 0 || newIndex >= banners.length) return;

    try {
      setIsSaving(true);
      
      const appwrite = initializeAppwrite();
      if (!appwrite?.databases) {
        setError('Appwrite not configured. Please try again.');
        return;
      }

      // Update the order of the two banners
      const banner1 = banners[bannerIndex];
      const banner2 = banners[newIndex];
      
      await appwrite.databases.updateDocument(DB_ID, COLLECTION_ID, banner1.$id, { order: banner2.order });
      await appwrite.databases.updateDocument(DB_ID, COLLECTION_ID, banner2.$id, { order: banner1.order });
      
      setMessage('Banner order updated successfully!');
      fetchBanners();
    } catch (err) {
      console.error('Error reordering banner:', err);
      setError('Failed to reorder banner');
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
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-[#961c18]">
            Hero Banners Management
          </h1>
          <button
            onClick={handleAddBanner}
            disabled={isSaving}
            className="px-4 py-2 bg-[#961c18] hover:bg-[#7a1514] disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {isSaving ? 'Adding...' : 'Add New Banner'}
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
        {banners.length === 0 && !isLoading && (
          <div className="bg-yellow-900/50 border border-yellow-500 text-yellow-200 px-4 py-3 rounded-lg mb-6 text-sm sm:text-base">
            <p className="font-medium mb-2">Collection Setup Required</p>
            <p>The &apos;hero_banners&apos; collection doesn&apos;t exist yet. Please create it in your Appwrite console with these fields:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
              <li>src (string) - Image URL or path</li>
              <li>alt (string) - Alt text for accessibility</li>
              <li>title (string, optional) - Banner title</li>
              <li>subtitle (string, optional) - Banner subtitle</li>
              <li>ctaText (string, optional) - Call-to-action button text</li>
              <li>ctaLink (string, optional) - Call-to-action link</li>
              <li>order (integer) - Display order</li>
              <li>isActive (boolean) - Whether banner is active</li>
            </ul>
          </div>
        )}

        {/* Banners List */}
        <div className="space-y-6">
          {banners.map((banner, index) => (
            <div key={banner.$id} className="bg-gray-900 rounded-lg p-4 sm:p-6">
              {editingBannerId === banner.$id ? (
                /* Edit Form */
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-[#961c18] mb-4">
                    Edit Banner #{banner.order}
                  </h3>
                  
                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Banner Image</label>
                    
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
                      <input
                        type="url"
                        value={editForm.src || ''}
                        onChange={(e) => {
                          setEditForm(prev => ({ ...prev, src: e.target.value }));
                          setPreviewUrl(e.target.value);
                        }}
                        placeholder="https://example.com/image.jpg or /images/banner.png"
                        className="w-full px-3 py-2 bg-black border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#961c18]"
                      />
                    ) : (
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="w-full px-3 py-2 bg-black border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#961c18] file:text-white hover:file:bg-[#7a1514] focus:outline-none focus:border-[#961c18]"
                      />
                    )}
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Alt Text *</label>
                      <input
                        type="text"
                        value={editForm.alt || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, alt: e.target.value }))}
                        className="w-full px-3 py-2 bg-black border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#961c18]"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <input
                        type="text"
                        value={editForm.title || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 bg-black border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#961c18]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Subtitle</label>
                      <input
                        type="text"
                        value={editForm.subtitle || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, subtitle: e.target.value }))}
                        className="w-full px-3 py-2 bg-black border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#961c18]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">CTA Button Text</label>
                      <input
                        type="text"
                        value={editForm.ctaText || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, ctaText: e.target.value }))}
                        placeholder="Register Now, View Tournaments, etc."
                        className="w-full px-3 py-2 bg-black border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#961c18]"
                      />
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-2">CTA Button Link</label>
                      <input
                        type="text"
                        value={editForm.ctaLink || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, ctaLink: e.target.value }))}
                        placeholder="/register, /tournaments, https://example.com"
                        className="w-full px-3 py-2 bg-black border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#961c18]"
                      />
                    </div>
                  </div>
                  
                  {/* Image Preview */}
                  {previewUrl && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Preview</label>
                      <img
                        src={previewUrl}
                        alt="Banner preview"
                        className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-600"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/600x400/111111/FFFFFF?text=Image+Error';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={handleSaveBanner}
                      disabled={isSaving}
                      className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded font-medium transition-colors"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingBannerId(null);
                        setEditForm({});
                        setPreviewUrl('');
                        setSelectedFile(null);
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
                  {/* Banner Preview */}
                  <div className="lg:w-1/3">
                    <img
                      src={banner.src}
                      alt={banner.alt}
                      className="w-full h-48 object-cover rounded-lg border border-gray-600"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://placehold.co/600x400/111111/FFFFFF?text=Image+Error';
                      }}
                    />
                  </div>
                  
                  {/* Banner Info */}
                  <div className="lg:w-2/3 space-y-3">
                    <div className="flex items-center gap-4">
                      <h3 className="text-xl font-bold text-white">
                        {banner.title || `Banner #${banner.order}`}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        banner.isActive 
                          ? 'bg-green-900/50 text-green-200 border border-green-500'
                          : 'bg-red-900/50 text-red-200 border border-red-500'
                      }`}>
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Alt Text:</span>
                        <p className="text-white">{banner.alt}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Subtitle:</span>
                        <p className="text-white">{banner.subtitle || 'Not set'}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">CTA Text:</span>
                        <p className="text-white">{banner.ctaText || 'Not set'}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">CTA Link:</span>
                        <p className="text-white">{banner.ctaLink || 'Not set'}</p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-4">
                      <button
                        onClick={() => handleEditBanner(banner)}
                        className="px-3 py-1 bg-[#961c18] hover:bg-[#7a1514] text-white rounded text-sm font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleActive(banner.$id)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          banner.isActive
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        {banner.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      {index > 0 && (
                        <button
                          onClick={() => handleReorderBanner(banner.$id, 'up')}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                        >
                          Move Up
                        </button>
                      )}
                      {index < banners.length - 1 && (
                        <button
                          onClick={() => handleReorderBanner(banner.$id, 'down')}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                        >
                          Move Down
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteBanner(banner.$id)}
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

        {banners.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No banners found</p>
            <button
              onClick={handleAddBanner}
              disabled={isSaving}
              className="px-6 py-3 bg-[#961c18] hover:bg-[#7a1514] disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              {isSaving ? 'Creating...' : 'Add Your First Banner'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}