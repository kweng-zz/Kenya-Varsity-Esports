
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { contentfulAPI, transformContentfulArticle, TransformedArticle } from '@/lib/contentful';
import { Clock } from 'lucide-react';

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
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [imageError, setImageError] = useState<boolean>(false);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).toUpperCase();
  };

  const getReadingTime = (description: string) => {
    const wordsPerMinute = 200;
    const wordCount = description.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  // Ensure we have a valid image URL with proper fallback
  const getImageUrl = (url?: string | object | null) => {
    // Handle null, undefined, or empty string
    if (!url || url === '' || url === null || url === undefined) {
      return '/images/Join our tournaments.png';
    }
    
    // Handle object case (from Strapi image objects)
    if (typeof url === 'object' && url !== null) {
      // Try to extract URL from object
      const urlObj = url as any;
      if (urlObj.url && typeof urlObj.url === 'string' && urlObj.url.trim() !== '') {
        const extractedUrl = urlObj.url.trim();
        if (extractedUrl.startsWith('http')) {
          return extractedUrl;
        }
        if (extractedUrl.startsWith('/uploads/')) {
          const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
          return `${strapiUrl}${extractedUrl}`;
        }
        return extractedUrl.startsWith('/') ? extractedUrl : `/images/${extractedUrl}`;
      }
      // If object doesn't have url property, use fallback
      return '/images/Join our tournaments.png';
    }
    
    // Handle string case
    if (typeof url === 'string') {
      const trimmedUrl = url.trim();
      
      // Check for empty string after trimming
      if (trimmedUrl === '') {
        return '/images/Join our tournaments.png';
      }
      
      // If it's already a full URL, return as is
      if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
        return trimmedUrl;
      }
      
      // Handle Strapi uploads
      if (trimmedUrl.startsWith('/uploads/')) {
        const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
        return `${strapiUrl}${trimmedUrl}`;
      }
      
      // If it starts with /, it's already a proper path
      if (trimmedUrl.startsWith('/')) {
        return trimmedUrl;
      }
      
      // Otherwise, assume it needs /images/ prefix
      return `/images/${trimmedUrl}`;
    }
    
    // Fallback for any other case
    return '/images/Join our tournaments.png';
  };

  // Initialize the image URL when component mounts or imageUrl changes
  useEffect(() => {
    setImageError(false);
    const processedUrl = getImageUrl(imageUrl);
    if (process.env.NODE_ENV === 'development') {
      console.log('Processing image URL:', { original: typeof imageUrl, processed: processedUrl });
    }
    setCurrentImageUrl(processedUrl);
  }, [imageUrl]);

  // Ensure displayImageUrl is never empty string
  const displayImageUrl = imageError 
    ? '/images/Join our tournaments.png' 
    : (currentImageUrl && currentImageUrl.trim() !== '' ? currentImageUrl : '/images/Join our tournaments.png');
  
  const linkHref = `/blogs/${slug}`;

  return (
    <Link href={linkHref}>
      <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-none overflow-hidden shadow-2xl w-full cursor-pointer group transition-all duration-500 ease-in-out hover:shadow-3xl hover:shadow-red-500/30 hover:-translate-y-3 hover:bg-gradient-to-br hover:from-gray-800 hover:to-black">
        {/* Image section with enhanced overlays */}
        <div className="w-full h-48 bg-gray-800 relative overflow-hidden">
          {displayImageUrl && displayImageUrl.trim() !== '' ? (
            <>
              <img
                src={displayImageUrl}
                alt={title}
                className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-115 group-hover:brightness-110"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  console.error('Image failed to load:', displayImageUrl);
                  if (!imageError) {
                    setImageError(true);
                  }
                }}
                onLoad={() => {
                  // Reset error state if image loads successfully
                  if (imageError) {
                    setImageError(false);
                  }
                }}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-700">
              <span className="text-gray-500 text-sm">No image available</span>
            </div>
          )}
          
          {/* Enhanced date badge */}
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md group-hover:bg-black/90 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-all duration-300 ease-in-out border border-white/20">
            {formatDate(date)}
          </div>
          
          {/* Reading time indicator */}
          <div className="absolute top-3 right-3 bg-[#961c18]/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full transition-all duration-300 ease-in-out flex items-center gap-1 border border-white/20">
            <Clock className="w-3 h-3" />
            {getReadingTime(description)}m
          </div>
        </div>
        
        {/* Enhanced content section */}
        <div className="p-6 transition-all duration-300 ease-in-out relative z-10">
          {/* Enhanced category badge */}
          <div className="inline-block mb-3">
            <span className="px-3 py-1 bg-gradient-to-r from-[#961c18] to-[#c41e3a] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg border border-white/20">
              {category}
            </span>
          </div>
          
          <h3 className="text-white text-xl font-bold mt-2 mb-3 leading-tight transition-colors duration-300 ease-in-out group-hover:text-[#961c18]">
            {title}
          </h3>
          
          <p className="text-gray-400 text-sm leading-relaxed transition-colors duration-300 ease-in-out line-clamp-3">
            {description}
          </p>
        </div>

        {/* Enhanced animated border effect */}
        <div className="absolute inset-0 rounded-none border-2 border-transparent group-hover:border-[#961c18]/60 transition-all duration-500 ease-in-out pointer-events-none"></div>

        {/* Enhanced glow effect on hover */}
        <div className="absolute inset-0 rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out pointer-events-none"
             style={{
               background: 'radial-gradient(circle at center, rgba(150, 28, 24, 0.2) 0%, rgba(196, 30, 58, 0.1) 40%, transparent 70%)',
               filter: 'blur(25px)'
             }}>
        </div>

        {/* Corner accent effect */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-transparent to-[#961c18]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out blur-xl"></div>
      </div>
    </Link>
  );
};

// The main component for the "Latest News" section.
const LatestNews = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const loadArticles = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from Contentful
        const response = await contentfulAPI.getFeaturedArticles(2);
        if (response.data && response.data.length > 0) {
          const newsArticles = response.data.map((article: TransformedArticle) => ({
            id: article.id,
            title: article.title,
            description: article.description,
            imageUrl: article.imageUrl || undefined, // Convert null to undefined to match NewsArticle interface
            category: article.category,
            date: article.publishedAt,
            slug: article.slug
          }));
          if (isMounted) {
            setArticles(newsArticles);
            setLoading(false);
          }
          return;
        }
      } catch (error) {
        console.log('Contentful not available, using fallback data:', error);
      }

      // Fallback to static articles
      setTimeout(() => {
        if (!isMounted) return;
        
        const fallbackArticles: NewsArticle[] = [
          {
            id: '1',
            title: 'KVE Season 3 Registration Now Open',
            description: 'Universities across Kenya can now register their teams for the biggest collegiate esports tournament.',
            imageUrl: '/images/News/Registration_News.png',
            category: 'Tournament',
            date: '2024-03-15',
            slug: 'kve-season-3-registration'
          },
          {
            id: '2',
            title: 'New Gaming Titles Announced',
            description: 'KVE expands to include 5 new game titles in Season 3, bringing more opportunities for diverse gaming communities.',
            imageUrl: '/images/News/New_Titles_News.png',
            category: 'Announcement',
            date: '2024-03-10',
            slug: 'new-gaming-titles'
          }
        ];
        
        if (isMounted) {
          setArticles(fallbackArticles);
          setLoading(false);
        }
      }, 1000);
    };

    loadArticles();
    
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="bg-black w-full py-16 sm:py-24 relative">
      {/* Left background image */}
      <img
        className="absolute top-0 left-0 w-1/4 h-full object-cover opacity-60 pointer-events-none"
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