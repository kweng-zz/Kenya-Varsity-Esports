# Appwrite Authentication Fix - 500 Error Resolution

## Problem
The API endpoints were returning **500 Internal Server Error** with the message:
```
User (role: guests) missing scopes (["collections.read"])
```

This occurred when trying to fetch rankings data from:
- `GET /api/rankings/general?limit=5`
- `GET /api/rankings?category=all`
- `GET /api/rankings/categories`

## Root Cause
The API routes were using **client-side Appwrite initialization** (`src/lib/appwrite.ts`) which:
1. Does not include API key authentication
2. Uses guest permissions by default
3. Guest users don't have `collections.read` scope
4. Results in 500 errors when trying to access protected collections

## Solution
Created a **server-side Appwrite module** with proper API key authentication:

### New File: `src/lib/appwrite-server.ts`
- Uses `node-appwrite` SDK (server-side)
- Initializes with `APPWRITE_API_KEY` environment variable
- Provides authenticated database access
- Includes proper error handling and fallback support

### Updated API Routes
1. **`src/app/api/rankings/general/route.ts`**
   - Changed from client-side to server-side Appwrite
   - Added fallback data when server not initialized
   - Proper error handling with graceful degradation

2. **`src/app/api/rankings/route.ts`**
   - Updated all database calls to use server-side Appwrite
   - Maintains existing fallback mode functionality
   - Better error logging for debugging

3. **`src/app/api/rankings/categories/route.ts`**
   - Migrated to server-side authentication
   - Improved error handling
   - Fallback data support

## Key Changes

### Before (Client-side - Broken)
```typescript
import { databases } from '@/lib/appwrite';
// This uses guest permissions - no API key!
const response = await databases.listDocuments(...);
```

### After (Server-side - Fixed)
```typescript
import { getAppwriteServer } from '@/lib/appwrite-server';
const appwrite = getAppwriteServer();
if (!appwrite) throw new Error('Appwrite not initialized');
const response = await appwrite.databases.listDocuments(...);
```

## Environment Requirements
Ensure your `.env` file includes:
```
APPWRITE_API_KEY=your_api_key_here
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DB_ID=your_database_id
```

## Testing
After deployment, the API endpoints should:
1. ✅ Return 200 status with rankings data
2. ✅ No longer show "missing scopes" error
3. ✅ Gracefully fall back to sample data if Appwrite is unavailable
4. ✅ Log detailed error information for debugging

## Fallback Behavior
If Appwrite server is not initialized or connection fails:
- API returns 200 status (not 500)
- Returns sample/fallback data
- Frontend can display rankings without errors
- Logs warnings for monitoring

## Migration Notes
- No database schema changes required
- No frontend code changes needed
- Backward compatible with existing API contracts
- All existing error handling preserved
