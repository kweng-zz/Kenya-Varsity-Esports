#!/usr/bin/env node

/**
 * Fix Railway Environment Variables
 * 
 * Your Strapi deployment is failing because it's missing the JWT_SECRET
 * and other required environment variables.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Fixing Railway Environment Variables\n');

// Generate secure keys
function generateRandomKey(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

console.log('🔐 Generated Environment Variables for Railway:');
console.log('================================================\n');

const envVars = {
  // Required JWT Secret (this is what's causing the failure)
  JWT_SECRET: generateRandomKey(32),
  
  // Other required Strapi keys
  APP_KEYS: [
    generateRandomKey(32),
    generateRandomKey(32), 
    generateRandomKey(32),
    generateRandomKey(32)
  ].join(','),
  
  API_TOKEN_SALT: generateRandomKey(32),
  ADMIN_JWT_SECRET: generateRandomKey(32),
  TRANSFER_TOKEN_SALT: generateRandomKey(32),
  
  // Server configuration
  HOST: '0.0.0.0',
  NODE_ENV: 'production',
  SERVE_ADMIN_PANEL: 'true',
  STRAPI_TELEMETRY_DISABLED: 'true',
  
  // Frontend URL (update this with your actual frontend URL)
  FRONTEND_URL: 'https://kenyaesportsrankings.org'
};

console.log('📋 COPY THESE TO YOUR RAILWAY PROJECT:');
console.log('=====================================\n');

Object.entries(envVars).forEach(([key, value]) => {
  console.log(`${key}=${value}`);
});

console.log('\n🚀 HOW TO ADD THESE TO RAILWAY:');
console.log('===============================');
console.log('1. Go to your Railway dashboard');
console.log('2. Open your "respectful-kindness" project');
console.log('3. Click on the "Variables" tab');
console.log('4. Add each variable above (one by one)');
console.log('5. Railway will automatically redeploy');

console.log('\n⚡ QUICK RAILWAY CLI METHOD:');
console.log('============================');
console.log('If you prefer using CLI, run these commands:');
console.log('');

Object.entries(envVars).forEach(([key, value]) => {
  console.log(`railway variables set ${key}="${value}"`);
});

console.log('\n🎯 WHAT WILL HAPPEN NEXT:');
console.log('=========================');
console.log('1. Add the environment variables to Railway');
console.log('2. Railway will automatically redeploy your Strapi');
console.log('3. Strapi will start successfully');
console.log('4. You can access admin panel at your Railway URL');
console.log('5. Create your admin account');
console.log('6. Start managing content!');

console.log('\n📝 SAVE THESE KEYS:');
console.log('===================');
const keysContent = Object.entries(envVars)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n');

const keysPath = path.join(__dirname, 'railway-env-vars.txt');
fs.writeFileSync(keysPath, keysContent);
console.log(`✅ Saved to: ${keysPath}`);
console.log('⚠️  Keep this file secure and private!');

console.log('\n🔗 YOUR RAILWAY PROJECT:');
console.log('========================');
console.log('Project: respectful-kindness');
console.log('Dashboard: https://railway.app/dashboard');
console.log('Once variables are added, your Strapi will be at:');
console.log('https://respectful-kindness-production.up.railway.app/admin');