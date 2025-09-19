# Simple Vercel Deployment Guide

## Problem Fixed
The infinite build loop was caused by the build script trying to build both Strapi and Next.js together. For Vercel, we only need to deploy the Next.js frontend.

## Changes Made

### 1. Updated package.json
- Changed main `build` script to only build Next.js: `"build": "next build"`
- Kept separate scripts for local development with Strapi
- Added `build:with-strapi` for local builds that need both

### 2. Updated vercel.json
- Configured proper routing for Next.js
- Set up API routes handling
- Added environment variables configuration

### 3. Deployment Strategy
For Vercel deployment, you have two options:

#### Option A: Frontend Only (Recommended for Vercel)
- Deploy only the Next.js frontend to Vercel
- Use external Strapi instance (Railway, Heroku, etc.) for the backend
- Connect via API calls to the external Strapi

#### Option B: Separate Deployments
- Deploy Strapi backend to Railway/Heroku
- Deploy Next.js frontend to Vercel
- Configure environment variables to connect them

## Deployment Steps

### 1. Deploy to Vercel (Frontend Only)
```bash
# The build will now work without infinite loops
npm run build
```

### 2. Environment Variables in Vercel
Set these in your Vercel dashboard:
- `NEXT_PUBLIC_STRAPI_URL` - URL of your Strapi backend
- `NEXT_PUBLIC_APPWRITE_ENDPOINT` - Your Appwrite endpoint
- `NEXT_PUBLIC_APPWRITE_PROJECT_ID` - Your Appwrite project ID

### 3. For Local Development with Both Services
```bash
# Use this for local development with both Strapi and Next.js
npm run dev

# Or build both locally
npm run build:with-strapi
```

## Next Steps
1. Deploy your Strapi backend to Railway or another service
2. Update your Next.js app to use the external Strapi URL
3. Deploy the Next.js frontend to Vercel
4. Configure environment variables in both services

This approach separates concerns and prevents the build loop issue while allowing you to deploy both services independently.