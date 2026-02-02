"use client";

import React from 'react';
import Image from 'next/image';
import { getSafeImageSrc } from '@/utils/imageUtils';

interface SafeImageProps {
  src: string | null | undefined;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  [key: string]: any;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackSrc = '/images/Join our tournaments.png',
  className = '',
  onError,
  onLoad,
  ...props
}) => {
  const safeSrc = getSafeImageSrc(src, fallbackSrc);
  const safeAlt = alt || 'KVE Esports Image';

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image failed to load:', safeSrc);
    
    // If the current src is not the fallback, try the fallback
    const target = e.target as HTMLImageElement;
    if (target.src !== fallbackSrc) {
      target.src = fallbackSrc;
    }
    
    if (onError) {
      onError(e);
    }
  };

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (onLoad) {
      onLoad(e);
    }
  };

  return (
    <Image
      src={safeSrc}
      alt={safeAlt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
};

// Also export a regular img tag version for cases where Next.js Image can't be used
export const SafeImgTag: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackSrc = '/images/Join our tournaments.png',
  className = '',
  onError,
  onLoad,
  ...props
}) => {
  const safeSrc = getSafeImageSrc(src, fallbackSrc);
  const safeAlt = alt || 'KVE Esports Image';

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image failed to load:', safeSrc);
    
    // If the current src is not the fallback, try the fallback
    const target = e.target as HTMLImageElement;
    if (target.src !== fallbackSrc) {
      target.src = fallbackSrc;
    }
    
    if (onError) {
      onError(e);
    }
  };

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (onLoad) {
      onLoad(e);
    }
  };

  return (
    <img
      src={safeSrc}
      alt={safeAlt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
};

export default SafeImage;