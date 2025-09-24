# Contentful Setup Guide

This guide will help you set up Contentful as your headless CMS to replace Strapi.

## 🚀 Why Contentful?

- **Reliable**: Cloud-hosted with 99.9% uptime
- **Fast**: Global CDN for optimal performance
- **Developer-friendly**: Excellent API and SDK
- **Scalable**: Handles traffic spikes automatically
- **User-friendly**: Great content management interface

## 📋 Prerequisites

1. A Contentful account (free tier available)
2. Your Next.js application (already set up)

## 🔧 Step 1: Create Contentful Space

1. **Sign up/Login** to [Contentful](https://www.contentful.com/)
2. **Create a new space** for your esports application
3. **Note your Space ID** (found in Settings > General settings)

## 🔑 Step 2: Get API Keys

1. Go to **Settings > API keys**
2. **Create a new API key** or use the default one
3. **Copy the following**:
   - Space ID
   - Content Delivery API - access token
   - Content Preview API - access token (optional, for draft content)

## 📝 Step 3: Create Content Models

Create these content types in your Contentful space:

### Article Content Type
**Content Type ID**: `article`

| Field Name | Field ID | Type | Required | Description |
|------------|----------|------|----------|-------------|
| Title | `title` | Short text | Yes | Article title |
| Description | `description` | Long text | Yes | Article summary |
| Content | `content` | Long text | Yes | Full article content |
| Slug | `slug` | Short text | Yes | URL-friendly identifier |
| Category | `category` | Short text | Yes | Article category |
| Game | `game` | Short text | No | Related game |
| Author | `author` | Short text | Yes | Article author |
| Featured | `featured` | Boolean | No | Is featured article |
| Tags | `tags` | Short text, list | No | Article tags |
| Image | `image` | Media | No | Featured image |
| Published At | `publishedAt` | Date & time | No | Publication date |

### Category Content Type
**Content Type ID**: `category`

| Field Name | Field ID | Type | Required |
|------------|----------|------|----------|
| Name | `name` | Short text | Yes |
| Slug | `slug` | Short text | Yes |

### Game Content Type
**Content Type ID**: `game`

| Field Name | Field ID | Type | Required |
|------------|----------|------|----------|
| Name | `name` | Short text | Yes |
| Slug | `slug` | Short text | Yes |

## 🔧 Step 4: Configure Environment Variables

Update your `.env.local` file:

```env
# Contentful Configuration
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=your_space_id_here
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=your_delivery_api_token_here
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_api_token_here
CONTENTFUL_ENVIRONMENT=master

# Disable fallback mode to use Contentful
NEXT_PUBLIC_FALLBACK_MODE=false

# Keep Appwrite disabled (or configure if needed)
# NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
# NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
```

## 📊 Step 5: Add Sample Content

Create some sample articles in Contentful:

### Sample Article 1
- **Title**: "MASINDE MULIRO UNIVERSITY (MMUST) MAKES HISTORY"
- **Description**: "As the Only Non-Nairobi Winner in the Kenya University Esports Rankings"
- **Content**: "MMUST has made history by becoming the first non-Nairobi university to win the Kenya University Esports Rankings. This achievement showcases the growing talent pool outside of Nairobi and demonstrates that esports excellence can be found across Kenya."
- **Slug**: "mmust-makes-history"
- **Category**: "Tournament Results"
- **Game**: "PUBG Mobile"
- **Author**: "KUER Team"
- **Featured**: true
- **Tags**: ["MMUST", "Tournament", "Victory"]

### Sample Categories
- Tournament Results
- Championship
- News
- Reviews
- Updates

### Sample Games
- PUBG Mobile
- Call of Duty Mobile
- Free Fire
- Fortnite
- Multiple Games

## 🚀 Step 6: Test the Integration

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Check the homepage** - should load articles from Contentful
3. **Visit the blogs page** - should display Contentful articles
4. **Test the admin panel** - should show Contentful data

## 🔍 Step 7: Verify Everything Works

### Homepage News Section
- Should display featured articles from Contentful
- Images should load properly
- Links should work

### Blogs Page
- Should show all articles with pagination
- Filtering by category should work
- Search functionality should work

### Admin Panel
- Should display articles from Contentful
- Demo mode should be disabled
- Article creation will still be in demo mode (Contentful is read-only via Delivery API)

## 🛠️ Advanced Configuration

### Enable Preview Mode (Optional)
To preview draft content, you can implement Contentful's Preview API:

```typescript
// In your Contentful service
const preview = searchParams.get('preview') === 'true';
const response = await contentful.getArticles({ preview });
```

### Image Optimization
Contentful automatically optimizes images. You can add parameters:

```typescript
// Example: Get optimized image
const imageUrl = getContentfulImageUrl(asset, 800, 600); // width, height
```

### Webhooks (Optional)
Set up webhooks in Contentful to trigger rebuilds when content changes:

1. Go to **Settings > Webhooks**
2. **Create webhook** pointing to your deployment service
3. **Configure triggers** for publish/unpublish events

## 🎉 You're Done!

Your application now uses Contentful instead of Strapi! 

### Benefits You'll Notice:
- ✅ **Faster loading** - Global CDN
- ✅ **No server maintenance** - Fully managed
- ✅ **Better reliability** - 99.9% uptime
- ✅ **Easier content management** - User-friendly interface
- ✅ **Automatic scaling** - Handles traffic spikes

### Next Steps:
1. **Add more content** in Contentful
2. **Customize the content models** as needed
3. **Set up webhooks** for automatic deployments
4. **Consider upgrading** to a paid Contentful plan for more features

## 🆘 Troubleshooting

### Common Issues:

**"No articles found"**
- Check your Space ID and Access Token
- Verify content models are created correctly
- Ensure articles are published (not just saved as drafts)

**Images not loading**
- Check that images are uploaded to Contentful
- Verify the image field is properly configured
- Check browser console for CORS errors

**API errors**
- Verify your API tokens are correct
- Check that the environment is set to 'master'
- Ensure your Contentful space is active

### Getting Help:
- [Contentful Documentation](https://www.contentful.com/developers/docs/)
- [Contentful Community](https://www.contentfulcommunity.com/)
- [Next.js + Contentful Guide](https://www.contentful.com/developers/docs/javascript/tutorials/integrate-contentful-with-nextjs/)

---

**Congratulations! You've successfully migrated from Strapi to Contentful! 🎉**