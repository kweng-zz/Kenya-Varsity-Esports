"use client";

import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ViewTrackerProps {
  articleId: string;
  trackView?: boolean; // Whether to increment view count when component mounts
}

interface ViewData {
  viewCount: number;
  lastViewed: string;
}

export const ViewTracker: React.FC<ViewTrackerProps> = ({ articleId, trackView = true }) => {
  const { user } = useAuth();
  const [viewData, setViewData] = useState<ViewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const fetchViews = async () => {
      if (!articleId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch current view count
        const response = await fetch(`/api/articles/${encodeURIComponent(articleId)}/views`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (mounted) {
          if (result.success && result.data) {
            setViewData(result.data);
          } else {
            setError(result.error || 'Failed to load view count');
          }
        }
        
        // Track view if requested (for progressive enhancement)
        if (trackView) {
          try {
            const trackResponse = await fetch(`/api/articles/${encodeURIComponent(articleId)}/views`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userId: user?.$id || 'anonymous' })
            });
            
            if (trackResponse.ok) {
              const trackResult = await trackResponse.json();
              if (mounted && trackResult.success && trackResult.data) {
                setViewData(trackResult.data);
              }
            }
          } catch (trackError) {
            // Don't fail the entire component if view tracking fails
            console.warn('View tracking failed:', trackError);
          }
        }
      } catch (err) {
        console.error('Error fetching view count:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load view count');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchViews();

    return () => {
      mounted = false;
    };
  }, [articleId, trackView]);

  const formatViewCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-1">
        <Eye className="w-3 h-3" />
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-1">
        <Eye className="w-3 h-3" />
        <span className="text-gray-500">--</span>
      </div>
    );
  }

  if (!viewData) {
    return (
      <div className="flex items-center gap-1">
        <Eye className="w-3 h-3" />
        <span className="text-gray-500">0 views</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Eye className="w-3 h-3" />
      <span>{formatViewCount(viewData.viewCount)} views</span>
    </div>
  );
};

export default ViewTracker;