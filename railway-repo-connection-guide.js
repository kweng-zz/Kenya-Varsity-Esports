#!/usr/bin/env node

console.log('🔗 RAILWAY REPOSITORY CONNECTION GUIDE');
console.log('======================================\n');

console.log('📋 RAILWAY SETTINGS CONFIGURATION:');
console.log('==================================\n');

console.log('1. 📂 SOURCE SETTINGS:');
console.log('   • Connect to Repository: YES');
console.log('   • Repository: [Your GitHub repo URL]');
console.log('   • Branch: main (or your default branch)');
console.log('   • Root Directory: / (leave empty - deploy from root)');
console.log('   • Auto-Deploy: ON (recommended)\n');

console.log('2. 🏗️ BUILD SETTINGS:');
console.log('   • Builder: DOCKERFILE');
console.log('   • Dockerfile Path: Dockerfile');
console.log('   • Build Command: (leave empty - Docker handles this)');
console.log('   • Install Command: (leave empty - Docker handles this)\n');

console.log('3. 🚀 DEPLOY SETTINGS:');
console.log('   • Start Command: npm run start');
console.log('   • Port: 8080');
console.log('   • Health Check Path: /admin');
console.log('   • Health Check Timeout: 300 seconds');
console.log('   • Restart Policy: ON_FAILURE\n');

console.log('4. 🌍 ENVIRONMENT VARIABLES:');
console.log('   Required variables (9 total):');
console.log('   ✅ NODE_ENV=production');
console.log('   ✅ HOST=0.0.0.0');
console.log('   ✅ PORT=8080');
console.log('   ✅ DATABASE_URL=[PostgreSQL connection string]');
console.log('   ✅ APP_KEYS=[your generated keys]');
console.log('   ✅ API_TOKEN_SALT=[your generated salt]');
console.log('   ✅ ADMIN_JWT_SECRET=[your generated secret]');
console.log('   ✅ TRANSFER_TOKEN_SALT=[your generated salt]');
console.log('   ✅ JWT_SECRET=[your generated secret]\n');

console.log('5. 💾 DATABASE CONNECTION:');
console.log('   • Create PostgreSQL service in Railway');
console.log('   • Copy DATABASE_URL from PostgreSQL service');
console.log('   • Add DATABASE_URL to your Strapi service environment\n');

console.log('📝 STEP-BY-STEP SETUP:');
console.log('======================\n');

console.log('STEP 1: Repository Connection');
console.log('   1. In Railway dashboard, go to your service');
console.log('   2. Settings → Source');
console.log('   3. Click "Connect Repository"');
console.log('   4. Select your GitHub repository');
console.log('   5. Choose branch (usually "main")');
console.log('   6. Root Directory: leave EMPTY (deploy from root)');
console.log('   7. Enable Auto-Deploy\n');

console.log('STEP 2: Build Configuration');
console.log('   1. Settings → Build');
console.log('   2. Builder: DOCKERFILE');
console.log('   3. Dockerfile Path: Dockerfile');
console.log('   4. Leave other fields empty\n');

console.log('STEP 3: Deploy Configuration');
console.log('   1. Settings → Deploy');
console.log('   2. Start Command: npm run start');
console.log('   3. Health Check Path: /admin');
console.log('   4. Health Check Timeout: 300\n');

console.log('STEP 4: Environment Variables');
console.log('   1. Settings → Environment');
console.log('   2. Add all 9 environment variables listed above');
console.log('   3. Make sure DATABASE_URL is from your PostgreSQL service\n');

console.log('STEP 5: Deploy');
console.log('   1. Push your changes to GitHub');
console.log('   2. Railway will auto-deploy');
console.log('   3. Monitor deployment logs\n');

console.log('🚨 CRITICAL SETTINGS TO VERIFY:');
console.log('===============================');
console.log('❗ Root Directory: MUST be empty (/) to deploy from root');
console.log('❗ Builder: MUST be DOCKERFILE');
console.log('❗ Start Command: MUST be "npm run start"');
console.log('❗ Port: MUST be 8080');
console.log('❗ DATABASE_URL: MUST be complete PostgreSQL connection string\n');

console.log('🔍 COMMON MISTAKES TO AVOID:');
console.log('============================');
console.log('❌ Setting Root Directory to "kuer-backend" (wrong - files are now in root)');
console.log('❌ Using NIXPACKS builder instead of DOCKERFILE');
console.log('❌ Missing PORT=8080 environment variable');
console.log('❌ Incorrect DATABASE_URL format');
console.log('❌ Not having PostgreSQL service running\n');

console.log('✅ SUCCESS INDICATORS:');
console.log('======================');
console.log('After setup, you should see:');
console.log('   • Repository connected and showing latest commit');
console.log('   • Auto-deploy triggered on push');
console.log('   • Build logs showing successful Docker build');
console.log('   • Deploy logs showing Strapi starting');
console.log('   • Service status showing "Active"\n');

console.log('🔧 TROUBLESHOOTING:');
console.log('===================');
console.log('If deployment fails:');
console.log('   1. Check build logs for Docker build errors');
console.log('   2. Verify all environment variables are set');
console.log('   3. Ensure PostgreSQL service is running');
console.log('   4. Check deploy logs for Strapi startup errors');
console.log('   5. Verify repository connection and branch\n');

console.log('📞 NEED HELP WITH SPECIFIC SETTINGS?');
console.log('====================================');
console.log('Let me know which specific setting you need clarification on:');
console.log('   • Repository connection');
console.log('   • Build configuration');
console.log('   • Environment variables');
console.log('   • Database setup');
console.log('   • Deploy settings');