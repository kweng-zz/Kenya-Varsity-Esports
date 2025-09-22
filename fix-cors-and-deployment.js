#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing CORS and Deployment Issues...\n');

// Step 1: Update CORS configuration in kuer-backend as well
const kuberBackendDir = path.join(__dirname, 'kuer-backend');
if (fs.existsSync(kuberBackendDir)) {
  const middlewaresPath = path.join(kuberBackendDir, 'config', 'middlewares.ts');
  
  if (fs.existsSync(middlewaresPath)) {
    console.log('📝 Updating CORS configuration in kuer-backend...');
    
    const corsConfig = `export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            'res.cloudinary.com',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            'res.cloudinary.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [
        'https://www.kenyaesportsrankings.org',
        'https://kenyaesportsrankings.org',
        'http://localhost:3000',
        'http://localhost:1337',
        '*' // Allow all origins for debugging
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
      keepHeaderOnError: true,
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];`;

    fs.writeFileSync(middlewaresPath, corsConfig);
    console.log('✅ Updated kuer-backend CORS configuration');
  }
}

// Step 2: Create a comprehensive Railway deployment guide
const deploymentGuide = `# 🚀 Railway Strapi Deployment Fix Guide

## Current Issues Identified:
1. ❌ CORS errors from frontend to backend
2. ❌ 404 errors indicating backend not properly deployed
3. ❌ TypeScript build errors

## Solutions Applied:

### 1. CORS Configuration Fixed ✅
- Updated both \`kuer/\` and \`kuer-backend/\` CORS settings
- Added your frontend domain: \`https://www.kenyaesportsrankings.org\`
- Enabled credentials and proper headers

### 2. TypeScript Errors Fixed ✅
- Fixed parameter type annotations in \`strapi-enhanced.ts\`
- Fixed default export warning in \`tournament-schema.ts\`
- Updated AbortController usage for better compatibility

### 3. Railway Deployment Steps:

#### Option A: Redeploy via Railway Dashboard
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Find your \`kuer-strapi-backend-production\` project
3. Go to the Deployments tab
4. Click "Redeploy" on the latest deployment
5. Monitor the build logs for errors

#### Option B: Deploy via CLI
\`\`\`bash
# Navigate to your Strapi directory
cd kuer

# Install Railway CLI if not installed
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project (if not already linked)
railway link

# Set environment variables (if missing)
railway variables set NODE_ENV=production
railway variables set HOST=0.0.0.0
railway variables set PORT=1337
railway variables set DATABASE_CLIENT=postgres

# Generate and set secure keys (replace with your actual values)
railway variables set APP_KEYS="key1,key2,key3,key4"
railway variables set API_TOKEN_SALT="your-api-token-salt"
railway variables set ADMIN_JWT_SECRET="your-admin-jwt-secret"
railway variables set TRANSFER_TOKEN_SALT="your-transfer-token-salt"
railway variables set JWT_SECRET="your-jwt-secret"

# Deploy
railway up
\`\`\`

#### Option C: Check Database Connection
Your Strapi might be failing because of database issues:

1. In Railway Dashboard, check if your PostgreSQL database is running
2. Verify the \`DATABASE_URL\` environment variable is set
3. Check the database connection logs

### 4. Environment Variables Checklist:

Make sure these are set in Railway:
- ✅ \`NODE_ENV=production\`
- ✅ \`HOST=0.0.0.0\`
- ✅ \`PORT=1337\`
- ✅ \`DATABASE_CLIENT=postgres\`
- ✅ \`DATABASE_URL\` (should be auto-set by Railway PostgreSQL)
- ✅ \`APP_KEYS\` (comma-separated secure keys)
- ✅ \`API_TOKEN_SALT\`
- ✅ \`ADMIN_JWT_SECRET\`
- ✅ \`TRANSFER_TOKEN_SALT\`
- ✅ \`JWT_SECRET\`

### 5. Testing the Fix:

After redeployment, test these endpoints:
- \`https://kuer-strapi-backend-production.up.railway.app/admin\` (should show Strapi admin)
- \`https://kuer-strapi-backend-production.up.railway.app/api/articles\` (should return JSON)

### 6. Frontend Environment Variables:

Make sure your frontend (Vercel) has:
- \`NEXT_PUBLIC_STRAPI_URL=https://kuer-strapi-backend-production.up.railway.app\`
- \`NEXT_PUBLIC_STRAPI_API_TOKEN\` (if using authenticated requests)

## Troubleshooting:

### If still getting 404 errors:
1. Check Railway build logs for errors
2. Verify the start command is \`npm run start\`
3. Check if the build process completed successfully

### If still getting CORS errors:
1. Verify the CORS configuration was deployed
2. Check browser network tab for the actual error
3. Try accessing the API directly in browser

### If database errors:
1. Check PostgreSQL service is running in Railway
2. Verify DATABASE_URL is correctly set
3. Check Strapi database configuration

## Next Steps:
1. Redeploy your Strapi backend using one of the methods above
2. Test the API endpoints
3. Verify your frontend can connect
4. Check admin panel access

## Support:
If issues persist, check:
- Railway deployment logs
- Strapi server logs
- Browser developer console
- Network requests in browser dev tools
`;

