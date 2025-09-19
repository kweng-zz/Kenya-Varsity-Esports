# Railway PORT Variable Fix

## Problem
Railway deployment fails with error: **"PORT variable must be integer between 0 and 65535"**

## Root Cause
The PORT environment variable is set to a non-numeric value like `"$PORT"` instead of being left unset or set to a valid integer.

## Solution

### Step 1: Remove Invalid PORT Variable
1. Go to your Railway dashboard
2. Navigate to your Strapi service
3. Click on the "Variables" tab
4. **Remove** any PORT variable that contains:
   - `PORT=$PORT`
   - `PORT="$PORT"`
   - Any non-numeric value

### Step 2: Let Railway Handle PORT Automatically
- **Do NOT set a PORT variable** in Railway
- Railway automatically provides a valid PORT at runtime
- Your Strapi config (`config/server.ts`) will read it via `env.int('PORT', 1337)`

### Step 3: Redeploy
1. After removing the invalid PORT variable
2. Click "Deploy" to trigger a new deployment
3. Railway will now provide a valid numeric PORT automatically

## What NOT to Do ❌
```bash
# Don't set these in Railway environment variables:
PORT=$PORT
PORT="$PORT"
PORT=${PORT}
```

## What TO Do ✅
```bash
# In Railway, only set these variables:
NODE_ENV=production
HOST=0.0.0.0
DATABASE_CLIENT=postgres
# ... other variables, but NO PORT
```

## For Local Development Only
If you need a PORT for local development, set it in your local `.env` file:
```bash
# .env (local only)
PORT=1337
```

## Why This Happens
- Railway documentation sometimes shows `PORT=$PORT` as an example
- This is meant to be a template, not a literal value
- Nixpacks validates environment variables and rejects non-integer PORT values
- Railway automatically injects the correct PORT at runtime

## Verification
After fixing, your deployment logs should show:
```
✅ Using Nixpacks
✅ Build completed successfully
✅ Service started on port XXXXX
```

Instead of:
```
❌ PORT variable must be integer between 0 and 65535
```

Your Strapi backend will now deploy successfully on Railway! 🚀