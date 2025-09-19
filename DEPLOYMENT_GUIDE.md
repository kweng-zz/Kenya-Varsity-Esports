# KUER Esports Platform - Deployment Guide

## Overview

The KUER Esports Platform consists of two main components:
1. **Next.js Frontend** - The main web application
2. **Strapi CMS** - Content management system for blogs and articles

Both services must run together for the application to function properly.

## Architecture

```
┌─────────────────┐    API Calls    ┌─────────────────┐
│   Next.js App   │ ──────────────► │   Strapi CMS    │
│  (Port 3000)    │                 │  (Port 1337)    │
└─────────────────┘                 └─────────────────┘
        │                                   │
        ▼                                   ▼
┌─────────────────┐                 ┌─────────────────┐
│   Appwrite DB   │                 │   SQLite DB     │
│  (External)     │                 │   (Local)       │
└───────────���─────┘                 └─────────────────┘
```

## Environment Variables

### Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_DB_ID=your_database_id
NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID=user_profiles
APPWRITE_API_KEY=your_api_key

# Strapi Configuration
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_token
NEXT_PUBLIC_STRAPI_API_TOKEN=your_strapi_token

# Collection IDs
NEXT_PUBLIC_APPWRITE_TOURNAMENTS_COLLECTION_ID=tournaments
NEXT_PUBLIC_APPWRITE_AWARDS_COLLECTION_ID=tournament_awards
NEXT_PUBLIC_APPWRITE_PARTICIPANTS_COLLECTION_ID=participants
NEXT_PUBLIC_APPWRITE_TOURNAMENT_REGISTRATIONS_COLLECTION_ID=tournament_registrations
NEXT_PUBLIC_APPWRITE_CALENDAR_COLLECTION_ID=calendar_events
```

## Build Process

### 1. Build Strapi
```bash
cd kuer
npm run build
cd ..
```

### 2. Build Next.js
```bash
npm run build:next
```

### 3. Build Both (Recommended)
```bash
npm run build:local
```

## Running the Application

### Development Mode
```bash
# Run both services in development
npm run dev

# Or run individually
npm run dev:strapi  # Strapi only
npm run dev:next    # Next.js only
```

### Production Mode
```bash
# Run both services in production
npm start

# Or use the full command
npm run start:full

# Or run individually
npm run start:strapi  # Strapi only
npm run start:next    # Next.js only
```

## Deployment Options

### Option 1: Single Server Deployment
Deploy both services on the same server:

1. Clone the repository
2. Install dependencies: `npm install`
3. Install Strapi dependencies: `cd kuer && npm install && cd ..`
4. Set up environment variables
5. Build both applications: `npm run build:local`
6. Start both services: `npm start`

### Option 2: Separate Deployments
Deploy services separately:

**Strapi Deployment:**
1. Deploy the `kuer/` directory to a Strapi hosting service
2. Update `NEXT_PUBLIC_STRAPI_URL` to point to the deployed Strapi URL

**Next.js Deployment:**
1. Deploy the main application to a Next.js hosting service
2. Ensure environment variables are configured

## Common Issues and Solutions

### Issue: "Failed to fetch" errors in browser console

**Cause:** Strapi is not running or not accessible

**Solution:**
1. Ensure Strapi is running: `npm run strapi:start`
2. Check if Strapi is accessible at http://localhost:1337
3. Verify `NEXT_PUBLIC_STRAPI_URL` environment variable

### Issue: Appwrite connection errors

**Cause:** Appwrite configuration is missing or incorrect

**Solution:**
1. Verify all Appwrite environment variables are set
2. Check Appwrite project settings
3. Ensure API key has proper permissions

### Issue: Build fails with Strapi connection errors

**Cause:** Next.js tries to fetch data from Strapi during build time

**Solution:**
1. Start Strapi before building: `npm run strapi:start`
2. Then build Next.js: `npm run build:next`
3. Or use: `npm run build:local` (builds Strapi first, then Next.js)

## Port Configuration

- **Next.js:** Port 3000 (configurable via PORT environment variable)
- **Strapi:** Port 1337 (configurable in `kuer/config/server.ts`)

## Database Configuration

### Strapi Database
- **Development:** SQLite (stored in `kuer/.tmp/data.db`)
- **Production:** Can be configured to use PostgreSQL, MySQL, etc.

### Appwrite Database
- External cloud service
- Configured via environment variables

## Monitoring and Logs

Both services output logs to the console. In production, consider:
1. Using a process manager like PM2
2. Setting up log rotation
3. Monitoring service health

## Security Considerations

1. **Environment Variables:** Never commit `.env` files to version control
2. **API Keys:** Use environment-specific API keys
3. **CORS:** Configure CORS settings in Strapi for production domains
4. **HTTPS:** Use HTTPS in production for both services

## Backup Strategy

1. **Strapi Database:** Regular backups of the SQLite file or configured database
2. **Appwrite:** Handled by Appwrite cloud service
3. **Media Files:** Backup Strapi uploads directory

## Performance Optimization

1. **Caching:** Configure appropriate caching headers
2. **CDN:** Use a CDN for static assets
3. **Database:** Optimize database queries and indexes
4. **Images:** Use Next.js Image optimization

## Support

For deployment issues:
1. Check the logs for both services
2. Verify environment variables
3. Ensure all dependencies are installed
4. Check network connectivity between services