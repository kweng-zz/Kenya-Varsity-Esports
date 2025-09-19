# Railway Deployment Instructions

## Prerequisites
1. Create a Railway account at https://railway.app
2. Install Railway CLI: `npm install -g @railway/cli`

## Deployment Steps

### 1. Create Railway Project
```bash
railway login
railway new
# Select "Empty Project"
```

### 2. Add PostgreSQL Database
```bash
railway add postgresql
```

### 3. Deploy Strapi
```bash
# From the root directory of your project
railway up
```

### 4. Configure Environment Variables
Copy the variables from `.env.railway.template` to your Railway project:
```bash
railway variables set APP_KEYS="key1,key2,key3,key4"
railway variables set API_TOKEN_SALT="your_salt_here"
# ... add all other variables
```

### 5. Generate Strapi Keys
Run this command to generate secure keys:
```bash
node generate-strapi-keys.js
```

### 6. Update Vercel Environment
Add the Railway URL to your Vercel environment variables:
```
NEXT_PUBLIC_STRAPI_URL=https://your-railway-app.railway.app
```

## Monitoring
- View logs: `railway logs`
- Open app: `railway open`
- Check status: `railway status`

## Database Management
- Connect to DB: `railway connect postgresql`
- View DB info: `railway variables`

## Troubleshooting
1. **Build fails**: Check that all dependencies are in package.json
2. **Database connection fails**: Verify DATABASE_URL is set automatically
3. **CORS errors**: Update FRONTEND_URL with your Vercel domain
4. **Admin panel not accessible**: Check that PORT is set to 1337
