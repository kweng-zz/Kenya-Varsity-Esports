# Railway Deployment Fix Guide

## Issue Identified ❌
Railway is failing with "Error creating build plan with Railpack" because it can't auto-detect the proper build configuration for Strapi.

## Solution Applied ✅
I've created the necessary configuration files:

### 1. `railway.json` - Railway Configuration
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 2. `nixpacks.toml` - Build Configuration
```toml
[phases.setup]
nixPkgs = ['nodejs-18_x', 'npm-9_x']

[phases.install]
cmds = ['npm ci']

[phases.build]
cmds = ['npm run build']

[start]
cmd = 'npm run start'
```

## Next Steps to Fix Railway Deployment

### Step 1: Connect Your Repository to GitHub
```bash
cd kuer-backend
git remote add origin https://github.com/YOUR_USERNAME/kuer-backend.git
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

### Step 2: Trigger New Railway Deployment
1. Go to your Railway dashboard
2. Your project should automatically detect the new commit
3. Click "Deploy" to trigger a new build
4. The build should now succeed with the configuration files

### Step 3: Set Environment Variables (If Not Done)
In Railway dashboard → Your Strapi service → Variables tab:

```
NODE_ENV=production
DATABASE_CLIENT=postgres
HOST=0.0.0.0
PORT=1337
APP_KEYS=6b4gTGDHwSk9AQucyC5PbQ==,LrPezk8rBwvVDY3qZSpk0g==,9h70kyshB6CB+yxazOlBDA==,ZAQHZTpiGyyy4DYK54a2vQ==
JWT_SECRET=LcEeMeilbttuiSssajzDMmRJ2MWnDY3nhjwVvqN7hgmsQpkBTQ7dZnoYu9wV47UivPYYJQsahPvfRNhp/EJBPQ==
ADMIN_JWT_SECRET=wXGZ+EliiHNtG69vLwRfS4ApRMf8IGCzQwdd6ZM/BG03J5cBKxc7uScLeEoyES+XOTZWSoADECejq/dGUccUUw==
API_TOKEN_SALT=lWJda4tyrPeQC31+hBGCVg==
TRANSFER_TOKEN_SALT=Js8PidmwvEX8ZWr25eTrfQ==
```

### Step 4: Ensure PostgreSQL Database is Connected
- Make sure you've added a PostgreSQL database in Railway
- The `DATABASE_URL` should be automatically set

## What These Files Do

### `railway.json`:
- Tells Railway to use NIXPACKS builder (more reliable than auto-detection)
- Sets the start command to `npm run start`
- Configures health checks and restart policies

### `nixpacks.toml`:
- Specifies Node.js 18.x and npm 9.x
- Defines the build phases: setup → install → build → start
- Ensures proper dependency installation with `npm ci`

## Expected Result
After pushing these files and redeploying:
1. ✅ Build phase should complete successfully
2. ✅ Strapi should start on Railway
3. ✅ You'll get a Railway URL for your Strapi backend
4. ✅ Admin panel should be accessible at `https://your-url.railway.app/admin`

## Troubleshooting

### If Build Still Fails:
1. Check Railway build logs for specific errors
2. Ensure all environment variables are set
3. Verify PostgreSQL database is connected

### If Strapi Doesn't Start:
1. Check the start logs in Railway dashboard
2. Verify environment variables are correct
3. Ensure database connection is working

Your Railway deployment should now work correctly! 🚀