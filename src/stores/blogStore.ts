import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Types for blog interactions
interface BlogInteraction {
  articleId: string;
  isLiked: boolean;
  isBookmarked: boolean;
  likeCount: number;
  viewCount: number;
}

interface BlogState {
  // State
  interactions: Map<string, BlogInteraction>;
  loading: boolean;
  error: string | null;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Fetch actions
  fetchArticleStatus: (articleId: string, userId?: string) => Promise<void>;
  
  // Toggle actions
  toggleLike: (articleId: string, userId?: string) => Promise<{ liked: boolean; totalLikes: number } | null>;
  toggleBookmark: (articleId: string, userId?: string) => Promise<{ bookmarked: boolean } | null>;
  
  // Track view
  trackView: (articleId: string, userId?: string) => Promise<void>;
  
  // Getters
  getInteraction: (articleId: string) => BlogInteraction | undefined;
  isLiked: (articleId: string) => boolean;
  isBookmarked: (articleId: string) => boolean;
  getLikeCount: (articleId: string) => number;
  getViewCount: (articleId: string) => number;
  
  // Batch actions
  initializeInteractions: (interactions: BlogInteraction[]) => void;
  updateInteraction: (articleId: string, updates: Partial<BlogInteraction>) => void;
  clearInteractions: () => void;
}

// Helper function to convert Map to/from JSON for persistence
const mapToJSON = (map: Map<string, BlogInteraction>) => {
  return Object.fromEntries(map.entries());
};

const jsonToMap = (json: Record<string, BlogInteraction>) => {
  return new Map(Object.entries(json));
};

