#!/usr/bin/env node

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

console.log('🚂 Setting up Railway deployment for Strapi...\n');

// Create railway directory if it doesn't exist
const railwayDir = 'railway-strapi';
if (!existsSync(railwayDir)) {
  mkdirSync(railwayDir, { recursive: true });
}

// Create railway.json for Strapi deployment
const railwayConfig = {
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd kuer && npm install && npm run build"
  },
  "deploy": {
    "startCommand": "cd kuer && npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
};

writeFileSync(join(railwayDir, 'railway.json'), JSON.stringify(railwayConfig, null, 2));

// Create nixpacks.toml for better build configuration
const nixpacksConfig = `[phases.setup]
nixPkgs = ['nodejs-18_x', 'npm-9_x']

[phases.install]
cmds = ['cd kuer && npm ci']

[phases.build]
cmds = ['cd kuer && npm run build']

[start]
cmd = 'cd kuer && npm start'

[variables]
NODE_ENV = 'production'
NPM_CONFIG_PRODUCTION = 'false'
`;

writeFileSync(join(railwayDir, 'nixpacks.toml'), nixpacksConfig);

// Create environment variables template
const envTemplate = `# Railway Environment Variables Template
# Copy these to your Railway project settings

# Database (automatically provided by Railway PostgreSQL service)
# DATABASE_URL=postgresql://username:password@host:port/database

# Strapi Configuration (generate these using: node generate-strapi-keys.js)
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your_api_token_salt_here
ADMIN_JWT_SECRET=your_admin_jwt_secret_here
TRANSFER_TOKEN_SALT=your_transfer_token_salt_here
JWT_SECRET=your_jwt_secret_here
ENCRYPTION_KEY=your_encryption_key_here

# Server Configuration
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# CORS Configuration (update with your Vercel domain)
FRONTEND_URL=https://your-vercel-app.vercel.app

# Optional: File Upload Configuration
# UPLOAD_PROVIDER=cloudinary
# CLOUDINARY_NAME=your_cloudinary_name
# CLOUDINARY_KEY=your_cloudinary_key
# CLOUDINARY_SECRET=your_cloudinary_secret
`;

writeFileSync(join(railwayDir, '.env.railway.template'), envTemplate);

// Create deployment instructions
const instructions = `# Railway Deployment Instructions

## Prerequisites
1. Create a Railway account at https://railway.app
2. Install Railway CLI: \`npm install -g @railway/cli\`

## Deployment Steps

### 1. Create Railway Project
\`\`\`bash
railway login
railway new
# Select "Empty Project"
\`\`\`

### 2. Add PostgreSQL Database
\`\`\`bash
railway add postgresql
\`\`\`

### 3. Deploy Strapi
\`\`\`bash
# From the root directory of your project
railway up
\`\`\`

### 4. Configure Environment Variables
Copy the variables from \`.env.railway.template\` to your Railway project:
\`\`\`bash
railway variables set APP_KEYS="key1,key2,key3,key4"
railway variables set API_TOKEN_SALT="your_salt_here"
# ... add all other variables
\`\`\`

### 5. Generate Strapi Keys
Run this command to generate secure keys:
\`\`\`bash
node generate-strapi-keys.js
\`\`\`

### 6. Update Vercel Environment
Add the Railway URL to your Vercel environment variables:
\`\`\`
NEXT_PUBLIC_STRAPI_URL=https://your-railway-app.railway.app
\`\`\`

## Monitoring
- View logs: \`railway logs\`
- Open app: \`railway open\`
- Check status: \`railway status\`

## Database Management
- Connect to DB: \`railway connect postgresql\`
- View DB info: \`railway variables\`

## Troubleshooting
1. **Build fails**: Check that all dependencies are in package.json
2. **Database connection fails**: Verify DATABASE_URL is set automatically
3. **CORS errors**: Update FRONTEND_URL with your Vercel domain
4. **Admin panel not accessible**: Check that PORT is set to 1337
`;

writeFileSync(join(railwayDir, 'DEPLOYMENT_INSTRUCTIONS.md'), instructions);

// Create a simple database configuration for Railway
const railwayDatabaseConfig = `import path from 'path';

export default ({ env }) => {
  // Railway PostgreSQL configuration
  if (env('DATABASE_URL')) {
    return {
      connection: {
        client: 'postgres',
        connection: {
          connectionString: env('DATABASE_URL'),
          ssl: env.bool('DATABASE_SSL', false) && {
            rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false),
          },
        },
        pool: {
          min: env.int('DATABASE_POOL_MIN', 2),
          max: env.int('DATABASE_POOL_MAX', 10),
        },
        acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
      },
    };
  }

  // Fallback to SQLite for local development
  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: path.join(__dirname, '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };
};
`;

writeFileSync(join(railwayDir, 'database.railway.ts'), railwayDatabaseConfig);

console.log('✅ Railway deployment files created in ./railway-strapi/');
console.log('');
console.log('📋 Next steps:');
console.log('1. Copy database.railway.ts to kuer/config/database.ts');
console.log('2. Follow instructions in railway-strapi/DEPLOYMENT_INSTRUCTIONS.md');
console.log('3. Deploy Strapi to Railway');
console.log('4. Update Vercel environment variables with Railway URL');
console.log('');
console.log('🔗 Useful links:');
console.log('- Railway Dashboard: https://railway.app/dashboard');
console.log('- Railway Docs: https://docs.railway.app');
console.log('- Strapi Deployment Guide: https://docs.strapi.io/dev-docs/deployment');