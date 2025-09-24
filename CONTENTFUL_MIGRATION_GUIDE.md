# Contentful Migration Guide

This guide will help you migrate from Strapi to Contentful for your blog management system.

## Overview

Your esports application has been successfully migrated from Strapi to Contentful. The blog management system in the admin panel now uses Contentful as the headless CMS instead of Strapi.

## What Changed

### ✅ Completed Migration Steps

1. **API Routes Updated**: Created new Contentful API routes to replace Strapi ones
   - `/api/contentful/articles/create` - Create new articles
   - `/api/contentful/articles/[id]` - Update and delete articles

2. **Admin Interface Updated**: The admin blog management page now uses Contentful
   - Form submissions now go to Contentful API routes
   - Error messages updated to reference Contentful instead of Strapi
   - All CRUD operations (Create, Read, Update, Delete) now work with Contentful

3. **Contentful Library Enhanced**: The existing Contentful integration has been improved
   - Better error handling
   - Image upload support
   - Content model compatibility with your existing blog structure

## Setup Instructions

### Step 1: Install Required Dependencies

The necessary dependencies should already be installed, but verify you have:

```bash
npm install contentful contentful-management
```

### Step 2: Configure Contentful

1. **Get Contentful Credentials**:
   - Go to [Contentful](https://app.contentful.com/)
   - Select your space or create a new one
   - Go to Settings > General settings to get your Space ID
   - Go to Settings > API keys to get your tokens

2. **Update Environment Variables**:
   Create or update your `.env.local` file:

```env
# Contentful Configuration
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=your_space_id_here
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=your_delivery_token_here
CONTENTFUL_MANAGEMENT_TOKEN=your_management_token_here
CONTENTFUL_ENVIRONMENT=master

# Disable fallback mode to use Contentful
NEXT_PUBLIC_FALLBACK_MODE=false
```

### Step 3: Set Up Content Models

Run the automated setup script to create the necessary content models:

```bash
node scripts/setup-contentful.cjs
```

This script will:
- Create Article, Category, and Game content types
- Add sample content
- Test the integration
- Update your environment file

### Step 4: Manual Content Model Setup (Alternative)

If you prefer to set up manually, create these content types in Contentful:

#### Article Content Type
- **Content Type ID**: `article`
- **Fields**:
  - `title` (Short text, required)
  - `description` (Long text, required)
  - `content` (Long text, required)
  - `slug` (Short text, required, unique)
  - `category` (Short text, required)
  - `game` (Short text, optional)
  - `author` (Short text, required, default: "KUER Team")
  - `featured` (Boolean, optional, default: false)
  - `tags` (Short text, list)
  - `image` (Media, optional)
  - `publishedAt` (Date & time, optional)

#### Category Content Type
- **Content Type ID**: `category`
- **Fields**:
  - `name` (Short text, required, unique)
  - `slug` (Short text, required, unique)

#### Game Content Type
- **Content Type ID**: `game`
- **Fields**:
  - `name` (Short text, required, unique)
  - `slug` (Short text, required, unique)

### Step 5: Test the Integration

1. Start your development server:
```bash
npm run dev
```

2. Navigate to `/admin/blogs` (requires admin access)

3. Try creating, editing, and deleting articles

## Features

### ✅ What Works Now

- **Create Articles**: Full article creation with image upload
- **Edit Articles**: Update existing articles with all fields
- **Delete Articles**: Remove articles from Contentful
- **Search & Filter**: Search articles by title and filter by category
- **Image Upload**: Upload and manage featured images
- **Rich Content**: Support for long-form content and descriptions
- **Metadata**: Tags, categories, games, authors, and featured status
- **Pagination**: Handle large numbers of articles efficiently

### 🔧 Admin Interface Features

- **User-Friendly Forms**: Easy-to-use article creation and editing forms
- **Real-time Validation**: Form validation with helpful error messages
- **Image Preview**: Visual feedback for uploaded images
- **Bulk Operations**: Efficient management of multiple articles
- **Responsive Design**: Works on desktop and mobile devices

## Troubleshooting

### Common Issues

1. **"Contentful not configured" Error**:
   - Verify your environment variables are set correctly
   - Make sure you're using the Management API token, not just the Delivery API token
   - Restart your development server after updating environment variables

2. **"Space not found" Error**:
   - Double-check your Space ID
   - Ensure your Management API token has access to the space

3. **Content Model Errors**:
   - Verify your content types match the expected structure
   - Check that field IDs are exactly as specified (case-sensitive)

4. **Image Upload Issues**:
   - Ensure your Management API token has asset creation permissions
   - Check file size limits (Contentful has upload limits)

### Debug Mode

To enable debug logging, add this to your environment:

```env
DEBUG=contentful*
```

## Migration Benefits

### Why Contentful over Strapi?

1. **Cloud-Native**: No server management required
2. **Scalability**: Handles traffic spikes automatically
3. **CDN Integration**: Global content delivery
4. **Rich API**: Powerful querying and filtering
5. **Asset Management**: Built-in image optimization
6. **Reliability**: Enterprise-grade uptime and performance

### Performance Improvements

- **Faster Loading**: CDN-delivered content
- **Better Caching**: Built-in caching strategies
- **Image Optimization**: Automatic image resizing and format conversion
- **Global Availability**: Content served from edge locations

## Next Steps

1. **Content Migration**: If you have existing Strapi content, you'll need to migrate it manually or create a migration script
2. **SEO Optimization**: Consider adding meta fields for better SEO
3. **Content Workflows**: Set up content approval workflows in Contentful
4. **Webhooks**: Configure webhooks for real-time updates
5. **Preview Mode**: Implement preview functionality for draft content

## Support

If you encounter issues:

1. Check the Contentful documentation: https://www.contentful.com/developers/docs/
2. Review the setup script logs for detailed error messages
3. Verify your content models match the expected structure
4. Test your API tokens in the Contentful web app

## File Structure

The migration created/updated these files:

```
src/
├── app/
│   ├── api/
│   │   └── contentful/
│   │       └── articles/
│   │           ├── create/
│   │           │   └── route.ts
│   │           └── [id]/
│   │               └── route.ts
│   └── admin/
│       └── blogs/
│           └── page.tsx (updated)
├── lib/
│   └── contentful.ts (enhanced)
└── scripts/
    └── setup-contentful.cjs
```

Your blog management system is now fully migrated to Contentful and ready for production use!