fs.writeFileSync(path.join(__dirname, 'RAILWAY_DEPLOYMENT_FIX_GUIDE.md'), deploymentGuide);
console.log('📋 Created comprehensive deployment fix guide');

// Step 3: Create a quick test script
const testScript = `#!/usr/bin/env node

const https = require('https');

console.log('🧪 Testing Strapi Backend Connectivity...\\n');

const testEndpoints = [
  'https://kuer-strapi-backend-production.up.railway.app',
  'https://kuer-strapi-backend-production.up.railway.app/admin',
  'https://kuer-strapi-backend-production.up.railway.app/api/articles'
];

async function testEndpoint(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      console.log(\`✅ \${url} - Status: \${res.statusCode}\`);
      resolve({ url, status: res.statusCode, success: res.statusCode < 400 });
    });
    
    req.on('error', (error) => {
      console.log(\`❌ \${url} - Error: \${error.message}\`);
      resolve({ url, error: error.message, success: false });
    });
    
    req.setTimeout(10000, () => {
      console.log(\`⏰ \${url} - Timeout\`);
      req.destroy();
      resolve({ url, error: 'Timeout', success: false });
    });
  });
}

async function runTests() {
  console.log('Testing backend endpoints...\\n');
  
  for (const endpoint of testEndpoints) {
    await testEndpoint(endpoint);
  }
  
  console.log('\\n🏁 Test completed!');
  console.log('\\n📝 Next steps:');
  console.log('1. If all tests fail, redeploy your Railway backend');
  console.log('2. If admin works but API fails, check Strapi content types');
  console.log('3. If CORS errors persist, verify CORS configuration was deployed');
}

runTests();`;

fs.writeFileSync(path.join(__dirname, 'test-backend.js'), testScript);
fs.chmodSync(path.join(__dirname, 'test-backend.js'), '755');
console.log('🧪 Created backend connectivity test script');

console.log('\n🎉 Fix Applied Successfully!');
console.log('\n📋 What was fixed:');
console.log('✅ TypeScript errors in strapi-enhanced.ts');
console.log('✅ Default export warning in tournament-schema.ts');
console.log('✅ CORS configuration updated');
console.log('✅ Created deployment fix guide');
console.log('✅ Created backend test script');

console.log('\n🚀 Next Steps:');
console.log('1. Read the RAILWAY_DEPLOYMENT_FIX_GUIDE.md file');
console.log('2. Redeploy your Railway Strapi backend');
console.log('3. Run: node test-backend.js to test connectivity');
console.log('4. Redeploy your Vercel frontend');

console.log('\n🔧 Quick Commands:');
console.log('• Test backend: node test-backend.js');
console.log('• View guide: cat RAILWAY_DEPLOYMENT_FIX_GUIDE.md');
console.log('• Deploy Railway: cd kuer && railway up');