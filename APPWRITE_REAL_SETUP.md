# 🚀 Real Appwrite Database Setup Guide

## Current Status
- ✅ Project ID: `68c7e7bc0028f9acee36` (already configured)
- ❌ API Key: Needs to be obtained from Appwrite
- ✅ Application: Working in demo mode

## Step-by-Step Setup

### 1. Get Your API Key from Appwrite

1. **Visit your Appwrite project:**
   ```
   https://cloud.appwrite.io
   ```

2. **Navigate to your project** with ID: `68c7e7bc0028f9acee36`

3. **Go to API Keys:**
   - Click on **"Settings"** in the left sidebar
   - Click on **"API Keys"**

4. **Create a new API Key:**
   - Click **"Create API Key"**
   - **Name:** `KUER Database Setup`
   - **Expiration:** Never (or set a long expiration)
   
5. **Select ALL these scopes (very important):**
   ```
   ✅ databases.read
   ✅ databases.write
   ✅ collections.read
   ✅ collections.write
   ✅ attributes.read
   ✅ attributes.write
   ✅ indexes.read
   ✅ indexes.write
   ✅ documents.read
   ✅ documents.write
   ```

6. **Click "Create"** and **COPY THE API KEY** immediately (it's only shown once!)

### 2. Update Your .env File

Open your `.env` file and replace this line:
```env
APPWRITE_API_KEY=paste_your_actual_api_key_here
```

With your actual API key:
```env
APPWRITE_API_KEY=your_copied_api_key_here
```

### 3. Run Database Setup

```bash
npm run setup:appwrite
```

This will:
- Create the database
- Create 6 collections (Universities, Regions, Game Categories, Rankings, Sponsors, Contact Messages)
- Set up all attributes and indexes

### 4. Populate with Sample Data

```bash
npm run populate:appwrite
```

This will add:
- 5 sample universities
- 3 regions
- 6 game categories
- Sample rankings data
- Sample sponsors

### 5. Switch to Live Mode

Update your `.env` file:
```env
NEXT_PUBLIC_FALLBACK_MODE=false
```

### 6. Restart Your Application

```bash
npm run dev
```

## Verification Steps

### Check Setup Status
```bash
npm run check:appwrite
```

### Test Your Application
1. **Visit:** http://localhost:3000/rankings
2. **Check:** Rankings display real data from Appwrite
3. **Test:** Contact form saves to database
4. **Access:** Admin panel at http://localhost:3000/admin

## Troubleshooting

### If setup fails with "unauthorized" error:
- Double-check your API key is correct
- Ensure all required scopes are selected
- Make sure the API key hasn't expired

### If you see "Project not found":
- Verify your Project ID is correct: `68c7e7bc0028f9acee36`
- Check you're logged into the right Appwrite account

### If collections already exist:
- The script will skip existing collections
- This is normal and safe

### To start over:
1. Delete the database in Appwrite console
2. Run `npm run setup:appwrite` again
3. Run `npm run populate:appwrite` again

## What Gets Created

### Database Structure:
```
esports-db/
├── universities/          # University information
├── regions/              # Regional data
├── game-categories/      # Game tournament categories
├── rankings/             # University rankings and scores
├── sponsors/             # Sponsor information
└── contact-messages/     # Contact form submissions
```

### Sample Data:
- **5 Universities:** TUK, UoN, KU, Strathmore, JKUAT
- **3 Regions:** Nairobi (active), Central Kenya, Western Kenya
- **6 Game Categories:** PUBGM, CODM, EFOOTBALL, CODM-MP, EAFC-2V2, EAFC-Women
- **Rankings:** Sample scores for each university and game
- **2 Sponsors:** KUER Official, B34R CL4N

## Admin Panel Features

Once set up, your admin panel will allow you to:
- ✅ Add/edit/delete university rankings
- ✅ Manage game categories
- ✅ View and respond to contact messages
- ✅ Add new universities and regions
- ✅ Manage sponsor information

## Next Steps After Setup

1. **Customize the data** through the admin panel
2. **Add real university logos** and images
3. **Update game category images** with your own
4. **Configure email notifications** for contact forms
5. **Set up user authentication** for admin access

Your KUER esports platform will then be running on a real database with full admin capabilities!