"use client";

import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { Search, ChevronDown, ChevronLeft, ChevronRight, Bookmark, BookmarkCheck, Clock, Eye } from "lucide-react";
import { contentfulAPI, transformContentfulArticle, TransformedArticle } from "@/lib/contentful";
import { ImageWithFallback } from "@/components/HydrationFix";
import { ErrorBoundary, MinimalErrorBoundary } from "@/components/ErrorBoundary";
import { ViewTracker } from "@/components/ViewTracker";
import { useAuth } from "@/contexts/AuthContext";
import { useBlogState } from "@/contexts/BlogStateContext";

// Search Input Component
const SearchInput = ({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-4 h-4" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`
        pl-10 pr-4 py-2 w-64 rounded-lg text-white placeholder-white
        border-2 border-red-900 focus:border-red-900 focus:ring-2 focus:ring-red-900
        bg-transparent outline-none transition-colors ${className || ""}
      `}
    />
  </div>
);

// Filter Dropdown Component
const FilterDropdown = ({
  value,
  onChange,
  options,
  placeholder,
  allLabel,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  allLabel: string;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between px-4 py-2 w-full rounded-lg text-white
          border-2 border-red-900 bg-transparent focus:border-red-900 focus:ring-2 focus:ring-red-900
          transition-colors ${className || ""}
        `}
      >
        <span className="truncate">{value || allLabel}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          className={`
            absolute top-full left-0 mt-1 w-full rounded-lg overflow-y-auto max-h-48
            bg-transparent border-2 border-red-900 text-white z-10
          `}
        >
          <button
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left hover:bg-red-900 transition-colors"
          >
            {allLabel}
          </button>
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-red-900 transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Blog Card Component
const BlogCard = ({ article }: { article: TransformedArticle }) => {
  const { user } = useAuth();
  const { isBookmarked, trackView } = useBlogState();
  
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getReadingTime = (description: string) => {
    const wordsPerMinute = 200;
    const wordCount = description.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  // Ensure we have a valid image URL with proper fallback
  const getImageUrl = (url?: string | null) => {
    // Handle null, undefined, or empty string
    if (!url || url === null || url === undefined || url.trim() === '') {
      return '/images/Join our tournaments.png';
    }
    
    const trimmedUrl = url.trim();
    
    // If it's already a full URL, return as is
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
      return trimmedUrl;
    }
    
    // If it starts with /uploads/, it's a Strapi upload - prepend Strapi URL
    if (trimmedUrl.startsWith('/uploads/')) {
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
      return `${strapiUrl}${trimmedUrl}`;
    }
    
    // If it starts with /, assume it's a local image
    if (trimmedUrl.startsWith('/')) {
      return trimmedUrl;
    }
    
    // Otherwise, assume it needs /images/ prefix
    return `/images/${trimmedUrl}`;
  };

  const imageUrl = getImageUrl(article.imageUrl);

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Bookmark toggle is handled by centralized state
  };

  const handleArticleClick = async () => {
    // Track view when article is clicked
    trackView(article.id);
  };

  return (
    <Link href={`/blogs/${article.slug}`} className="block h-full" onClick={handleArticleClick}>
      <div className="relative bg-black rounded-none border border-white/20 overflow-hidden shadow-2xl hover:shadow-3xl hover:shadow-red-500/20 transition-all duration-500 hover:-translate-y-2 cursor-pointer group h-full flex flex-col">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
        
        <div className="relative h-48 bg-gray-800 shrink-0">
          <ImageWithFallback
            src={imageUrl}
            alt={article.title}
            fallbackSrc="/images/Join our tournaments.png"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={() => {
              console.error('Blog image failed to load:', imageUrl);
            }}
          />
          
          {/* Gradient overlay for image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {article.featured && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-[#961c18] to-[#c41e3a] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20 z-20">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                Featured
              </span>
            </div>
          )}
          
          {/* Bookmark button */}
          <button
            onClick={handleBookmarkToggle}
            className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-full hover:bg-black/80 transition-all duration-300 z-20 group/btn"
          >
            {isBookmarked(article.id) ? (
              <BookmarkCheck className="w-4 h-4 text-[#961c18] fill-current" />
            ) : (
              <Bookmark className="w-4 h-4 text-white group-hover/btn:text-[#961c18] transition-colors" />
            )}
          </button>
          
          {/* Date badge with improved styling */}
          <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium border border-white/20 z-20">
            {formatDate(article.publishedAt)}
          </div>
        </div>

        <div className="p-6 flex flex-col flex-1 relative z-10">
          {/* Enhanced category badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-gradient-to-r from-[#961c18] to-[#c41e3a] text-white rounded-full text-xs font-bold shadow-lg">
              {article.category}
            </span>
            {article.game && (
              <span className="px-3 py-1 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-full text-xs font-semibold shadow-md">{article.game}</span>
            )}
          </div>

          {/* Enhanced typography */}
          <h3 className="text-white text-xl font-bold mb-3 group-hover:text-[#961c18] transition-colors duration-300 line-clamp-2 leading-tight">
            {article.title}
          </h3>

          <p className="text-gray-400 text-sm line-clamp-3 mb-5 flex-1 leading-relaxed">{article.description}</p>

          {/* Enhanced footer with more info */}
          <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-3 border-t border-white/10">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{getReadingTime(article.description)} min</span>
            </div>
            <ViewTracker articleId={article.id} trackView={true} />
            <span className="text-[#961c18] group-hover:text-white transition-colors font-semibold">Read More →</span>
          </div>
        </div>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
        
        {/* Animated border effect */}
        <div className="absolute inset-0 rounded-none border-2 border-transparent group-hover:border-[#961c18]/50 transition-all duration-500 pointer-events-none"></div>
        
        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
             style={{
               background: 'radial-gradient(circle at center, rgba(150, 28, 24, 0.15) 0%, transparent 70%)',
               filter: 'blur(20px)'
             }}>
        </div>
      </div>
    </Link>
  );
};

