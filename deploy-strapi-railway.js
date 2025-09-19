#!/usr/bin/env node

/**
 * Railway Strapi Deployment Helper
 * This script helps you deploy Strapi to Railway with proper configuration
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Railway Strapi Deployment Helper\n');

// Check if we're in the right directory
const strapiPath = path.join(__dirname, 'kuer');
if (!fs.existsSync(strapiPath)) {
  console.error('❌ Error: kuer directory not found. Make sure you run this from the project root.');
  process.exit(1);
}

console.log('✅ Found Strapi directory at:', strapiPath);

// Check package.json
const packageJsonPath = path.join(strapiPath, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: package.json not found in kuer directory.');
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
console.log('✅ Strapi version:', packageJson.dependencies['@strapi/strapi']);

// Check configuration files
const configFiles = [
  'nixpacks.toml',
  'railway.json',
  'config/database.ts',
  'config/server.ts'
];

console.log('\n📋 Checking configuration files:');
configFiles.forEach(file => {
  const filePath = path.join(strapiPath, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Missing!`);
  }
});

// Environment variables checklist
console.log('\n🔧 Environment Variables Checklist for Railway:');
console.log('Copy these to your Railway service environment variables:\n');

const envVars = [
  'NODE_ENV=production',
  'HOST=0.0.0.0',
  'PORT=$PORT',
  '',
  '# Database (Railway PostgreSQL)',
  'DATABASE_CLIENT=postgres',
  'DATABASE_URL=${{Postgres.DATABASE_URL}}',
  'DATABASE_HOST=${{Postgres.PGHOST}}',
  'DATABASE_PORT=${{Postgres.PGPORT}}',
  'DATABASE_NAME=${{Postgres.PGDATABASE}}',
  'DATABASE_USERNAME=${{Postgres.PGUSER}}',
  'DATABASE_PASSWORD=${{Postgres.PGPASSWORD}}',
  'DATABASE_SSL=true',
  '',
  '# Strapi Secrets (generate new ones for production)',
  'APP_KEYS=your-app-keys-here',
  'API_TOKEN_SALT=your-api-token-salt',
  'ADMIN_JWT_SECRET=your-admin-jwt-secret',
  'TRANSFER_TOKEN_SALT=your-transfer-token-salt',
  'ENCRYPTION_KEY=your-encryption-key',
  'JWT_SECRET=your-jwt-secret'
];

envVars.forEach(line => console.log(line));

console.log('\n📝 Deployment Steps:');
console.log('1. Create a new Railway project');
console.log('2. Add PostgreSQL database service');
console.log('3. Deploy from GitHub (select kuer folder as root)');
console.log('4. Add the environment variables above');
console.log('5. Deploy and access /admin to create your first admin user');

console.log('\n🔗 Useful Links:');
console.log('- Railway Dashboard: https://railway.app/dashboard');
console.log('- Strapi Documentation: https://docs.strapi.io/');
console.log('- Deployment Guide: ./RAILWAY_STRAPI_DEPLOYMENT.md');

console.log('\n✨ Ready for deployment!');