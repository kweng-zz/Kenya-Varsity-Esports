# Appwrite Setup Guide for KUER Esports Platform

This guide will help you set up Appwrite as the backend for your KUER esports platform, enabling database management through the admin panel.

## Prerequisites

- Node.js 18+ installed
- An Appwrite account (free at https://cloud.appwrite.io)
- Basic understanding of environment variables

## Step 1: Create Appwrite Project

1. Go to [Appwrite Cloud](https://cloud.appwrite.io) and sign up/login
2. Create a new project
3. Note down your **Project ID** from the project settings
4. Go to "API Keys" in your project settings
5. Create a new API key with the following scopes:
   - `databases.read`
   - `databases.write`
   - `collections.read`
   - `collections.write`
   - `attributes.read`
   - `attributes.write`
   - `indexes.read`
   - `indexes.write`
   - `documents.read`
   - `documents.write`
6. Note down your **API Key**

## Step 2: Configure Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the following variables in your `.env` file:
   ```env
   # Set to false to use Appwrite
   NEXT_PUBLIC_FALLBACK_MODE=false
   
   # Your Appwrite project details
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
   APPWRITE_API_KEY=your_api_key_here
   
   # Keep these as they are (unless you want custom names)
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_DB_ID=esports-db
   NEXT_PUBLIC_APPWRITE_RANKINGS_COLLECTION_ID=rankings
   NEXT_PUBLIC_APPWRITE_REGIONS_COLLECTION_ID=regions
   NEXT_PUBLIC_APPWRITE_GAME_CATEGORIES_COLLECTION_ID=game-categories
   NEXT_PUBLIC_APPWRITE_UNIVERSITIES_COLLECTION_ID=universities
   NEXT_PUBLIC_APPWRITE_SPONSORS_COLLECTION_ID=sponsors
   NEXT_PUBLIC_APPWRITE_CONTACT_MESSAGES_COLLECTION_ID=contact-messages
   ```

## Step 3: Set Up Database Schema

Run the database setup script to create all necessary collections and attributes:

```bash
npm run setup:appwrite
```

This script will create:
- **Universities** collection (university data)
- **Regions** collection (regional information)
- **Game Categories** collection (game types and tournaments)
- **Rankings** collection (university rankings and scores)
- **Sponsors** collection (sponsor information)
- **Contact Messages** collection (contact form submissions)

## Step 4: Populate Sample Data

Populate your database with sample data:

```bash
npm run populate:appwrite
```

This will add:
- 5 sample universities
- 3 regions (Nairobi active, others coming soon)
- 6 game categories (PUBGM, CODM, EFOOTBALL, etc.)
- Sample rankings for different games
- Sample sponsors

## Step 5: Start the Application

```bash
npm run dev
```

Your application should now be running with Appwrite as the backend!

## Step 6: Access Admin Panel

1. Navigate to `http://localhost:3000/admin`
2. You can now manage:
   - University rankings
   - Game categories
   - Regions
   - Universities
   - Sponsors
   - Contact messages

## Database Collections Overview

### Universities
- Stores university information (name, region, logo, etc.)
- Used for dropdown selections in rankings

### Regions
- Regional groupings for universities
- Controls which regions are active/coming soon

### Game Categories
- Different game tournaments (PUBGM, CODM, etc.)
- Organized by season (September/January) and category (main/added)

### Rankings
- University performance data
- Supports both general and game-specific rankings
- Tracks placement, participation, social media, and bonus points

### Sponsors
- Sponsor information with tiers (platinum, gold, silver, bronze)
- Used for sponsor displays on the website

### Contact Messages
- Stores contact form submissions
- Categorized by type (partnership, press, general)
- Tracks read/unread status

## API Endpoints

The following API endpoints are available:

- `GET /api/rankings` - Get all rankings
- `GET /api/rankings/general` - Get general rankings
- `GET /api/regions` - Get all regions
- `POST /api/regions` - Create new region
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get contact messages (admin)

## Admin Panel Features

### Dashboard
- Overview of all data counts
- Quick action buttons
- Recent activity feed

### Rankings Management
- Add/edit/delete university rankings
- Support for different game categories
- Automatic total calculation
- Bulk operations

### University Management
- Add/edit university information
- Manage regional assignments
- Upload logos and images

### Game Categories
- Manage tournament categories
- Set active/inactive status
- Organize by seasons

### Contact Messages
- View all contact form submissions
- Mark as read/unread
- Filter by type and status

## Troubleshooting

### Common Issues

1. **"Project not found" error**
   - Check your `NEXT_PUBLIC_APPWRITE_PROJECT_ID` is correct
   - Ensure your project is active in Appwrite console

2. **"Unauthorized" error**
   - Verify your `APPWRITE_API_KEY` has the correct permissions
   - Check that the API key hasn't expired

3. **"Collection not found" error**
   - Run `npm run setup:appwrite` to create collections
   - Check collection IDs in your `.env` file

4. **No data showing**
   - Run `npm run populate:appwrite` to add sample data
   - Check that `NEXT_PUBLIC_FALLBACK_MODE=false` in your `.env`

### Getting Help

1. Check the Appwrite console for error logs
2. Look at browser console for client-side errors
3. Check server logs for API errors
4. Verify all environment variables are set correctly

## Security Notes

- Never commit your `.env` file to version control
- Keep your API keys secure
- Use different API keys for development and production
- Regularly rotate your API keys

## Production Deployment

For production deployment:

1. Set up a production Appwrite project
2. Update environment variables in your hosting platform
3. Run the setup scripts on your production database
4. Test all functionality before going live

## Next Steps

Once your Appwrite setup is complete, you can:

1. Customize the admin panel interface
2. Add more data validation
3. Implement user authentication
4. Add file upload capabilities for images
5. Set up automated backups
6. Add more advanced querying and filtering

Your KUER esports platform is now fully integrated with Appwrite and ready for content management!