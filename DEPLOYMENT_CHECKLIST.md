# Deployment Checklist for Esports Platform

## 🎯 Quick Deployment Strategy

Since your blog functionality depends on Strapi, here's the recommended deployment approach:

### Phase 1: Deploy Strapi Backend (5-10 minutes)

1. **Prepare Strapi for deployment**:
   ```bash
   npm run setup:strapi-deploy
   ```

2. **Deploy Strapi on Railway** (Recommended - Free tier):
   - Go to [Railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "Deploy from GitHub repo"
   - Select your `kuer-backend` repository
   - Railway will auto-detect it's a Node.js app
   - Add these environment variables in Railway dashboard:
     ```
     NODE_ENV=production
     STRAPI_API_TOKEN=your-secure-token-123
     JWT_SECRET=your-jwt-secret-456
     ADMIN_JWT_SECRET=your-admin-jwt-secret-789
     APP_KEYS=key1,key2,key3,key4
     ```
   - Deploy! 🚀

3. **Get your Strapi URL**:
   - Railway will provide a URL like: `https://your-app-name.railway.app`

### Phase 2: Deploy Next.js Frontend on Vercel (2-3 minutes)

1. **Update environment variables in Vercel**:
   ```env
   NEXT_PUBLIC_STRAPI_URL=https://your-app-name.railway.app
   STRAPI_API_TOKEN=your-secure-token-123
   NEXT_PUBLIC_APPWRITE_ENDPOINT=your-appwrite-endpoint
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_APPWRITE_DB_ID=your-database-id
   ```

2. **Deploy on Vercel**:
   - Your Next.js app should now deploy successfully
   - The build command will only build Next.js (not Strapi)

### Phase 3: Configure Strapi (5 minutes)

1. **Access Strapi Admin**:
   - Go to `https://your-app-name.railway.app/admin`
   - Create your admin account

2. **Configure API Permissions**:
   - Go to Settings → Roles → Public
   - Enable `find` and `findOne` for Articles
   - Save

3. **Generate API Token**:
   - Go to Settings → API Tokens
   - Create new token with `Read-only` access
   - Copy the token and update your Vercel environment variables

## 🚀 Alternative: One-Click Deploy

If you prefer a simpler approach, you can use these one-click deploy buttons:

### Deploy Strapi on Railway:
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

### Deploy Next.js on Vercel:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

## 🔧 Environment Variables Reference

### Strapi Backend (Railway):
```env
NODE_ENV=production
DATABASE_URL=<auto-provided-by-railway>
STRAPI_API_TOKEN=<generate-secure-token>
JWT_SECRET=<generate-secure-secret>
ADMIN_JWT_SECRET=<generate-secure-secret>
APP_KEYS=<generate-4-secure-keys>
HOST=0.0.0.0
PORT=<auto-provided-by-railway>
```

### Next.js Frontend (Vercel):
```env
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-app.railway.app
STRAPI_API_TOKEN=<same-as-backend>
NEXT_PUBLIC_APPWRITE_ENDPOINT=<your-appwrite-endpoint>
NEXT_PUBLIC_APPWRITE_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_APPWRITE_DB_ID=<your-database-id>
```

## ✅ Post-Deployment Checklist

- [ ] Strapi admin panel accessible
- [ ] API permissions configured
- [ ] API token generated and added to Vercel
- [ ] Next.js app deployed successfully
- [ ] Blog pages loading correctly
- [ ] Admin blog management working
- [ ] Tournament system functional
- [ ] Ticket system operational

## 🆘 Troubleshooting

### Common Issues:

1. **"Strapi connection failed"**:
   - Check `NEXT_PUBLIC_STRAPI_URL` in Vercel
   - Ensure Strapi is deployed and running
   - Verify API permissions in Strapi admin

2. **"API Token invalid"**:
   - Generate new API token in Strapi admin
   - Update `STRAPI_API_TOKEN` in Vercel

3. **"Database connection failed"**:
   - Railway auto-provides PostgreSQL
   - Check DATABASE_URL in Railway dashboard

## 📞 Need Help?

If you encounter any issues:
1. Check the deployment logs in Railway/Vercel
2. Verify all environment variables are set correctly
3. Test API endpoints manually: `https://your-strapi-url.railway.app/api/articles`

## 🎉 Success!

Once deployed, your platform will have:
- ✅ Fully functional blog system
- ✅ Admin blog management
- ✅ Tournament system
- ✅ Support ticket system
- ✅ User authentication
- ✅ Real-time notifications

Your esports platform is ready for production! 🚀