"use client";

import { useEffect, useState, useRef } from 'react';
import { getSafeImageSrc } from '@/utils/imageUtils';

interface HydrationFixProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const HydrationFix: React.FC<HydrationFixProps> = ({ 
  children, 
  fallback = null 
}) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

interface ImageWithFallbackProps {
  src: string | object | null | undefined;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  [key: string]: any;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc = '/images/Join our tournaments.png',
  className = '',
  onError,
  onLoad,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState(getSafeImageSrc(src, fallbackSrc));
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    try {
      const safeSrc = getSafeImageSrc(src, fallbackSrc);
      setCurrentSrc(safeSrc);
      setHasError(false);
      setIsLoading(true);
    } catch (error) {
      console.error('Error processing image src:', error, 'Original src:', src);
      setCurrentSrc(fallbackSrc);
      setHasError(true);
      setIsLoading(false);
    }
  }, [src, fallbackSrc]);

  // Monitor the image element for completion
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // Check if image is already complete (cached or loaded)
    if (img.complete && img.naturalWidth > 0) {
      setIsLoading(false);
      return;
    }

    // If image failed to load
    if (img.complete && img.naturalWidth === 0) {
      return;
    }

    // Set up a polling mechanism to check image status
    // This handles the case where the image loads very quickly
    let isMounted = true;
    const checkInterval = setInterval(() => {
      if (isMounted && img.complete && img.naturalWidth > 0) {
        setIsLoading(false);
        clearInterval(checkInterval);
      }
    }, 50);

    return () => {
      isMounted = false;
      clearInterval(checkInterval);
    };
  }, [currentSrc]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image failed to load:', currentSrc);
    
    if (!hasError && currentSrc !== fallbackSrc) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
    
    if (onError) {
      onError(e);
    }
  };

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false);
    
    if (onLoad) {
      onLoad(e);
    }
  };

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#961c18]"></div>
        </div>
      )}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </div>
  );
};

export default HydrationFix;