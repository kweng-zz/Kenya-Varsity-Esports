# Regional Rankings Management System

## Overview
The Regional Rankings Management system allows admins to input ranking data for universities in each region and upload images to display on the frontend.

## Files Created

### 1. **Admin Page: `/admin/regional-rankings/page.tsx`** (NEW)
**Location:** `e:\Apps\esports\src\app\admin\regional-rankings\page.tsx`

Complete admin interface for managing regional rankings with the following features:

## Features

### 1. **Add Regional Ranking**
- Click "Add Regional Ranking" button to create a new region
- Enter region name (e.g., NAIROBI)
- Upload region image from your computer
- Add universities with their ranking scores

### 2. **Input Ranking Data**
For each university, enter:
- **University Name**: Name of the university
- **PUBGM**: Points from PUBGM tournament
- **CODM BR**: Points from Call of Duty Mobile Battle Royale
- **CODM MP**: Points from Call of Duty Mobile Multiplayer
- **eFootball**: Points from eFootball tournament
- **Total**: Automatically calculated (sum of all game points)

### 3. **Image Upload**
- Upload region image that displays on the frontend
- Image is converted to Base64 and stored in Appwrite
- Preview shows before saving
- Supports all standard image formats (JPG, PNG, GIF, WebP, etc.)

### 4. **Edit Regional Ranking**
- Click edit icon on any region card
- Modify region name, image, or university data
- Add/remove universities
- Save changes

### 5. **Delete Regional Ranking**
- Click delete icon to remove a region
- Confirmation happens immediately
- All associated data is removed

### 6. **View Rankings**
- See all regions in a list format
- Each region shows:
  - Region image
  - Region name
  - Number of universities
  - Table with all university rankings

## Data Structure

```typescript
interface University {
  id: string;
  name: string;
  pubgm: number;
  codmBR: number;
  codmMP: number;
  efootball: number;
  total: number; // Auto-calculated
}

interface RegionalRanking {
  id: string;
  region: string;
  image: string; // Base64 encoded image
  universities: University[];
}
```

## How to Use

### Adding a New Region with Rankings:

1. Navigate to `/admin/regional-rankings`
2. Click **"Add Regional Ranking"** button
3. Fill in the region name (e.g., "NAIROBI")
4. Click **"Choose File"** to upload region image
5. Click **"Add University"** button
6. Enter university details:
   - University name
   - PUBGM points
   - CODM BR points
   - CODM MP points
   - eFootball points
   - Total calculates automatically
7. Add more universities as needed
8. Click **"Save Ranking"**

### Editing a Region:

1. Find the region in the list
2. Click the **edit icon** (pencil)
3. Modify any fields
4. Click **"Save Ranking"**

### Deleting a Region:

1. Find the region in the list
2. Click the **delete icon** (trash)
3. Region is immediately removed

## Storage

- Data is stored in **Appwrite Database**
- Collection: `regional_rankings`
- Each region's image is stored as Base64 data URL
- Automatic ordering by region name

## Frontend Integration

The regional rankings data can be displayed on the frontend by:
1. Fetching from Appwrite database using the `regional_rankings` collection
2. Displaying region image (Base64 encoded)
3. Showing university rankings in a table format

## Example Data

```json
{
  "id": "1234567890",
  "region": "NAIROBI",
  "image": "data:image/png;base64,...",
  "universities": [
    {
      "id": "uni-1",
      "name": "TECHNICAL UNIVERSITY OF KENYA",
      "pubgm": 100,
      "codmBR": 150,
      "codmMP": 80,
      "efootball": 70,
      "total": 400
    },
    {
      "id": "uni-2",
      "name": "UNIVERSITY OF NAIROBI",
      "pubgm": 90,
      "codmBR": 140,
      "codmMP": 75,
      "efootball": 65,
      "total": 370
    }
  ]
}
```

## Features

✅ Add/Edit/Delete regional rankings  
✅ Upload region images  
✅ Input university ranking data  
✅ Auto-calculate total points  
✅ Search regions  
✅ View all rankings in table format  
✅ Image preview before saving  
✅ Responsive design  
✅ Admin authentication required  

## Future Enhancements

- Migrate from localStorage to Appwrite database
- Bulk import rankings from CSV
- Export rankings to CSV
- Historical ranking tracking
- Ranking comparison between regions
- Automated ranking calculations
- API endpoint for frontend to fetch rankings
- Ranking history and changes log
