# Railway Deployment Fix

## Problem Identified
Railway is currently deploying the entire Next.js project instead of just the Strapi backend. This is why you're getting Next.js responses instead of Strapi API responses.

## Solution: Deploy Only Strapi Directory

### Option 1: Create Separate Repository (Recommended)

1. **Create a new repository for Strapi only:**
   ```bash
   # Create new directory
   mkdir kuer-strapi-only
   cd kuer-strapi-only
   
   # Copy only Strapi files
   cp -r ../kuer/* .
   
   # Initialize git
   git init
   git add .
   git commit -m "Initial Strapi deployment"
   
   # Push to new GitHub repository
   git remote add origin https://github.com/yourusername/kuer-strapi.git
   git push -u origin main
   ```

2. **Connect new repository to Railway:**
   - Go to Railway dashboard
   - Create new project
   - Connect the new Strapi-only repository
   - Add PostgreSQL service

### Option 2: Configure Railway Root Directory

If you want to keep using the same repository:

1. **Update Railway configuration:**
   - In Railway dashboard, go to your project settings
   - Set **Root Directory** to: `kuer`
   - This tells Railway to only deploy the `kuer` folder

2. **Update build commands:**
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### Option 3: Use Railway CLI (Quick Fix)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your existing project
railway link

# Set the root directory
railway up --detach --service kuer-strapi ./kuer
```

## Required Environment Variables for Railway

Make sure these are set in your Railway project:

```bash
# Database (auto-provided by Railway PostgreSQL)
DATABASE_URL=postgresql://...

# Strapi Configuration
APP_KEYS=edDDb2HrsnM3aDoqFCLGiw==,jp5EbpnZbGG4oXc0T+fwzA==,UABeuJmeF4rRhbyWUsBl5g==,vd8xTqyVb6CR3CbN81qRpg==
API_TOKEN_SALT=22lcOS3BuG0Ew3t9COVi8Q==
ADMIN_JWT_SECRET=vc6ojK50UTqjxpzMRQCMhQ==
TRANSFER_TOKEN_SALT=mLHODZchIDazS2FgU6QhrA==
ENCRYPTION_KEY=e1TVXrJztyDgzeTtUDnMXQ==
JWT_SECRET=yi/Pz8/Kxd2BYFNxOiG1XA==

# Server Configuration
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# CORS (add your Vercel domain when you get it)
FRONTEND_URL=https://your-vercel-app.vercel.app
```

## Database Configuration

Update `kuer/config/database.ts`:

```typescript
import path from 'path';

export default ({ env }) => {
  // Railway PostgreSQL configuration
  if (env('DATABASE_URL')) {
    return {
      connection: {
        client: 'postgres',
        connection: {
          connectionString: env('DATABASE_URL'),
          ssl: env.bool('DATABASE_SSL', false) && {
            rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false),
          },
        },
        pool: {
          min: env.int('DATABASE_POOL_MIN', 2),
          max: env.int('DATABASE_POOL_MAX', 10),
        },
        acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
      },
    };
  }

  // Fallback to SQLite for local development
  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: path.join(__dirname, '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };
};
```

## Verification Steps

After fixing the Railway deployment:

1. **Test Strapi API:**
   ```bash
   curl https://kuer-production.up.railway.app/api/articles
   ```
   Should return JSON, not HTML

2. **Test Strapi Admin:**
   Visit: `https://kuer-production.up.railway.app/admin`
   Should show Strapi admin login

3. **Test Health:**
   ```bash
   curl https://kuer-production.up.railway.app/api/articles?pagination[pageSize]=1
   ```
   Should return article data

## Next Steps After Railway Fix

1. **Fix Railway deployment** using one of the options above
2. **Verify Strapi is working** at the Railway URL
3. **Update Vercel environment variables** (already prepared)
4. **Redeploy Vercel** to connect to working Strapi backend

## Quick Test Commands

```bash
# Test if it's Strapi (should return JSON)
curl -H "Accept: application/json" https://kuer-production.up.railway.app/api/articles

# Test if it's Next.js (should return HTML)
curl https://kuer-production.up.railway.app
```

The key is making sure Railway only deploys the Strapi backend, not the entire full-stack application.