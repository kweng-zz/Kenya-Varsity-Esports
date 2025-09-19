# Vercel Deployment Guide - Fixed Configuration

## Issues Fixed

The original `vercel.json` had several problems:

1. **Attempted to deploy Strapi as serverless function** - Strapi is not designed for serverless environments
2. **SQLite database** - Not suitable for serverless/production deployments
3. **Complex routing** - Unnecessary complexity for frontend-only deployment

## Current Setup

Your `vercel.json` is now configured to deploy **only the Next.js frontend** to Vercel. This is the recommended approach.

## Deployment Steps

### Step 1: Deploy Frontend to Vercel

1. **Push your code to GitHub** (if not already done)
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect it's a Next.js project

3. **Set Environment Variables in Vercel**:
   ```
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=68c7e7bc0028f9acee36
   NEXT_PUBLIC_APPWRITE_PROJECT_NAME=KUER
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_DB_ID=68c7f25e00083a6d2992
   NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID=user_profiles
   APPWRITE_API_KEY=your-api-key
   
   # Tournament Collections
   NEXT_PUBLIC_APPWRITE_TOURNAMENTS_COLLECTION_ID=tournaments
   NEXT_PUBLIC_APPWRITE_AWARDS_COLLECTION_ID=tournament_awards
   NEXT_PUBLIC_APPWRITE_SCHEDULE_COLLECTION_ID=tournament_schedule
   NEXT_PUBLIC_APPWRITE_SPONSORS_COLLECTION_ID=tournament_sponsors
   NEXT_PUBLIC_APPWRITE_PARTICIPANTS_COLLECTION_ID=participants
   NEXT_PUBLIC_APPWRITE_TOURNAMENT_REGISTRATIONS_COLLECTION_ID=tournament_registrations
   NEXT_PUBLIC_APPWRITE_CALENDAR_COLLECTION_ID=calendar_events
   
   # Strapi (will be updated after backend deployment)
   NEXT_PUBLIC_STRAPI_URL=https://your-strapi-backend.railway.app
   STRAPI_API_TOKEN=your-production-token
   NEXT_PUBLIC_STRAPI_API_TOKEN=your-production-token
   ```

### Step 2: Deploy Strapi Backend Separately

**Option A: Railway (Recommended)**

1. **Create a new repository for Strapi**:
   ```bash
   # Create a new directory for Strapi backend
   mkdir ../kuer-backend
   cp -r kuer/* ../kuer-backend/
   cd ../kuer-backend
   
   # Initialize git repository
   git init
   git add .
   git commit -m "Initial Strapi backend for production"
   
   # Push to GitHub (create new repository first)
   git remote add origin https://github.com/yourusername/kuer-backend.git
   git push -u origin main
   ```

2. **Deploy on Railway**:
   - Go to [railway.app](https://railway.app)
   - Sign up/login with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your `kuer-backend` repository
   - Railway will auto-detect it's a Node.js project

3. **Configure Environment Variables in Railway**:
   ```
   NODE_ENV=production
   DATABASE_CLIENT=postgresql
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   STRAPI_API_TOKEN=generate-a-secure-token-here
   JWT_SECRET=generate-a-secure-jwt-secret
   ADMIN_JWT_SECRET=generate-a-secure-admin-jwt-secret
   APP_KEYS=key1,key2,key3,key4
   ```

4. **Add PostgreSQL Database**:
   - In Railway dashboard, click "New" → "Database" → "PostgreSQL"
   - Railway will automatically set the `DATABASE_URL` variable

**Option B: Render.com**

1. Go to [render.com](https://render.com)
2. Create "New Web Service"
3. Connect your `kuer-backend` repository
4. Use similar environment variables as Railway

### Step 3: Update Frontend Environment Variables

After your Strapi backend is deployed:

1. **Get your Strapi URL** from Railway/Render
2. **Update Vercel environment variables**:
   - `NEXT_PUBLIC_STRAPI_URL=https://your-strapi-backend.railway.app`
   - `STRAPI_API_TOKEN=your-production-token`
   - `NEXT_PUBLIC_STRAPI_API_TOKEN=your-production-token`

3. **Redeploy your frontend** on Vercel (it will automatically redeploy when you update env vars)

## Database Configuration for Strapi

Update your `kuer/config/database.js` for production:

```javascript
module.exports = ({ env }) => ({
  connection: {
    client: env('DATABASE_CLIENT', 'sqlite'),
    connection:
      env('DATABASE_CLIENT') === 'sqlite'
        ? {
            filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
          }
        : {
            connectionString: env('DATABASE_URL'),
            host: env('DATABASE_HOST'),
            port: env.int('DATABASE_PORT'),
            database: env('DATABASE_NAME'),
            user: env('DATABASE_USERNAME'),
            password: env('DATABASE_PASSWORD'),
            ssl: env.bool('DATABASE_SSL', false) && {
              key: env('DATABASE_SSL_KEY', undefined),
              cert: env('DATABASE_SSL_CERT', undefined),
              ca: env('DATABASE_SSL_CA', undefined),
              capath: env('DATABASE_SSL_CAPATH', undefined),
              cipher: env('DATABASE_SSL_CIPHER', undefined),
              rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
            },
          },
    useNullAsDefault: true,
  },
});
```

## Security Tokens Generation

Generate secure tokens for production:

```bash
# Generate random strings for your environment variables
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run this command 4 times to generate:
- `STRAPI_API_TOKEN`
- `JWT_SECRET`
- `ADMIN_JWT_SECRET`
- `APP_KEYS` (generate 4 keys, comma-separated)

## Final Checklist

- [ ] Frontend deployed to Vercel
- [ ] Strapi backend deployed to Railway/Render
- [ ] PostgreSQL database connected to Strapi
- [ ] All environment variables configured
- [ ] Frontend pointing to production Strapi URL
- [ ] Test all functionality works

## Benefits of This Setup

✅ **Scalable**: Frontend and backend can scale independently
✅ **Reliable**: Dedicated resources for Strapi
✅ **Cost-effective**: Railway/Render have generous free tiers
✅ **Maintainable**: Clear separation of concerns
✅ **Production-ready**: Proper database and environment setup

Your deployment should now work correctly with this configuration!