#!/usr/bin/env node

/**
 * Deploy Production Strapi Backend
 * 
 * This script helps you deploy your Strapi backend to production
 * and configure it properly for your Next.js frontend.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Production Strapi Deployment Guide\n');

// Check current configuration
function analyzeCurrentSetup() {
  console.log('📋 Current Setup Analysis:');
  console.log('==========================');
  
  const strapiDir = path.join(__dirname, 'kuer');
  const packageJsonPath = path.join(strapiDir, 'package.json');
  
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    console.log('✅ Strapi installation found');
    console.log(`   Version: ${packageJson.dependencies['@strapi/strapi']}`);
    console.log(`   Directory: ./kuer`);
  } else {
    console.log('❌ Strapi installation not found');
    return false;
  }
  
  // Check for Railway configuration
  const railwayConfigPath = path.join(strapiDir, 'railway.json');
  if (fs.existsSync(railwayConfigPath)) {
    console.log('✅ Railway configuration found');
  } else {
    console.log('⚠️  No Railway configuration found');
  }
  
  console.log('');
  return true;
}

// Create Railway deployment configuration for Strapi
function createRailwayConfig() {
  console.log('🔧 Creating Railway Configuration for Strapi...');
  
  const railwayConfig = {
    "$schema": "https://railway.app/railway.schema.json",
    "build": {
      "builder": "NIXPACKS"
    },
    "deploy": {
      "startCommand": "npm run start",
      "healthcheckPath": "/admin",
      "healthcheckTimeout": 300,
      "restartPolicyType": "ON_FAILURE",
      "restartPolicyMaxRetries": 10
    }
  };
  
  const configPath = path.join(__dirname, 'kuer', 'railway.json');
  fs.writeFileSync(configPath, JSON.stringify(railwayConfig, null, 2));
  console.log('✅ Created railway.json for Strapi');
}

// Create environment template for production Strapi
function createProductionEnvTemplate() {
  console.log('🔧 Creating Production Environment Template...');
  
  const envTemplate = `# Production Strapi Environment Variables
# Copy these to your Railway project settings

# Database (Railway will auto-provide DATABASE_URL)
DATABASE_URL=\${DATABASE_URL}

# App Keys (Generate new ones for production)
APP_KEYS=\${APP_KEYS}
API_TOKEN_SALT=\${API_TOKEN_SALT}
ADMIN_JWT_SECRET=\${ADMIN_JWT_SECRET}
TRANSFER_TOKEN_SALT=\${TRANSFER_TOKEN_SALT}
JWT_SECRET=\${JWT_SECRET}

# Server Configuration
HOST=0.0.0.0
PORT=\${PORT}
NODE_ENV=production

# Frontend URL (Your Vercel deployment)
FRONTEND_URL=https://your-frontend-app.vercel.app

# Admin Panel Configuration
SERVE_ADMIN_PANEL=true
STRAPI_ADMIN_BACKEND_URL=\${RAILWAY_STATIC_URL}

# CORS Configuration
STRAPI_CORS_ENABLED=true
STRAPI_CORS_ORIGIN=https://your-frontend-app.vercel.app

# File Upload Configuration
STRAPI_UPLOAD_PROVIDER=local
STRAPI_UPLOAD_SIZE_LIMIT=50000000

# Telemetry
STRAPI_TELEMETRY_DISABLED=true
`;

  const templatePath = path.join(__dirname, 'kuer', '.env.production.template');
  fs.writeFileSync(templatePath, envTemplate);
  console.log('✅ Created .env.production.template');
}

// Create deployment script
function createDeploymentScript() {
  console.log('🔧 Creating Deployment Script...');
  
  const deployScript = `#!/bin/bash

# Production Strapi Deployment Script
echo "🚀 Deploying Strapi to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
    echo "✅ Railway CLI installed"
fi

# Navigate to Strapi directory
cd kuer

echo "📋 Deployment Steps:"
echo "1. Login to Railway"
echo "2. Create new project for Strapi"
echo "3. Add PostgreSQL database"
echo "4. Deploy Strapi"
echo "5. Configure environment variables"

echo ""
echo "🔧 Run these commands manually:"
echo "cd kuer"
echo "railway login"
echo "railway new"
echo "railway add postgresql"
echo "railway up"

echo ""
echo "📝 After deployment:"
echo "1. Copy environment variables from .env.production.template"
echo "2. Set them in Railway dashboard"
echo "3. Update your frontend .env with the new Strapi URL"
echo "4. Test the connection"
`;

  const scriptPath = path.join(__dirname, 'deploy-strapi.sh');
  fs.writeFileSync(scriptPath, deployScript);
  
  // Make script executable on Unix systems
  try {
    fs.chmodSync(scriptPath, '755');
  } catch (error) {
    // Ignore on Windows
  }
  
  console.log('✅ Created deploy-strapi.sh');
}

// Generate secure keys for production
function generateSecureKeys() {
  console.log('🔐 Generating Secure Keys for Production...');
  
  function generateRandomKey(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  
  const keys = {
    APP_KEYS: [
      generateRandomKey(32),
      generateRandomKey(32),
      generateRandomKey(32),
      generateRandomKey(32)
    ].join(','),
    API_TOKEN_SALT: generateRandomKey(32),
    ADMIN_JWT_SECRET: generateRandomKey(32),
    TRANSFER_TOKEN_SALT: generateRandomKey(32),
    JWT_SECRET: generateRandomKey(32)
  };
  
  const keysContent = `# Generated Production Keys - KEEP SECURE!
# Copy these to your Railway environment variables

APP_KEYS=${keys.APP_KEYS}
API_TOKEN_SALT=${keys.API_TOKEN_SALT}
ADMIN_JWT_SECRET=${keys.ADMIN_JWT_SECRET}
TRANSFER_TOKEN_SALT=${keys.TRANSFER_TOKEN_SALT}
JWT_SECRET=${keys.JWT_SECRET}

# Additional Configuration
HOST=0.0.0.0
NODE_ENV=production
SERVE_ADMIN_PANEL=true
STRAPI_TELEMETRY_DISABLED=true
`;

  const keysPath = path.join(__dirname, 'production-keys.env');
  fs.writeFileSync(keysPath, keysContent);
  console.log('✅ Generated production-keys.env');
  console.log('⚠️  IMPORTANT: Keep these keys secure and private!');
}

// Provide step-by-step instructions
function provideInstructions() {
  console.log('\n🎯 Production Deployment Instructions:');
  console.log('=====================================\n');
  
  console.log('📋 STEP 1: Prepare Strapi for Production');
  console.log('1. Files created for you:');
  console.log('   - kuer/railway.json (Railway configuration)');
  console.log('   - kuer/.env.production.template (Environment template)');
  console.log('   - production-keys.env (Secure keys - KEEP PRIVATE!)');
  console.log('   - deploy-strapi.sh (Deployment script)');
  console.log('');
  
  console.log('🚀 STEP 2: Deploy to Railway');
  console.log('1. Open a new terminal and run:');
  console.log('   cd kuer');
  console.log('   railway login');
  console.log('   railway new  # Create NEW project for Strapi');
  console.log('   railway add postgresql  # Add database');
  console.log('   railway up  # Deploy Strapi');
  console.log('');
  
  console.log('🔧 STEP 3: Configure Environment Variables');
  console.log('1. Go to your Railway dashboard');
  console.log('2. Open the new Strapi project');
  console.log('3. Go to Variables tab');
  console.log('4. Copy all variables from production-keys.env');
  console.log('5. Add your frontend URL to FRONTEND_URL');
  console.log('');
  
  console.log('🔗 STEP 4: Update Frontend Configuration');
  console.log('1. Get your new Railway Strapi URL');
  console.log('2. Update your .env file:');
  console.log('   NEXT_PUBLIC_STRAPI_URL=https://your-new-strapi.railway.app');
  console.log('3. Update Vercel environment variables');
  console.log('4. Redeploy your frontend');
  console.log('');
  
  console.log('✅ STEP 5: Test Everything');
  console.log('1. Visit your new Strapi admin: https://your-new-strapi.railway.app/admin');
  console.log('2. Create an admin account');
  console.log('3. Add some test content');
  console.log('4. Check if it appears in your frontend');
  console.log('');
  
  console.log('🎉 SUCCESS INDICATORS:');
  console.log('- ✅ Strapi admin panel loads at your Railway URL');
  console.log('- ✅ You can create/edit content');
  console.log('- ✅ Frontend pulls content from production Strapi');
  console.log('- ✅ No more 404 errors');
}

// Main execution
function main() {
  if (!analyzeCurrentSetup()) {
    console.log('❌ Cannot proceed without Strapi installation');
    return;
  }
  
  createRailwayConfig();
  createProductionEnvTemplate();
  createDeploymentScript();
  generateSecureKeys();
  provideInstructions();
  
  console.log('\n🚨 IMPORTANT SECURITY NOTE:');
  console.log('The file "production-keys.env" contains sensitive keys.');
  console.log('Do NOT commit this file to version control!');
  console.log('Keep it secure and only use for Railway environment variables.');
}

main();