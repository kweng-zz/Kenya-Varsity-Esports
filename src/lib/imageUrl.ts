/**
 * Resolves an image URL to a site-relative path.
 * 
 * Rules:
 * - empty/undefined → returns fallback fallback image path
 * - starts with http:// or https:// → return unchanged (external images)
 * - starts with / → return unchanged (local images from public/)
 * - otherwise → prepend /
 * - NEVER prepends localhost from CMS host
 */
export function resolveImageUrl(
  url: string | null | undefined,
  fallback: string = '/images/Join our tournaments.png'
): string {
  // Handle null, undefined, empty string
  if (!url || url.trim() === '') {
    return fallback;
  }

  const trimmedUrl = url.trim();

  // If it's already a full URL (http:// or https://), return as-is
  // These are external images, never modify them
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl;
  }

  // If it starts with /, it's already a local path from public/
  // Return unchanged - Next.js serves these from the root
  if (trimmedUrl.startsWith('/')) {
    return trimmedUrl;
  }

  // Otherwise, prepend / to make it a relative path
  return `/${trimmedUrl}`;
}

export default resolveImageUrl;