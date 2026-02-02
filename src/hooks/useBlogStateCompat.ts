import { useEffect } from 'react';
import { useBlogStore, useBlogInteraction, useBlogActions } from '@/stores/blogStore';

// Hook to maintain compatibility with existing BlogStateContext pattern
export const useBlogStateCompat = () => {
  const interactions = useBlogStore((state) => state.interactions);
  const loading = useBlogStore((state) => state.loading);
  const error = useBlogStore((state) => state.error);
  const fetchArticleStatus = useBlogStore((state) => state.fetchArticleStatus);
  const toggleLike = useBlogStore((state) => state.toggleLike);
  const toggleBookmark = useBlogStore((state) => state.toggleBookmark);
  const trackView = useBlogStore((state) => state.trackView);
  
  const isLiked = (articleId: string) => {
    const interaction = interactions.get(articleId);
    return interaction?.isLiked || false;
  };
  
  const isBookmarked = (articleId: string) => {
    const interaction = interactions.get(articleId);
    return interaction?.isBookmarked || false;
  };
  
  const getLikeCount = (articleId: string) => {
    const interaction = interactions.get(articleId);
    return interaction?.likeCount || 0;
  };
  
  const getViewCount = (articleId: string) => {
    const interaction = interactions.get(articleId);
    return interaction?.viewCount || 0;
  };

  return {
    interactions,
    loading,
    error,
    fetchArticleStatus,
    toggleLike,
    toggleBookmark,
    trackView,
    isLiked,
    isBookmarked,
    getLikeCount,
    getViewCount,
    getInteraction: (articleId: string) => interactions.get(articleId),
  };
};

// Hook to automatically fetch article status when needed
export const useArticleStatus = (articleId: string, userId?: string) => {
  const interaction = useBlogInteraction(articleId);
  const fetchArticleStatus = useBlogStore((state) => state.fetchArticleStatus);

  useEffect(() => {
    if (!interaction && articleId) {
      fetchArticleStatus(articleId, userId);
    }
  }, [articleId, userId, interaction, fetchArticleStatus]);

  return interaction;
};