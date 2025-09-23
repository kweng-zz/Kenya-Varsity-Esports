# 🚀 KUER Deployment Guide

## Overview
Your KUER esports platform has two main components:
- **Frontend (Next.js)**: Deploys to Vercel
- **Backend (Strapi)**: Deploys to Render
- **Database**: Appwrite (already working) + PostgreSQL for Strapi

## 📋 Deployment Steps

### Step 1: Deploy Strapi Backend to Render

1. **Navigate to the Strapi deployment folder:**
   ```bash
   cd strapi-render-deploy
   ```

2. **Initialize Git repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial Strapi backend for Render"
   ```

3. **Create GitHub repository:**
   - Go to GitHub and create a new repository named `kuer-strapi-backend`
   - Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/kuer-strapi-backend.git
   git branch -M main
   git push -u origin main
   ```

4. **Deploy on Render:**
   - Go to [render.com](https://render.com)
   - Sign up/login (accepts regular credit/debit cards)
   - Click "New +" → "Blueprint"
   - Connect your `kuer-strapi-backend` repository
   - Render will automatically detect `render.yaml` and create:
     - PostgreSQL database (free tier)
     - Web service with auto-generated environment variables

5. **Set Environment Variables in Render:**
   Use these generated secure keys:
   ```
   APP_KEYS=ekyz8wRee9o8EOXa44E22da1fiN8eg7GFVcSCaqH/sM=,B115tU0GcpfuXIRW6cjVsSrbwRcH0au9g8NYaI88vaU=,pejj/sR9XQ66yeIlK0jRjNv/lkUqi6sDKjDKARqOytk=,+CDjgu+D2OGKSbF9UcRCwEDFBhMZa0nJ/OO0+dPNl3I=
   JWT_SECRET=qR7BoA/SRw+mLn3PaZC92wWxANZfKeNjUDAFZgBt7jA=
   ADMIN_JWT_SECRET=WBlpdbHJpthOsr65fgrsujwoE03+2d9lPxE+k5T3yoc=
   API_TOKEN_SALT=HuB7SMusFlTqz0HKAMFM88Q2mqiEUCCbC6HekUGiNHY=
   TRANSFER_TOKEN_SALT=TFPasYO1g3+emf9gL0Q9kS4zAcK4hgshxODoh2yIsps=
   NODE_ENV=production
   HOST=0.0.0.0
   PORT=10000
   ```

6. **After Deployment:**
   - Access admin panel: `https://your-app-name.onrender.com/admin`
   - Create your admin user
   - Set up content types and permissions
   - Generate API token for frontend

### Step 2: Deploy Frontend to Vercel

1. **Commit your frontend changes:**
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your main repository
   - Vercel auto-detects Next.js settings

3. **Set Environment Variables in Vercel:**
   ```
   NEXT_PUBLIC_STRAPI_URL=https://your-strapi-app.onrender.com
   STRAPI_API_TOKEN=your-generated-api-token
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_APPWRITE_DB_ID=your-database-id
   APPWRITE_API_KEY=your-api-key
   NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
   SKIP_STRAPI_BUILD=true
   ```

## 🔧 Configuration Files Created

### For Render (Strapi):
- ✅ `render.yaml` - Automatic deployment configuration
- ✅ `config/database.js` - PostgreSQL configuration
- ✅ `config/server.js` - Server configuration
- ✅ `config/middlewares.js` - CORS configuration
- ✅ `.env.example` - Environment variables template
- ✅ `generate-secrets.js` - Secure key generator

### For Vercel (Next.js):
- ✅ `vercel.json` - Vercel deployment configuration
- ✅ `next.config.ts` - Next.js configuration with image domains
- ✅ `.vercelignore` - Files to exclude from deployment
- ✅ Updated `package.json` scripts
- ✅ `.env.vercel.example` - Environment variables template

## 🚨 Important Notes

### Render Deployment:
- **Free Tier**: 750 hours/month (enough for most projects)
- **Database**: Free PostgreSQL with 1GB storage
- **Custom Domain**: Supported on free tier
- **Sleep Mode**: Apps sleep after 15 minutes of inactivity (free tier)

### Vercel Deployment:
- **Free Tier**: Unlimited personal projects
- **Automatic Deployments**: On every push to main branch
- **Preview Deployments**: For pull requests
- **Custom Domain**: Supported on free tier

### Security:
- ✅ All sensitive keys are generated securely
- ✅ CORS configured for your domains
- ✅ Environment variables encrypted
- ✅ HTTPS enabled by default

## 🔄 Workflow After Setup

1. **Content Updates**: Edit in Strapi admin panel
2. **Frontend Changes**: Push to GitHub → Auto-deploy to Vercel
3. **Backend Changes**: Push to strapi repo → Auto-deploy to Render

## 🆘 Troubleshooting

### Render Issues:
- Check build logs in Render dashboard
- Verify environment variables are set
- Ensure PostgreSQL connection is working

### Vercel Issues:
- Check build logs in Vercel dashboard
- Verify `NEXT_PUBLIC_STRAPI_URL` points to your Render app
- Ensure all environment variables are set

### CORS Issues:
- Update `config/middlewares.js` in Strapi
- Add your Vercel domain to allowed origins

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Strapi Docs**: https://docs.strapi.io
- **Next.js Docs**: https://nextjs.org/docs

---

## 🎯 Quick Checklist

- [ ] Strapi deployed to Render
- [ ] PostgreSQL database connected
- [ ] Strapi admin panel accessible
- [ ] API token generated
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set in Vercel
- [ ] Blog pages loading correctly
- [ ] CORS configured properly
- [ ] Custom domains configured (optional)

Your esports platform should now be fully deployed and functional! 🎉