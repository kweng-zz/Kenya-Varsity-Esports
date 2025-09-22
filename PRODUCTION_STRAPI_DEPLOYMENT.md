# Production Strapi Deployment - Complete Guide

## 🎯 **The Problem**
Your current Railway URL `https://kuer-strapi-backend-production.up.railway.app` is serving your Next.js frontend instead of Strapi. You need a separate Railway service for your Strapi backend.

## 🚀 **Solution: Deploy Strapi as Separate Service**

### **STEP 1: Deploy New Strapi Service**

Open a **new terminal** (keep your local Strapi running) and run:

```bash
cd kuer
railway login
railway new
# When prompted, name it something like "kuer-strapi-backend"
railway add postgresql
railway up
```

### **STEP 2: Configure Environment Variables**

1. **Go to Railway Dashboard** → Your new Strapi project → **Variables**

2. **Copy these variables** from the generated `production-keys.env` file:
   ```bash
   APP_KEYS=your_generated_keys_here
   API_TOKEN_SALT=your_generated_salt_here
   ADMIN_JWT_SECRET=your_generated_secret_here
   TRANSFER_TOKEN_SALT=your_generated_salt_here
   JWT_SECRET=your_generated_secret_here
   ```

3. **Add these additional variables**:
   ```bash
   HOST=0.0.0.0
   NODE_ENV=production
   SERVE_ADMIN_PANEL=true
   STRAPI_TELEMETRY_DISABLED=true
   FRONTEND_URL=https://kenyaesportsrankings.org
   ```

### **STEP 3: Get Your New Strapi URL**

After deployment, Railway will give you a URL like:
`https://kuer-strapi-backend-abc123.railway.app`

### **STEP 4: Update Your Frontend**

1. **Update `.env` file**:
   ```bash
   NEXT_PUBLIC_STRAPI_URL=https://your-new-strapi-url.railway.app
   ```

2. **Update `.env.vercel` file**:
   ```bash
   NEXT_PUBLIC_STRAPI_URL=https://your-new-strapi-url.railway.app
   ```

3. **Update Vercel Dashboard**:
   - Go to Vercel → Your project → Settings → Environment Variables
   - Update `NEXT_PUBLIC_STRAPI_URL` with your new Railway URL

### **STEP 5: Test Your Production Strapi**

1. **Visit your new admin panel**:
   `https://your-new-strapi-url.railway.app/admin`

2. **Create admin account** (first time setup)

3. **Test API endpoint**:
   `https://your-new-strapi-url.railway.app/api/articles`
   Should return JSON, not HTML!

## 🔧 **API Token Configuration**

Since you mentioned API tokens, here's how to set them up in production:

### **In Your Production Strapi Admin Panel:**

1. Go to **Settings** → **API Tokens**
2. **Create New Token**:
   - Name: "Frontend API Token"
   - Token type: "Read-only" or "Full access"
   - Duration: "Unlimited"
3. **Copy the generated token**

### **Update Your Environment Variables:**

```bash
# In your .env and Vercel settings
NEXT_PUBLIC_STRAPI_API_TOKEN=your_new_production_token_here
STRAPI_API_TOKEN=your_new_production_token_here
```

## 📋 **Migration Checklist**

- [ ] Deploy new Strapi service to Railway
- [ ] Configure all environment variables
- [ ] Create admin account in production
- [ ] Generate new API tokens
- [ ] Update frontend environment variables
- [ ] Test API endpoints return JSON
- [ ] Test admin panel access
- [ ] Migrate existing content (if any)
- [ ] Update Vercel deployment
- [ ] Test frontend-backend connection

## 🎉 **Success Verification**

You'll know it's working when:

1. ✅ **Admin Panel**: `https://your-strapi.railway.app/admin` loads Strapi admin
2. ✅ **API Endpoint**: `https://your-strapi.railway.app/api/articles` returns JSON
3. ✅ **Frontend**: Your Next.js app pulls content from production Strapi
4. ✅ **No 404 Errors**: All API calls work properly

## 🚨 **Important Notes**

1. **Keep Local Strapi Running**: Use it for development and content creation
2. **Two Environments**: 
   - Local: `http://localhost:1337` (development)
   - Production: `https://your-strapi.railway.app` (live site)
3. **Security**: Never commit `production-keys.env` to version control
4. **Database**: Production uses PostgreSQL, local uses SQLite

## 🔄 **Workflow After Setup**

1. **Content Creation**: Use local Strapi admin for development
2. **Content Publishing**: Recreate content in production Strapi
3. **Development**: Test locally first
4. **Production**: Deploy changes to production Strapi

---

## 🚀 **Quick Start Commands**

```bash
# Deploy Strapi to Railway
cd kuer
railway login
railway new
railway add postgresql
railway up

# Then configure environment variables in Railway dashboard
# And update your frontend .env files
```

Your production Strapi admin will be available at:
**https://your-new-strapi-url.railway.app/admin**