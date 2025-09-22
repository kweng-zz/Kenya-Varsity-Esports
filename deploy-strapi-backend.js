#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Deploying Strapi Backend to Railway...\n');

// Check if we're in the right directory
const backendPath = path.join(__dirname, 'kuer-backend');
if (!fs.existsSync(backendPath)) {
  console.error('❌ kuer-backend directory not found!');
  process.exit(1);
}

// Change to backend directory
process.chdir(backendPath);

console.log('📁 Current directory:', process.cwd());

// Check if railway.json exists
if (!fs.existsSync('railway.json')) {
  console.error('❌ railway.json not found in kuer-backend directory!');
  process.exit(1);
}

// Check if Dockerfile exists
if (!fs.existsSync('Dockerfile')) {
  console.error('❌ Dockerfile not found in kuer-backend directory!');
  process.exit(1);
}

console.log('✅ Configuration files found');

try {
  // Install Railway CLI if not installed
  console.log('🔧 Checking Railway CLI...');
  try {
    execSync('railway --version', { stdio: 'pipe' });
    console.log('✅ Railway CLI is installed');
  } catch (error) {
    console.log('📦 Installing Railway CLI...');
    execSync('npm install -g @railway/cli', { stdio: 'inherit' });
  }

  // Login to Railway (if not already logged in)
  console.log('🔐 Checking Railway authentication...');
  try {
    execSync('railway whoami', { stdio: 'pipe' });
    console.log('✅ Already logged in to Railway');
  } catch (error) {
    console.log('🔐 Please log in to Railway...');
    execSync('railway login', { stdio: 'inherit' });
  }

  // Deploy to Railway
  console.log('🚀 Deploying to Railway...');
  execSync('railway up', { stdio: 'inherit' });

  console.log('\n✅ Deployment completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Go to your Railway dashboard');
  console.log('2. Find your Strapi service');
  console.log('3. Set the custom domain to: kuer-strapi-backend-production.up.railway.app');
  console.log('4. Add environment variables if needed');
  console.log('5. Wait for the service to start');
  console.log('6. Access Strapi admin at: https://kuer-strapi-backend-production.up.railway.app/admin');

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}