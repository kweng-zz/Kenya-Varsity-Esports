/**
 * Utility functions for handling image URLs safely
 */

import resolveImageUrl from '@/lib/imageUrl';

/**
 * Ensures that an image src is never empty or null
 * @param src - The source URL that might be empty, null, undefined, or an object
 * @param fallback - The fallback URL to use if src is invalid
 * @returns A safe URL that is never empty
 */
export function getSafeImageSrc(
  src: string | null | undefined | object, 
  fallback: string = '/images/Join our tournaments.png'
): string {
  // Handle null, undefined, empty string, or non-string types
  if (!src || src === null || src === undefined) {
    return fallback;
  }
  
  // Handle case where src is an object (common error in the logs)
  if (typeof src !== 'string') {
    console.warn('Image src is not a string, received:', typeof src, src);
    
    // Try to extract URL from object if it has common properties
    if (src && typeof src === 'object') {
      const obj = src as any;
      if (obj.url) {
        src = obj.url;
      } else if (obj.src) {
        src = obj.src;
      } else if (obj.href) {
        src = obj.href;
      } else {
        return fallback;
      }
    } else {
      return fallback;
    }
  }
  
  // Now src should be a string
  const urlString = src as string;
  
  if (urlString.trim() === '') {
    return fallback;
  }
  
  return resolveImageUrl(urlString, fallback);
}

/**
 * Creates a safe image props object that prevents empty src attributes
 * @param src - The source URL
 * @param alt - The alt text
 * @param fallback - The fallback URL
 * @returns Safe image props
 */
export function getSafeImageProps(
  src: string | null | undefined,
  alt: string,
  fallback?: string
) {
  return {
    src: getSafeImageSrc(src, fallback),
    alt: alt || 'Image',
  };
}

/**
 * Validates if a URL is a valid image source
 * @param url - The URL to validate
 * @returns true if the URL is valid, false otherwise
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return false;
  }
  
  const trimmedUrl = url.trim();
  
  // Check if it's a valid URL format
  try {
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
      new URL(trimmedUrl);
      return true;
    }
    
    // Check if it's a valid relative path
    if (trimmedUrl.startsWith('/')) {
      return true;
    }
    
    return false;
  } catch {
    return false;
  }
}

export default {
  getSafeImageSrc,
  getSafeImageProps,
  isValidImageUrl,
};