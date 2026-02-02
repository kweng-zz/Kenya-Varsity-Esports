 "use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Tag, Gamepad2, Clock, Share2, Heart, MessageCircle, ChevronUp, Facebook, Twitter, Linkedin, Copy, Check, ChevronRight, ChevronLeft, Menu, X, Instagram, Mail, UserCircle, Bookmark, TrendingUp, Hash, Link2, Quote, Code, List, ListOrdered, Image, Table } from 'lucide-react';
import { TransformedArticle } from '@/lib/contentful';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useAuth } from '@/contexts/AuthContext';
import { useBlogState } from '@/contexts/BlogStateContext';
import { FollowButton } from '@/components/FollowButton';

interface BlogPostContentProps {
  post: TransformedArticle;
}

interface Heading {
  text: string;
  id: string;
  level: number;
}

interface Comment {
  id: number;
  author_name?: string;
  created_at: string;
  content: string;
  author_avatar?: string;
  replies?: Comment[];
}

// CommentAvatar component with comprehensive fallbacks
const CommentAvatar: React.FC<{ comment: Comment }> = ({ comment }) => {
  const getAvatarContent = () => {
    // If avatar URL exists, use it (this would be for image avatars)
    if (comment.author_avatar) {
      return <img src={comment.author_avatar} alt={comment.author_name || 'User'} className="w-full h-full rounded-full object-cover" />;
    }

    // If author name exists, use first character
    if (comment.author_name && comment.author_name.trim().length > 0) {
      return comment.author_name.charAt(0).toUpperCase();
    }

    // Fallback to user icon
    return <UserCircle className="w-6 h-6" />;
  };

  return (
    <div className="w-12 h-12 bg-gradient-to-br from-[#961c18] to-[#c41e3a] rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
      {getAvatarContent()}
    </div>
  );
};

export const BlogPostContent = ({ post }: BlogPostContentProps) => {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('BlogPostContent Error:', error, errorInfo);
        // Log to analytics or error tracking service
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'exception', {
            description: `BlogPostContent: ${error.toString()}`,
            fatal: false
          });
        }
      }}
    >
      <BlogPostContentInner post={post} />
    </ErrorBoundary>
  );
};

