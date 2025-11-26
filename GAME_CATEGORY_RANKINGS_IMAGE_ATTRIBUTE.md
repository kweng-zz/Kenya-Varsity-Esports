# Game Category Rankings - Image Attribute Addition

## Overview

The `game_category_rankings` Appwrite collection was missing the `image` attribute, which is required to display featured images in the rankings page. This document outlines the changes made to add this functionality.

## Changes Made

### 1. Updated Setup Script
**File:** `scripts/setup-game-category-rankings.js`

Added the `image` attribute to the collection schema:
- **Attribute Name:** `image`
- **Type:** String
- **Size:** 2048 characters (to accommodate long URLs)
- **Required:** No (optional field)

This ensures that when the collection is created fresh, it includes the image attribute from the start.

### 2. Created Migration Script
**File:** `scripts/add-image-attribute-to-game-categories.js`

A new migration script that adds the `image` attribute to existing `game_category_rankings` collections. This is useful if you already have the collection set up but it's missing the image attribute.

**Usage:**
```bash
node scripts/add-image-attribute-to-game-categories.js
```

### 3. Updated Admin API
**File:** `src/app/api/admin/game-categories/route.ts`

Modified the POST endpoint to include the `image` field when creating/updating game category rankings:
```typescript
image: String(ranking.image || ''),
```

This allows the admin panel to save image URLs along with ranking data.

### 4. Updated Rankings Categories API
**File:** `src/app/api/rankings/categories/route.ts`

Enhanced the GET endpoint to:
- Retrieve the `image` attribute from game category rankings
- Fall back to the category image if individual ranking images aren't available
- Pass the image URL to the frontend component

```typescript
// Get image from category or from first ranking if available
let categoryImage = category.image;
if (!categoryImage && sortedRankings.length > 0 && sortedRankings[0].image) {
    categoryImage = sortedRankings[0].image;
}
```

## How It Works

### Data Flow

1. **Admin Panel** → Saves game category rankings with image URLs to Appwrite
2. **Admin API** → Stores the image field in the `game_category_rankings` collection
3. **Rankings API** → Retrieves rankings and extracts image URLs
4. **Frontend Component** → Displays the images in the rankings grid

### Image Sources (Priority Order)

1. **Tournament Featured Image** - From the tournaments collection
2. **Game Category Ranking Image** - From the game_category_rankings collection
3. **Mapped Image** - From the gameImageMap in the API
4. **Default Image** - Fallback to `/images/{gameSlug}.png`

## Implementation Steps

### For New Installations

If you're setting up the project fresh:

1. Run the setup script:
   ```bash
   node scripts/setup-game-category-rankings.js
   ```

The collection will be created with the `image` attribute included.

### For Existing Installations

If you already have the `game_category_rankings` collection:

1. Run the migration script:
   ```bash
   node scripts/add-image-attribute-to-game-categories.js
   ```

2. The script will add the `image` attribute to your existing collection

3. You can now add image URLs to your game category rankings through the admin panel

## Component Integration

The `CategorySection` component in `src/components/pages/rankings/CategorySections.tsx` already expects the `image` attribute:

```typescript
interface GameCategoryInfo {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;  // ← This is now properly populated
  isActive: boolean;
  universities: GameCategoryRanking[];
}
```

The component displays images in the category grid:
```typescript
<img
  className="w-[360px] h-[430px] object-cover border border-white"
  alt={category.name}
  src={category.image}
/>
```

## Database Schema

### game_category_rankings Collection

| Attribute | Type | Required | Size | Purpose |
|-----------|------|----------|------|---------|
| categoryId | String | Yes | 255 | Game category identifier |
| rank | Integer | Yes | - | Ranking position |
| playerName | String | Yes | 255 | Squad/player name |
| university | String | Yes | 255 | University name |
| points | Integer | No | - | Points earned |
| wins | Integer | No | - | Wins count |
| losses | Integer | No | - | Losses count |
| **image** | **String** | **No** | **2048** | **Featured image URL** |
| createdAt | String | No | - | Creation timestamp |
| updatedAt | String | No | - | Last update timestamp |

## Testing

To verify the implementation:

1. **Check Collection Schema:**
   - Go to Appwrite Console
   - Navigate to Database → game_category_rankings
   - Verify the `image` attribute exists

2. **Add Test Data:**
   - Use the admin panel to add game category rankings with image URLs
   - Example image URL: `/images/PUBGM.jpeg`

3. **Verify Frontend:**
   - Navigate to the rankings page
   - Confirm that category images are displayed correctly

## Troubleshooting

### Images Not Displaying

1. **Check Appwrite Collection:**
   - Verify the `image` attribute exists in the collection
   - Run the migration script if needed

2. **Check API Response:**
   - Open browser DevTools → Network tab
   - Check the `/api/rankings/categories` response
   - Verify the `image` field is populated

3. **Check Image URLs:**
   - Ensure image URLs are valid and accessible
   - Check that images exist in the `/public/images/` directory

### Migration Script Fails

1. **Verify Environment Variables:**
   ```bash
   echo $NEXT_PUBLIC_APPWRITE_ENDPOINT
   echo $NEXT_PUBLIC_APPWRITE_PROJECT_ID
   echo $APPWRITE_API_KEY
   echo $NEXT_PUBLIC_APPWRITE_DB_ID
   ```

2. **Check Appwrite Connection:**
   - Verify Appwrite server is running
   - Check network connectivity

3. **Run Setup Script Instead:**
   - If migration fails, you can recreate the collection with the updated setup script

## Related Files

- `src/components/pages/rankings/CategorySections.tsx` - Frontend component
- `src/app/api/rankings/categories/route.ts` - Rankings API
- `src/app/api/admin/game-categories/route.ts` - Admin API
- `scripts/setup-game-category-rankings.js` - Collection setup
- `scripts/add-image-attribute-to-game-categories.js` - Migration script

## Notes

- The `image` attribute is optional to maintain backward compatibility
- Existing rankings without images will continue to work
- Images can be added or updated at any time
- The component gracefully handles missing images with fallback logic
