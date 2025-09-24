# 🚀 Contentful Quick Start Guide

This guide will get you up and running with Contentful in just a few minutes using our automated setup scripts.

## 📋 Prerequisites

1. **Contentful Account**: Sign up at [contentful.com](https://www.contentful.com/) (free tier available)
2. **Node.js**: Version 18+ (already installed if you're running this project)

## 🎯 Option 1: Automated Setup (Recommended)

### Step 1: Run the Setup Script

```bash
npm run setup:contentful
```

This interactive script will:
- ✅ Guide you through entering your Contentful credentials
- ✅ Verify your connection to Contentful
- ✅ Automatically create all required content models (Article, Category, Game)
- ✅ Add sample content to get you started
- ✅ Test the integration
- ✅ Update your environment variables

### Step 2: Get Your Contentful Credentials

The script will ask for these credentials (you can find them in your Contentful space):

1. **Go to [Contentful](https://app.contentful.com/)**
2. **Select your space** (or create a new one)
3. **Get your Space ID**:
   - Go to Settings > General settings
   - Copy the Space ID
4. **Get your API tokens**:
   - Go to Settings > API keys
   - Copy the "Content Delivery API - access token"
   - Copy the "Content Management API - access token"

### Step 3: Run Your Application

```bash
npm run dev
```

Your application will now use Contentful instead of demo data! 🎉

## 🔍 Option 2: Verify Existing Setup

If you've already set up Contentful or want to check your current configuration:

```bash
npm run verify:contentful
```

This script will:
- ✅ Check if required packages are installed
- ✅ Verify environment variables are configured
- ✅ Test the Contentful connection
- ✅ Validate content models exist
- ✅ Test the application integration

## 📁 What Gets Created

### Content Models

**Article** (`article`)
- Title, Description, Content
- Slug, Category, Game
- Author, Featured flag
- Tags, Image, Published date

**Category** (`category`)
- Name, Slug

**Game** (`game`)
- Name, Slug

### Sample Content

**Categories:**
- Tournament Results
- Championship
- News
- Reviews
- Updates

**Games:**
- PUBG Mobile
- Call of Duty Mobile
- Free Fire
- Fortnite
- Multiple Games

**Articles:**
- MMUST Makes History
- TUK Season 2 Champions
- Season 3 Format Announcement

## 🔧 Manual Setup (If Scripts Don't Work)

If you prefer to set up manually or the scripts encounter issues:

1. **Follow the detailed guide**: `CONTENTFUL_SETUP.md`
2. **Create content models manually** in your Contentful space
3. **Add environment variables** to `.env.local`:

```env
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=your_space_id
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=your_access_token
NEXT_PUBLIC_FALLBACK_MODE=false
```

## 🎛️ Environment Variables

After running the setup script, your `.env.local` will contain:

```env
# Contentful Configuration
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=your_space_id
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=your_access_token
CONTENTFUL_ENVIRONMENT=master

# Disable fallback mode to use Contentful
NEXT_PUBLIC_FALLBACK_MODE=false
```

## 🚨 Troubleshooting

### Common Issues

**"Command not found" error:**
```bash
# Make sure you're in the project directory
cd path/to/your/esports/project
npm run setup:contentful
```

**"Permission denied" error:**
```bash
# On Unix systems, you might need to make the script executable
chmod +x scripts/setup-contentful.js
npm run setup:contentful
```

**"Cannot find module" error:**
```bash
# Install dependencies first
npm install
npm run setup:contentful
```

**Setup script fails:**
1. Check your internet connection
2. Verify your Contentful credentials
3. Try the manual setup guide: `CONTENTFUL_SETUP.md`

### Verification Commands

```bash
# Check if everything is working
npm run verify:contentful

# Check your environment variables
cat .env.local

# Test your application
npm run dev
```

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ **Setup script completes** without errors
2. ✅ **Verification script passes** all checks
3. ✅ **Homepage loads** with articles from Contentful
4. ✅ **Blogs page shows** your Contentful content
5. ✅ **Admin panel displays** Contentful data

## 🔄 Switching Back to Demo Mode

If you want to temporarily use demo data instead of Contentful:

```bash
# Edit .env.local and change:
NEXT_PUBLIC_FALLBACK_MODE=true

# Restart your application
npm run dev
```

## 📞 Getting Help

If you encounter issues:

1. **Run the verification script**: `npm run verify:contentful`
2. **Check the detailed setup guide**: `CONTENTFUL_SETUP.md`
3. **Review the migration summary**: `STRAPI_TO_CONTENTFUL_MIGRATION.md`
4. **Check Contentful documentation**: [contentful.com/developers](https://www.contentful.com/developers/)

## 🎊 Next Steps

Once Contentful is set up:

1. **Add more content** in your Contentful space
2. **Customize content models** as needed
3. **Set up webhooks** for automatic deployments
4. **Consider upgrading** to a paid Contentful plan for more features

---

**That's it! You're now using Contentful as your CMS! 🚀**

The automated scripts make the migration from Strapi to Contentful seamless and ensure everything is configured correctly.