'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Edit, Trash2, Eye, Loader2, Search, Filter, X } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  category: string;
  game: string;
  author: string;
  tags: string[];
  published: boolean;
}

interface AdminBlogsPageProps {
  searchParams?: Promise<{ page?: string }>;
}

export default function AdminBlogsPage({ searchParams }: AdminBlogsPageProps) {
  const { user, profile } = useAuth();
  const router = useRouter();
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const pageSize = 20;

  useEffect(() => {
    if (!loading && !profile?.isAdmin) {
      router.push('/');
      return;
    }
    if (profile?.isAdmin) {
      loadPosts();
      loadFilters();
    }
  }, [profile, currentPage, searchTerm]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        includeDrafts: 'true',
      });
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/admin/blog?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.data);
        setTotalPages(data.meta.pagination.pageCount);
        setTotalPosts(data.meta.pagination.total);
      } else {
        setError(data.error || 'Failed to load posts');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const loadFilters = async () => {
    try {
      const response = await fetch('/api/admin/blog');
      // Categories/games/authors loaded but not used in this simplified version
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return;
    
    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        setPosts(posts.filter(p => p.id !== id));
        setTotalPosts(totalPosts - 1);
      } else {
        alert(data.error || 'Failed to delete post');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete post');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 border-4 border-[#8c110d] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!profile?.isAdmin) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="text-gray-400">You must be an admin to view this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Blog Management</h1>
            <p className="text-gray-400">Create, edit, and manage blog articles</p>
          </div>
          <Link href="/admin/blog/new" className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#8c110d] to-[#b91c17] hover:from-[#b91c17] hover:to-[#8c110d] text-white font-black uppercase tracking-wider transition-all duration-300">
            <Plus className="w-5 h-5" />
            New Article
          </Link>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2 rounded-lg text-white placeholder-gray-400 border-2 border-gray-700 focus:border-[#8c110d] focus:ring-2 focus:ring-[#8c110d]/20 bg-black outline-none transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-800 text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {/* Posts Table */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Author</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Updated</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400">
                      <Loader2 className="w-8 h-8 border-2 border-[#8c110d] border-t-transparent animate-spin mx-auto mb-4" />
                      Loading posts...
                    </td>
                  </tr>
                ) : posts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400">No articles found</td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-white truncate max-w-xs">{post.title}</div>
                          <div className="text-xs text-gray-500">/{post.slug}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-gray-800 border border-gray-700 text-gray-300 text-xs font-medium uppercase tracking-wider rounded">
                          {post.category}
                        </span>
                        {post.game && (
                          <span className="ml-2 px-2 py-1 bg-gray-700 border border-gray-600 text-gray-400 text-xs font-medium uppercase tracking-wider rounded">
                            {post.game}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-gray-300">{post.author}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                          post.published 
                            ? 'bg-green-900/30 text-green-400 border border-green-800' 
                            : 'bg-yellow-900/30 text-yellow-400 border border-yellow-800'
                        }`}>
                          {post.featured && <span className="mr-1">★</span>}
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400 text-sm">{formatDate(post.updatedAt)}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/blogs/${post.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-white transition-colors" title="View">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link href={`/admin/blog/${post.slug}/edit`} className="p-2 text-gray-400 hover:text-white transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            disabled={deletingId === post.id}
                            className="p-2 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50" title="Delete"
                          >
                            {deletingId === post.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-800 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Page {currentPage} of {totalPages} ({totalPosts} total)
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || loading}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 hover:border-[#8c110d] text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || loading}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 hover:border-[#8c110d] text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}