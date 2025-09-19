# Vercel Environment Variables Update

## Your Railway Domain
✅ **Strapi Backend URL**: `https://kuer-production.up.railway.app`

## Required Vercel Environment Variables

Go to your Vercel dashboard → Project Settings → Environment Variables and update/add these:

### 1. Strapi Configuration
```bash
NEXT_PUBLIC_STRAPI_URL=https://kuer-production.up.railway.app
NEXT_PUBLIC_STRAPI_API_TOKEN=e3cff91858de3e5c3571877d32ba8ace1538cae90deb278c7d43d4385165fb503f8b4924941cb4a11477ea4c5dd27f140aecd360c35326f9ef24f900419c3d582c2c15169e60febaa93ab13882d1f4d4af1842893bea15e8aed011564b686c06537fb112eef522c596783a7768795c8d567e0ced6ed356b3ef46a99eccb2c5f0
STRAPI_API_TOKEN=e3cff91858de3e5c3571877d32ba8ace1538cae90deb278c7d43d4385165fb503f8b4924941cb4a11477ea4c5dd27f140aecd360c35326f9ef24f900419c3d582c2c15169e60febaa93ab13882d1f4d4af1842893bea15e8aed011564b686c06537fb112eef522c596783a7768795c8d567e0ced6ed356b3ef46a99eccb2c5f0
```

### 2. Build Configuration
```bash
SKIP_STRAPI_BUILD=true
```

### 3. Appwrite Configuration (keep existing)
```bash
NEXT_PUBLIC_APPWRITE_PROJECT_ID=68c7e7bc0028f9acee36
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_DB_ID=68c7f25e00083a6d2992
NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID=user_profiles
APPWRITE_API_KEY=standard_a0aa66027851a2b02c700a76c66af629b8b490744c64b3cf029b42b46c3886ce7fa11860e50db39bd613a1da60b6a5ad6acb0b6f0a27832a5117c765f92b0218d0af869df5410de55294fc86f69184161b073661a03fdc0ef3a99639f07a3bb4dc52900b20681e1dc2c686fbbd476296b16cb093269d264b42a0c454a78a33f2
```

### 4. Collection IDs (keep existing)
```bash
NEXT_PUBLIC_APPWRITE_TOURNAMENTS_COLLECTION_ID=tournaments
NEXT_PUBLIC_APPWRITE_AWARDS_COLLECTION_ID=tournament_awards
NEXT_PUBLIC_APPWRITE_SCHEDULE_COLLECTION_ID=tournament_schedule
NEXT_PUBLIC_APPWRITE_SPONSORS_COLLECTION_ID=tournament_sponsors
NEXT_PUBLIC_APPWRITE_PARTICIPANTS_COLLECTION_ID=participants
NEXT_PUBLIC_APPWRITE_TOURNAMENT_REGISTRATIONS_COLLECTION_ID=tournament_registrations
NEXT_PUBLIC_APPWRITE_CALENDAR_COLLECTION_ID=calendar_events
```

## Steps to Update

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Select your KUER project

2. **Navigate to Environment Variables**
   - Go to Settings → Environment Variables

3. **Update/Add Variables**
   - Update `NEXT_PUBLIC_STRAPI_URL` to: `https://kuer-production.up.railway.app`
   - Add `SKIP_STRAPI_BUILD` set to: `true`
   - Keep all other variables the same

4. **Redeploy**
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment
   - Or push a new commit to trigger automatic deployment

## Verification Steps

After redeployment, test these URLs:

1. **Health Check**: `https://your-vercel-app.vercel.app/api/health`
   - Should show Strapi as "healthy"

2. **Strapi Admin**: `https://kuer-production.up.railway.app/admin`
   - Should load Strapi admin panel

3. **API Test**: `https://kuer-production.up.railway.app/api/articles`
   - Should return JSON data

4. **Frontend**: `https://your-vercel-app.vercel.app`
   - Should load without API errors

## Expected Results

✅ Vercel build will succeed  
✅ No more "Failed to fetch" errors  
✅ Blog posts will load from Railway Strapi  
✅ All API connections will work  
✅ Admin panel accessible at Railway URL  

## Troubleshooting

If you still see errors after updating:

1. **Clear Vercel Cache**
   - In Vercel dashboard, go to Settings → Functions
   - Click "Clear Cache"

2. **Check CORS in Strapi**
   - Make sure your Vercel domain is allowed in Strapi CORS settings

3. **Verify Environment Variables**
   - Double-check all variables are saved correctly
   - Ensure no trailing spaces or extra characters

4. **Check Railway Logs**
   - Go to Railway dashboard
   - Check if Strapi is running properly