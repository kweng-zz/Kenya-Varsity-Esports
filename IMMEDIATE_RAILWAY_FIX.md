# IMMEDIATE Railway Fix - Step by Step

## ✅ CONFIRMED ISSUE
Your Railway deployment is serving **Next.js** instead of **Strapi**. The curl response shows Next.js 404 HTML instead of Strapi JSON.

## 🚀 IMMEDIATE FIX (5 minutes)

### Step 1: Access Railway Dashboard
1. Go to: https://railway.app/dashboard
2. Find and click on your **kuer-production** project

### Step 2: Configure Root Directory
1. In your project, click on the **service** (not the database)
2. Go to **Settings** tab
3. Scroll down to **Deploy** section
4. Find **Root Directory** field
5. Set it to: `kuer`
6. Click **Save**

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click **Deploy** button to trigger a new deployment
3. Wait for deployment to complete (2-3 minutes)

### Step 4: Verify Fix
Run these commands to test:

```bash
# This should return Strapi admin login page (HTML)
curl -I https://kuer-production.up.railway.app/admin

# This should return JSON data (not HTML)
curl https://kuer-production.up.railway.app/api/articles

# This should return 200 OK with JSON content-type
curl -I https://kuer-production.up.railway.app/api/articles
```

## 🎯 EXPECTED RESULTS AFTER FIX

**BEFORE (Current - Wrong):**
```bash
curl https://kuer-production.up.railway.app/api/articles
# Returns: Next.js 404 HTML page
```

**AFTER (Fixed - Correct):**
```bash
curl https://kuer-production.up.railway.app/api/articles
# Returns: {"data":[],"meta":{"pagination":{"page":1,"pageSize":25,"pageCount":0,"total":0}}}
```

## 🔧 ALTERNATIVE FIX (If Dashboard Method Doesn't Work)

### Option A: Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and link to your project
railway login
railway link

# Deploy only the Strapi directory
railway up --detach ./kuer
```

### Option B: Create railway.json in root
Create `railway.json` in your project root:
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd kuer && npm install && npm run build"
  },
  "deploy": {
    "startCommand": "cd kuer && npm start"
  }
}
```

## 📋 VERIFICATION CHECKLIST

After the fix, verify these work:

- [ ] `https://kuer-production.up.railway.app/admin` → Shows Strapi login
- [ ] `https://kuer-production.up.railway.app/api/articles` → Returns JSON
- [ ] `curl -I https://kuer-production.up.railway.app/api/articles` → Content-Type: application/json
- [ ] Railway logs show "Strapi started successfully"

## 🚨 TROUBLESHOOTING

### If Root Directory Setting Doesn't Exist:
1. Make sure you're editing the **service** not the database
2. Look for "Source Repo" or "GitHub Repo" settings
3. The Root Directory field should be in the Deploy section

### If Still Getting Next.js:
1. Check Railway logs for errors
2. Ensure PostgreSQL database is connected
3. Verify environment variables are set
4. Try the CLI method as backup

### If Build Fails:
1. Check that `kuer/package.json` exists
2. Verify PostgreSQL service is running
3. Check environment variables are configured

## ⏱️ TIMELINE
- **Step 1-2**: 2 minutes (Dashboard navigation)
- **Step 3**: 3-5 minutes (Deployment)
- **Step 4**: 1 minute (Verification)
- **Total**: ~8 minutes

## 🎉 AFTER SUCCESS
Once Railway serves Strapi correctly:
1. Update Vercel environment variables
2. Redeploy Vercel
3. Test full application end-to-end

The root directory fix is the most common solution for this issue!