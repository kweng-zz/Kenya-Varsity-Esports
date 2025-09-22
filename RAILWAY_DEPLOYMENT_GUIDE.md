# Railway Deployment Guide for KUER Esports Platform

## Current Issue Resolution

Your Railway deployment was stuck on "initializing" because:

1. **Conflicting Services**: The original configuration tried to run both Strapi and Next.js in one service
2. **Wrong Health Check**: Health check was pointing to `/admin` instead of `/`
3. **Missing Environment Variables**: Railway needs specific environment variables

## Fixed Configuration

### 1. Updated Files
- `railway.json` - Changed to use Docker builder and health check at `/api/health`
- `Dockerfile` - New Docker configuration for reliable deployment
- `next.config.ts` - Added standalone output for Docker
- `src/app/api/health/route.ts` - Health check endpoint
- `.dockerignore` - Optimized Docker build
- `start-railway.js` - Improved Railway-specific startup script (backup option)

### 2. Required Environment Variables in Railway

Add these environment variables in your Railway dashboard:

```bash
# Node Environment
NODE_ENV=production
PORT=3000
SKIP_STRAPI_BUILD=true

# Appwrite Configuration (from your .env file)
NEXT_PUBLIC_APPWRITE_PROJECT_ID=68c7e7bc0028f9acee36
NEXT_PUBLIC_APPWRITE_PROJECT_NAME=KUER
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_DB_ID=68c7f25e00083a6d2992
NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID=user_profiles
APPWRITE_API_KEY=standard_a0aa66027851a2b02c700a76c66af629b8b490744c64b3cf029b42b46c3886ce7fa11860e50db39bd613a1da60b6a5ad6acb0b6f0a27832a5117c765f92b0218d0af869df5410de55294fc86f69184161b073661a03fdc0ef3a99639f07a3bb4dc52900b20681e1dc2c686fbbd476296b16cb093269d264b42a0c454a78a33f2

# Strapi Configuration (your existing Railway Strapi backend)
NEXT_PUBLIC_STRAPI_URL=https://kuer-strapi-backend-production.up.railway.app
STRAPI_API_TOKEN=f9ba5c261d524f484aae16a01f5c938f810ba4f95113583c29c336810107258f635d0697f78edeb14b5e378de0f99712770838476431d77b64488e5d6a66091ddc112fef919ea32bf3bb96526523d5a05b7adbf018e5fec094dd8a53ddf3a5bf929814faa23d7cf7e9b382fb2007b8b8b142d7a2c1628372dea0a464f2849486
NEXT_PUBLIC_STRAPI_API_TOKEN=e3cff91858de3e5c3571877d32ba8ace1538cae90deb278c7d43d4385165fb503f8b4924941cb4a11477ea4c5dd27f140aecd360c35326f9ef24f900419c3d582c2c15169e60febaa93ab13882d1f4d4af1842893bea15e8aed011564b686c06537fb112eef522c596783a7768795c8d567e0ced6ed356b3ef46a99eccb2c5f0

# Tournament Collections
NEXT_PUBLIC_APPWRITE_TOURNAMENTS_COLLECTION_ID=tournaments
NEXT_PUBLIC_APPWRITE_AWARDS_COLLECTION_ID=tournament_awards
NEXT_PUBLIC_APPWRITE_SCHEDULE_COLLECTION_ID=tournament_schedule
NEXT_PUBLIC_APPWRITE_SPONSORS_COLLECTION_ID=tournament_sponsors
NEXT_PUBLIC_APPWRITE_PARTICIPANTS_COLLECTION_ID=participants
NEXT_PUBLIC_APPWRITE_TOURNAMENT_REGISTRATIONS_COLLECTION_ID=tournament_registrations
NEXT_PUBLIC_APPWRITE_CALENDAR_COLLECTION_ID=calendar_events
```

## Deployment Steps

### 1. Push Changes to Git
```bash
git add .
git commit -m "Fix Railway deployment configuration"
git push origin main
```

### 2. In Railway Dashboard:
1. Go to your project settings
2. Navigate to "Variables" tab
3. Add all the environment variables listed above
4. Trigger a new deployment

### 3. Monitor Deployment
- The deployment should now complete successfully
- Health check will ping `/` instead of `/admin`
- Only Next.js will run (Strapi runs separately)

## Architecture

```
Railway Service 1: Next.js Frontend (this deployment)
├── Serves the main website
├── Connects to Appwrite for user data
└── Connects to Strapi backend via API

Railway Service 2: Strapi Backend (already running)
├── https://kuer-strapi-backend-production.up.railway.app
├── Provides CMS functionality
└── Connected to PostgreSQL database
```

## Troubleshooting

If deployment still fails:

1. **Check Build Logs**: Look for specific error messages in Railway logs
2. **Verify Environment Variables**: Ensure all variables are set correctly
3. **Test Locally**: Run `npm run start:railway` locally to test the startup script
4. **Health Check**: Verify your app responds to GET requests at `/`

## Testing the Deployment

Once deployed, test these endpoints:
- `https://your-railway-app.railway.app/` - Main website
- `https://your-railway-app.railway.app/api/health` - Health check (if you have one)

The deployment should now work correctly with the updated configuration.