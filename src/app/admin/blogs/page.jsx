'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { strapiAPI, transformStrapiArticle } from '@/lib/strapi';
import { Plus, Edit, Trash2, Eye, Search, Calendar, User } from 'lucide-react';
import Link from 'next/link';
const initialFormData = {
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
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);
    const [formData, setFormData] = useState(initialFormData);
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
            const response = await strapiAPI.getArticles({
                page: currentPage,
                pageSize: articlesPerPage,
                category: selectedCategory || undefined,
                search: searchTerm || undefined,
                populate: ['image']
            });
            const transformedArticles = response.data.map(transformStrapiArticle);
            setArticles(transformedArticles);
            setTotalPages(response.meta.pagination?.pageCount || 1);
        }
        catch (error) {
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
        }
        finally {
            setIsLoading(false);
        }
    };
    const loadFilters = async () => {
        try {
            const [categoriesData, gamesData] = await Promise.all([
                strapiAPI.getCategories(),
                strapiAPI.getGames()
            ]);
            setCategories(categoriesData);
            setGames(gamesData);
        }
        catch (error) {
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
    const handleEdit = (article) => {
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
    const handleDelete = async (articleId) => {
        if (!confirm('Are you sure you want to delete this article?'))
            return;
        try {
            const response = await fetch(`/api/strapi/articles/${articleId}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            if (result.success) {
                alert('Article deleted successfully');
                loadArticles();
            }
            else {
                throw new Error(result.error || 'Failed to delete article');
            }
        }
        catch (error) {
            console.error('Error deleting article:', error);
            alert('Failed to delete article: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    };
    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Generate slug if not provided
            if (!formData.slug && formData.title) {
                formData.slug = generateSlug(formData.title);
            }
            // Create FormData for file upload
            const submitFormData = new FormData();
            submitFormData.append('title', formData.title);
            submitFormData.append('description', formData.description);
            submitFormData.append('content', formData.content);
            submitFormData.append('slug', formData.slug);
            submitFormData.append('category', formData.category);
            submitFormData.append('game', formData.game);
            submitFormData.append('author', formData.author);
            submitFormData.append('featured', formData.featured.toString());
            submitFormData.append('tags', formData.tags.join(','));
            if (formData.image) {
                submitFormData.append('image', formData.image);
            }
            let response;
            if (editingArticle) {
                // Update existing article
                response = await fetch(`/api/strapi/articles/${editingArticle.id}`, {
                    method: 'PUT',
                    body: submitFormData,
                });
            }
            else {
                // Create new article
                response = await fetch('/api/strapi/articles/create', {
                    method: 'POST',
                    body: submitFormData,
                });
            }
            const result = await response.json();
            if (result.success) {
                alert(editingArticle ? 'Article updated successfully!' : 'Article created successfully!');
                setShowCreateForm(false);
                setFormData(initialFormData);
                setEditingArticle(null);
                loadArticles();
            }
            else {
                // Handle specific Strapi connection errors
                if (result.details && result.details.includes('Strapi')) {
                    alert(`Strapi Connection Error: ${result.details}\n\nTo use blog management:\n1. Start Strapi: cd kuer && npm run develop\n2. Configure environment variables\n3. Follow STRAPI_SETUP.md guide`);
                }
                else {
                    throw new Error(result.error || 'Failed to save article');
                }
            }
        }
        catch (error) {
            console.error('Error submitting form:', error);
            let errorMessage = 'Failed to save article: ';
            if (error instanceof Error) {
                if (error.message.includes('fetch')) {
                    errorMessage += 'Cannot connect to server. Please check if Strapi is running.';
                }
                else {
                    errorMessage += error.message;
                }
            }
            else {
                errorMessage += 'Unknown error';
            }
            alert(errorMessage);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const formatDate = (dateString) => {
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
        return (<div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading admin panel...
      </div>);
    }
    // Unauthorized access
    if (!profile?.isAdmin) {
        return (<div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white gap-4">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p>You must be an admin to view this page.</p>
      </div>);
    }
    if (showCreateForm) {
        return (<div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">
              {editingArticle ? 'Edit Article' : 'Create New Article'}
            </h1>
            <button onClick={() => {
                setShowCreateForm(false);
                setFormData(initialFormData);
                setEditingArticle(null);
            }} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
              Cancel
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500" required/>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Slug</label>
                <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="Auto-generated from title" className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500"/>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="e.g., Tournament Results, News, Reviews" className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500" required/>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Game</label>
                <input type="text" value={formData.game} onChange={(e) => setFormData({ ...formData, game: e.target.value })} placeholder="e.g., PUBG Mobile, Call of Duty Mobile, Free Fire" className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500"/>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Author</label>
                <input type="text" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500"/>
              </div>

              <div className="flex items-center">
                <input type="checkbox" id="featured" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="mr-2"/>
                <label htmlFor="featured" className="text-sm font-medium">Featured Article</label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500" required/>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content *</label>
              <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={12} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500" required/>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
              <input type="text" value={formData.tags.join(', ')} onChange={(e) => setFormData({
                ...formData,
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
            })} placeholder="e.g., tournament, victory, PUBG" className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500"/>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Featured Image</label>
              <input type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] })} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500"/>
            </div>

            <div className="flex gap-4">
              <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition-colors">
                {isSubmitting ? 'Saving...' : (editingArticle ? 'Update Article' : 'Create Article')}
              </button>
              <button type="button" onClick={() => {
                setShowCreateForm(false);
                setFormData(initialFormData);
                setEditingArticle(null);
            }} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Blog Management</h1>
            <p className="text-gray-400">Manage your blog posts and articles</p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
              Back to Admin
            </Link>
            <button onClick={handleCreateNew} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
              <Plus className="w-4 h-4"/>
              Create New Article
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search articles..." className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 w-full"/>
          </div>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500">
            <option value="">All Categories</option>
            {categories.map(category => (<option key={category} value={category}>{category}</option>))}
          </select>
        </div>

        

        {/* Articles Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          {isLoading ? (<div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>) : articles.length === 0 ? (<div className="text-center py-12">
              <p className="text-gray-400">No articles found</p>
            </div>) : (<div className="overflow-x-auto">
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
                  {articles.map((article) => (<tr key={article.id} className="hover:bg-gray-750">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img className="h-12 w-12 rounded-lg object-cover" src={article.imageUrl || '/images/Join our tournaments.png'} alt={String(article.title || 'Article image')}/>
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
                          <User className="w-4 h-4 mr-1"/>
                          {String(article.author || 'Unknown Author')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1"/>
                          {formatDate(String(article.publishedAt || new Date().toISOString()))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {article.featured && (<span className="px-2 py-1 text-xs font-medium bg-yellow-900 text-yellow-200 rounded-full mr-2">
                              Featured
                            </span>)}
                          <span className="px-2 py-1 text-xs font-medium bg-green-900 text-green-200 rounded-full">
                            Published
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/blogs/${article.slug}`} className="text-blue-400 hover:text-blue-300 p-1" title="View Article">
                            <Eye className="w-4 h-4"/>
                          </Link>
                          <button onClick={() => handleEdit(article)} className="text-yellow-400 hover:text-yellow-300 p-1" title="Edit Article">
                            <Edit className="w-4 h-4"/>
                          </button>
                          <button onClick={() => handleDelete(article.id)} className="text-red-400 hover:text-red-300 p-1" title="Delete Article">
                            <Trash2 className="w-4 h-4"/>
                          </button>
                        </div>
                      </td>
                    </tr>))}
                </tbody>
              </table>
            </div>)}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (<div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage <= 1} className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              Previous
            </button>
            
            <span className="text-white">
              Page {currentPage} of {totalPages}
            </span>
            
            <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage >= totalPages} className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              Next
            </button>
          </div>)}
      </div>
    </div>);
}
