# Render Deployment Setup Guide

## 🚀 Quick Setup (5-10 minutes)

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (recommended)
3. Connect your GitHub repository

### Step 2: Deploy to Render
1. In Render dashboard, click "New +"
2. Select "Blueprint"
3. Connect your GitHub repo: `your-username/esports`
4. Render will automatically detect the `render.yaml` file
5. Click "Apply"

### Step 3: Configure Environment Variables
Render will create the services but you need to set these manually:

**For Strapi Service:**
- `DATABASE_URL`: Will be auto-provided by Render PostgreSQL
- `STRAPI_API_TOKEN`: Generate a new token in Strapi admin

**For Frontend Service:**
- `STRAPI_API_TOKEN`: Same as above
- `NEXT_PUBLIC_STRAPI_URL`: Will be `https://kuer-strapi.onrender.com`

### Step 4: Test Deployment
1. Wait for both services to deploy (5-10 minutes)
2. Visit your Strapi admin: `https://kuer-strapi.onrender.com/admin`
3. Create admin account and generate API token
4. Update frontend environment variables with the token
5. Visit your app: `https://kuer.onrender.com`

## 🔄 Environment Switching

### Switch to Render
```bash
npm run switch-env render
npm run dev
```

### Switch back to Railway
```bash
npm run switch-env railway
npm run dev
```

### Switch to Local Development
```bash
npm run switch-env local
npm run dev
```

## 🚨 Emergency Deployment

If Railway is down and you need to deploy urgently:

```bash
# Switch to Render environment
npm run switch-env render

# Deploy to Render
npm run deploy:render
```

## 📊 Comparison: Railway vs Render

| Feature | Railway | Render |
|---------|---------|---------|
| **Deployment Speed** | Fast (2-3 min) | Medium (5-10 min) |
| **Free Tier** | $5/month credit | Free tier available |
| **Database** | PostgreSQL included | PostgreSQL included |
| **Custom Domains** | ✅ Easy | ✅ Easy |
| **Build Logs** | ✅ Excellent | ✅ Good |
| **Reliability** | ⚠️ Sometimes issues | ✅ Very reliable |

## 🎯 Recommended Strategy

1. **Primary**: Use Railway for main production
2. **Backup**: Keep Render as backup/staging
3. **Development**: Use local environment
4. **Emergency**: Switch to Render if Railway has issues

## 🔧 Troubleshooting

### If Render deployment fails:
1. Check build logs in Render dashboard
2. Ensure all environment variables are set
3. Verify `render.yaml` configuration
4. Check database connection

### If environment switching fails:
1. Ensure `.env.railway` and `.env.render` files exist
2. Check file permissions
3. Manually copy environment files if needed

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **Status Page**: https://status.render.com