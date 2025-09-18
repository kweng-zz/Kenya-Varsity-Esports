# Strapi Deployment Guide for Vercel

Since your blog functionality depends on Strapi, here are the recommended deployment strategies:

## Option 1: Deploy Strapi on Railway/Render (Recommended)

### Step 1: Deploy Strapi Backend

1. **Create a separate repository for Strapi**:
   ```bash
   # Copy your kuer folder to a new repository
   cp -r kuer ../kuer-strapi-backend
   cd ../kuer-strapi-backend
   git init
   git add .
   git commit -m "Initial Strapi backend"
   ```

2. **Deploy on Railway** (Free tier available):
   - Go to [Railway.app](https://railway.app)
   - Connect your GitHub account
   - Deploy the Strapi repository
   - Add environment variables:
     ```
     NODE_ENV=production
     DATABASE_CLIENT=postgresql
     DATABASE_URL=<provided by Railway>
     STRAPI_API_TOKEN=<generate a secure token>
     JWT_SECRET=<generate a secure secret>
     ADMIN_JWT_SECRET=<generate a secure secret>
     APP_KEYS=<generate secure keys>
     ```

3. **Alternative: Deploy on Render**:
   - Go to [Render.com](https://render.com)
   - Create a new Web Service
   - Connect your Strapi repository
   - Use similar environment variables

### Step 2: Update Next.js Environment Variables

In your Vercel deployment, set these environment variables:

```env
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-app.railway.app
STRAPI_API_TOKEN=your-secure-token
NEXT_PUBLIC_APPWRITE_ENDPOINT=your-appwrite-endpoint
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DB_ID=your-database-id
```

## Option 2: Deploy Both on Vercel (Advanced)

If you want to keep everything on Vercel, we can create a monorepo setup:

### Step 1: Create Vercel Configuration for Strapi

Create `kuer/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node",
      "config": {
        "includeFiles": [
          "dist/**",
          "config/**",
          "database/**",
          "public/**"
        ]
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/src/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Step 2: Update Root Vercel Configuration

Update your main `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    },
    {
      "src": "kuer/package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/strapi/(.*)",
      "dest": "/kuer/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

## Option 3: Use Strapi Cloud (Easiest)

1. Go to [Strapi Cloud](https://cloud.strapi.io)
2. Deploy your Strapi project directly
3. Get the provided URL and API token
4. Update your Next.js environment variables

## Recommended Approach

I recommend **Option 1** (Railway/Render) because:
- ✅ Dedicated resources for Strapi
- ✅ Better database support
- ✅ Easier to manage and scale
- ✅ Free tiers available
- ✅ Better for production workloads

## Quick Setup Commands

If you choose Option 1, here are the commands to get started:

```bash
# 1. Create Strapi deployment repository
mkdir ../kuer-backend
cp -r kuer/* ../kuer-backend/
cd ../kuer-backend

# 2. Update package.json for production
npm install --production

# 3. Create production build
npm run build

# 4. Deploy to Railway/Render
# (Follow their respective deployment guides)

# 5. Update your main project environment variables
# Set NEXT_PUBLIC_STRAPI_URL to your deployed Strapi URL
```

## Environment Variables Checklist

### For Strapi Backend:
- `NODE_ENV=production`
- `DATABASE_URL` (provided by hosting service)
- `STRAPI_API_TOKEN` (generate secure token)
- `JWT_SECRET` (generate secure secret)
- `ADMIN_JWT_SECRET` (generate secure secret)
- `APP_KEYS` (generate secure keys)

### For Next.js Frontend:
- `NEXT_PUBLIC_STRAPI_URL` (your deployed Strapi URL)
- `STRAPI_API_TOKEN` (same as backend)
- `NEXT_PUBLIC_APPWRITE_ENDPOINT`
- `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
- `NEXT_PUBLIC_APPWRITE_DB_ID`

Would you like me to help you set up any of these options?