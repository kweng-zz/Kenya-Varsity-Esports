# KUER Esports Platform - Vercel + Railway Deployment Guide

## Overview

This guide explains how to deploy the KUER Esports Platform using a **separate deployment strategy**:
- **Vercel**: Hosts the Next.js frontend
- **Railway**: Hosts the Strapi CMS backend

## Architecture

```
┌─────────────────┐    API Calls    ┌─────────────────┐
│   Vercel        │ ──────────────► │   Railway       │
│   (Next.js)     │                 │   (Strapi)      │
│   Port 3000     │                 │   Port 1337     │
└─────────────────┘                 └─────────────────┘
        │                                   │
        ▼                                   ▼
┌─────────────────┐                 ┌─────────────────┐
│   Appwrite      │                 │   PostgreSQL    │
│   (External)    │                 │   (Railway)     │
└───��─────────────┘                 └─────────────────┘
```

## Step 1: Deploy Strapi to Railway

### 1.1 Prepare Strapi for Railway

First, update the Strapi configuration for production:

**Update `kuer/config/database.ts`:**
```typescript
export default ({ env }) => {
  if (env('DATABASE_URL')) {
    // Railway PostgreSQL
    return {
      connection: {
        client: 'postgres',
        connection: {
          connectionString: env('DATABASE_URL'),
          ssl: env.bool('DATABASE_SSL', false) && {
            rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false),
          },
        },
        pool: {
          min: env.int('DATABASE_POOL_MIN', 2),
          max: env.int('DATABASE_POOL_MAX', 10),
        },
        acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
      },
    };
  }

  // Fallback to SQLite for development
  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: path.join(__dirname, '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };
};
```

**Update `kuer/config/server.ts`:**
```typescript
export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
```

### 1.2 Create Railway Deployment

1. **Create a new Railway project**
2. **Connect your GitHub repository**
3. **Add PostgreSQL database service**
4. **Configure environment variables:**

```bash
# Database (automatically provided by Railway)
DATABASE_URL=postgresql://...

# Strapi Configuration
APP_KEYS=your_app_keys_here
API_TOKEN_SALT=your_api_token_salt
ADMIN_JWT_SECRET=your_admin_jwt_secret
TRANSFER_TOKEN_SALT=your_transfer_token_salt
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key

# Server Configuration
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# CORS Configuration (add your Vercel domain)
FRONTEND_URL=https://your-vercel-app.vercel.app
```

5. **Set build and start commands:**
   - **Build Command**: `cd kuer && npm install && npm run build`
   - **Start Command**: `cd kuer && npm start`

6. **Deploy and note the Railway URL** (e.g., `https://your-app.railway.app`)

## Step 2: Deploy Next.js to Vercel

### 2.1 Configure Environment Variables in Vercel

In your Vercel dashboard, add these environment variables:

```bash
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_DB_ID=your_database_id
NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID=user_profiles
APPWRITE_API_KEY=your_api_key

# Strapi Configuration (use Railway URL)
NEXT_PUBLIC_STRAPI_URL=https://your-app.railway.app
NEXT_PUBLIC_STRAPI_API_TOKEN=your_strapi_token
STRAPI_API_TOKEN=your_strapi_token

# Collection IDs
NEXT_PUBLIC_APPWRITE_TOURNAMENTS_COLLECTION_ID=tournaments
NEXT_PUBLIC_APPWRITE_AWARDS_COLLECTION_ID=tournament_awards
NEXT_PUBLIC_APPWRITE_PARTICIPANTS_COLLECTION_ID=participants
NEXT_PUBLIC_APPWRITE_TOURNAMENT_REGISTRATIONS_COLLECTION_ID=tournament_registrations
NEXT_PUBLIC_APPWRITE_CALENDAR_COLLECTION_ID=calendar_events

# Build Configuration
SKIP_STRAPI_BUILD=true
```

### 2.2 Deploy to Vercel

1. **Connect your GitHub repository to Vercel**
2. **Vercel will automatically detect Next.js and use the correct build settings**
3. **The build will use `npm run build:vercel` which skips Strapi calls during build**

