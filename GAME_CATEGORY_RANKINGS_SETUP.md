# Game Category Rankings Setup Guide

## Overview

The game category rankings feature allows admins to edit rankings for individual games (PUBG Mobile, CODM, eFootball, etc.) and have those changes reflected on the main rankings page.

## Current Status

The system is now working with a **fallback storage mechanism**:

- ✅ Rankings can be edited in the admin panel (`/admin/game-categories`)
- ✅ Rankings are saved and persist during the session
- ⚠️ Currently using temporary in-memory storage (data lost on server restart)
- 📌 For permanent storage, you need to set up the Appwrite collection

## Setup Instructions

### Option 1: Automatic Setup (Recommended)

Run the setup script to automatically create the collection in Appwrite:

```bash
# From the project root directory
npm run setup:game-categories
```

Or manually:

```bash
node scripts/setup-game-category-rankings.js
```

**Requirements:**
- Environment variables must be set:
  - `NEXT_PUBLIC_APPWRITE_ENDPOINT`
  - `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
  - `APPWRITE_API_KEY`
  - `NEXT_PUBLIC_APPWRITE_DB_ID`

### Option 2: Manual Setup in Appwrite Console

1. Go to your Appwrite Console
2. Navigate to your Database
3. Create a new Collection with ID: `game_category_rankings`
4. Add the following attributes:
   - `categoryId` (String, Required, 255 chars)
   - `rank` (Integer, Required)
   - `playerName` (String, Required, 255 chars)
   - `university` (String, Required, 255 chars)
   - `points` (Integer, Optional)
   - `wins` (Integer, Optional)
   - `losses` (Integer, Optional)
   - `createdAt` (String, Optional)
   - `updatedAt` (String, Optional)

5. Create an index on `categoryId` for better query performance

## How It Works

### Admin Panel Flow

1. Admin navigates to `/admin/game-categories`
2. Clicks "Edit Rankings" for a game category
3. Adds/edits/deletes ranking entries
4. Clicks "Save Rankings"
5. Data is sent to `/api/admin/game-categories` endpoint
6. API attempts to save to Appwrite collection
7. If collection exists → Data saved to Appwrite ✅
8. If collection doesn't exist → Data saved to temporary storage ⚠️

### Main Rankings Page Flow

1. User visits `/rankings` or `/rankings/[game]`
2. Page fetches from `/api/rankings/categories`
3. API retrieves data from:
   - Appwrite `game_category_rankings` collection (if available)
   - In-memory fallback storage (if collection not available)
4. Rankings are displayed on the page

## Troubleshooting

### "Collection with the requested ID could not be found"

**Solution:** This is expected if you haven't set up the collection yet. The system will use fallback storage.

To fix permanently:
1. Run the setup script: `npm run setup:game-categories`
2. Or manually create the collection in Appwrite Console

### Rankings not appearing on main page

**Possible causes:**
1. Collection not created in Appwrite
2. API endpoint not responding
3. Browser cache issue

**Solutions:**
1. Check browser console for errors
2. Run the setup script
3. Clear browser cache and refresh
4. Check server logs for API errors

### Data lost after server restart

**Cause:** Using fallback in-memory storage

**Solution:** Set up the Appwrite collection using the setup script

## API Endpoints

### POST `/api/admin/game-categories`

Save rankings for a game category.

**Request:**
```json
{
  "categoryId": "pubgm",
  "rankings": [
    {
      "rank": 1,
      "playerName": "Player Name",
      "university": "University Name",
      "points": 100,
      "wins": 5,
      "losses": 2
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "message": "Successfully saved 1 rankings for category pubgm",
  "source": "appwrite" | "fallback"
}
```

### GET `/api/admin/game-categories?categoryId=pubgm`

Retrieve rankings for a specific category.

**Response:**
```json
{
  "success": true,
  "data": [...],
  "source": "appwrite" | "fallback"
}
```

## Environment Variables

Make sure these are set in your `.env` file:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://your-appwrite-instance.com/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
NEXT_PUBLIC_APPWRITE_DB_ID=your-database-id
```

## Next Steps

1. ✅ Test the admin panel by editing rankings
2. ✅ Verify rankings appear on the main page
3. 📌 Run the setup script to enable permanent storage
4. 📌 Verify data persists after server restart

## Support

If you encounter issues:

1. Check the browser console for errors
2. Check the server logs for API errors
3. Verify all environment variables are set correctly
4. Run the setup script to create the collection
5. Clear browser cache and refresh

---

**Last Updated:** 2025-01-15
**Status:** Working with fallback storage, ready for permanent setup
