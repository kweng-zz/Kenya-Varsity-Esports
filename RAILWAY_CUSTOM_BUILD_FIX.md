# Railway Custom Build Command Fix

## 🎯 SOLUTION: Use Custom Build & Start Commands

Since the Root Directory field isn't available, we'll use **Custom Build Command** and **Custom Start Command** to deploy only Strapi.

## 📋 STEP-BY-STEP FIX

### Step 1: Set Custom Build Command
1. In your Railway settings (where you are now)
2. Find **"Custom Build Command"** section
3. Click in the **Build Command** field
4. Enter: `cd kuer && npm install && npm run build`
5. This tells Railway to build only the Strapi part

### Step 2: Set Custom Start Command  
1. Find **"Custom Start Command"** section
2. Click in the **Start command** field
3. Enter: `cd kuer && npm start`
4. This tells Railway to start only Strapi

### Step 3: Deploy
1. Scroll to the top of the page
2. Click **"Deploy"** or trigger a new deployment
3. Wait 3-5 minutes for deployment to complete

## 🔧 EXACT COMMANDS TO ENTER

**Custom Build Command:**
```bash
cd kuer && npm install && npm run build
```

**Custom Start Command:**
```bash
cd kuer && npm start
```

## ✅ VERIFICATION

After deployment completes, test these:

```bash
# Should return JSON (Strapi API)
curl https://kuer-production.up.railway.app/api/articles

# Should return Strapi admin login page
curl https://kuer-production.up.railway.app/admin

# Should NOT return Next.js 404
curl https://kuer-production.up.railway.app
```

## 🚨 ALTERNATIVE: Railway.json Method

If the custom commands don't work, create this file in your project root:

**Create `railway.json` in project root:**
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd kuer && npm install && npm run build"
  },
  "deploy": {
    "startCommand": "cd kuer && npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

Then commit and push to trigger deployment.

## 📊 EXPECTED RESULTS

**BEFORE (Current):**
- `curl https://kuer-production.up.railway.app/api/articles` → Next.js 404 HTML

**AFTER (Fixed):**
- `curl https://kuer-production.up.railway.app/api/articles` → `{"data":[],"meta":{"pagination":...}}`
- `curl https://kuer-production.up.railway.app/admin` → Strapi admin login page

## 🎯 WHY THIS WORKS

- **Build Command**: `cd kuer && npm install && npm run build`
  - Changes to Strapi directory
  - Installs Strapi dependencies
  - Builds Strapi for production

- **Start Command**: `cd kuer && npm start`  
  - Changes to Strapi directory
  - Starts Strapi server on port 1337
  - Railway automatically maps this to port 8080

## ⏱️ TIMELINE
- **Setting commands**: 2 minutes
- **Deployment**: 3-5 minutes  
- **Verification**: 1 minute
- **Total**: ~8 minutes

## 🔍 TROUBLESHOOTING

**If build fails:**
- Check Railway logs for specific error
- Ensure PostgreSQL database is connected
- Verify environment variables are set

**If still returns Next.js:**
- Try the railway.json method
- Check that commands were saved correctly
- Verify deployment completed successfully

**If Strapi starts but API fails:**
- Check environment variables (especially DATABASE_URL)
- Verify PostgreSQL connection
- Check Strapi logs in Railway dashboard

## 🚀 NEXT STEPS AFTER SUCCESS

1. ✅ Verify Strapi is working at Railway URL
2. ✅ Update Vercel environment variables  
3. ✅ Redeploy Vercel
4. ✅ Test complete application

The custom build/start commands are the most reliable way to deploy only Strapi when Root Directory isn't available!