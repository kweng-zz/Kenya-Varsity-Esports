# 🚨 URGENT: Fix CORS Issue - Articles Missing

## Problem Summary
Your articles are missing because your Railway Strapi backend is blocking requests from your frontend due to CORS policy. The error shows:

```
Access to fetch at 'https://kuer-production.up.railway.app/api/articles' 
from origin 'https://www.kenyaesportsrankings.org' has been blocked by CORS policy
```

## ✅ Solution Ready - 2 Steps to Fix

### Step 1: Add Missing Environment Variables to Railway

Your Railway deployment is failing because it's missing the `APP_KEYS` and other required environment variables. Add these to your Railway project:

**Go to Railway Dashboard → Your Project → Variables and add:**

```bash
APP_KEYS=50e4f592829260c9116cd367b4ab21a5d6230ed9525f5f391c147d37c6889b4df3163c6825f80b5a68e845383c76a4f543d3eed09214bfc48bdd960c0f429c425c5ba52bf36dd1e322588f8e831c7fd6a8d8fd42160fddb6eab11ac90a4c6406fc89f8d978d027b0cda19635317535c1db53732ac5dc204afd5b6e6c8d7c3d17

API_TOKEN_SALT=ad61338f9c4f5549d88ed1100cf1d58112e4b2e494ee03d595ed4f96b0007f64

ADMIN_JWT_SECRET=2b59738d18d391f8647cf080bac3ea33e5f8c45919fea9f99c740a7ba8e475a3

TRANSFER_TOKEN_SALT=bd1ce74a833c6b89da591011e7c680c78d7901e526a0b1b331cd75877418d4eb

JWT_SECRET=197576366db4b56d4f01611bafec680fdbe75eddc3abd83c54e82627ce499983

NODE_ENV=production
HOST=0.0.0.0
PORT=1337
DATABASE_SSL=true
RAILWAY_ENVIRONMENT=production
ALLOWED_ORIGINS=https://www.kenyaesportsrankings.org,https://kenyaesportsrankings.org
```

**Don't forget to add your PostgreSQL database URL:**
```bash
DATABASE_URL=your_railway_postgresql_connection_string
```

### Step 2: Deploy Updated CORS Configuration

I've already fixed the CORS configuration in your code. You need to commit and push these changes:

```bash
git add .
git commit -m "Fix CORS configuration for Railway deployment"
git push origin main
```

Railway will automatically redeploy with the new CORS settings.

## 🔍 What Was Fixed

1. **CORS Configuration**: Updated `kuer/config/middlewares.ts` to allow your frontend domain
2. **Environment Variables**: Generated secure keys for Strapi
3. **Database Configuration**: Configured for Railway PostgreSQL with SSL

## ⏱️ Timeline to Fix

- **Add environment variables**: 2 minutes
- **Commit and push changes**: 1 minute  
- **Railway deployment**: 3-5 minutes
- **Total time**: ~10 minutes

## 🎯 Expected Result

After completing both steps:
- ✅ Your Strapi backend will start successfully (no more APP_KEYS error)
- ✅ CORS will allow requests from your frontend
- ✅ Articles will load on your website
- ✅ All API endpoints will be accessible

## 🚨 Critical Actions Required NOW

1. **Add environment variables to Railway** (most important - fixes the startup error)
2. **Commit and push the CORS fixes** (fixes the cross-origin blocking)
3. **Wait for Railway deployment** to complete
4. **Test your website** - articles should appear

## 📞 Verification

After deployment, test these URLs in your browser:
- Backend health: `https://kuer-production.up.railway.app/_health`
- Articles API: `https://kuer-production.up.railway.app/api/articles`
- Admin panel: `https://kuer-production.up.railway.app/admin`

## 🆘 If Still Not Working

1. Check Railway logs: `railway logs --follow`
2. Verify all environment variables are set
3. Ensure PostgreSQL database is connected
4. Run the test script: `node test-cors.js`

Your articles will be back once these two steps are completed!