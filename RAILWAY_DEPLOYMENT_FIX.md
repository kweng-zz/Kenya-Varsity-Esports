# Railway Deployment Fix Guide

## Issues Identified

Based on the error logs, the main issues were:

1. **Permission denied error**: `EACCES: permission denied, mkdir '/nonexistent'`
2. **Missing build directory**: `undefined directory not found. Please run the build command before starting your application`
3. **User creation issue**: The system user `strapi` was created with `/nonexistent` as home directory

## Solutions Applied

### 1. Fixed Dockerfile User Creation

**Problem**: The original Dockerfile used `adduser --system` which creates users with `/nonexistent` home directory.

**Solution**: Updated to use `useradd` with explicit home directory:

```dockerfile
# Create non-root user with proper home directory
RUN groupadd --system --gid 1001 strapi && \
    useradd --system --uid 1001 --gid strapi --home-dir /app --shell /bin/bash strapi
```

### 2. Generated Proper Environment Variables

**Problem**: The environment variables contained placeholder values like `your-admin-jwt-secret-here`.

**Solution**: Created `generate-production-secrets.js` script to generate proper cryptographic secrets:

- `ADMIN_JWT_SECRET`: Base64-encoded 32-byte secret
- `JWT_SECRET`: Base64-encoded 32-byte secret  
- `API_TOKEN_SALT`: Base64-encoded 32-byte secret
- `TRANSFER_TOKEN_SALT`: Base64-encoded 32-byte secret
- `APP_KEYS`: 4 comma-separated Base64-encoded 32-byte keys

### 3. Created Robust Entrypoint Script

**Problem**: The startup command didn't properly verify the build directory and environment.

**Solution**: Created `docker-entrypoint.sh` with:

- Build directory verification
- Environment variable validation
- Proper error handling and logging
- SQLite database directory creation

### 4. Updated Build Process

**Problem**: The build process wasn't properly verified.

**Solution**: Added build verification in Dockerfile:

```dockerfile
RUN npm run build && ls -la build/ || (echo "Build failed or build directory missing" && exit 1)
```

## Railway Deployment Steps

### 1. Environment Variables

Set these environment variables in Railway:

```bash
NODE_ENV=production
HOST=0.0.0.0
PORT=8080
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

Copy the generated secrets from `.env.production`:

```bash
ADMIN_JWT_SECRET=<generated-secret>
JWT_SECRET=<generated-secret>
API_TOKEN_SALT=<generated-secret>
TRANSFER_TOKEN_SALT=<generated-secret>
APP_KEYS=<generated-keys>
```

### 2. Railway Configuration

Ensure your `railway.json` is configured:

```json
{
  "build": {
    "builder": "dockerfile"
  },
  "deploy": {
    "healthcheckPath": "/admin",
    "healthcheckTimeout": 300,
    "restartPolicyType": "on_failure",
    "restartPolicyMaxRetries": 3
  }
}
```

### 3. Deployment Commands

```bash
# Build and test locally first
npm install
npm run build
npm run start

# Deploy to Railway
railway login
railway link
railway up
```

## Verification Steps

### 1. Local Testing

```bash
# Test the Docker build locally
docker build -t strapi-app .
docker run -p 8080:8080 --env-file .env.production strapi-app
```

### 2. Check Application Health

Once deployed, verify:

- Application starts without permission errors
- Build directory exists and is accessible
- Admin panel is accessible at `/admin`
- API endpoints respond correctly

### 3. Monitor Logs

Watch Railway logs for:

- ✅ "Starting Strapi application..."
- ✅ "Build directory found"
- ✅ "Environment variables are set"
- ✅ "Starting Strapi server..."

## Common Issues and Solutions

### Issue: "EACCES: permission denied"

**Cause**: User doesn't have proper home directory or permissions.

**Solution**: Ensure the Dockerfile creates the user with `/app` as home directory.

### Issue: "undefined directory not found"

**Cause**: Build directory missing or not accessible.

**Solution**: Verify the build process completes successfully and the `build/` directory exists.

### Issue: "Failed to load command"

**Cause**: Missing or invalid environment variables.

**Solution**: Ensure all required environment variables are set with proper values.

## Files Modified

1. `Dockerfile` - Fixed user creation and entrypoint
2. `.env.production` - Generated proper secrets
3. `docker-entrypoint.sh` - Created robust startup script
4. `generate-production-secrets.js` - Secret generation utility

## Next Steps

1. Test the deployment locally using Docker
2. Deploy to Railway with the updated configuration
3. Monitor the application startup logs
4. Verify admin panel accessibility
5. Test API endpoints

The deployment should now start successfully without the permission and build directory errors.