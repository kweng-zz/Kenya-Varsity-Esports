'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Loader2, Save, Eye, ArrowLeft, Image as ImageIcon, Bold, Italic, Type, List, Quote, Code, Link2, Minus, Maximize2, Minimize2, X } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  slug: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  category: string;
  game: string;
  author: string;
  authorAvatar?: string;
  authorBio?: string;
  authorTwitter?: string;
  authorLinkedIn?: string;
  authorInstagram?: string;
  authorTikTok?: string;
  authorYouTube?: string;
  authorFacebook?: string;
  tags: string[];
  imageUrl?: string;
  image?: any;
  published: boolean;
}

const CATEGORIES = ['Tournament Results', 'Championship', 'News', 'Reviews', 'Updates', 'General'];
const GAMES = ['PUBG Mobile', 'Call of Duty Mobile', 'Free Fire', 'Fortnite', 'Multiple Games', 'General'];

export default function AdminBlogNewPage() {
  const { profile } = useAuth();
  const router = useRouter();
  
  const [post, setPost] = useState<BlogPost>({
    id: '',
    title: '',
    description: '',
    content: '',
    slug: '',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    featured: false,
    category: 'News',
    game: 'General',
    author: 'KVE Team',
    authorAvatar: '',
    authorBio: '',
    authorTwitter: '',
    authorLinkedIn: '',
    authorInstagram: '',
    authorTikTok: '',
    authorYouTube: '',
    authorFacebook: '',
    tags: [],
    imageUrl: '',
    image: null,
    published: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!profile?.isAdmin) {
      router.push('/');
    }
  }, [profile, router]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleChange = (field: string, value: any) => {
    setPost(prev => ({
      ...prev,
      [field]: value,
      slug: field === 'title' && !post.slug ? generateSlug(value) : prev.slug,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleTagChange = (tags: string) => {
    const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    setPost(prev => ({ ...prev, tags: tagArray }));
  };

  const handleImageUpload = async (type: 'cover' | 'body') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp,image/gif';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        alert('Invalid file type. Allowed: jpg, png, webp, gif');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File too large. Max 5MB');
        return;
      }

      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      try {
        const response = await fetch('/api/admin/blog/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        
        if (data.success) {
          if (type === 'cover') {
            setPost(prev => ({ ...prev, imageUrl: data.data.url }));
          } else {
            setPost(prev => ({ 
              ...prev, 
              content: prev.content + (prev.content ? '\n\n' : '') + data.data.markdown 
            }));
          }
          setSuccess('Image uploaded successfully');
        } else {
          setError(data.error || 'Upload failed');
        }
      } catch (err) {
        console.error(err);
        setError('Upload failed');
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  const handleSave = async (publish = false) => {
    if (!post.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!post.content.trim()) {
      setError('Content is required');
      return;
    }
    if (!post.slug.trim()) {
      setError('Slug is required');
      return;
    }
    if (!/^[a-z0-9-]+$/.test(post.slug)) {
      setError('Slug must contain only lowercase letters, numbers, and hyphens');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const postData = {
        ...post,
        published: publish,
        publishedAt: publish ? new Date().toISOString() : post.publishedAt,
      };

      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      const data = await response.json();

      if (data.success) {
        setSuccess(publish ? 'Article published successfully!' : 'Article saved as draft!');
        setTimeout(() => router.push(`/admin/blog/${data.data.slug}/edit`), 1500);
      } else {
        setError(data.error || 'Failed to save');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!profile?.isAdmin) {
    return <div>Access denied</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-black border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/blog" className="p-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold">New Article</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/blog" className="px-4 py-2 text-gray-400 hover:text-white font-medium transition-colors">
              Cancel
            </Link>
            <button
              onClick={() => handleSave(false)}
              disabled={loading}
              className="px-4 py-2 border-2 border-gray-700 hover:border-[#8c110d] text-gray-300 hover:text-white font-medium rounded transition-all disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={loading}
              className="px-5 py-2 bg-gradient-to-r from-[#8c110d] to-[#b91c17] hover:from-[#b91c17] hover:to-[#8c110d] text-white font-medium rounded transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? 'Saving...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-800 text-red-300 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">×</button>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-800 text-green-300 rounded-lg flex items-center justify-between">
            <span>{success}</span>
            <button onClick={() => setSuccess(null)} className="text-green-400 hover:text-green-300">×</button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Slug */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Title *</label>
                <input
                  type="text"
                  value={post.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter article title..."
                  className="w-full px-4 py-3 bg-black border-2 border-gray-700 focus:border-[#8c110d] text-white placeholder-gray-500 rounded-lg outline-none transition-colors text-lg font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Slug *</label>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-3 bg-gray-800 border-2 border-gray-700 text-gray-400 rounded-l-lg font-mono text-sm">/blogs/</span>
                  <input
                    type="text"
                    value={post.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    placeholder="auto-generated-from-title"
                    className="flex-1 px-4 py-3 bg-black border-2 border-gray-700 focus:border-[#8c110d] text-white placeholder-gray-500 rounded-r-lg outline-none transition-colors font-mono text-sm"
                  />
                </div>
                <p className="text-xs text-gray-500">URL-friendly identifier. Lowercase letters, numbers, and hyphens only.</p>
              </div>
            </div>

            {/* Cover Image */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-400">Cover Image</label>
                <button
                  onClick={() => handleImageUpload('cover')}
                  disabled={uploading}
                  className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider bg-gray-800 border border-gray-700 hover:border-[#8c110d] text-gray-300 hover:text-white rounded transition-colors disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
              {post.imageUrl ? (
                <div className="relative max-w-md">
                  <img src={post.imageUrl} alt="Cover preview" className="w-full h-auto rounded-lg border border-gray-700" />
                  <button
                    onClick={() => setPost(prev => ({ ...prev, imageUrl: '' }))}
                    className="absolute top-2 right-2 p-1 bg-black/80 rounded-full text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="text-xs text-gray-500">No cover image selected. Will use default fallback.</p>
              )}
            </div>

            {/* Markdown Editor */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
              {/* Toolbar */}
              <div className="bg-gray-800 border-b border-gray-700 p-2 flex flex-wrap gap-1">
                <button type="button" onClick={() => wrapSelection('**', '**')} className="p-2 text-gray-400 hover:text-white rounded transition-colors" title="Bold (Ctrl+B)"><Bold className="w-4 h-4" /></button>
                <button type="button" onClick={() => wrapSelection('*', '*')} className="p-2 text-gray-400 hover:text-white rounded transition-colors" title="Italic (Ctrl+I)"><Italic className="w-4 h-4" /></button>
                <button type="button" onClick={() => wrapSelection('### ', '')} className="p-2 text-gray-400 hover:text-white rounded transition-colors" title="Heading"><Type className="w-4 h-4" /></button>
                <button type="button" onClick={() => wrapSelection('- ', '')} className="p-2 text-gray-400 hover:text-white rounded transition-colors" title="Bullet List"><List className="w-4 h-4" /></button>
                <button type="button" onClick={() => wrapSelection('1. ', '')} className="p-2 text-gray-400 hover:text-white rounded transition-colors" title="Numbered List"><Type className="w-4 h-4" /></button>
                <button type="button" onClick={() => wrapSelection('> ', '')} className="p-2 text-gray-400 hover:text-white rounded transition-colors" title="Blockquote"><Quote className="w-4 h-4" /></button>
                <button type="button" onClick={() => wrapSelection('`', '`')} className="p-2 text-gray-400 hover:text-white rounded transition-colors" title="Inline Code"><Code className="w-4 h-4" /></button>
                <button type="button" onClick={() => wrapSelection('```\n', '\n```')} className="p-2 text-gray-400 hover:text-white rounded transition-colors" title="Code Block"><Code className="w-4 h-4" /></button>
                <button type="button" onClick={() => insertLink()} className="p-2 text-gray-400 hover:text-white rounded transition-colors" title="Link"><Link2 className="w-4 h-4" /></button>
                <button type="button" onClick={() => handleImageUpload('body')} className="p-2 text-gray-400 hover:text-white rounded transition-colors" title="Insert Image"><ImageIcon className="w-4 h-4" /></button>
                <button type="button" onClick={() => wrapSelection('\n---\n', '')} className="p-2 text-gray-400 hover:text-white rounded transition-colors" title="Horizontal Rule"><Minus className="w-4 h-4" /></button>
                <div className="w-px h-6 bg-gray-700 mx-1" />
                <button type="button" onClick={() => setShowPreview(!showPreview)} className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider rounded transition-colors ${showPreview ? 'bg-[#8c110d] text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                  {showPreview ? <Minimize2 className="w-3 h-3 inline mr-1" /> : <Maximize2 className="w-3 h-3 inline mr-1" />} {showPreview ? 'Edit' : 'Preview'}
                </button>
              </div>

              {/* Editor / Preview */}
              <div className="p-4">
                {showPreview ? (
                  <div className="prose prose-invert prose-lg max-w-none min-h-[400px] p-4 bg-black rounded-lg border border-gray-800">
                    {post.content ? (
                      <div>Rendered preview would go here - in production use react-markdown</div>
                    ) : (
                      <p className="text-gray-500 italic">Start writing your article...</p>
                    )}
                  </div>
                ) : (
                  <textarea
                    value={post.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                    placeholder="Write your article in Markdown..."
                    className="w-full min-h-[500px] px-4 py-4 bg-black border-2 border-gray-700 focus:border-[#8c110d] text-white placeholder-gray-500 rounded-lg outline-none transition-colors font-mono text-sm resize-y"
                    spellCheck={false}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 space-y-6">
              <h3 className="text-lg font-bold uppercase tracking-wider">Publish Settings</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={post.published}
                      onChange={() => setPost(prev => ({ ...prev, published: true }))}
                      className="w-4 h-4 accent-[#8c110d]"
                    />
                    <span className="text-white">Published</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={!post.published}
                      onChange={() => setPost(prev => ({ ...prev, published: false }))}
                      className="w-4 h-4 accent-[#8c110d]"
                    />
                    <span className="text-gray-400">Draft</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={post.featured}
                    onChange={(e) => setPost(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4 accent-[#8c110d]"
                  />
                  <span className="text-white">Featured Article</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Published Date</label>
                <input
                  type="datetime-local"
                  value={post.publishedAt.slice(0, 16)}
                  onChange={(e) => handleChange('publishedAt', e.target.value + ':00.000Z')}
                  className="w-full px-4 py-2 bg-black border-2 border-gray-700 focus:border-[#8c110d] text-white rounded-lg outline-none transition-colors"
                />
              </div>
            </div>

            {/* Categories & Tags */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 space-y-6">
              <h3 className="text-lg font-bold uppercase tracking-wider">Organization</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Category *</label>
                <select
                  value={post.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-4 py-2 bg-black border-2 border-gray-700 focus:border-[#8c110d] text-white rounded-lg outline-none transition-colors"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Game</label>
                <select
                  value={post.game}
                  onChange={(e) => handleChange('game', e.target.value)}
                  className="w-full px-4 py-2 bg-black border-2 border-gray-700 focus:border-[#8c110d] text-white rounded-lg outline-none transition-colors"
                >
                  {GAMES.map(game => (
                    <option key={game} value={game}>{game}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={post.tags.join(', ')}
                  onChange={(e) => handleTagChange(e.target.value)}
                  placeholder="esports, tournament, university"
                  className="w-full px-4 py-2 bg-black border-2 border-gray-700 focus:border-[#8c110d] text-white placeholder-gray-500 rounded-lg outline-none transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">Press Enter or comma to separate tags</p>
              </div>
            </div>

            {/* Author Info */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-bold uppercase tracking-wider">Author</h3>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Author Name</label>
                <input
                  type="text"
                  value={post.author}
                  onChange={(e) => handleChange('author', e.target.value)}
                  className="w-full px-4 py-2 bg-black border-2 border-gray-700 focus:border-[#8c110d] text-white rounded-lg outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Author Bio</label>
                <textarea
                  value={post.authorBio || ''}
                  onChange={(e) => handleChange('authorBio', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-black border-2 border-gray-700 focus:border-[#8c110d] text-white placeholder-gray-500 rounded-lg outline-none transition-colors resize-y"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function wrapSelection(prefix: string, suffix: string) {
  const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
  if (!textarea) return;
  
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const selected = text.substring(start, end);
  
  textarea.value = text.substring(0, start) + prefix + selected + suffix + text.substring(end);
  textarea.focus();
  textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
}

function insertLink() {
  const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
  if (!textarea) return;
  
  const url = prompt('Enter URL:');
  if (!url) return;
  
  const text = prompt('Enter link text:', 'Link');
  if (!text) return;
  
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const before = textarea.value.substring(0, start);
  const after = textarea.value.substring(end);
  
  textarea.value = before + `[${text}](${url})` + after;
  textarea.focus();
}