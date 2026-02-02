'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// TypeScript interfaces
export interface FollowButtonProps {
  author: string;
  initialState?: boolean;
  className?: string;
  variant?: 'default' | 'compact';
  disabled?: boolean;
}

export interface FollowResponse {
  success: boolean;
  data: {
    following: boolean;
  };
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  author,
  initialState = false,
  className = '',
  variant = 'default',
  disabled = false
}) => {
  const [isFollowing, setIsFollowing] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch follow status on component mount
  useEffect(() => {
    const fetchFollowStatus = async () => {
      if (!user) return;
      
      try {
        const userId = user.$id || 'anonymous';
        const response = await fetch(`/api/authors/${encodeURIComponent(author)}/follow?userId=${userId}`);
        const data: FollowResponse = await response.json();
        if (data.success) {
          setIsFollowing(data.data.following);
        }
      } catch (error) {
        console.error('Error fetching follow status:', error);
      }
    };

    fetchFollowStatus();
  }, [author, user]);

  const handleFollowToggle = async () => {
    if (!user || loading || disabled) return;
    
    setLoading(true);
    try {
      const userId = user.$id || 'anonymous';
      const response = await fetch(`/api/authors/${encodeURIComponent(author)}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      const data: FollowResponse = await response.json();
      if (data.success) {
        console.log('Follow toggle successful:', data);
        setIsFollowing(data.data.following);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setLoading(false);
    }
  };

  const getButtonStyles = () => {
    const baseStyles = 'font-semibold hover:shadow-lg transition-all duration-300';
    const disabledStyles = loading || disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
    
    if (variant === 'compact') {
      const compactStyles = 'px-4 py-1 rounded-md text-sm';
      return `${baseStyles} ${compactStyles} ${disabledStyles} ${
        isFollowing 
          ? 'bg-gray-600 text-white' 
          : 'bg-gradient-to-r from-[#961c18] to-[#c41e3a] text-white'
      }`;
    }
    
    const defaultStyles = 'px-6 py-2 rounded-full';
    return `${baseStyles} ${defaultStyles} ${disabledStyles} ${
      isFollowing 
        ? 'bg-gray-600 text-white' 
        : 'bg-gradient-to-r from-[#961c18] to-[#c41e3a] text-white'
    }`;
  };

  const getButtonText = () => {
    if (loading) return 'Loading...';
    if (variant === 'compact') {
      return isFollowing ? 'Following' : 'Follow';
    }
    return isFollowing ? 'Following' : 'Follow Author';
  };

  return (
    <button 
      onClick={handleFollowToggle}
      disabled={loading || disabled || !user}
      className={`${getButtonStyles()} ${className}`}
      title={!user ? 'Please login to follow authors' : undefined}
    >
      {getButtonText()}
    </button>
  );
};

export default FollowButton;