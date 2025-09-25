/**
 * Utility functions for handling image URLs safely
 */

/**
 * Ensures that an image src is never empty or null
 * @param src - The source URL that might be empty, null, or undefined
 * @param fallback - The fallback URL to use if src is invalid
 * @returns A safe URL that is never empty
 */
export function getSafeImageSrc(
  src: string | null | undefined, 
  fallback: string = '/images/Join our tournaments.png'
): string {
  // Handle null, undefined, or empty string
  if (!src || src === null || src === undefined || src.trim() === '') {
    return fallback;
  }
  
  const trimmedUrl = src.trim();
  
  // If it's already a full URL, return as is
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl;
  }
  
  // If it starts with /uploads/, it's a Strapi upload - prepend Strapi URL
  if (trimmedUrl.startsWith('/uploads/')) {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
    return `${strapiUrl}${trimmedUrl}`;
  }
  
  // If it starts with /, assume it's a local image
  if (trimmedUrl.startsWith('/')) {
    return trimmedUrl;
  }
  
  // Otherwise, assume it needs /images/ prefix
  return `/images/${trimmedUrl}`;
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