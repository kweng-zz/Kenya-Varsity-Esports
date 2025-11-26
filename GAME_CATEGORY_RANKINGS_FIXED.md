# Game Category Rankings - Fixed ✅

## What Was Fixed

### Issue 1: Missing `total` Attribute
**Error:** `Invalid document structure: Unknown attribute: "total"`

**Solution:** Added the `total` attribute to the `game_category_rankings` collection using the fix script.

### Issue 2: Data Loss on Save
**Problem:** Every POST request was deleting all existing rankings

**Solution:** Modified the admin API to only delete rankings when `replaceAll: true` is explicitly sent

## Current Collection Schema

The `game_category_rankings` collection now has these attributes:

| Attribute | Type | Required | Purpose |
|-----------|------|----------|---------|
| categoryId | String | Yes | Game category ID (pubg-mobile, codm, etc.) |
| rank | Integer | Yes | Ranking position (1, 2, 3, etc.) |
| playerName | String | Yes | Squad/Team name |
| university | String | Yes | University name |
| wins | Integer | No | Static wins value |
| losses | Integer | No | Static losses value |
| total | Integer | No | Static total points |
| image | String | No | Featured image URL |
| createdAt | String | No | Creation timestamp |
| updatedAt | String | No | Last update timestamp |

## How to Add Rankings

### Via Admin Panel
1. Go to `/admin/game-categories`
2. Select a game category
3. Add rankings with:
   - Squad Name (playerName)
   - University
   - Rank
   - Wins
   - Losses
   - Total
   - Image URL (optional)
4. Save

### Via API
```bash
curl -X POST http://localhost:3000/api/admin/game-categories \
  -H "Content-Type: application/json" \
  -d '{
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
      },
      {
        "rank": 2,
        "playerName": "ANOTHER SQUAD",
        "university": "ANOTHER UNI",
        "wins": 20,
        "losses": 2,
        "total": 68
      }
    ],
    "replaceAll": true
  }'
```

## Important Parameters

### replaceAll Parameter
- **`replaceAll: true`** - Deletes all existing rankings for the category and creates new ones
- **`replaceAll: false` or omitted** - Only adds new rankings without deleting existing ones

## Verification Steps

1. **Check Collection Exists:**
   ```bash
   node scripts/fix-game-categories-collection.js
   ```

2. **Add Test Rankings:**
   - Use the admin panel or API to add rankings
   - Verify they appear in Appwrite console

3. **Check Rankings Page:**
   - Navigate to `/rankings/pubg-mobile` (or any game)
   - Verify rankings display correctly

4. **Check API Response:**
   - Open browser DevTools → Network
   - Go to rankings page
   - Check `/api/rankings/categories` response
   - Verify rankings are included

## Display Format

Rankings are displayed in a table with these columns:

| Column | Source |
|--------|--------|
| SQUAD NAME | playerName |
| UNIVERSITY | university |
| RANK | rank |
| WINS | wins |
| LOSSES | losses |
| TOTAL | total |

## Example Data

```json
{
  "rank": 1,
  "playerName": "BRUTAL PSYCHOS",
  "university": "STRATHMORE",
  "wins": 24,
  "losses": 0,
  "total": 72,
  "image": "/images/PUBGM.jpeg"
}
```

## Troubleshooting

### Rankings not showing
1. Check Appwrite console - verify documents exist
2. Check API response - open DevTools Network tab
3. Check category ID - must match game slug

### Error: "Unknown attribute"
1. Run: `node scripts/fix-game-categories-collection.js`
2. Wait a few seconds for Appwrite to process
3. Try again

### Data keeps disappearing
1. Make sure `replaceAll` is not being sent as `true` unless you want to replace all data
2. Check admin panel settings
3. Check API calls in browser DevTools

## Files Modified

- `src/app/api/admin/game-categories/route.ts` - Fixed data loss issue
- `src/app/api/rankings/categories/route.ts` - Rankings API
- `src/app/rankings/[game]/page.tsx` - Rankings display
- `scripts/fix-game-categories-collection.js` - Collection fix script (NEW)

## Next Steps

1. Run the fix script to ensure all attributes exist
2. Add game category rankings through the admin panel
3. Verify rankings appear on the rankings page
4. Test the API endpoints

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Check the server logs for API errors
3. Run the fix script to ensure collection is properly set up
4. Verify Appwrite connection in `.env` file
