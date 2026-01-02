"use client";

import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { contentfulAPI, transformContentfulArticle, TransformedArticle } from "@/lib/contentful";
import { ImageWithFallback } from "@/components/HydrationFix";

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
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

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

  return (
    <Link href={`/blogs/${article.slug}`}>
      <div className="bg-black rounded-none border border-white/50 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
        <div className="relative h-48 bg-gray-800">
          <ImageWithFallback
            src={imageUrl}
            alt={article.title}
            fallbackSrc="/images/Join our tournaments.png"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => {
              console.error('Blog image failed to load:', imageUrl);
            }}
          />
          
          {article.featured && (
            <div className="absolute top-2 left-2 bg-[#961c18] text-white px-2 py-1 rounded text-xs font-semibold">
              Featured
            </div>
          )}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
            {formatDate(article.publishedAt)}
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-2 py-1 bg-[#961c18] text-white rounded text-xs">
              {article.category}
            </span>
            {article.game && (
              <span className="px-2 py-1 bg-gray-700 text-white rounded text-xs">{article.game}</span>
            )}
          </div>

          <h3 className="text-white text-xl font-bold mb-2 group-hover:text-[#961c18] transition-colors line-clamp-2">
            {article.title}
          </h3>

          <p className="text-gray-400 text-sm line-clamp-3 mb-4">{article.description}</p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>By {article.author}</span>
            <span className="text-[#961c18] group-hover:text-white transition-colors">Read More →</span>
          </div>
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
                    <BlogCard article={article} />
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
