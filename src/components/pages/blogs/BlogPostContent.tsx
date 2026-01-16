 "use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Tag, Gamepad2, Clock } from 'lucide-react';
import { TransformedArticle } from '@/lib/strapi';

interface BlogPostContentProps {
  post: TransformedArticle;
}

export const BlogPostContent = ({ post }: BlogPostContentProps) => {
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [imageError, setImageError] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Ensure we have a valid image URL with proper fallback
  const getImageUrl = (url?: string | null) => {
    if (!url || url.trim() === '') return '/images/Join our tournaments.png';
    
    // If it's already a full URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it starts with /uploads/, it's a Strapi upload - prepend Strapi URL
    if (url.startsWith('/uploads/')) {
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
      return `${strapiUrl}${url}`;
    }
    
    // If it starts with /, assume it's a local image
    if (url.startsWith('/')) {
      return url;
    }
    
    // Otherwise, assume it needs /images/ prefix
    return `/images/${url}`;
  };

  // Initialize the image URL when component mounts or imageUrl changes
  useEffect(() => {
    setImageError(false);
    const processedUrl = getImageUrl(post.imageUrl);
    setCurrentImageUrl(processedUrl);
  }, [post.imageUrl]);

  const displayImageUrl = imageError ? '/images/Join our tournaments.png' : (currentImageUrl || '/images/Join our tournaments.png');

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  // Simple function to render content with proper paragraph breaks
  const renderContent = (content: string) => {
    // Split by newlines (single or double) to ensure proper formatting
    const paragraphs = content.split(/(?:\r\n|\r|\n)+/).filter(p => p.trim());
    
    return paragraphs.map((paragraph: string, index: number) => {
      // Check if this paragraph is a heading (starts with **)
      const isHeading = paragraph.startsWith('**') && paragraph.endsWith('**');
      
      if (isHeading) {
        const headingText = paragraph.replace(/\*\*/g, '');
        return (
          <div key={index} className="w-full px-6 mb-8 py-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white text-left">
                {headingText}
              </h2>
            </div>
          </div>
        );
      }
      
      return (
        <div key={index} className="w-full px-6 mb-8 py-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg leading-relaxed text-gray-300 text-left">
              {paragraph.trim()}
            </p>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      {/* Back Button */}
      <div className="relative z-10 bg-black pt-6 px-6">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 group bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Articles</span>
        </Link>
      </div>

      {/* Image Section - Top */}
      <section className="w-full bg-black py-8">
        <div className="flex justify-center px-6">
          <img
            src={displayImageUrl}
            alt={post.title}
            onError={() => setImageError(true)}
            className="w-full max-w-4xl h-auto object-cover"
          />
        </div>
      </section>

      {/* Title and Meta Section - Left Aligned */}
      <section className="w-full bg-black py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Featured Badge */}
          {post.featured && (
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-[#961c18] to-[#c41e3a] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Featured Article
              </span>
            </div>
          )}

          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-left">
            {post.title}
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed text-left">
            {post.description}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 text-left">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>By {post.author}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{getReadingTime(post.content)} min read</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-semibold">
                {post.category}
              </span>
            </div>
            
            {post.game && (
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4" />
                <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white rounded-full text-xs font-medium">
                  {post.game}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Full-Width Content Sections */}
      <article className="w-full bg-black text-white">
        {post.content ? (
          <div className="w-full">
            {renderContent(post.content)}
            
            {/* Call to Action Section */}
            <div className="w-full bg-gradient-to-r from-[#961c18]/20 to-[#c41e3a]/20 py-16 my-12">
              <div className="max-w-4xl mx-auto px-6 text-center">
                <h3 className="text-3xl font-bold text-white mb-6">🎮 Join the Action!</h3>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Ready to be part of Kenya&apos;s premier university esports scene? Don&apos;t miss out on the excitement!
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/blogs"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-red-900 text-white rounded-none  transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-lg"
                  >
                    <span>🏆</span>
                    <span>More Tournament News</span>
                  </Link>
                  <Link href="https://discord.com/invite/yGHCzZax5S">
                  <button className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-[#961c18]/50 font-semibold text-lg">
                    <span>💬</span>
                    <span>Join Discord</span>
                  </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full py-24">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#961c18] to-[#c41e3a] rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-6">Content Coming Soon!</h3>
              <p className="text-xl text-gray-400 mb-4">
                This article is currently being prepared by our editorial team.
              </p>
              <p className="text-gray-500 mb-8">
                Check back soon for the full content, or explore our other exciting articles!
              </p>
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 px-8 py-4 bg-red-900 text-white rounded-none transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-lg"
              >
                <span>📚</span>
                <span>Browse Other Articles</span>
              </Link>
            </div>
          </div>
        )}

        {/* Tags Section */}
        {post.tags && post.tags.length > 0 && (
          <div className="w-full bg-gray-900/30 py-16">
            <div className="max-w-4xl mx-auto px-6">
              <h3 className="text-2xl font-semibold mb-8 text-white text-center">Related Topics</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {post.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-6 py-3 bg-white/10 backdrop-blur-sm text-gray-300 rounded-full text-sm hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-[#961c18]/50 cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer Section */}
        <footer className="w-full bg-gray-900/50 py-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Published on {formatDate(post.publishedAt)}</span>
                </div>
                {post.updatedAt !== post.publishedAt && (
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500">
                    <span className="w-4 h-4 flex items-center justify-center">🔄</span>
                    <span>Updated on {formatDate(post.updatedAt)}</span>
                  </div>
                )}
              </div>
              
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 px-8 py-4 bg-red-900 text-white rounded-none transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-lg"
              >
                <span>Read More Articles</span>
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
          </div>
        </footer>
      </article>
    </>
  );
};