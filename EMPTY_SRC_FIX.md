# Fix for Empty String src Attribute Error

## Problem
React was throwing an error: "An empty string ("") was passed to the src attribute. This may cause the browser to download the whole page again over the network."

## Root Cause
The error occurs when an image component receives an empty string, null, or undefined value for its `src` attribute. This can happen when:
1. Data is loading and image URLs are not yet available
2. API responses contain empty or null image URLs
3. Conditional rendering logic doesn't properly handle missing image data

## Solution
Created a comprehensive fix with multiple layers of protection:

### 1. Utility Functions (`src/utils/imageUtils.ts`)
- `getSafeImageSrc()`: Ensures image src is never empty
- `getSafeImageProps()`: Creates safe image props
- `isValidImageUrl()`: Validates image URLs

### 2. Safe Image Components
- `SafeImage` (`src/components/SafeImage.tsx`): Next.js Image wrapper with safety checks
- `SafeImgTag`: Regular img tag wrapper with safety checks
- Updated `ImageWithFallback` in `HydrationFix.tsx`

### 3. Updated Components
- `Team.tsx`: Now uses SafeImage component
- `HydrationFix.tsx`: Updated to use utility functions

## Usage

### Using SafeImage Component
```tsx
import { SafeImage } from '@/components/SafeImage';

// Safe - will never pass empty string to src
<SafeImage 
  src={potentiallyEmptyUrl} 
  alt="Description"
  fallbackSrc="/images/fallback.png"
/>
```

### Using Utility Functions
```tsx
import { getSafeImageSrc } from '@/utils/imageUtils';

const safeSrc = getSafeImageSrc(userProvidedUrl, '/images/fallback.png');
```

## Prevention
To prevent this error in the future:
1. Always use `SafeImage` or `ImageWithFallback` components instead of raw `<img>` or `<Image>` tags
2. Use `getSafeImageSrc()` utility when working with dynamic image URLs
3. Validate image URLs before passing them to components
4. Provide fallback images for all dynamic content

## Files Modified
- `src/utils/imageUtils.ts` (new)
- `src/components/SafeImage.tsx` (new)
- `src/components/HydrationFix.tsx` (updated)
- `src/components/pages/landing/Team.tsx` (updated)

## Testing
The fix ensures that:
1. Empty strings are replaced with fallback URLs
2. Null/undefined values are handled gracefully
3. Invalid URLs are caught and replaced
4. All image components have proper error handling