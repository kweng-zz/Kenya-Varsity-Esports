'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, ExternalLink, Calendar, Clock, Trash2, Search, Filter, ChevronDown, Grid, List, Eye, Heart, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useBlogState } from '@/contexts/BlogStateContext';
import { TransformedArticle } from '@/lib/contentful';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface BookmarkWithArticle {
  article_id: string;
  user_id: string;
  created_at: string;
  article?: TransformedArticle;
}

const BookmarkManagementPage = () => {
  const { user } = useAuth();
  const { isBookmarked, getLikeCount, getViewCount } = useBlogState();
  const [bookmarks, setBookmarks] = useState<BookmarkWithArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'views'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const userId = user?.$id || 'anonymous';

  // Fetch bookmarks
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/articles/bookmarks?userId=${userId}&page=${page}&limit=12`);
        const data = await response.json();
        
        if (data.success) {
          // Fetch full article details for each bookmark
          const bookmarksWithArticles = await Promise.all(
            data.data.bookmarks.map(async (bookmark: BookmarkWithArticle) => {
              try {
                // Try to fetch article from Contentful API
                const articleResponse = await fetch(`/api/articles/content/${bookmark.article_id}`);
                if (articleResponse.ok) {
                  const articleData = await articleResponse.json();
                  return { ...bookmark, article: articleData.data };
                }
                
                // Fallback: create minimal article object
                return {
                  ...bookmark,
                  article: {
                    id: bookmark.article_id,
                    title: `Article ${bookmark.article_id}`,
                    slug: bookmark.article_id,
                    description: 'Article description not available',
                    publishedAt: bookmark.created_at,
                    category: 'Blog',
                    imageUrl: '/images/Join our tournaments.png'
                  } as TransformedArticle
                };
              } catch (err) {
                console.error('Error fetching article details:', err);
                return {
                  ...bookmark,
                  article: {
                    id: bookmark.article_id,
                    title: `Article ${bookmark.article_id}`,
                    slug: bookmark.article_id,
                    description: 'Article description not available',
                    publishedAt: bookmark.created_at,
                    category: 'Blog',
                    imageUrl: '/images/Join our tournaments.png'
                  } as TransformedArticle
                };
              }
            })
          );
          
          setBookmarks(bookmarksWithArticles);
          setTotal(data.data.pagination.total);
          setTotalPages(data.data.pagination.totalPages);
        } else {
          setError(data.message || 'Failed to fetch bookmarks');
        }
      } catch (err) {
        console.error('Error fetching bookmarks:', err);
        setError('Failed to load bookmarks');
      } finally {
        setLoading(false);
      }
    };

    if (userId && userId !== 'anonymous') {
      fetchBookmarks();
    } else {
      setLoading(false);
    }
  }, [userId, page]);

  // Filter and sort bookmarks
  const filteredBookmarks = bookmarks
    .filter(bookmark => 
      bookmark.article && (
        bookmark.article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (bookmark.article.category && bookmark.article.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (bookmark.article.game && bookmark.article.game.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    )
    .sort((a, b): number => {
      switch (sortBy) {
        case 'date':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'title':
          return a.article?.title.localeCompare(b.article?.title || '') ?? 0;
        case 'views':
          return (getViewCount(b.article_id) ?? 0) - (getViewCount(a.article_id) ?? 0);
        default:
          return 0;
      }
    });

  const handleRemoveBookmark = async (articleId: string) => {
    try {
      const response = await fetch(`/api/articles/${articleId}/bookmarks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, userId })
      });
      
      if (response.ok) {
        // Remove from local state
        setBookmarks(prev => prev.filter(b => b.article_id !== articleId));
        setTotal(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error removing bookmark:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (userId === 'anonymous' || !user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Bookmark className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
          <p className="text-gray-400 mb-6">Please sign in to view and manage your bookmarked articles.</p>
          <Link 
            href="/auth" 
            className="inline-block bg-[#961c18] hover:bg-[#b41e3a] text-white px-6 py-3 rounded-lg transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#961c18]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#961c18] hover:bg-[#b41e3a] text-white px-6 py-3 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-[#961c18]" />
            My Bookmarks
          </h1>
          <p className="text-gray-400">
            {total} {total === 1 ? 'bookmark' : 'bookmarks'} saved
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center flex-1">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search bookmarks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#961c18] focus:border-2"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'views')}
                className="appearance-none bg-gray-900 border border-white/20 rounded-lg px-4 py-3 pr-10 text-white focus:outline-none focus:border-[#961c18]"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="views">Sort by Views</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-[#961c18] text-white' 
                  : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-[#961c18] text-white' 
                  : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bookmarks Display */}
        {filteredBookmarks.length === 0 ? (
          <div className="text-center py-16">
            <Bookmark className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold mb-2 text-gray-300">
              {searchTerm ? 'No bookmarks found' : 'No bookmarks yet'}
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? 'Try adjusting your search terms or filters.'
                : 'Start bookmarking articles to see them here.'
              }
            </p>
            {!searchTerm && (
              <Link 
                href="/blogs"
                className="inline-block mt-4 bg-[#961c18] hover:bg-[#b41e3a] text-white px-6 py-3 rounded-lg transition-colors"
              >
                Browse Articles
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredBookmarks.map((bookmark) => (
                  <div key={bookmark.article_id} className="bg-gray-900 border border-white/20 rounded-lg overflow-hidden hover:border-[#961c18]/50 transition-all duration-300 group">
                    {/* Article Image */}
                    <div className="relative h-48 bg-gray-800">
                      <img
                        src={bookmark.article?.imageUrl || '/images/Join our tournaments.png'}
                        alt={bookmark.article?.title || 'Article'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Remove Bookmark Button */}
                      <button
                        onClick={() => handleRemoveBookmark(bookmark.article_id)}
                        className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-full hover:bg-red-500/80 transition-all duration-300 opacity-0 group-hover:opacity-100"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                      
                      {/* Date Badge */}
                      <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs">
                        {formatDate(bookmark.created_at)}
                      </div>
                    </div>

                    {/* Article Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-[#961c18] transition-colors">
                        {bookmark.article?.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                        {bookmark.article?.description}
                      </p>
                      
                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {getViewCount(bookmark.article_id) || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {getLikeCount(bookmark.article_id) || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {bookmark.article?.category}
                          </span>
                        </div>
                        <Link
                          href={`/blogs/${bookmark.article?.slug}`}
                          className="text-[#961c18] hover:text-white transition-colors flex items-center gap-1"
                        >
                          Read <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-4 mb-8">
                {filteredBookmarks.map((bookmark) => (
                  <div key={bookmark.article_id} className="bg-gray-900 border border-white/20 rounded-lg p-6 hover:border-[#961c18]/50 transition-all duration-300 group">
                    <div className="flex items-start gap-4">
                      {/* Article Image */}
                      <div className="w-24 h-24 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={bookmark.article?.imageUrl || '/images/Join our tournaments.png'}
                          alt={bookmark.article?.title || 'Article'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Article Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-white text-lg group-hover:text-[#961c18] transition-colors line-clamp-2">
                            {bookmark.article?.title}
                          </h3>
                          <button
                            onClick={() => handleRemoveBookmark(bookmark.article_id)}
                            className="p-2 bg-black/60 backdrop-blur-md rounded-full hover:bg-red-500/80 transition-all duration-300 opacity-0 group-hover:opacity-100"
                            title="Remove bookmark"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                        
                        <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                          {bookmark.article?.description}
                        </p>
                        
                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(bookmark.created_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {getViewCount(bookmark.article_id) || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {getLikeCount(bookmark.article_id) || 0}
                            </span>
                          </div>
                          <Link
                            href={`/blogs/${bookmark.article?.slug}`}
                            className="text-[#961c18] hover:text-white transition-colors flex items-center gap-1 text-sm font-medium"
                          >
                            Read <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  disabled={page <= 1}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                <span className="text-white">
                  Page {page} of {totalPages}
                </span>
                
                <button
                  onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={page >= totalPages}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Wrap with error boundary
export default function BookmarkManagementPageWrapper() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Bookmark Management Error:', error, errorInfo);
      }}
    >
      <BookmarkManagementPage />
    </ErrorBoundary>
  );
}