# Configuration Fix Guide

This guide addresses the configuration issues you're experiencing with both Appwrite and Strapi.

## Issues Identified

### 1. ✅ RESOLVED: Appwrite Configuration Missing
**Status**: Fixed - Environment variables are now properly configured in `.env`

The Appwrite warnings were caused by missing environment variables. These have been added to your `.env` file:

```bash
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_PROJECT_ID=68c7e7bc0028f9acee36
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_DB_ID=68c7f25e00083a6d2992
# ... and other required variables
```

### 2. 🔧 IN PROGRESS: Strapi Article Creation Issue
**Status**: Partially Fixed - Connection works, but article creation has validation errors

**Problem**: "Invalid relations" error when creating articles with images
**Root Cause**: Image relation format incompatible with Strapi v5 schema

## Current Status Summary

| Component | Status | Details |
|-----------|--------|---------|
| Appwrite Auth | ✅ Working | Environment variables configured |
| Appwrite Banners | ✅ Working | Environment variables configured |
| Appwrite Statistics | ✅ Working | Environment variables configured |
| Appwrite Highlights | ✅ Working | Environment variables configured |
| Strapi Connection | ✅ Working | API token valid, connection successful |
| Strapi Article Read | ✅ Working | Can fetch existing articles |
| Strapi Article Create | ❌ Failing | Validation error with image relations |

## Next Steps for Strapi Fix

### Option 1: Fix Image Relations (Recommended)
The issue is likely with how image relations are handled in Strapi v5. Try these approaches:

1. **Check Strapi Admin Panel**:
   - Go to https://kuer-strapi-backend-production.up.railway.app/admin
   - Navigate to Content-Type Builder → Article
   - Check the "image" field configuration
   - Ensure it's set as "Media" type with proper relation settings

2. **Test Different Relation Formats**:
   The API route now tries direct ID assignment. If this fails, we may need to try:
   - `image: { connect: [imageId] }`
   - `image: { set: [imageId] }`
   - `image: [imageId]`

### Option 2: Create Articles Without Images First
To test if the core article creation works:

1. Try creating an article without uploading an image
2. If successful, then focus on fixing the image relation
3. You can always add images later via the Strapi admin panel

### Option 3: Use Strapi Admin Panel Directly
As a temporary workaround:
1. Use the Strapi admin panel to create articles: https://kuer-strapi-backend-production.up.railway.app/admin
2. This bypasses the API validation issues
3. Continue using the frontend for other features

## Testing Your Fixes

### Test Appwrite (Should now work):
```bash
# Run the development server
npm run dev:next

# Check browser console - should see no more Appwrite warnings
```

### Test Strapi Connection:
```bash
# Run the connection test script
node test-strapi-connection.js

# Should show all green checkmarks
```

### Test Article Creation:
1. Go to http://localhost:3001/admin/blogs
2. Try creating a simple article without an image first
3. If that works, try with an image

## Environment Files Summary

- **`.env`**: ✅ Updated with all required variables
- **`.env.vercel`**: ✅ Contains Vercel deployment config
- **`.env.railway`**: ✅ Contains Railway backend config
- **`.env.render`**: ⚠️ Alternative deployment option

## Verification Commands

```bash
# Check if environment variables are loaded
node -e "require('dotenv').config(); console.log('Appwrite Project ID:', process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);"

# Test Strapi connection
curl -H "Content-Type: application/json" "https://kuer-strapi-backend-production.up.railway.app/api/articles?pagination%5Blimit%5D=1"

# Test Appwrite connection (if you have curl with proper auth)
curl -H "X-Appwrite-Project: 68c7e7bc0028f9acee36" "https://fra.cloud.appwrite.io/v1/health"
```

## If Issues Persist

1. **Restart Development Server**: `npm run dev:next`
2. **Clear Next.js Cache**: `rm -rf .next`
3. **Check Browser Console**: Look for any remaining error messages
4. **Check Network Tab**: Verify API calls are using correct URLs and tokens

## Contact Points

- **Strapi Admin**: https://kuer-strapi-backend-production.up.railway.app/admin
- **Appwrite Console**: https://fra.cloud.appwrite.io/console/project-68c7e7bc0028f9acee36
- **Local Development**: http://localhost:3001 (or 3000 if available)

---

**Last Updated**: January 27, 2025
**Status**: Appwrite ✅ Fixed | Strapi 🔧 In Progress