export const useBlogStore = create<BlogState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        interactions: new Map(),
        loading: false,
        error: null,

        // Basic setters
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),

        // Fetch article status
        fetchArticleStatus: async (articleId: string, userId?: string) => {
          try {
            set({ loading: true, error: null });
            
            const finalUserId = userId || 'anonymous';
            
            // Parallel fetch all status
            const [likesResponse, bookmarksResponse, viewsResponse] = await Promise.all([
              fetch(`/api/articles/${articleId}/likes?userId=${finalUserId}`),
              fetch(`/api/articles/${articleId}/bookmarks?userId=${finalUserId}&articleId=${articleId}`),
              fetch(`/api/articles/${articleId}/views`)
            ]);

            const [likesData, bookmarksData, viewsData] = await Promise.all([
              likesResponse.json(),
              bookmarksResponse.json(),
              viewsResponse.json()
            ]);

            const interaction: BlogInteraction = {
              articleId,
              isLiked: likesData.success ? likesData.data.isLiked : false,
              isBookmarked: bookmarksData.success ? bookmarksData.data.isBookmarked : false,
              likeCount: likesData.success ? likesData.data.count : 0,
              viewCount: viewsData.success ? viewsData.data.viewCount : 0,
            };

            set((state) => {
              const newInteractions = new Map(state.interactions);
              newInteractions.set(articleId, interaction);
              return { interactions: newInteractions, loading: false };
            });

          } catch (err) {
            console.error('Error fetching article status:', err);
            set({ error: 'Failed to fetch article status', loading: false });
          }
        },

        // Toggle like (Optimistic)
        toggleLike: async (articleId: string, userId?: string) => {
          const prevState = get().interactions.get(articleId);
          if (!prevState) return null;

          // Optimistic update
          set((state) => {
            const newInteractions = new Map(state.interactions);
            const current = newInteractions.get(articleId);
            if (current) {
              const newLiked = !current.isLiked;
              newInteractions.set(articleId, {
                ...current,
                isLiked: newLiked,
                likeCount: current.likeCount + (newLiked ? 1 : -1),
              });
            }
            return { interactions: newInteractions };
          });

          try {
            const finalUserId = userId || 'anonymous';
            const response = await fetch(`/api/articles/${articleId}/likes`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: finalUserId })
            });

            const data = await response.json();
            
            if (!data.success) {
              // Revert on error
              console.error('Like API error, reverting:', data);
              set((state) => {
                const newInteractions = new Map(state.interactions);
                newInteractions.set(articleId, prevState);
                return { interactions: newInteractions };
              });
              return null;
            }

            // Sync with server response to be sure
             set((state) => {
                const newInteractions = new Map(state.interactions);
                const existing = newInteractions.get(articleId);
                 if (existing) {
                  newInteractions.set(articleId, {
                    ...existing,
                    isLiked: data.data.isLiked,
                    likeCount: data.data.totalLikes,
                  });
                }
                return { interactions: newInteractions };
              });
              
              return {
                liked: data.data.isLiked,
                totalLikes: data.data.totalLikes
              };

          } catch (err) {
            console.error('Error toggling like, reverting:', err);
             // Revert on error
             set((state) => {
                const newInteractions = new Map(state.interactions);
                newInteractions.set(articleId, prevState);
                return { interactions: newInteractions };
              });
            return null;
          }
        },

        // Toggle bookmark (Optimistic)
        toggleBookmark: async (articleId: string, userId?: string) => {
           const prevState = get().interactions.get(articleId);
           if (!prevState) return null;

           // Optimistic update
           set((state) => {
            const newInteractions = new Map(state.interactions);
            const current = newInteractions.get(articleId);
            if (current) {
              newInteractions.set(articleId, {
                ...current,
                isBookmarked: !current.isBookmarked,
              });
            }
            return { interactions: newInteractions };
          });

          try {
            const finalUserId = userId || 'anonymous';
            const response = await fetch(`/api/articles/${articleId}/bookmarks`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ articleId, userId: finalUserId })
            });

            const data = await response.json();
            
            if (!data.success) {
               // Revert on error
               console.error('Bookmark API error, reverting:', data);
               set((state) => {
                  const newInteractions = new Map(state.interactions);
                  newInteractions.set(articleId, prevState);
                  return { interactions: newInteractions };
                });
              return null;
            }

            // Sync with server response
            set((state) => {
                const newInteractions = new Map(state.interactions);
                const existing = newInteractions.get(articleId);
                if (existing) {
                  newInteractions.set(articleId, {
                    ...existing,
                    isBookmarked: data.data.bookmarked,
                  });
                }
                return { interactions: newInteractions };
              });
              
            return { bookmarked: data.data.bookmarked };
          } catch (err) {
            console.error('Error toggling bookmark, reverting:', err);
             // Revert on error
             set((state) => {
                const newInteractions = new Map(state.interactions);
                newInteractions.set(articleId, prevState);
                return { interactions: newInteractions };
              });
            return null;
          }
        },

        // Track view (Optimistic increment)
        trackView: async (articleId: string, userId?: string) => {
           // Optimistic update
           set((state) => {
              const newInteractions = new Map(state.interactions);
              const existing = newInteractions.get(articleId);
              if (existing) {
                newInteractions.set(articleId, {
                  ...existing,
                  viewCount: existing.viewCount + 1,
                });
              }
              return { interactions: newInteractions };
            });

          try {
            await fetch(`/api/articles/${articleId}/views`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: userId || 'anonymous' })
            });
            // Validation happens silently, we don't strictly revert views as it's less critical
          } catch (err) {
            console.error('Error tracking view:', err);
          }
        },

        // Getters
        getInteraction: (articleId: string) => get().interactions.get(articleId),
        isLiked: (articleId: string) => get().interactions.get(articleId)?.isLiked || false,
        isBookmarked: (articleId: string) => get().interactions.get(articleId)?.isBookmarked || false,
        getLikeCount: (articleId: string) => get().interactions.get(articleId)?.likeCount || 0,
        getViewCount: (articleId: string) => get().interactions.get(articleId)?.viewCount || 0,

        // Batch actions
        initializeInteractions: (interactions: BlogInteraction[]) => {
          const interactionMap = new Map(interactions.map(i => [i.articleId, i]));
          set({ interactions: interactionMap });
        },

        updateInteraction: (articleId: string, updates: Partial<BlogInteraction>) => {
          set((state) => {
            const newInteractions = new Map(state.interactions);
            const existing = newInteractions.get(articleId);
            if (existing) {
              newInteractions.set(articleId, { ...existing, ...updates });
            }
            return { interactions: newInteractions };
          });
        },

        clearInteractions: () => set({ interactions: new Map() }),
      }),
      {
        name: 'blog-interactions',
        storage: {
          getItem: (name) => {
            const item = localStorage.getItem(name);
            if (!item) return null;
            try {
              const parsed = JSON.parse(item);
              // Convert the interactions object back to Map
              if (parsed.state && parsed.state.interactions) {
                parsed.state.interactions = jsonToMap(parsed.state.interactions);
              }
              return parsed;
            } catch {
              return null;
            }
          },
          setItem: (name, value) => {
            try {
              // Convert Map to JSON for storage
              const valueToStore = {
                ...value,
                state: {
                  ...value.state,
                  interactions: mapToJSON(value.state.interactions),
                }
              };
              localStorage.setItem(name, JSON.stringify(valueToStore));
            } catch (error) {
              console.error('Failed to persist blog interactions:', error);
            }
          },
          removeItem: (name) => localStorage.removeItem(name),
        },
        partialize: (state) => state,
      }
    )
  )
);

// Selectors for optimized re-renders
export const useBlogInteraction = (articleId: string) => 
  useBlogStore((state) => state.getInteraction(articleId));

export const useBlogActions = () => 
  useBlogStore((state) => ({
    fetchArticleStatus: state.fetchArticleStatus,
    toggleLike: state.toggleLike,
    toggleBookmark: state.toggleBookmark,
    trackView: state.trackView,
    updateInteraction: state.updateInteraction,
  }));

export const useBlogLoading = () => useBlogStore((state) => state.loading);
export const useBlogError = () => useBlogStore((state) => state.error);