# Game Rankings API Documentation

## Overview

The Game Rankings API provides endpoints for managing game rankings in the esports platform. Admins can create, read, update, and delete rankings for different game categories through both the API and the admin dashboard.

## API Endpoints

### Base URL
```
/api/admin/rankings
```

---

## GET - Fetch Rankings

**Endpoint:** `GET /api/admin/rankings`

**Description:** Fetch rankings for a specific game category or all categories.

**Query Parameters:**
- `categoryId` (optional): Specific game category ID to fetch rankings for
- `limit` (optional): Maximum number of rankings to return (default: 100)

**Example Requests:**

```bash
# Get all rankings
curl "http://localhost:3000/api/admin/rankings"

# Get rankings for a specific game
curl "http://localhost:3000/api/admin/rankings?categoryId=pubg-mobile"

# Get top 10 rankings
curl "http://localhost:3000/api/admin/rankings?limit=10"

# Get top 10 rankings for a specific game
curl "http://localhost:3000/api/admin/rankings?categoryId=pubg-mobile&limit=10"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "ranking_id_123",
      "rank": 1,
      "playerName": "ProGamer_Elite",
      "university": "Makerere University",
      "wins": 45,
      "losses": 8,
      "total": 862,
      "points": 2850,
      "game": "pubg-mobile",
      "categoryId": "pubg-mobile"
    },
    {
      "id": "ranking_id_124",
      "rank": 2,
      "playerName": "ShadowKnight",
      "university": "Kampala International University",
      "wins": 42,
      "losses": 10,
      "total": 740,
      "points": 2720,
      "game": "pubg-mobile",
      "categoryId": "pubg-mobile"
    }
  ],
  "source": "appwrite",
  "count": 2
}
```

---

## POST - Create/Update Rankings

**Endpoint:** `POST /api/admin/rankings`

**Description:** Create or update rankings for a game category. By default, replaces all existing rankings for the category.

**Request Body:**
```json
{
  "categoryId": "pubg-mobile",
  "rankings": [
    {
      "rank": 1,
      "playerName": "ProGamer_Elite",
      "university": "Makerere University",
      "wins": 45,
      "losses": 8,
      "total": 862,
      "points": 2850,
      "image": "https://example.com/image.jpg"
    },
    {
      "rank": 2,
      "playerName": "ShadowKnight",
      "university": "Kampala International University",
      "wins": 42,
      "losses": 10,
      "total": 740,
      "points": 2720
    }
  ],
  "replaceAll": true
}
```

**Parameters:**
- `categoryId` (required): The game category ID (e.g., "pubg-mobile", "codm-multiplayer")
- `rankings` (required): Array of ranking entries
- `replaceAll` (optional): If true, deletes all existing rankings for this category before adding new ones (default: true)

**Ranking Entry Fields:**
- `rank` (required): Ranking position (number)
- `playerName` (required): Player's name (string)
- `university` (required): Player's university (string)
- `wins` (required): Number of wins (number)
- `losses` (required): Number of losses (number)
- `total` (required): Total score (number)
- `points` (optional): Points earned (number, defaults to total if not provided)
- `image` (optional): Player image URL (string)

**Example Request:**
```bash
curl -X POST "http://localhost:3000/api/admin/rankings" \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": "pubg-mobile",
    "rankings": [
      {
        "rank": 1,
        "playerName": "ProGamer_Elite",
        "university": "Makerere University",
        "wins": 45,
        "losses": 8,
        "total": 862,
        "points": 2850
      }
    ],
    "replaceAll": true
  }'
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "ranking_id_123",
      "rank": 1,
      "playerName": "ProGamer_Elite",
      "university": "Makerere University",
      "wins": 45,
      "losses": 8,
      "total": 862,
      "points": 2850,
      "categoryId": "pubg-mobile"
    }
  ],
  "message": "Successfully saved 1 rankings for category pubg-mobile",
  "source": "appwrite",
  "count": 1
}
```

---

## PUT - Update Single Ranking

**Endpoint:** `PUT /api/admin/rankings`

**Description:** Update a specific ranking entry.

**Request Body:**
```json
{
  "rankingId": "ranking_id_123",
  "categoryId": "pubg-mobile",
  "ranking": {
    "rank": 1,
    "playerName": "ProGamer_Elite_Updated",
    "university": "Makerere University",
    "wins": 50,
    "losses": 5,
    "total": 900,
    "points": 2900
  }
}
```

