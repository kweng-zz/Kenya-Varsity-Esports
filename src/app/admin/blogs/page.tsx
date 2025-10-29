'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { contentfulAPI, transformContentfulArticle, TransformedArticle } from '@/lib/contentful';
import { Plus, Edit, Trash2, Eye, Search, Filter, Calendar, User, Tag } from 'lucide-react';
import Link from 'next/link';

interface BlogFormData {
  title: string;
  description: string;
  content: string;
  slug: string;
  category: string;
  game: string;
  author: string;
  featured: boolean;
  tags: string[];
  image?: File;
}

const initialFormData: BlogFormData = {
  title: '',
  description: '',
  content: '',
  slug: '',
  category: '',
  game: '',
  author: '',
  featured: false,
  tags: [],
};

export default function AdminBlogsPage() {
  const { user, profile, loading } = useAuth();
  const [articles, setArticles] = useState<TransformedArticle[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [games, setGames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<TransformedArticle | null>(null);
  const [formData, setFormData] = useState<BlogFormData>(initialFormData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const articlesPerPage = 10;

  useEffect(() => {
    if (!loading && profile?.isAdmin) {
      loadArticles();
      loadFilters();
    }
  }, [currentPage, selectedCategory, searchTerm, loading, profile?.isAdmin]);

  const loadArticles = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await contentfulAPI.getArticles({
        page: currentPage,
        pageSize: articlesPerPage,
        category: selectedCategory || undefined,
        search: searchTerm || undefined,
      });

      const transformedArticles = response.data;
      setArticles(transformedArticles);
      setTotalPages(response.meta?.pagination?.pageCount || 1);
    } catch (error) {
      console.error('Error loading articles:', error);
      setError('Failed to load articles. Using fallback data.');
      
      // Fallback articles for when Strapi is not available
      const fallbackArticles = [
        {
          id: '1',
          title: 'MASINDE MULIRO UNIVERSITY (MMUST) MAKES HISTORY',
          description: 'As the Only Non-Nairobi Winner in the Kenya University Esports Rankings',
          content: 'MMUST has made history by becoming the first non-Nairobi university to win the Kenya University Esports Rankings.',
          slug: 'mmust-makes-history',
          publishedAt: '2024-01-15T00:00:00.000Z',
          createdAt: '2024-01-15T00:00:00.000Z',
          updatedAt: '2024-01-15T00:00:00.000Z',
          featured: true,
          category: 'Tournament Results',
          game: 'PUBG Mobile',
          author: 'KUER Team',
          tags: ['MMUST', 'Tournament', 'Victory'],
          imageUrl: '/images/Join our tournaments.png',
          image: null
        }
      ];
      setArticles(fallbackArticles);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFilters = async () => {
    try {
      const [categoriesData, gamesData] = await Promise.all([
        contentfulAPI.getCategories(),
        contentfulAPI.getGames()
      ]);
      
      setCategories(categoriesData);
      setGames(gamesData);
    } catch (error) {
      console.error('Error loading filters:', error);
      setCategories(['Tournament Results', 'Championship', 'News', 'Reviews', 'Updates']);
      setGames(['PUBG Mobile', 'Call of Duty Mobile', 'Free Fire', 'Fortnite', 'Multiple Games']);
    }
  };

  const handleCreateNew = () => {
    setFormData({ ...initialFormData, author: profile?.fullname || 'KUER Team' });
    setEditingArticle(null);
    setShowCreateForm(true);
  };

  const handleEdit = (article: TransformedArticle) => {
    // Check if we're in fallback mode or if this is a fallback article
    if (process.env.NEXT_PUBLIC_FALLBACK_MODE === 'true' || article.id === '1') {
      alert('Demo Mode Active\n\nArticle editing is disabled in demo mode. This article is part of the demo data and cannot be modified.\n\nTo enable full functionality:\n1. Configure Contentful backend\n2. Set NEXT_PUBLIC_FALLBACK_MODE=false in .env\n3. Add CONTENTFUL_MANAGEMENT_TOKEN to .env\n4. Restart the application');
      return;
    }

    setFormData({
      title: String(article.title || ''),
      description: String(article.description || ''),
      content: String(article.content || ''),
      slug: String(article.slug || ''),
      category: String(article.category || ''),
      game: String(article.game || ''),
      author: String(article.author || ''),
      featured: Boolean(article.featured),
      tags: Array.isArray(article.tags) ? article.tags : [],
    });
    setEditingArticle(article);
    setShowCreateForm(true);
  };
  const handleDelete = async (articleId: string) => {
  if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) return;

  try {
    console.log('Attempting to delete article:', articleId);
    
    const response = await fetch(`/api/contentful/articles/${articleId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Delete response status:', response.status);

    if (!response.ok) {
      // Handle HTTP errors
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Delete result:', result);

    if (result.success) {
      alert(result.message || 'Article deleted successfully');
      loadArticles(); // Refresh the list
    } else {
      throw new Error(result.error || 'Failed to delete article');
    }

  } catch (error) {
    console.error('Error deleting article:', error);
    
    let errorMessage = 'Failed to delete article: ';
    if (error instanceof Error) {
      if (error.message.includes('Demo mode active')) {
        errorMessage = 'Demo Mode: Article deletion is disabled. Configure Contentful to enable full functionality.';
      } else if (error.message.includes('Contentful not configured')) {
        errorMessage = 'Contentful not configured. Please check your environment variables.';
      } else if (error.message.includes('Article not found')) {
        errorMessage = 'Article not found. It may have already been deleted.';
      } else {
        errorMessage += error.message;
      }
    }
    
    alert(errorMessage);
    loadArticles(); // Refresh to ensure consistent state
  }
};
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

 const handleFormSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    // Check if we're in fallback mode
    if (process.env.NEXT_PUBLIC_FALLBACK_MODE === 'true') {
      alert('Demo Mode Active\n\nArticle editing is disabled in demo mode. This is a demonstration of the admin interface.\n\nTo enable full functionality:\n1. Configure Contentful backend\n2. Set NEXT_PUBLIC_FALLBACK_MODE=false in .env\n3. Restart the application');
      setIsSubmitting(false);
      return;
    }

    // Validate required fields
    if (!formData.title || !formData.description || !formData.content || !formData.category) {
      alert('Please fill in all required fields: Title, Description, Content, and Category');
      setIsSubmitting(false);
      return;
    }

    // Generate slug if not provided
    const finalSlug = formData.slug || generateSlug(formData.title);

    // Create FormData for file upload
    const submitFormData = new FormData();
    submitFormData.append('title', formData.title);
    submitFormData.append('description', formData.description);
    submitFormData.append('content', formData.content);
    submitFormData.append('slug', finalSlug);
    submitFormData.append('category', formData.category);
    submitFormData.append('game', formData.game);
    submitFormData.append('author', formData.author);
    submitFormData.append('featured', formData.featured.toString());
    submitFormData.append('tags', formData.tags.join(','));
    
    if (formData.image) {
      submitFormData.append('image', formData.image);
      console.log('Including image in form data:', formData.image.name, formData.image.size);
    }

    let response;
    let url;
    
    if (editingArticle) {
  // Use PUT method for updates (proper RESTful approach)
  url = `/api/contentful/articles/${editingArticle.id}`; // Cleaner URL
  console.log('🔄 Updating article with PUT:', { 
    id: editingArticle.id, 
    url,
    title: formData.title,
    hasImage: !!formData.image
  });
  
  response = await fetch(url, {
    method: 'PUT', // Use PUT instead of POST
    body: submitFormData,
  });
} else {
  // Create new article (POST)
  url = '/api/contentful/articles';
  console.log('Creating new article:', { 
    url,
    title: formData.title,
    hasImage: !!formData.image
  });
  
  response = await fetch(url, {
    method: 'POST',
    body: submitFormData,
  });
}

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    // Handle non-200 responses
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server returned error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      
      // Handle specific HTTP errors
      if (response.status === 405) {
        throw new Error('Method Not Allowed: The server does not support this operation. Please try again or contact support.');
      } else if (response.status === 404) {
        throw new Error('Article not found. It may have been deleted.');
      } else if (response.status === 503) {
        throw new Error('Service temporarily unavailable. Please try again in a few moments.');
      }
      
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text);
      throw new Error('Server returned non-JJSON response. Check server logs.');
    }

    const result = await response.json();
    console.log('Response result:', result);

    if (result.success) {
      alert(editingArticle ? 'Article updated successfully!' : 'Article created successfully!');
      setShowCreateForm(false);
      setFormData(initialFormData);
      setEditingArticle(null);
      loadArticles();
    } else {
      // Handle specific error types
      if (result.error?.includes('Demo mode active')) {
        alert('Demo Mode Active\n\nArticle editing is disabled in demo mode. This is a demonstration of the admin interface.\n\nTo enable full functionality:\n1. Configure Contentful backend\n2. Set NEXT_PUBLIC_FALLBACK_MODE=false in .env\n3. Restart the application');
      } else if (result.details && (result.details.includes('Contentful') || result.details.includes('Space not found'))) {
        alert(`Contentful Connection Error: ${result.details}\n\nTo use blog management:\n1. Configure Contentful credentials in .env\n2. Run the setup script: node scripts/setup-contentful.cjs\n3. Follow CONTENTFUL_SETUP.md guide`);
      } else if (result.error?.includes('Contentful not configured')) {
        alert(`Contentful Configuration Error: ${result.error}\n\nPlease check your environment variables.`);
      } else {
        throw new Error(result.error || result.details || 'Failed to save article');
      }
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    let errorMessage = 'Failed to save article: ';
    
    if (error instanceof Error) {
      if (error.message.includes('405') || error.message.includes('Method not allowed')) {
        errorMessage = 'Editing is currently unavailable. Please try again later or contact support.';
      } else if (error.message.includes('fetch') || error.message.includes('Network')) {
        errorMessage += 'Cannot connect to server. Please check your internet connection and try again.';
      } else if (error.message.includes('JSON')) {
        errorMessage += 'Server returned an invalid response. Please check the server logs.';
      } else {
        errorMessage += error.message;
      }
    } else {
      errorMessage += 'Unknown error occurred';
    }
    
    alert(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">
              {editingArticle ? 'Edit Article' : 'Create New Article'}
            </h1>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setFormData(initialFormData);
                setEditingArticle(null);
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="Auto-generated from title"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Tournament Results, News, Reviews"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Game</label>
                <input
                  type="text"
                  value={formData.game}
                  onChange={(e) => setFormData({ ...formData, game: e.target.value })}
                  placeholder="e.g., PUBG Mobile, Call of Duty Mobile, Free Fire"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="featured" className="text-sm font-medium">Featured Article</label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={12}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) 
                })}
                placeholder="e.g., tournament, victory, PUBG"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Featured Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition-colors"
              >
                {isSubmitting ? 'Saving...' : (editingArticle ? 'Update Article' : 'Create Article')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setFormData(initialFormData);
                  setEditingArticle(null);
                }}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Blog Management
              {process.env.NEXT_PUBLIC_FALLBACK_MODE === 'true' && (
                <span className="ml-3 px-3 py-1 text-sm bg-yellow-600 text-yellow-100 rounded-full">
                  Demo Mode
                </span>
              )}
            </h1>
            <p className="text-gray-400">
              {process.env.NEXT_PUBLIC_FALLBACK_MODE === 'true' 
                ? 'Demo interface - Article creation is disabled in demo mode'
                : 'Manage your blog posts and articles'
              }
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Back to Admin
            </Link>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create New Article
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
              placeholder="Search articles..."
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 w-full"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        

        {/* Articles Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No articles found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Article
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Published
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-750">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={article.imageUrl || '/images/Join our tournaments.png'}
                              alt={String(article.title || 'Article image')}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white line-clamp-1">
                              {String(article.title || 'Untitled Article')}
                            </div>
                            <div className="text-sm text-gray-400 line-clamp-1">
                              {String(article.description || 'No description available')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-red-900 text-red-200 rounded-full">
                          {String(article.category || 'General')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {String(article.author || 'Unknown Author')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(String(article.publishedAt || new Date().toISOString()))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {article.featured && (
                            <span className="px-2 py-1 text-xs font-medium bg-yellow-900 text-yellow-200 rounded-full mr-2">
                              Featured
                            </span>
                          )}
                          <span className="px-2 py-1 text-xs font-medium bg-green-900 text-green-200 rounded-full">
                            Published
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/blogs/${article.slug}`}
                            className="text-blue-400 hover:text-blue-300 p-1"
                            title="View Article"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleEdit(article)}
                            className="text-yellow-400 hover:text-yellow-300 p-1"
                            title="Edit Article"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="text-red-400 hover:text-red-300 p-1"
                            title="Delete Article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <span className="text-white">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}