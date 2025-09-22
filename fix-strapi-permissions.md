# Fix Strapi API Permissions (403 Error)

## 🎉 Good News!
✅ **CORS is now working perfectly!**  
✅ **Strapi backend is running properly!**  
❌ **API endpoints need public access permissions**

## The Issue
Strapi is returning 403 Forbidden because the API endpoints are not configured for public access. By default, Strapi requires authentication for all API calls.

## Solution: Configure Public Access

### Method 1: Via Strapi Admin Panel (Recommended)

1. **Access Strapi Admin:**
   - Go to: https://kuer-strapi-backend-production.up.railway.app/admin
   - Login with your admin credentials
   - If you don't have an admin account, create one

2. **Configure Permissions:**
   - Go to **Settings** → **Users & Permissions Plugin** → **Roles**
   - Click on **Public** role
   - Under **Permissions**, find **Article**
   - Enable these permissions for public access:
     - ✅ `find` (to get all articles)
     - ✅ `findOne` (to get single article)
   - Click **Save**

3. **Test the Fix:**
   - Run: `node test-cors-after-fix.js`
   - Or visit: https://kuer-strapi-backend-production.up.railway.app/api/articles
   - Should now return JSON data instead of 403

### Method 2: Via API Token (Alternative)

If you prefer to use API tokens:

1. **Create API Token:**
   - In Strapi Admin: **Settings** → **API Tokens**
   - Click **Create new API Token**
   - Name: `Frontend Token`
   - Token duration: `Unlimited`
   - Token type: `Read-only` or `Full access`
   - Click **Save** and copy the token

2. **Update Frontend Code:**
   - Add the token to your environment variables
   - Update API calls to include Authorization header

### Method 3: Check Current Permissions (Diagnostic)

Run this command to see current permissions:
```bash
curl -H "Content-Type: application/json" https://kuer-strapi-backend-production.up.railway.app/api/users-permissions/roles
```

## Expected Results After Fix

### Successful API Response:
```bash
curl https://kuer-strapi-backend-production.up.railway.app/api/articles
```

Should return:
```json
{
  "data": [],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 0,
      "total": 0
    }
  }
}
```

## Test Commands

### Test API without authentication:
```bash
curl https://kuer-strapi-backend-production.up.railway.app/api/articles
```

### Test with CORS headers:
```bash
curl -H "Origin: https://www.kenyaesportsrankings.org" https://kuer-strapi-backend-production.up.railway.app/api/articles
```

### Test from your website:
- Open: https://www.kenyaesportsrankings.org
- Check browser console - should see articles loading
- No more CORS errors!

## Quick Verification

After configuring permissions, run:
```bash
node test-cors-after-fix.js
```

Expected output:
```
✅ CORS Working: YES
✅ API Working: YES
🎉 SUCCESS! Your CORS issue should be resolved!
```

## Summary

1. **CORS Issue**: ✅ **COMPLETELY RESOLVED**
2. **Current Issue**: API permissions (easy fix via admin panel)
3. **Next Step**: Configure public access in Strapi admin
4. **Result**: Your website will load articles without any errors

The hard part (CORS) is done! This is just a simple configuration step in Strapi.