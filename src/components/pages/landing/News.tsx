
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { strapiAPI, transformStrapiArticle, TransformedArticle } from '@/lib/strapi';

// Define the TypeScript interface for a single news article's data.
interface NewsArticle {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
  date: string;
  slug: string;
}

// Define the props for the NewsCard component.
interface NewsCardProps {
  article: NewsArticle;
}

// A reusable component for a single news card with hover animations.
const NewsCard = ({ article }: NewsCardProps) => {
  const { date, category, title, description, imageUrl, slug } = article;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).toUpperCase();
  };

  // Ensure we have a valid image URL with proper fallback
  const getImageUrl = (url?: string) => {
    if (!url) return '/images/Join our tournaments.png';
    
    // If it's already a full URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it starts with /, it's already a proper path
    if (url.startsWith('/')) {
      return url;
    }
    
    // Otherwise, assume it needs /images/ prefix
    return `/images/${url}`;
  };

  const displayImageUrl = getImageUrl(imageUrl);
  const linkHref = `/blogs/${slug}`;

  return (
    <Link href={linkHref}>
      <div className="bg-black rounded-none overflow-hidden shadow-lg w-full cursor-pointer group transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-red-500/20 hover:-translate-y-2 hover:bg-[#252525] relative">
        {/* Image section with date overlay */}
        <div className="w-full h-48 bg-gray-800 relative">
          <img
            src={displayImageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              const target = e.target as HTMLImageElement;
              console.error('Image failed to load:', displayImageUrl);
              target.onerror = null;
              // Try fallback image first
              if (target.src !== '/images/Join our tournaments.png') {
                target.src = '/images/Join our tournaments.png';
              } else {
                // If even fallback fails, use placeholder
                target.src = `https://placehold.co/400x192/1a1a1a/ffffff?text=KUER+NEWS`;
              }
            }}
          />
          
          {/* Date badge */}
          <div className="absolute top-2 left-2 bg-black bg-opacity-50 group-hover:bg-opacity-70 text-white text-xs font-semibold px-3 py-1 rounded transition-all duration-300 ease-in-out">
            {formatDate(date)}
          </div>
        </div>
        {/* Content section */}
        <div className="p-6 transition-all duration-300 ease-in-out">
          <p className="text-red-500 group-hover:text-red-400 text-xs font-bold uppercase tracking-wider transition-colors duration-300 ease-in-out">{category}</p>
          <h3 className="text-white group-hover:text-red-100 text-xl font-bold mt-2 mb-3 leading-tight transition-colors duration-300 ease-in-out">{title}</h3>
          <p className="text-gray-400 group-hover:text-gray-300 text-sm leading-relaxed transition-colors duration-300 ease-in-out">{description}</p>
        </div>

        {/* Animated border effect */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-500/50 rounded-none transition-all duration-300 ease-in-out pointer-events-none"></div>

        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out pointer-events-none"
             style={{
               background: 'radial-gradient(circle at center, rgba(143, 18, 14, 0.1) 0%, transparent 70%)'
             }}>
        </div>
      </div>
    </Link>
  );
};

// The main component for the "Latest News" section.
const LatestNews = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from Strapi directly using the same approach as blogs page
        if (process.env.NEXT_PUBLIC_STRAPI_URL) {
          const response = await strapiAPI.getFeaturedArticles(2);
          if (response.data && response.data.length > 0) {
            const transformedArticles = response.data.map(transformStrapiArticle);
            const newsArticles = transformedArticles.map((article: TransformedArticle) => ({
              id: article.id,
              title: article.title,
              description: article.description,
              imageUrl: article.imageUrl || '/images/Join our tournaments.png',
              category: article.category,
              date: article.publishedAt,
              slug: article.slug
            }));
            setArticles(newsArticles);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.log('Strapi not available, using fallback data:', error);
      }

      // Fallback to static articles
      setTimeout(() => {
        setArticles([
          {
            id: 'news-1',
            title: "MASINDE MULIRO UNIVERSITY (MMUST) MAKES HISTORY",
            description: "As the Only Non-Nairobi Winner in the Kenya University Esports Rankings, MMUST has proven that talent exists beyond the capital city.",
            imageUrl: '/images/Join our tournaments.png',
            category: "Tournament Results",
            date: "2024-01-15",
            slug: "mmust-makes-history"
          },
          {
            id: 'news-2',
            title: "TUK TAKES THE OVERALL POSITION FOR SEASON 2",
            description: "The Technical University of Kenya gathers the top position in KUER Season 2, showcasing exceptional gaming skills and teamwork.",
            imageUrl: '/images/Join-Your-Uni.png',
            category: "Championship",
            date: "2024-01-10",
            slug: "tuk-season-2-champions"
          }
        ]);
        setLoading(false);
      }, 500);
    };

    loadArticles();
  }, []);

  return (
    <section className="bg-black w-full py-16 sm:py-24 relative">
      {/* Left background image */}
      <img
        className="absolute bottom-15 left-20 w-3/4 h-3/4 object-contain -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        alt="Background Left"
        src="/images/Mask Group.png"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Left Column: Title and Button */}
          <div className="lg:col-span-1 text-center lg:text-left">
            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
              STAY
              <br />
              WITH OUR
              <br />
              LATEST <span className="text-red-800">NEWS</span>
            </h2>
            <Link href="/blogs">
              <button className="mt-8 bg-red-900 text-white font-bold py-3 px-8 rounded-none hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-1 transition-all duration-300 ease-in-out">
                View All
              </button>
            </Link>
          </div>

          {/* Right Column: News Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
              // Loading skeleton
              <>
                {[1, 2].map((i) => (
                  <div key={i} className="bg-gray-800 rounded-none overflow-hidden shadow-lg w-full animate-pulse">
                    <div className="w-full h-48 bg-gray-700"></div>
                    <div className="p-6">
                      <div className="h-3 bg-gray-700 rounded w-1/4 mb-2"></div>
                      <div className="h-6 bg-gray-700 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </>
            ) : articles.length > 0 ? (
              articles.map((article, index) => (
                <NewsCard key={article.id || index} article={article} />
              ))
            ) : (
              // No articles found
              <div className="col-span-2 text-center py-8">
                <p className="text-gray-400 text-lg">No news articles available at the moment.</p>
                <p className="text-gray-500 text-sm mt-2">Check back later for updates!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;