// Pagination Controls
const PaginationControls = ({
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
}: {
  currentPage: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}) => (
  <div className="flex items-center justify-center gap-4 mt-8">
    <button
      onClick={onPreviousPage}
      disabled={currentPage <= 1}
      className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <ChevronLeft className="w-4 h-4" />
      Previous
    </button>

    <span className="text-white">
      Page {currentPage} of {totalPages}
    </span>

    <button
      onClick={onNextPage}
      disabled={currentPage >= totalPages}
      className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      Next
      <ChevronRight className="w-4 h-4" />
    </button>
  </div>
);

// Main BlogsOverviewSection Component
export const BlogsOverviewSection = () => {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('BlogsOverview Error:', error, errorInfo);
        // Log to analytics or error tracking service
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'exception', {
            description: `BlogsOverview: ${error.toString()}`,
            fatal: false
          });
        }
      }}
    >
      <BlogsOverviewSectionInner />
    </ErrorBoundary>
  );
};

const BlogsOverviewSectionInner = () => {
  const [articles, setArticles] = useState<TransformedArticle[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [games, setGames] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const articlesPerPage = 6;
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Load articles and filters
  useEffect(() => {
    loadData();
  }, [currentPage, selectedCategory, selectedGame, searchTerm]);

  useEffect(() => {
    loadFilters();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      let fetchedArticles: TransformedArticle[] = [];

      const response = await contentfulAPI.getArticles({
        page: currentPage,
        pageSize: articlesPerPage,
        category: selectedCategory || undefined,
        game: selectedGame || undefined,
        search: searchTerm || undefined,
      });
      fetchedArticles = response.data;
      setTotalPages(response.meta?.pagination?.pageCount || 1);

      setArticles(fetchedArticles);
    } catch (err) {
      console.error(err);
      setError("Failed to load articles.");
    } finally {
      setLoading(false);
    }
  };

  const loadFilters = async () => {
    try {
      const [categoriesData, gamesData] = await Promise.all([contentfulAPI.getCategories(), contentfulAPI.getGames()]);
      setCategories(categoriesData);
      setGames(gamesData);
    } catch {
      setCategories(["Tournament Results", "Championship", "News", "Reviews"]);
      setGames(["PUBG Mobile", "Call of Duty Mobile", "Free Fire", "Fortnite"]);
    }
  };

  const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight =
    scrollContainerRef.current
      ? scrollPosition < scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth
      : articles.length > 2;

  return (
    <section id="articles" className="bg-black py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
          <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search articles..." />

          <div className="flex items-center gap-4">
            <FilterDropdown
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={categories}
              placeholder="All Categories"
              allLabel="All Categories"
            />
            <FilterDropdown
              value={selectedGame}
              onChange={setSelectedGame}
              options={games}
              placeholder="All Games"
              allLabel="All Games"
            />
          </div>
        </div>

        {/* Articles Section */}
        <div className="min-h-[600px] relative">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#961c18] mx-auto mb-4"></div>
                <p className="text-[#aaaaaa] text-lg">Loading articles...</p>
              </div>
            </div>
          ) : articles.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-[#aaaaaa] text-lg">No articles found matching your criteria.</p>
            </div>
          ) : (
            <>
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
              >
                 {articles.map((article) => (
                   <div key={article.id} className="flex-none w-80">
                     <MinimalErrorBoundary>
                       <BlogCard article={article} />
                     </MinimalErrorBoundary>
                   </div>
                 ))}
               </div>

              {canScrollLeft && (
                <button
                  onClick={scrollLeft}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {canScrollRight && (
                <button
                  onClick={scrollRight}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
          />
        )}
      </div>
    </section>
  );
};