const BlogPostContentInner = ({ post }: BlogPostContentProps) => {
  const { user, loading: authLoading } = useAuth();
  const {
    loading: blogLoading,
    error: blogError,
    fetchArticleStatus,
    toggleLike,
    toggleBookmark,
    trackView,
    isLiked,
    isBookmarked,
    getLikeCount,
    getViewCount,
  } = useBlogState();
  
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [imageError, setImageError] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeHeading, setActiveHeading] = useState<string>('');
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [commentCount, setCommentCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [authorArticles, setAuthorArticles] = useState<any[]>([]);
  const [prevArticle, setPrevArticle] = useState<any>(null);
  const [nextArticle, setNextArticle] = useState<any>(null);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Sample comments data - now fetched from API

  // Static data removed - now fetched from APIs

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Enhanced scroll handling for progress and TOC
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
      setShowBackToTop(scrollTop > 500);

      // Update active heading for TOC
      if (contentRef.current) {
        const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4');
        let currentHeading = '';
        
        headings.forEach((heading) => {
          const rect = heading.getBoundingClientRect();
          if (rect.top <= 100) {
            currentHeading = heading.id;
          }
        });
        
        setActiveHeading(currentHeading);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch article status (likes, bookmarks, views) in one call
  useEffect(() => {
    if (!authLoading) {
      fetchArticleStatus(post.id, user?.$id);
    }
  }, [post.id, user, authLoading, fetchArticleStatus]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/articles/${post.slug}/comments`);
        const data = await response.json();
        if (data.success) {
          setComments(data.data.comments);
          setCommentCount(data.data.pagination.total);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    fetchComments();
  }, [post.slug]);

  // Track view when component mounts (after status is loaded)
  useEffect(() => {
    if (!authLoading && !blogLoading) {
      trackView(post.id, user?.$id);
    }
  }, [post.id, user, authLoading, blogLoading, trackView]);

  // Fetch articles by author
  useEffect(() => {
    const fetchAuthorArticles = async () => {
      try {
        console.log('=== Fetching Author Articles ===');
        console.log('Author name:', post.author);
        console.log('Article ID to exclude:', post.id);
        
        const response = await fetch(`/api/articles/author/${encodeURIComponent(post.author)}?excludeId=${post.id}`);
        const data = await response.json();
        
        console.log('Author Articles API response:', data);
        
        if (data.success) {
          console.log('Setting authorArticles, count:', data.data.articles.length);
          setAuthorArticles(data.data.articles);
        } else {
          console.error('Author Articles API returned error:', data);
        }
      } catch (error) {
        console.error('Error fetching author articles:', error);
      }
    };
    fetchAuthorArticles();
  }, [post.author, post.id]);

  // Fetch related articles
  useEffect(() => {
    const fetchRelatedArticles = async () => {
      try {
        const response = await fetch(`/api/articles/${post.slug}/related`);
        const data = await response.json();
        if (data.success) {
          setRelatedArticles(data.data.relatedArticles);
        }
      } catch (error) {
        console.error('Error fetching related articles:', error);
      }
    };
    fetchRelatedArticles();
  }, [post.slug]);

  // Fetch navigation (prev/next)
  useEffect(() => {
    const fetchNavigation = async () => {
      try {
        console.log('=== Fetching Navigation ===');
        console.log('Fetching for slug:', post.slug);
        const response = await fetch(`/api/articles/${post.slug}/navigate`);
        const data = await response.json();
        
        console.log('Navigation API response:', data);
        
        if (data.success) {
          console.log('Setting prevArticle:', data.data.prev);
          console.log('Setting nextArticle:', data.data.next);
          setPrevArticle(data.data.prev);
          setNextArticle(data.data.next);
        } else {
          console.error('Navigation API returned error:', data);
        }
      } catch (error) {
        console.error('Error fetching navigation:', error);
      }
    };
    fetchNavigation();
  }, [post.slug]);

  // Enhanced markdown parsing
  const parseMarkdown = (content: string): Heading[] => {
    const lines = content.split('\n');
    const headings: Heading[] = [];
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Parse headings (# ## ### ####)
      if (trimmed.startsWith('#')) {
        const match = trimmed.match(/^(#{1,4})\s+(.+)$/);
        if (match) {
          const level = match[1].length;
          const text = match[2].replace(/\*\*/g, '').replace(/\*/g, '');
          const id = `heading-${headings.length}`;
          headings.push({ text, id, level });
        }
      }
      // Parse old-style bold headings (**text**)
      else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        const text = trimmed.replace(/\*\*/g, '');
        const id = `heading-${headings.length}`;
        headings.push({ text, id, level: 2 });
      }
    });
    
    return headings;
  };

  const headings = parseMarkdown(post.content || '');

  // Enhanced content rendering with markdown support
  const renderMarkdownContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBlockLanguage = '';
    let codeBlockContent: string[] = [];
    let paragraphContent: string[] = [];
    let headingIndex = 0;
    let isFirstParagraph = true;

    const flushParagraph = () => {
      if (paragraphContent.length > 0) {
        const paragraphText = paragraphContent.join(' ').trim();
        elements.push(
          <div key={`para-${elements.length}`} className="prose prose-lg prose-invert max-w-none mb-8">
            <p className="text-lg leading-loose text-gray-300">
              {isFirstParagraph && (
                <span className="float-left text-6xl font-bold text-[#961c18] mr-3 leading-none">
                  {paragraphText.charAt(0)}
                </span>
              )}
              <span className={isFirstParagraph ? "first-letter:normal" : ""}>
                {renderInlineFormatting(isFirstParagraph ? paragraphText.substring(1) : paragraphText)}
              </span>
            </p>
          </div>
        );
        isFirstParagraph = false;
        paragraphContent = [];
      }
    };

    const flushCodeBlock = () => {
      if (inCodeBlock && codeBlockContent.length > 0) {
        elements.push(
          <div key={`code-${elements.length}`} className="prose prose-invert max-w-none mb-8">
            <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto">
              <code className="text-sm font-mono text-green-400">
                {codeBlockContent.join('\n')}
              </code>
            </pre>
          </div>
        );
        codeBlockContent = [];
        inCodeBlock = false;
        codeBlockLanguage = '';
      }
    };

    const renderInlineFormatting = (text: string) => {
      // Bold text (**text**)
      text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');
      // Italic text (*text*)
      text = text.replace(/\*(.*?)\*/g, '<em class="italic text-gray-200">$1</em>');
      // Inline code (`code`)
      text = text.replace(/`([^`]+)`/g, '<code class="bg-gray-800 px-2 py-1 rounded text-sm font-mono text-blue-400">$1</code>');
      // Links [text](url)
      text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#961c18] hover:text-[#c41e3a] underline transition-colors" target="_blank" rel="noopener noreferrer">$1</a>');
      return text;
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Code blocks
      if (trimmed.startsWith('```')) {
        flushParagraph();
        if (inCodeBlock) {
          flushCodeBlock();
        } else {
          inCodeBlock = true;
          codeBlockLanguage = trimmed.substring(3).trim();
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      // Headings
      if (trimmed.startsWith('#')) {
        flushParagraph();
        const match = trimmed.match(/^(#{1,4})\s+(.+)$/);
        if (match) {
          const level = match[1].length;
          const text = match[2].replace(/\*\*/g, '').replace(/\*/g, '');
          const id = `heading-${headingIndex}`;
          headingIndex++;
          
          const Tag = `h${level}` as keyof JSX.IntrinsicElements;
          const sizeClasses = {
            1: 'text-4xl md:text-5xl',
            2: 'text-3xl md:text-4xl',
            3: 'text-2xl md:text-3xl',
            4: 'text-xl md:text-2xl'
          };
          
          elements.push(
            <Tag key={`heading-${elements.length}`} id={id} className={`${sizeClasses[level as keyof typeof sizeClasses]} font-bold text-white mb-6 mt-12 scroll-mt-24`}>
              {text}
            </Tag>
          );
        }
        return;
      }

      // Old-style bold headings
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        flushParagraph();
        const text = trimmed.replace(/\*\*/g, '');
        const id = `heading-${headingIndex}`;
        headingIndex++;
        
        elements.push(
          <h2 key={`heading-${elements.length}`} id={id} className="text-3xl md:text-4xl font-bold text-white mb-6 mt-12 scroll-mt-24">
            {text}
          </h2>
        );
        return;
      }

      // Blockquotes
      if (trimmed.startsWith('>')) {
        flushParagraph();
        const quoteText = trimmed.substring(1).trim();
        elements.push(
          <blockquote key={`quote-${elements.length}`} className="border-l-4 border-[#961c18] pl-6 py-4 mb-8 bg-gray-900/50 rounded-r-lg">
            <p className="text-lg italic text-gray-300">
              "{renderInlineFormatting(quoteText)}"
            </p>
          </blockquote>
        );
        return;
      }

      // Lists
      if (trimmed.match(/^[-*]\s+/) || trimmed.match(/^\d+\.\s+/)) {
        flushParagraph();
        const isOrdered = trimmed.match(/^\d+\.\s+/);
        
        if (isOrdered) {
          elements.push(
            <ol key={`list-${elements.length}`} className="list-decimal list-inside mb-8 space-y-2">
              <li className="text-lg text-gray-300 leading-relaxed">
                {renderInlineFormatting(trimmed.replace(/^\d+\.\s+/, ''))}
              </li>
            </ol>
          );
        } else {
          elements.push(
            <ul key={`list-${elements.length}`} className="list-disc list-inside mb-8 space-y-2">
              <li className="text-lg text-gray-300 leading-relaxed">
                {renderInlineFormatting(trimmed.replace(/^[-*]\s+/, ''))}
              </li>
            </ul>
          );
        }
        return;
      }

      // Tables
      if (trimmed.includes('|') && trimmed.split('|').length >= 3) {
        flushParagraph();
        const cells = trimmed.split('|').filter(cell => cell.trim()).map(cell => cell.trim());
        
        elements.push(
          <div key={`table-${elements.length}`} className="overflow-x-auto mb-8">
            <table className="w-full border-collapse">
              <tr className="bg-gray-800">
                {cells.map((cell, cellIndex) => (
                  <th key={cellIndex} className="border border-gray-700 px-4 py-3 text-left text-sm font-semibold text-white">
                    {renderInlineFormatting(cell)}
                  </th>
                ))}
              </tr>
            </table>
          </div>
        );
        return;
      }

      // Images
      const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (imageMatch) {
        flushParagraph();
        const [, alt, src] = imageMatch;
        const imgSrc = getImageUrl(src);
        
        elements.push(
          <figure key={`image-${elements.length}`} className="mb-8">
            <img 
              src={imgSrc} 
              alt={alt} 
              className="w-full h-auto rounded-lg shadow-lg"
              onError={() => setImageError(true)}
            />
            {alt && (
              <figcaption className="text-center text-gray-400 mt-2 text-sm">
                {alt}
              </figcaption>
            )}
          </figure>
        );
        return;
      }

      // Horizontal rules
      if (trimmed === '---' || trimmed === '***') {
        flushParagraph();
        elements.push(
          <hr key={`hr-${elements.length}`} className="border-gray-700 my-8" />
        );
        return;
      }

      // Regular paragraph content
      if (trimmed) {
        paragraphContent.push(trimmed);
      } else {
        flushParagraph();
      }
    });

    flushParagraph();
    flushCodeBlock();

    return <div ref={contentRef}>{elements}</div>;
  };

  const scrollToHeading = (headingId: string) => {
    const element = document.getElementById(headingId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', newsletterEmail);
    setNewsletterEmail('');
    // Show success message
  };

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

  const getAuthorInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

const handleLikeToggle = async () => {
    try {
      if (!user && !authLoading) {
        console.warn('User not authenticated - like operation requires login');
        // Optional: Show login prompt or notification
        return;
      }
      
      const result = await toggleLike(post.id, user?.$id);
      if (result === null) {
        console.error('Like operation failed');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentAuthor || !commentEmail || !commentContent) return;
    
    setSubmittingComment(true);
    try {
      const response = await fetch(`/api/articles/${post.slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: commentAuthor,
          authorEmail: commentEmail,
          content: commentContent
        })
      });
      const data = await response.json();
      if (data.success) {
        setComments([data.data.comment, ...comments]);
        setCommentCount(commentCount + 1);
        setCommentAuthor('');
        setCommentEmail('');
        setCommentContent('');
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleBookmarkToggle = async () => {
    try {
      if (!user && !authLoading) {
        console.warn('User not authenticated - bookmark operation requires login');
        // Optional: Show login prompt or notification
        return;
      }
      
      const result = await toggleBookmark(post.id, user?.$id);
      if (result === null) {
        console.error('Bookmark operation failed');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-[#961c18] to-[#c41e3a] transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Action Buttons */}
      {isClient && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
          {/* Like Button */}
          <button
            onClick={handleLikeToggle}
            className="w-14 h-14 bg-white/10 backdrop-blur-md text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center border border-white/20"
          >
            <Heart className={`w-6 h-6 ${isLiked(post.id) ? 'text-red-500' : 'text-white'}`} fill={isLiked(post.id) ? 'currentColor' : 'none'} />
          </button>
          
          {/* Comment Button */}
          <button
            onClick={() => setCommentsOpen(!commentsOpen)}
            className="w-14 h-14 bg-white/10 backdrop-blur-md text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center border border-white/20"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-[#961c18] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{commentCount || 0}</span>
          </button>
          
          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkToggle}
            className="w-14 h-14 bg-white/10 backdrop-blur-md text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center border border-white/20"
          >
            <Bookmark className={`w-6 h-6 ${isBookmarked(post.id) ? 'fill-current' : ''}`} />
          </button>
          
          {/* Back to Top Button */}
          {showBackToTop && (
            <button
              onClick={scrollToTop}
              className="w-14 h-14 bg-gradient-to-br from-[#961c18] to-[#c41e3a] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center backdrop-blur-sm border border-white/20 animate-fade-in"
            >
              <ChevronUp className="w-6 h-6" />
            </button>
          )}
        </div>
      )}

      {/* Main Layout Container */}
      <div className="min-h-screen bg-black">
        {/* Breadcrumbs Navigation */}
        <div className="relative z-10 bg-black pt-6 px-6">
          <nav className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/blogs" className="hover:text-white transition-colors">Blogs</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/blogs/category/${post.category.toLowerCase()}`} className="hover:text-white transition-colors">{post.category}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white truncate max-w-xs">{post.title}</span>
          </nav>
          
          {/* Back Button */}
          <div className="mt-4">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 group bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Articles</span>
            </Link>
          </div>
        </div>

        {/* Two-Column Layout for Desktop */}
        <div className="max-w-7xl mx-auto px-6 lg:flex lg:gap-12">
          {/* Main Content */}
          <main className="flex-1 lg:max-w-4xl">
            {/* Hero Section */}
            <section className="py-8">
              <img
                src={displayImageUrl}
                alt={post.title}
                onError={() => setImageError(true)}
                className="w-full h-auto rounded-xl shadow-2xl"
              />
            </section>

            {/* Article Header */}
            <header className="pb-8 border-b border-white/10">
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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                {post.description}
              </p>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-8">
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

              {/* Engagement Stats */}
              <div className="flex items-center gap-6 pb-6">
                <button
                  onClick={handleLikeToggle}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    isLiked(post.id) 
                      ? 'bg-red-500/20 text-red-400 border border-red-400' 
                      : 'bg-white/10 text-gray-400 border border-white/20 hover:bg-white/20'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked(post.id) ? 'text-red-400' : 'text-gray-400'}`} fill={isLiked(post.id) ? 'currentColor' : 'none'} />
                  <span className="text-sm font-medium">{getLikeCount(post.id)} Likes</span>
                </button>
                
                <button 
                  onClick={() => setCommentsOpen(!commentsOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 text-gray-400 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">{commentCount} Comments</span>
                </button>
              </div>
            </header>

            {/* Article Content */}
            <article className="py-12">
              {post.content ? (
                renderMarkdownContent(post.content)
              ) : (
                <div className="text-center py-24">
                  <div className="w-20 h-20 bg-gradient-to-r from-[#961c18] to-[#c41e3a] rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                    <span className="text-3xl">📝</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-6">Content Coming Soon!</h3>
                  <p className="text-xl text-gray-400 mb-4">
                    This article is currently being prepared by our editorial team.
                  </p>
                </div>
              )}
            </article>

            {/* Enhanced Author Section */}
            <section className="py-12 border-t border-white/10">
              <div className="bg-gradient-to-r from-gray-900/50 to-black rounded-xl p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Author Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#961c18] to-[#c41e3a] rounded-full overflow-hidden flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                      {post.authorAvatar ? (
                        <img 
                          src={post.authorAvatar} 
                          alt={post.author}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to initials if image fails
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="author-initials">{getAuthorInitials(post.author)}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Author Info */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{post.author}</h3>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      {post.authorBio || `Esports writer and analyst covering ${post.category.toLowerCase()} and competitive gaming trends.`}
                    </p>
                    
                    {/* Social Links - only show if available */}
                    {(post.authorTwitter || post.authorLinkedIn || post.authorInstagram) && (
                      <div className="flex items-center gap-4 mb-6">
                        {post.authorTwitter && (
                          <a 
                            href={`https://twitter.com/${post.authorTwitter.replace('@', '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                          >
                            <Twitter className="w-4 h-4 text-white" />
                          </a>
                        )}
                        {post.authorLinkedIn && (
                          <a 
                            href={post.authorLinkedIn.startsWith('http') ? post.authorLinkedIn : `https://linkedin.com/in/${post.authorLinkedIn}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                          >
                            <Linkedin className="w-4 h-4 text-white" />
                          </a>
                        )}
                        {post.authorInstagram && (
                          <a 
                            href={`https://instagram.com/${post.authorInstagram.replace('@', '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                          >
                            <Instagram className="w-4 h-4 text-white" />
                          </a>
                        )}
                      </div>
                    )}
                    
                    {/* Follow Button */}
                    <FollowButton author={post.author} />
                  </div>
                </div>
                
                 {/* More from Author */}
                 {authorArticles.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-white/10">
                      <h4 className="text-lg font-semibold text-white mb-4">More from {post.author}</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {authorArticles.filter(article => article != null).slice(0, 4).map((article: any) => (
                         <Link key={article.id} href={`/blogs/${article.slug}`} className="group">
                           <div className="flex gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                             <img
                               src={article.imageUrl || '/images/Join our tournaments.png'}
                               alt={article.title}
                               className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                             />
                             <div className="flex-1">
                               <h5 className="text-white font-medium group-hover:text-[#961c18] transition-colors line-clamp-1">
                                 {article.title}
                               </h5>
                               <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                                 {article.description}
                               </p>
                               <span className="text-xs text-gray-500">{Math.ceil((article.description || '').split(' ').length / 200)} min read</span>
                             </div>
                           </div>
                         </Link>
                       ))}
                     </div>
                   </div>
                )}
              </div>
            </section>

            {/* Previous/Next Navigation */}
            <section className="py-12 border-t border-white/10">
              <div className="grid md:grid-cols-2 gap-8">
                 {/* Previous Post */}
                 {prevArticle && (
                   <Link href={prevArticle.slug ? `/blogs/${prevArticle.slug}` : '#'} className="group">
                     <div className="bg-gradient-to-br from-gray-800 to-black rounded-xl border border-white/20 overflow-hidden hover:border-[#961c18]/50 transition-all duration-300 hover:transform hover:-translate-y-1">
                       <div className="p-6">
                         <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                           <ChevronLeft className="w-4 h-4" />
                           <span>Previous Article</span>
                         </div>
                         <h3 className="text-white font-bold mb-2 group-hover:text-[#961c18] transition-colors">
                           {prevArticle.title}
                         </h3>
                         <p className="text-gray-400 text-sm line-clamp-2">
                           {prevArticle.description}
                         </p>
                       </div>
                     </div>
                   </Link>
                 )}

                 {/* Next Post */}
                 {nextArticle && (
                   <Link href={nextArticle.slug ? `/blogs/${nextArticle.slug}` : '#'} className="group">
                     <div className="bg-gradient-to-br from-gray-800 to-black rounded-xl border border-white/20 overflow-hidden hover:border-[#961c18]/50 transition-all duration-300 hover:transform hover:-translate-y-1">
                       <div className="p-6">
                         <div className="flex items-center gap-2 text-sm text-gray-400 mb-3 justify-end">
                           <span>Next Article</span>
                           <ChevronRight className="w-4 h-4" />
                         </div>
                         <h3 className="text-white font-bold mb-2 group-hover:text-[#961c18] transition-colors text-right">
                           {nextArticle.title}
                         </h3>
                         <p className="text-gray-400 text-sm line-clamp-2 text-right">
                           {nextArticle.description}
                         </p>
                       </div>
                     </div>
                   </Link>
                 )}
              </div>
            </section>

            {/* Newsletter Signup */}
            <section className="py-16 border-t border-white/10">
              <div className="bg-gradient-to-r from-[#961c18]/20 to-[#c41e3a]/20 rounded-2xl p-8 md:p-12 text-center">
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Stay in the Game
                  </h3>
                  <p className="text-lg text-gray-300 mb-8">
                    Get the latest esports insights, tournament updates, and exclusive content delivered straight to your inbox.
                  </p>
                  
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#961c18] transition-colors"
                      required
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-[#961c18] to-[#c41e3a] text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      Subscribe
                    </button>
                  </form>
                  
                  <p className="text-sm text-gray-400 mt-4">
                    Join 5,000+ esports enthusiasts. No spam, unsubscribe anytime.
                  </p>
                </div>
              </div>
            </section>

            {/* Comments Section */}
            <section className="py-12 border-t border-white/10">
              <div className="mb-8">
                <button
                  onClick={() => setCommentsOpen(!commentsOpen)}
                  className="flex items-center justify-between w-full text-left group"
                >
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Comments ({commentCount})
                    </h3>
                    <p className="text-gray-400">
                      Join the discussion and share your thoughts
                    </p>
                  </div>
                  <div className={`transform transition-transform duration-300 ${commentsOpen ? 'rotate-180' : ''}`}>
                    <ChevronUp className="w-6 h-6 text-gray-400" />
                  </div>
                </button>
              </div>

              {commentsOpen && (
                <div className="space-y-8">
                  {/* Comment Form */}
                  <div className="bg-gray-900/50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Leave a Comment</h4>
                    <form onSubmit={handleCreateComment} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={commentAuthor}
                          onChange={(e) => setCommentAuthor(e.target.value)}
                          placeholder="Your Name"
                          className="px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#961c18] transition-colors"
                          required
                        />
                        <input
                          type="email"
                          value={commentEmail}
                          onChange={(e) => setCommentEmail(e.target.value)}
                          placeholder="Your Email"
                          className="px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#961c18] transition-colors"
                          required
                        />
                      </div>
                      <textarea
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="Share your thoughts..."
                        rows={4}
                        className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#961c18] transition-colors resize-none"
                        required
                      />
                      <button
                        type="submit"
                        disabled={submittingComment}
                        className="px-6 py-3 bg-gradient-to-r from-[#961c18] to-[#c41e3a] text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submittingComment ? 'Posting...' : 'Post Comment'}
                      </button>
                    </form>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-6">
                    {comments.filter(comment => comment != null).map((comment: Comment) => (
                      <div key={comment.id} className="bg-gray-900/30 rounded-xl p-6">
                        <div className="flex gap-4">
                           <div className="flex-shrink-0">
                             <CommentAvatar comment={comment} />
                           </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-white">{comment.author_name || 'Anonymous'}</h5>
                              <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
                            </div>
                            <p className="text-gray-300 leading-relaxed">{comment.content}</p>
                            <button className="mt-3 text-sm text-[#961c18] hover:text-[#c41e3a] transition-colors">
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Tags Section */}
            {post.tags && post.tags.length > 0 && (
              <section className="py-12 border-t border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6">Related Topics</h3>
                <div className="flex flex-wrap gap-3">
                  {post.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-white/10 backdrop-blur-sm text-gray-300 rounded-full text-sm hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-[#961c18]/50 cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* Sticky Sidebar - Desktop Only */}
          <aside className="hidden lg:block w-80">
            <div className="sticky top-6 space-y-8">
              {/* Table of Contents */}
              {headings.length > 0 && (
                <div className="bg-gray-900/50 rounded-xl border border-white/20 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <List className="w-5 h-5" />
                    Table of Contents
                  </h3>
                  <nav className="space-y-2">
                    {headings.map((heading) => (
                      <button
                        key={heading.id}
                        onClick={() => scrollToHeading(heading.id)}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                          activeHeading === heading.id
                            ? 'bg-[#961c18]/20 text-[#961c18] font-medium'
                            : 'text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                        style={{ paddingLeft: `${(heading.level - 1) * 12 + 12}px` }}
                      >
                        {heading.text}
                      </button>
                    ))}
                  </nav>
                </div>
              )}

              {/* Mini Author Card */}
              <div className="bg-gray-900/50 rounded-xl border border-white/20 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#961c18] to-[#c41e3a] rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {post.authorAvatar ? (
                      <img
                        src={post.authorAvatar}
                        alt={post.author}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to initials if image fails
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="author-initials">{getAuthorInitials(post.author)}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{post.author}</h4>
                    <p className="text-sm text-gray-400">Esports Analyst</p>
                  </div>
                </div>
              </div>

              {/* Vertical Share Buttons */}
              <div className="bg-gray-900/50 rounded-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share Article
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={shareOnFacebook}
                    className="w-full flex items-center gap-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <Facebook className="w-4 h-4" />
                    <span className="text-sm">Facebook</span>
                  </button>
                  <button
                    onClick={shareOnTwitter}
                    className="w-full flex items-center gap-3 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors duration-200"
                  >
                    <Twitter className="w-4 h-4" />
                    <span className="text-sm">Twitter</span>
                  </button>
                  <button
                    onClick={shareOnLinkedIn}
                    className="w-full flex items-center gap-3 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors duration-200"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span className="text-sm">LinkedIn</span>
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="w-full flex items-center gap-3 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="text-sm">{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Reading Progress */}
              <div className="bg-gray-900/50 rounded-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Reading Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-medium">{Math.round(scrollProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div 
                      className="h-full bg-gradient-to-r from-[#961c18] to-[#c41e3a] rounded-full transition-all duration-300"
                      style={{ width: `${scrollProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};