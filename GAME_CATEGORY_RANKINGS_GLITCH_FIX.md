# Game Category Rankings Glitch Fix

## Problem Description
When filling in rankings for another game category (e.g., "KUER SEASON 3 CALL OF DUTY RANKINGS"), the rankings were being duplicated or mixed with other categories. This caused the same rankings to appear across multiple game categories.

## Root Causes Identified

### 1. **Improper Category Isolation in Rankings API** (`/api/rankings/categories/route.ts`)
The API was replacing the entire `rankingsByCategory` map when adding game category rankings, instead of properly merging them by category.

**Issue:**
```typescript
// OLD CODE - This overwrites all rankings for a category
gameCategoryRankingsByCategory.forEach((rankings, categoryId) => {
    rankingsByCategory.set(categoryId, rankings); // ❌ Overwrites existing data
});
```

**Fix:**
```typescript
// NEW CODE - Only use game category rankings if no traditional rankings exist
gameCategoryRankingsByCategory.forEach((rankings, categoryId) => {
    if (!rankingsByCategory.has(categoryId) || rankingsByCategory.get(categoryId)!.length === 0) {
        rankingsByCategory.set(categoryId, rankings);
    }
});
```

### 2. **Missing Category Filtering in Admin API** (`/api/admin/game-categories/route.ts`)
The GET endpoint was fetching all rankings without properly filtering by category when requested.

**Issue:**
```typescript
// OLD CODE - Always fetches all rankings
const response = await databases.listDocuments(
    DATABASE_ID,
    GAME_CATEGORIES_COLLECTION,
    [Query.limit(1000)] // ❌ No category filter
);
```

**Fix:**
```typescript
// NEW CODE - Filters by specific category when requested
let queries: any[] = [Query.limit(1000)];
if (categoryId) {
    let normalizedId = categoryId;
    // Normalize the categoryId...
    queries = [Query.equal('categoryId', normalizedId), Query.limit(1000)];
}
```

### 3. **Conditional Deletion Logic in Admin API POST** (`/api/admin/game-categories/route.ts`)
The API only deleted existing rankings when `replaceAll` was explicitly true, but when editing a category, it should ALWAYS replace rankings for that specific category to prevent duplicates.

**Issue:**
```typescript
// OLD CODE - Only deletes if replaceAll is true
if (replaceAll === true) {
    // Delete existing rankings
}
```

**Fix:**
```typescript
// NEW CODE - Always deletes existing rankings for the category being updated
// This ensures we don't have duplicate or mixed data when updating a category
try {
    const existingRankings = await databases.listDocuments(
        DATABASE_ID,
        GAME_CATEGORIES_COLLECTION,
        [Query.equal('categoryId', categoryId)]
    );
    // Delete all existing rankings for this category
    for (const doc of existingRankings.documents) {
        await databases.deleteDocument(...);
    }
}
```

## Changes Made

### File 1: `/src/app/api/rankings/categories/route.ts`
- **Line ~180-190**: Modified the logic for merging game category rankings
- Changed from overwriting to conditional merging based on existing data
- Ensures rankings from different sources don't conflict

### File 2: `/src/app/api/admin/game-categories/route.ts`
- **GET endpoint (~50-70)**: Added category filtering when `categoryId` parameter is provided
- **POST endpoint (~120-140)**: Changed deletion logic to ALWAYS delete existing rankings for the category being updated
- Added better logging for debugging category isolation issues

## How It Works Now

1. **When saving rankings for a category:**
   - The API first deletes ALL existing rankings for that specific category
   - Then creates new rankings with the provided data
   - This prevents duplicates and ensures clean category isolation

2. **When fetching rankings:**
   - The API properly groups rankings by category
   - Only merges game category rankings if no traditional rankings exist for that category
   - Maintains proper separation between different game categories

3. **Category Normalization:**
   - Both endpoints use the same normalization map to handle different slug formats
   - Ensures "codm", "codm-br", and "call-of-duty-mobile-br" all map to the same category

## Cleaning Up Existing Duplicates

If you already have duplicate rankings in your database, run the cleanup script:

```bash
node scripts/cleanup-duplicate-rankings.js
```

This script will:
1. Identify all duplicate rankings (same categoryId and rank appearing multiple times)
2. Keep the first occurrence of each ranking
3. Delete all duplicate entries
4. Report how many duplicates were removed

**Important:** Make sure you have a backup of your database before running this script!

## Testing the Fix

To verify the fix works:

1. Run the cleanup script to remove existing duplicates (if any)
2. Go to Admin Panel → Game Categories Management
3. Edit rankings for "PUBG Mobile" and save some entries
4. Edit rankings for "Call of Duty Mobile" and save different entries
5. Verify that each category shows only its own rankings
6. Check the rankings page to ensure categories display correctly
7. Edit the same category again and verify old rankings are replaced (not duplicated)

## Expected Behavior After Fix

- ✅ Each game category maintains its own isolated rankings
- ✅ Editing one category doesn't affect other categories
- ✅ Rankings display correctly on the public rankings page
- ✅ No duplicate entries across categories
- ✅ Proper category filtering in the admin panel

## Logging for Debugging

The API now includes detailed logging:
- `📊 API - Rankings grouped by category:` - Shows which categories have rankings
- `🗑️ Found existing rankings:` - Shows how many rankings are being replaced
- `📝 Creating ranking:` - Shows each ranking being created
- `✅ Successfully saved all rankings to Appwrite` - Confirms successful save

Check browser console or server logs to verify the fix is working correctly.
