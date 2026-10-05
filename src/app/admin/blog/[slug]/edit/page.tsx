'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Loader2, Save, Eye, ArrowLeft, Image as ImageIcon, Bold, Italic, Type, List, Quote, Code, Link2, Minus, Maximize2, Minimize2, Trash2, AlertTriangle, X } from 'lucide-react';

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
export default function AdminBlogEditPage() {
  const { profile } = useAuth();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!profile?.isAdmin) {
      router.push('/');
      return;
    }
    loadPost();
  }, [profile, slug, router]);

  const loadPost = async () => {
    try {
      const response = await fetch(`/api/admin/blog/${slug}`);
      const data = await response.json();
      
      if (data.success) {
        setPost(data.data);
      } else {
        setError(data.error || 'Post not found');
        router.push('/admin/blog');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load post');
      router.push('/admin/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setPost(prev => prev ? ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString(),
    }) : null);
  };

  const handleTagChange = (tags: string) => {
    const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    setPost(prev => prev ? ({ ...prev, tags: tagArray }) : null);
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
            setPost(prev => prev ? ({ ...prev, imageUrl: data.data.url }) : null);
          } else {
            setPost(prev => prev ? ({ 
              ...prev, 
              content: prev.content + (prev.content ? '\n\n' : '') + data.data.markdown 
            }) : null);
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
    if (!post) return;
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

    setSaving(true);
    setError(null);

    try {
      const postData = {
        ...post,
        published: publish,
        publishedAt: publish && !post.published ? new Date().toISOString() : post.publishedAt,
      };

      const response = await fetch(`/api/admin/blog/${post.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      const data = await response.json();

      if (data.success) {
        setPost(data.data);
        setSuccess(publish ? 'Article published successfully!' : 'Article saved successfully!');
      } else {
        setError(data.error || 'Failed to save');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/blog/${post.slug}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        router.push('/admin/blog');
      } else {
        setError(data.error || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  if (!profile?.isAdmin) {
    return <div>Access denied</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 border-4 border-[#8c110d] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!post) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">Post not found</div>;
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
            <h1 className="text-xl font-bold">Edit: {post.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/blogs/${post.slug}`} target="_blank" className="px-4 py-2 text-gray-400 hover:text-white font-medium transition-colors">
              <Eye className="w-4 h-4 inline mr-1" /> View
            </Link>
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-4 py-2 border-2 border-gray-700 hover:border-[#8c110d] text-gray-300 hover:text-white font-medium rounded transition-all disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="px-5 py-2 bg-gradient-to-r from-[#8c110d] to-[#b91c17] hover:from-[#b91c17] hover:to-[#8c110d] text-white font-medium rounded transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Publish'}
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
                    className="flex-1 px-4 py-3 bg-black border-2 border-gray-700 focus:border-[#8c110d] text-white placeholder-gray-500 rounded-r-lg outline-none transition-colors font-mono text-sm"
                  />
                </div>
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
                    onClick={() => setPost(prev => prev ? ({ ...prev, imageUrl: '' }) : null)}
                    className="absolute top-2 right-2 p-1 bg-black/80 rounded-full text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="text-xs text-gray-500">No cover image selected.</p>
              )}
            </div>

            {/* Markdown Editor */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
              <div className="bg-gray-800 border-b border-gray-700 p-2 flex flex-wrap gap-1">
                <button type="button" onClick={() => wrapSelection('**', '**')} className="p-2 text-gray-400 hover:text-white rounded transition-colors" title="Bold"><Bold className="w-4 h-4" /></button>
                <button type="button" onClick={() => wrapSelection('*', '*')} className="p-2 text-gray-400 hover:text-white rounded transition-colors" title="Italic"><Italic className="w-4 h-4" /></button>
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

              <div className="p-4">
                {showPreview ? (
                  <div className="prose prose-invert prose-lg max-w-none min-h-[400px] p-4 bg-black rounded-lg border border-gray-800">
                    <p className="text-gray-500 italic">Preview mode - use react-markdown in production</p>
                  </div>
                ) : (
                  <textarea
                    value={post.content}
                    onChange={(e) => handleChange('content', e.target.value)}
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold uppercase tracking-wider">Publish Settings</h3>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${post.published ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-yellow-900/30 text-yellow-400 border border-yellow-800'}`}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
              </div>
              
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={post.published}
                    onChange={(e) => handleChange('published', e.target.checked)}
                    className="w-4 h-4 accent-[#8c110d]"
                  />
                  <span className="text-white">Published</span>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={post.featured}
                    onChange={(e) => handleChange('featured', e.target.checked)}
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
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Game</label>
                <select
                  value={post.game}
                  onChange={(e) => handleChange('game', e.target.value)}
                  className="w-full px-4 py-2 bg-black border-2 border-gray-700 focus:border-[#8c110d] text-white rounded-lg outline-none transition-colors"
                >
                  {GAMES.map(game => <option key={game} value={game}>{game}</option>)}
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

            {/* Danger Zone */}
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Danger Zone
              </h3>
              <p className="text-gray-400 text-sm">Deleting this article is permanent and cannot be undone.</p>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete Article
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border-2 border-red-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-red-400 mb-4">Delete Article?</h3>
            <p className="text-gray-300 mb-6">This will permanently delete "{post.title}". This action cannot be undone.</p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {deleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
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