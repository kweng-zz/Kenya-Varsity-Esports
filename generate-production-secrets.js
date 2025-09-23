#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Generate a random secret
function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('base64');
}

// Generate APP_KEYS (4 keys)
function generateAppKeys() {
  return Array.from({ length: 4 }, () => generateSecret()).join(',');
}

// Create production environment variables
const productionEnv = `# Server
HOST=0.0.0.0
PORT=8080
NODE_ENV=production

# Database
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Admin
ADMIN_JWT_SECRET=${generateSecret()}
JWT_SECRET=${generateSecret()}
API_TOKEN_SALT=${generateSecret()}
TRANSFER_TOKEN_SALT=${generateSecret()}

# App Keys (required for Strapi v4+)
APP_KEYS=${generateAppKeys()}

# CORS
CORS_ENABLED=true
CORS_ORIGIN=*

# Strapi Admin
STRAPI_ADMIN_BACKEND_URL=http://localhost:8080
`;

// Write to .env.production
fs.writeFileSync(path.join(__dirname, '.env.production'), productionEnv);

console.log('✅ Generated new production environment variables');
console.log('📁 Updated .env.production file');