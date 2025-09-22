# Railway Deployment Guide for Strapi Backend

## Quick Fix for Current Issue

Your Strapi deployment is failing because the `APP_KEYS` environment variable is missing. Here's how to fix it immediately:

### Step 1: Add Required Environment Variables

Go to your Railway project dashboard and add these environment variables:

```bash
# Essential Strapi Keys (generated securely)
APP_KEYS=50e4f592829260c9116cd367b4ab21a5d6230ed9525f5f391c147d37c6889b4df3163c6825f80b5a68e845383c76a4f543d3eed09214bfc48bdd960c0f429c425c5ba52bf36dd1e322588f8e831c7fd6a8d8fd42160fddb6eab11ac90a4c6406fc89f8d978d027b0cda19635317535c1db53732ac5dc204afd5b6e6c8d7c3d17

API_TOKEN_SALT=ad61338f9c4f5549d88ed1100cf1d58112e4b2e494ee03d595ed4f96b0007f64

ADMIN_JWT_SECRET=2b59738d18d391f8647cf080bac3ea33e5f8c45919fea9f99c740a7ba8e475a3

TRANSFER_TOKEN_SALT=bd1ce74a833c6b89da591011e7c680c78d7901e526a0b1b331cd75877418d4eb

JWT_SECRET=197576366db4b56d4f01611bafec680fdbe75eddc3abd83c54e82627ce499983

# Server Configuration
NODE_ENV=production
HOST=0.0.0.0
PORT=1337

# Database Configuration (add your Railway PostgreSQL URL)
DATABASE_URL=postgresql://username:password@host:port/database
DATABASE_SSL=true
```

### Step 2: Set Up PostgreSQL Database

1. In your Railway project, add a PostgreSQL service
2. Copy the connection string from the PostgreSQL service
3. Set it as the `DATABASE_URL` environment variable

### Step 3: Deploy

After adding all environment variables, trigger a new deployment. Your Strapi backend should now start successfully.

## Complete Railway Setup Instructions

### 1. Create Railway Project

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Create new project
railway new
```

### 2. Configure Services

#### Add PostgreSQL Database
- In Railway dashboard, click "Add Service"
- Select "PostgreSQL"
- Note the connection details

#### Configure Strapi Service
- Connect your GitHub repository
- Set the root directory to `/kuer` (your Strapi folder)
- Railway will automatically detect the nixpacks.toml configuration

### 3. Environment Variables Setup

Add all the environment variables listed in Step 1 above. You can do this via:

**Railway Dashboard:**
1. Go to your project
2. Click on your Strapi service
3. Go to "Variables" tab
4. Add each variable

**Railway CLI:**
```bash
railway variables set APP_KEYS="your-app-keys-here"
railway variables set API_TOKEN_SALT="your-api-token-salt"
# ... add all other variables
```

### 4. Domain Configuration

1. In Railway dashboard, go to your Strapi service
2. Click "Settings" → "Domains"
3. Generate a Railway domain or add your custom domain
4. Update your frontend to use the new backend URL

### 5. Health Check Configuration

The `railway.json` file is already configured with:
- Health check path: `/admin`
- Timeout: 300 seconds
- Restart policy: ON_FAILURE with max 10 retries

### 6. Build Configuration

The `nixpacks.toml` file configures:
- Node.js 18.x
- npm 9.x
- Production build process
- Proper start command

## Troubleshooting

### Common Issues

1. **App Keys Missing**: Ensure `APP_KEYS` is set with comma-separated values
2. **Database Connection**: Verify `DATABASE_URL` is correct and SSL is enabled
3. **Port Issues**: Railway automatically assigns PORT, but ensure HOST is `0.0.0.0`
4. **Build Failures**: Check that all dependencies are in package.json

### Logs and Debugging

```bash
# View logs via CLI
railway logs

# Follow logs in real-time
railway logs --follow
```

### Environment Variables Check

```bash
# List all variables
railway variables

# Check specific variable
railway variables get APP_KEYS
```

## Migration from Render

If you're migrating from Render:

1. Export your data from Render's PostgreSQL
2. Import to Railway's PostgreSQL
3. Update environment variables
4. Update frontend API endpoints
5. Test all functionality

## Security Notes

- The generated keys above are secure and unique
- Never commit environment variables to version control
- Rotate keys periodically for enhanced security
- Use Railway's built-in secrets management

## Next Steps

1. Add the environment variables listed above
2. Redeploy your service
3. Test the admin panel at `https://your-railway-domain.railway.app/admin`
4. Update your frontend to use the new Railway URL
5. Set up custom domain if needed

Your Strapi backend should now be running successfully on Railway!