**Parameters:**
- `rankingId` (required): The ranking document ID to update
- `categoryId` (required): The game category ID
- `ranking` (required): Updated ranking data (same fields as POST)

**Example Request:**
```bash
curl -X PUT "http://localhost:3000/api/admin/rankings" \
  -H "Content-Type: application/json" \
  -d '{
    "rankingId": "ranking_id_123",
    "categoryId": "pubg-mobile",
    "ranking": {
      "rank": 1,
      "playerName": "ProGamer_Elite_Updated",
      "university": "Makerere University",
      "wins": 50,
      "losses": 5,
      "total": 900,
      "points": 2900
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ranking_id_123",
    "rank": 1,
    "playerName": "ProGamer_Elite_Updated",
    "university": "Makerere University",
    "wins": 50,
    "losses": 5,
    "total": 900,
    "points": 2900
  },
  "message": "Ranking updated successfully",
  "source": "appwrite"
}
```

---

## DELETE - Delete Rankings

**Endpoint:** `DELETE /api/admin/rankings`

**Description:** Delete a specific ranking or all rankings for a category.

**Query Parameters:**
- `rankingId` (optional): Delete a specific ranking by ID
- `categoryId` (optional): Delete all rankings for a category

**Note:** Either `rankingId` or `categoryId` must be provided.

**Example Requests:**

```bash
# Delete a specific ranking
curl -X DELETE "http://localhost:3000/api/admin/rankings?rankingId=ranking_id_123"

# Delete all rankings for a category
curl -X DELETE "http://localhost:3000/api/admin/rankings?categoryId=pubg-mobile"
```

**Response (Delete Single):**
```json
{
  "success": true,
  "message": "Ranking deleted successfully"
}
```

**Response (Delete Category):**
```json
{
  "success": true,
  "message": "Deleted 5 rankings for category pubg-mobile",
  "count": 5
}
```

---

## Admin Dashboard

Access the admin rankings management dashboard at:
```
/admin/rankings
```

### Features:
- **Category Selection**: Choose which game to manage rankings for
- **View Rankings**: See all rankings for the selected game
- **Add Rankings**: Add new player rankings
- **Edit Rankings**: Modify existing ranking data inline
- **Delete Rankings**: Remove individual rankings
- **Search**: Filter rankings by player name or university
- **Bulk Save**: Save all changes at once

---

## Game Category IDs

Common game category IDs used in the system:

| Game | Category ID |
|------|------------|
| PUBG Mobile | `pubg-mobile` |
| Call of Duty Mobile - BR | `call-of-duty-mobile-br` |
| Call of Duty Mobile - MP | `codm-multiplayer` |
| eFootball Mobile | `efootball-mobile` |
| EAFC 1v1 | `eafc-1v1` |
| EAFC 2v2 | `eafc-2v2` |
| EAFC Women | `eafc-women` |

---

## Error Handling

### Common Error Responses:

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Category ID and rankings array are required"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Failed to save rankings",
  "details": "Appwrite error message"
}
```

---

## Storage Modes

The API supports two storage modes:

### 1. **Appwrite (Primary)**
- Persistent database storage
- Recommended for production
- Requires Appwrite configuration

### 2. **Fallback (In-Memory)**
- Used when Appwrite is unavailable
- Data is lost on server restart
- Useful for development/testing

The API automatically falls back to in-memory storage if Appwrite is not configured or unavailable.

---

## Integration with Frontend

The rankings are displayed on the public-facing tournaments page at `/tournaments`. The `ComingSoonSection` component fetches rankings from the API and displays them in a filterable table.

### Frontend Component:
```typescript
// Fetch all rankings
const response = await fetch('/api/admin/rankings');
const result = await response.json();

if (result.success) {
  const rankings = result.data;
  // Display rankings...
}
```

---

## Environment Variables

Ensure these environment variables are set for the API to work:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://your-appwrite-instance.com/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DB_ID=your_database_id
APPWRITE_API_KEY=your_api_key
```

---

## Best Practices

1. **Always validate input data** before sending to the API
2. **Use replaceAll: true** when updating all rankings for a category
3. **Handle errors gracefully** in frontend applications
4. **Cache rankings data** on the client side to reduce API calls
5. **Use pagination** for large datasets (use the `limit` parameter)
6. **Authenticate requests** - ensure only admins can modify rankings

---

## Support

For issues or questions about the API, please contact the development team or check the admin dashboard for more information.
