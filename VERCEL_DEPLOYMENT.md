# Vercel Deployment Guide for KUER Frontend

## 🚀 Quick Deploy

### Prerequisites
1. ✅ Strapi backend deployed on Render
2. �� GitHub repository with your code
3. ✅ Vercel account

### Step 1: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js and configure build settings
5. Click "Deploy"

### Step 2: Configure Environment Variables
In your Vercel project dashboard:

1. Go to "Settings" → "Environment Variables"
2. Add these variables:

```
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-app.onrender.com
STRAPI_API_TOKEN=your-strapi-api-token
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DB_ID=your-database-id
APPWRITE_API_KEY=your-api-key
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
SKIP_STRAPI_BUILD=true
```

### Step 3: Update Build Settings (if needed)
- **Build Command**: `npm run build:vercel`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Step 4: Configure Custom Domain (Optional)
1. Go to "Settings" → "Domains"
2. Add your custom domain
3. Update DNS records as instructed

## 🔧 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify Node.js version compatibility

### CORS Issues
- Update your Strapi CORS configuration
- Add your Vercel domain to allowed origins

### Images Not Loading
- Check image domains in `next.config.ts`
- Verify Strapi media URLs are accessible

### API Calls Failing
- Verify `NEXT_PUBLIC_STRAPI_URL` is correct
- Check Strapi API token permissions
- Ensure Strapi is running and accessible

## 🔄 Automatic Deployments

Vercel automatically deploys when you push to your main branch:
1. Push changes to GitHub
2. Vercel detects changes
3. Builds and deploys automatically
4. Preview deployments for pull requests

## 📊 Monitoring

- **Analytics**: Enable Vercel Analytics in project settings
- **Logs**: Check function logs in Vercel dashboard
- **Performance**: Monitor Core Web Vitals

## 🔒 Security

- Environment variables are encrypted
- Automatic HTTPS
- DDoS protection included
- Edge caching for performance

## 📝 Notes

- Frontend deploys to Vercel
- Backend (Strapi) deploys to Render
- Database can be on Render (PostgreSQL)
- Media files served from Strapi/Render