## Step 3: Configure CORS in Strapi

After both deployments are complete, update Strapi CORS settings:

**In Railway Strapi, update `kuer/config/middlewares.ts`:**
```typescript
export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https:'],
          'media-src': ["'self'", 'data:', 'blob:', 'https:'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'http://localhost:3000',
        'https://your-vercel-app.vercel.app', // Replace with your Vercel URL
        'https://*.vercel.app', // Allow all Vercel preview deployments
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

## Step 4: Test the Deployment

### 4.1 Verify Services

1. **Test Strapi**: Visit `https://your-app.railway.app/admin`
2. **Test Next.js**: Visit `https://your-vercel-app.vercel.app`
3. **Test API Connection**: Visit `https://your-vercel-app.vercel.app/api/health`

### 4.2 Health Check

The health check endpoint will show:
```json
{
  "status": "ok",
  "services": {
    "nextjs": { "status": "healthy" },
    "strapi": { "status": "healthy" },
    "appwrite": { "status": "configured" }
  }
}
```

## Step 5: Content Management

### 5.1 Access Strapi Admin

1. Visit `https://your-app.railway.app/admin`
2. Create an admin account
3. Start adding articles and content

### 5.2 Content Types

Ensure these content types exist in Strapi:
- **Articles** (for blog posts)
- **Categories** (for article categorization)
- **Media Library** (for images)

## Troubleshooting

### Common Issues

**1. CORS Errors**
- Ensure Vercel URL is added to Strapi CORS configuration
- Check that both HTTP and HTTPS are allowed if needed

**2. Build Failures on Vercel**
- Verify `SKIP_STRAPI_BUILD=true` is set in Vercel environment variables
- Check that all required environment variables are configured

**3. Database Connection Issues on Railway**
- Ensure PostgreSQL service is running
- Verify `DATABASE_URL` is automatically provided by Railway

**4. API Token Issues**
- Generate new API tokens in Strapi admin panel
- Ensure tokens have proper permissions

### Environment Variable Checklist

**Vercel Environment Variables:**
- [ ] `NEXT_PUBLIC_STRAPI_URL` (Railway URL)
- [ ] `NEXT_PUBLIC_STRAPI_API_TOKEN`
- [ ] `SKIP_STRAPI_BUILD=true`
- [ ] All Appwrite configuration variables
- [ ] All collection ID variables

**Railway Environment Variables:**
- [ ] `DATABASE_URL` (auto-provided)
- [ ] `APP_KEYS`
- [ ] `API_TOKEN_SALT`
- [ ] `ADMIN_JWT_SECRET`
- [ ] `JWT_SECRET`
- [ ] `NODE_ENV=production`

## Monitoring and Maintenance

### 1. Monitoring
- **Vercel**: Built-in analytics and error tracking
- **Railway**: Built-in metrics and logs
- **Uptime**: Use services like UptimeRobot to monitor both URLs

### 2. Backups
- **Railway PostgreSQL**: Automatic backups included
- **Strapi Media**: Consider using cloud storage (AWS S3, Cloudinary)

### 3. Updates
- **Next.js**: Deploy via Git push to main branch
- **Strapi**: Deploy via Git push, Railway will rebuild automatically

## Performance Optimization

### 1. Caching
- **Vercel**: Automatic edge caching for static content
- **Railway**: Configure Redis for Strapi caching if needed

### 2. CDN
- **Images**: Use Vercel's built-in image optimization
- **Media**: Consider moving Strapi uploads to cloud storage

### 3. Database
- **Railway**: Monitor database performance and upgrade plan if needed
- **Indexes**: Add database indexes for frequently queried fields

## Security Best Practices

1. **Environment Variables**: Never commit secrets to Git
2. **API Tokens**: Rotate tokens regularly
3. **CORS**: Only allow necessary origins
4. **HTTPS**: Ensure all communication is encrypted
5. **Database**: Use strong passwords and connection encryption

This deployment strategy provides better scalability, reliability, and separation of concerns compared to running both services on a single server.