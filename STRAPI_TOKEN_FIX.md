# Strapi API Token Fix Guide

## Problem
The current STRAPI_API_TOKEN is invalid or expired, causing 401 Unauthorized errors when trying to create articles.

## Solution Steps

### 1. Access Strapi Admin Panel
Visit your Strapi backend admin panel:
- **Railway Backend**: https://kuer-strapi-backend-production.up.railway.app/admin
- **Local Development**: http://localhost:1337/admin

### 2. Generate New API Token
1. Log in to the Strapi admin panel
2. Go to **Settings** → **API Tokens**
3. Click **Create new API token**
4. Configure the token:
   - **Name**: `Frontend API Token`
   - **Description**: `Token for frontend article creation`
   - **Token duration**: `Unlimited` (or set expiration as needed)
   - **Token type**: `Full access` or `Custom`

### 3. If using Custom token type, set permissions:
   - **Article**: `find`, `findOne`, `create`, `update`, `delete`
   - **Upload**: `upload` (for image uploads)

### 4. Copy the generated token
⚠️ **Important**: Copy the token immediately as it won't be shown again!

### 5. Update Environment Variables
Update your `.env` file with the new token:

```bash
STRAPI_API_TOKEN=your_new_token_here
NEXT_PUBLIC_STRAPI_API_TOKEN=your_new_token_here
```

### 6. Restart Development Server
```bash
npm run dev
```

## Alternative: Enable Public Access (Less Secure)

If you want to allow public article creation (not recommended for production):

1. Go to **Settings** → **Users & Permissions Plugin** → **Roles**
2. Click on **Public**
3. Under **Article**, enable:
   - `create`
   - `update` 
   - `delete`
4. Under **Upload**, enable:
   - `upload`
5. Save changes

## Testing the Fix

After updating the token, test the connection:

```bash
curl -H "Authorization: Bearer YOUR_NEW_TOKEN" \
     -H "Content-Type: application/json" \
     "https://kuer-strapi-backend-production.up.railway.app/api/articles?pagination[limit]=1"
```

Should return articles data instead of 401 error.

## Current Token Status
- **Current Token**: `e3cff91858de3e5c3571877d32ba8ace1538cae90deb278c7d43d4385165fb503f8b4924941cb4a11477ea4c5dd27f140aecd360c35326f9ef24f900419c3d582c2c15169e60febaa93ab13882d1f4d4af1842893bea15e8aed011564b686c06537fb112eef522c596783a7768795c8d567e0ced6ed356b3ef46a99eccb2c5f0`
- **Status**: ❌ Invalid/Expired (returns 401)
- **Backend URL**: https://kuer-strapi-backend-production.up.railway.app
- **Public Read Access**: ✅ Working (articles can be read without token)