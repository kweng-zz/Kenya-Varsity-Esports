'use client';
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useBlogStateCompat } from '@/hooks/useBlogStateCompat';

interface BlogInteraction {
  articleId: string;
  isLiked: boolean;
  isBookmarked: boolean;
  likeCount: number;
  viewCount: number;
}

interface BlogStateContextType {
  interactions: Map<string, BlogInteraction>;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchArticleStatus: (articleId: string) => Promise<void>;
  toggleLike: (articleId: string) => Promise<{ liked: boolean; totalLikes: number } | null>;
  toggleBookmark: (articleId: string) => Promise<{ bookmarked: boolean } | null>;
  trackView: (articleId: string) => Promise<void>;
  
  // Getters
  getInteraction: (articleId: string) => BlogInteraction | undefined;
  isLiked: (articleId: string) => boolean;
  isBookmarked: (articleId: string) => boolean;
  getLikeCount: (articleId: string) => number;
  getViewCount: (articleId: string) => number;
}

const BlogStateContext = createContext<BlogStateContextType | undefined>(undefined);

export const useBlogState = (): BlogStateContextType => {
  const context = useContext(BlogStateContext);
  if (!context) {
    throw new Error('useBlogState must be used within a BlogStateProvider');
  }
  return context;
};

interface BlogStateProviderProps {
  children: ReactNode;
}

export const BlogStateProvider: React.FC<BlogStateProviderProps> = ({ children }) => {
  const {
    interactions,
    loading,
    error,
    fetchArticleStatus,
    toggleLike,
    toggleBookmark,
    trackView,
    getInteraction,
    isLiked,
    isBookmarked,
    getLikeCount,
    getViewCount,
  } = useBlogStateCompat();

  const value: BlogStateContextType = {
    interactions,
    loading,
    error,
    fetchArticleStatus,
    toggleLike,
    toggleBookmark,
    trackView,
    getInteraction,
    isLiked,
    isBookmarked,
    getLikeCount,
    getViewCount,
  };

  return (
    <BlogStateContext.Provider value={value}>
      {children}
    </BlogStateContext.Provider>
  );
};