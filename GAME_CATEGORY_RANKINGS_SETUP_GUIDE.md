# Game Category Rankings - Complete Setup Guide

## Problem Identified

The `game_category_rankings` collection was not properly set up in Appwrite, causing:
- Data to be lost when saving rankings
- Empty arrays returned from the API
- Rankings not displaying on the page

## Solution

### Step 1: Verify and Create the Collection

Run the verification script to check if the collection exists and create it if needed:

```bash
node scripts/verify-and-fix-game-categories.js
```

This script will:
- Check if the `game_category_rankings` collection exists
- Verify all required attributes are present
- Create missing attributes
- Create the collection if it doesn't exist

### Step 2: Verify Collection Schema

After running the script, verify the collection has these attributes:

| Attribute | Type | Required | Size |
|-----------|------|----------|------|
| categoryId | String | Yes | 255 |
| rank | Integer | Yes | - |
| playerName | String | Yes | 255 |
| university | String | Yes | 255 |
| wins | Integer | No | - |
| losses | Integer | No | - |
| total | Integer | No | - |
| image | String | No | 2048 |
| createdAt | String | No | - |
| updatedAt | String | No | - |

### Step 3: Add Game Category Rankings

You can now add rankings through:

1. **Admin Panel** - Use the admin interface to add rankings
2. **API** - POST to `/api/admin/game-categories` with:

```json
{
  "categoryId": "pubg-mobile",
  "rankings": [
    {
      "rank": 1,
      "playerName": "BRUTAL PSYCHOS",
      "university": "STRATHMORE",
      "wins": 24,
      "losses": 0,
      "total": 72,
      "image": "/images/PUBGM.jpeg"
    }
  ],
  "replaceAll": true
}
```

### Important: replaceAll Parameter

- **`replaceAll: true`** - Deletes all existing rankings for the category and creates new ones (use for full replacement)
- **`replaceAll: false` or omitted** - Only adds new rankings without deleting existing ones (use for incremental updates)

## Data Structure

### Game Category Ranking Object

```typescript
interface GameCategoryRanking {
  id: string;              // Document ID
  rank: number;            // Ranking position (1, 2, 3, etc.)
  playerName: string;      // Squad/Team name
  university: string;      // University name
  wins: number;            // Static wins value
  losses: number;          // Static losses value
  total: number;           // Static total points
  image?: string;          // Optional featured image URL
  categoryId: string;      // Game category ID (pubg-mobile, codm, etc.)
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
}
```

## Display Format

The rankings page displays:

| Column | Source |
|--------|--------|
| SQUAD NAME | playerName |
| UNIVERSITY | university |
| RANK | rank |
| WINS | wins |
| LOSSES | losses |
| TOTAL | total |

## Troubleshooting

### Issue: "Admin API - Fetched rankings from Appwrite: []"

**Solution:**
1. Run the verification script: `node scripts/verify-and-fix-game-categories.js`
2. Check Appwrite console to confirm collection exists
3. Verify all attributes are created

### Issue: Data keeps getting deleted

**Solution:**
- The API now only deletes data when `replaceAll: true` is explicitly sent
- Make sure your admin panel or API calls don't send `replaceAll: true` unless you want to replace all data
- Check the logs for "Replace all: true/false"

### Issue: Rankings not showing on page

**Solution:**
1. Verify rankings are saved: Check Appwrite console
2. Check API response: Open browser DevTools → Network → `/api/rankings/categories`
3. Verify category IDs match: Check if categoryId matches the game slug

### Issue: Collection doesn't exist

**Solution:**
```bash
# Run the setup script
node scripts/setup-game-category-rankings.js

# Or run the verification script
node scripts/verify-and-fix-game-categories.js
```

## API Endpoints

### GET /api/admin/game-categories

Fetches all game category rankings grouped by category ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "pubg-mobile": [
      {
        "$id": "doc_id",
        "categoryId": "pubg-mobile",
        "rank": "1",
        "playerName": "BRUTAL PSYCHOS",
        "university": "STRATHMORE",
        "wins": "24",
        "losses": "0",
        "total": "72",
        "image": "/images/PUBGM.jpeg",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ]
  },
  "source": "appwrite"
}
```

### POST /api/admin/game-categories

Saves game category rankings.

**Request:**
```json
{
  "categoryId": "pubg-mobile",
  "rankings": [
    {
      "rank": 1,
      "playerName": "BRUTAL PSYCHOS",
      "university": "STRATHMORE",
      "wins": 24,
      "losses": 0,
      "total": 72,
      "image": "/images/PUBGM.jpeg"
    }
  ],
  "replaceAll": true
}
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "message": "Successfully saved 1 rankings for category pubg-mobile",
  "source": "appwrite"
}
```

### GET /api/rankings/categories

Fetches all game categories with their rankings for display.

**Query Parameters:**
- `season` (optional): "september" or "january" (default: "september")

**Response:**
```json
{
  "success": true,
  "data": {
    "septemberMain": [
      {
        "id": "pubg-mobile",
        "name": "PUBG Mobile",
        "title": "PUBG MOBILE RANKINGS",
        "description": "Current standings for PUBG Mobile tournament",
        "image": "/images/PUBGM.jpeg",
        "isActive": true,
        "universities": [
          {
            "id": "doc_id",
            "playerName": "BRUTAL PSYCHOS",
            "university": "STRATHMORE",
            "rank": 1,
            "wins": 24,
            "losses": 0,
            "total": 72
          }
        ]
      }
    ],
    "septemberAdded": [],
    "januaryMain": [],
    "januaryAdded": []
  }
}
```

## Category IDs

Supported category IDs:
- `pubg-mobile` (aliases: pubgm, pubg)
- `call-of-duty-mobile-br` (aliases: codm, codm-br)
- `codm-multiplayer` (aliases: codm-mp)
- `efootball-mobile` (aliases: efootball)
- `eafc-1v1` (aliases: eafc)
- `eafc-2v2`
- `eafc-women`
- `rocket-league`
- `valorant`
- `chess`
- `nba2k`
- `fighting-games`

## Files Modified

- `src/app/api/rankings/categories/route.ts` - Rankings API
- `src/app/api/admin/game-categories/route.ts` - Admin API (fixed data loss issue)
- `src/app/rankings/[game]/page.tsx` - Rankings display page
- `scripts/setup-game-category-rankings.js` - Collection setup
- `scripts/verify-and-fix-game-categories.js` - Verification and fix script (NEW)

## Next Steps

1. Run the verification script
2. Add game category rankings through the admin panel
3. Verify rankings appear on the rankings page
4. Check the browser console for any errors
