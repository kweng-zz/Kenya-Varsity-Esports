# Railway Strapi Deployment Guide

## Prerequisites
1. Railway account (https://railway.app)
2. GitHub repository with your Strapi code
3. PostgreSQL database (Railway provides this)

## Step 1: Create Railway Project

1. Go to https://railway.app and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository and select the `kuer` folder as the root directory

## Step 2: Add PostgreSQL Database

1. In your Railway project dashboard, click "New Service"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create a PostgreSQL database and provide connection details

## Step 3: Configure Environment Variables

In your Railway Strapi service, add these environment variables:

### Required Variables:
```
NODE_ENV=production
HOST=0.0.0.0
PORT=$PORT

# Strapi Secrets (use the ones from your .env file or generate new ones)
APP_KEYS=edDDb2HrsnM3aDoqFCLGiw==,jp5EbpnZbGG4oXc0T+fwzA==,UABeuJmeF4rRhbyWUsBl5g==,vd8xTqyVb6CR3CbN81qRpg==
API_TOKEN_SALT=22lcOS3BuG0Ew3t9COVi8Q==
ADMIN_JWT_SECRET=vc6ojK50UTqjxpzMRQCMhQ==
TRANSFER_TOKEN_SALT=mLHODZchIDazS2FgU6QhrA==
ENCRYPTION_KEY=e1TVXrJztyDgzeTtUDnMXQ==
JWT_SECRET=yi/Pz8/Kxd2BYFNxOiG1XA==

# Database (Railway will auto-populate these from PostgreSQL service)
DATABASE_CLIENT=postgres
DATABASE_URL=${{Postgres.DATABASE_URL}}
DATABASE_HOST=${{Postgres.PGHOST}}
DATABASE_PORT=${{Postgres.PGPORT}}
DATABASE_NAME=${{Postgres.PGDATABASE}}
DATABASE_USERNAME=${{Postgres.PGUSER}}
DATABASE_PASSWORD=${{Postgres.PGPASSWORD}}
DATABASE_SSL=true
```

## Step 4: Deploy

1. Railway will automatically deploy when you push to your main branch
2. The build process will:
   - Install dependencies (`npm ci`)
   - Build Strapi (`npm run build`)
   - Start the server (`npm run start`)

## Step 5: Access Your Strapi Admin

1. Once deployed, Railway will provide a public URL (e.g., `https://your-app.railway.app`)
2. Access the admin panel at: `https://your-app.railway.app/admin`
3. Create your first admin user

## Step 6: Update Frontend Environment Variables

Update your Next.js app's environment variables to point to your Railway Strapi URL:

```env
# In your Next.js .env.local or Vercel environment variables
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-app.railway.app
STRAPI_API_TOKEN=your-api-token-from-strapi-admin
```

## Troubleshooting

### Build Fails
- Check the build logs in Railway dashboard
- Ensure all environment variables are set correctly
- Verify your `package.json` scripts are correct

### Database Connection Issues
- Ensure PostgreSQL service is running
- Check that database environment variables are properly linked
- Verify SSL is enabled for production database

### Admin Panel Not Accessible
- Check if the service is running (green status in Railway)
- Verify the health check path is correct (`/admin`)
- Check the logs for any startup errors

## Security Notes

1. **Generate New Secrets**: For production, generate new APP_KEYS, JWT_SECRET, etc.
2. **API Tokens**: Create API tokens in Strapi admin for your frontend to use
3. **CORS**: Configure CORS settings in Strapi for your frontend domain
4. **SSL**: Railway automatically provides SSL certificates

## Monitoring

- Use Railway's built-in metrics and logs
- Set up health checks and alerts
- Monitor database usage and performance

## Scaling

Railway automatically handles scaling, but you can:
- Upgrade to higher-tier plans for more resources
- Monitor memory and CPU usage
- Optimize database queries and indexes