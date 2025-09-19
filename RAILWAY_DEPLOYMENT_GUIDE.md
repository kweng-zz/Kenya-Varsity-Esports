# Deploy Strapi to Railway - Step by Step Guide

## Prerequisites
- GitHub account
- Railway account (free tier available)
- Your Strapi code ready for deployment

## Step 1: Prepare Strapi for Production

### 1.1 Update Strapi package.json for PostgreSQL
First, we need to add PostgreSQL support to your Strapi backend:

```bash
cd kuer
npm install pg
```

### 1.2 Create Production Environment File
Create a `.env.production` file in your `kuer` directory:

```env
NODE_ENV=production
DATABASE_CLIENT=postgres
HOST=0.0.0.0
PORT=1337
```

### 1.3 Update Database Configuration (Already Done ✅)
Your `config/database.js` is already configured for PostgreSQL in production!

## Step 2: Create Separate Repository for Strapi

### 2.1 Create New Directory
```bash
# Navigate to parent directory
cd ..
mkdir kuer-backend
```

### 2.2 Copy Strapi Files
```bash
# Copy all Strapi files to new directory
cp -r kuer/* kuer-backend/
cd kuer-backend
```

### 2.3 Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial Strapi backend for Railway deployment"
```

### 2.4 Create GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click "New repository"
3. Name it `kuer-backend` (or any name you prefer)
4. Make it public or private
5. Don't initialize with README (we already have files)
6. Click "Create repository"

### 2.5 Push to GitHub
```bash
# Replace with your actual GitHub repository URL
git remote add origin https://github.com/YOUR_USERNAME/kuer-backend.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Railway

### 3.1 Sign Up for Railway
1. Go to [railway.app](https://railway.app)
2. Click "Login" → "Login with GitHub"
3. Authorize Railway to access your GitHub account

### 3.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `kuer-backend` repository
4. Click "Deploy Now"

### 3.3 Add PostgreSQL Database
1. In your Railway project dashboard, click "New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically create a PostgreSQL database
4. The `DATABASE_URL` will be automatically set

### 3.4 Configure Environment Variables
In your Railway project dashboard, go to your Strapi service and add these environment variables:

**Required Variables:**
```
NODE_ENV=production
DATABASE_CLIENT=postgres
HOST=0.0.0.0
# NOTE: For Railway, do NOT set PORT - it's provided automatically
# For local development only: PORT=1337
```

**Security Variables (Generate these):**
```
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret
```

**Optional Variables:**
```
STRAPI_ADMIN_BACKEND_URL=https://your-app-name.railway.app
```

## Step 4: Generate Security Keys

Run these commands locally to generate secure keys:

```bash
# Generate APP_KEYS (run 4 times, comma-separate them)
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"

# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# Generate ADMIN_JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# Generate API_TOKEN_SALT
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"

# Generate TRANSFER_TOKEN_SALT
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
```

Copy these generated values into your Railway environment variables.

## Step 5: Deploy and Test

### 5.1 Trigger Deployment
1. Railway should automatically deploy when you push to GitHub
2. If not, click "Deploy" in your Railway dashboard
3. Watch the build logs for any errors

### 5.2 Get Your Strapi URL
1. In Railway dashboard, go to your Strapi service
2. Click "Settings" → "Domains"
3. Copy the generated URL (e.g., `https://your-app-name.railway.app`)

### 5.3 Test Your Deployment
1. Visit `https://your-app-name.railway.app/admin`
2. Create your admin account
3. Test the API endpoints

## Step 6: Update Your Next.js Frontend

### 6.1 Update Environment Variables in Vercel
Go to your Vercel project settings and update:

```
NEXT_PUBLIC_STRAPI_URL=https://your-app-name.railway.app
STRAPI_API_TOKEN=your-generated-api-token
NEXT_PUBLIC_STRAPI_API_TOKEN=your-generated-api-token
```

### 6.2 Generate API Token in Strapi Admin
1. Go to `https://your-app-name.railway.app/admin`
2. Navigate to Settings → API Tokens
3. Create a new token with appropriate permissions
4. Copy the token and update your Vercel environment variables

## Troubleshooting

### Build Fails
- Check Railway build logs
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Database Connection Issues
- Ensure PostgreSQL service is running in Railway
- Check `DATABASE_URL` environment variable is set
- Verify database configuration in `config/database.js`

### Admin Panel Not Accessible
- Check if `STRAPI_ADMIN_BACKEND_URL` is set correctly
- Verify admin build completed successfully
- Check for CORS issues

## Cost Considerations

**Railway Free Tier:**
- $5 credit per month
- Enough for small to medium applications
- Automatic scaling

**Upgrade if needed:**
- Pay-as-you-go pricing
- More resources and features

## Final Checklist

- [ ] Strapi repository created and pushed to GitHub
- [ ] Railway project created and connected to GitHub
- [ ] PostgreSQL database added
- [ ] All environment variables configured
- [ ] Security keys generated and set
- [ ] Deployment successful
- [ ] Admin panel accessible
- [ ] API endpoints working
- [ ] Frontend environment variables updated
- [ ] API token generated and configured

Your Strapi backend should now be running on Railway! 🚀