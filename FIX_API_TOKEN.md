# 🔧 Fix API Token Issue

## ✅ PROGRESS MADE
- ✅ Vercel now points to Railway URL: `https://kuer-production.up.railway.app`
- ✅ Environment variables updated correctly
- ❌ API token returning 403 Forbidden

## 🎯 THE ISSUE
Railway Strapi is returning 403 Forbidden, which means:
1. The API token is invalid for the Railway environment
2. The token doesn't have proper permissions
3. The token wasn't created in Railway Strapi admin

## 🚀 IMMEDIATE FIX

### Step 1: Access Railway Strapi Admin
1. Visit: `https://kuer-production.up.railway.app/admin`
2. Create admin account if you haven't already
3. Login to the admin panel

### Step 2: Generate New API Token
1. In Strapi admin, go to: **Settings** → **API Tokens**
2. Click **"Create new API Token"**
3. Configure:
   - **Name**: `Vercel Frontend`
   - **Description**: `Token for Vercel deployment`
   - **Token duration**: `Unlimited`
   - **Token type**: `Full access`
4. Click **"Save"**
5. **Copy the generated token immediately** (you won't see it again)

### Step 3: Update Environment Variables
Update both Vercel and local `.env` with the new token:

**In Vercel Dashboard:**
```bash
STRAPI_API_TOKEN=your_new_token_here
NEXT_PUBLIC_STRAPI_API_TOKEN=your_new_token_here
```

**In local `.env`:**
```bash
STRAPI_API_TOKEN=your_new_token_here
NEXT_PUBLIC_STRAPI_API_TOKEN=your_new_token_here
```

### Step 4: Test New Token
```bash
# Test with new token
curl -H "Authorization: Bearer YOUR_NEW_TOKEN" https://kuer-production.up.railway.app/api/articles
```

Should return: `{"data":[],"meta":{"pagination":...}}` instead of 403 error.

### Step 5: Redeploy Vercel
After updating environment variables, redeploy Vercel.

## 🔍 VERIFICATION

After fixing the token:

```bash
# Health check should show Strapi as healthy
curl https://www.kenyaesportsrankings.org/api/health

# Should return:
# "strapi": {"status": "healthy", "url": "https://kuer-production.up.railway.app"}
```

## 📋 ALTERNATIVE: Make Articles Public

If you want to skip API tokens for now, you can make articles publicly readable:

1. In Railway Strapi admin: **Settings** → **Users & Permissions Plugin** → **Roles**
2. Click **"Public"**
3. Under **Article**, check **"find"** and **"findOne"**
4. Click **"Save"**

This allows public access to articles without API tokens.

## 🎯 ROOT CAUSE

The API token from your local Strapi doesn't work with Railway Strapi because:
- Different database (SQLite vs PostgreSQL)
- Different Strapi instance
- Tokens are instance-specific

## ⏱️ TIMELINE
- **Create admin account**: 2 minutes
- **Generate API token**: 2 minutes
- **Update Vercel env vars**: 2 minutes
- **Redeploy**: 5 minutes
- **Total**: 11 minutes

## 🚨 PRIORITY ACTION

**Go to Railway Strapi admin and generate a new API token immediately!**

The connection is working - we just need a valid token for the Railway environment.