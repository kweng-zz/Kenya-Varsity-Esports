#!/usr/bin/env node

/**
 * Setup script to prepare Strapi for separate deployment
 * This script helps you create a deployment-ready Strapi backend
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, copyFileSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🚀 Setting up Strapi for separate deployment...');

try {
  // Check if kuer directory exists
  const strapiDir = join(projectRoot, 'kuer');
  if (!existsSync(strapiDir)) {
    console.error('❌ Strapi directory (kuer) not found!');
    process.exit(1);
  }

  // Create deployment directory
  const deployDir = join(projectRoot, '..', 'kuer-backend');
  if (!existsSync(deployDir)) {
    mkdirSync(deployDir, { recursive: true });
    console.log('📁 Created deployment directory:', deployDir);
  }

  // Copy Strapi files
  console.log('📋 Copying Strapi files...');
  execSync(`cp -r ${strapiDir}/* ${deployDir}/`, { stdio: 'inherit' });

  // Create production package.json
  const packageJsonPath = join(deployDir, 'package.json');
  if (existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    
    // Update scripts for production
    packageJson.scripts = {
      ...packageJson.scripts,
      "start": "strapi start",
      "build": "strapi build",
      "deploy": "npm run build && npm start"
    };

    // Add production dependencies if not present
    if (!packageJson.dependencies['pg']) {
      packageJson.dependencies['pg'] = '^8.8.0';
    }

    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Updated package.json for production');
  }

  // Create .env.example for deployment
  const envExample = `# Strapi Production Environment Variables
NODE_ENV=production

# Database (PostgreSQL recommended for production)
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=password
DATABASE_SSL=false

# Or use DATABASE_URL (for Railway, Render, etc.)
# DATABASE_URL=postgresql://username:password@host:port/database

# Strapi Configuration
STRAPI_API_TOKEN=your-secure-api-token-here
JWT_SECRET=your-jwt-secret-here
ADMIN_JWT_SECRET=your-admin-jwt-secret-here
APP_KEYS=key1,key2,key3,key4

# Server Configuration
HOST=0.0.0.0
PORT=1337

# Admin Panel
ADMIN_PATH=/admin
`;

  writeFileSync(join(deployDir, '.env.example'), envExample);
  console.log('✅ Created .env.example');

  // Create deployment README
  const deployReadme = `# Strapi Backend Deployment

This is the backend API for your esports platform, built with Strapi.

## Quick Deploy

### Railway (Recommended)
1. Push this repository to GitHub
2. Go to [Railway.app](https://railway.app)
3. Create new project from GitHub repo
4. Add environment variables from .env.example
5. Deploy!

### Render
1. Push this repository to GitHub
2. Go to [Render.com](https://render.com)
3. Create new Web Service
4. Connect GitHub repo
5. Add environment variables
6. Deploy!

### Heroku
1. Install Heroku CLI
2. \`heroku create your-app-name\`
3. \`heroku addons:create heroku-postgresql:hobby-dev\`
4. Set environment variables: \`heroku config:set KEY=value\`
5. \`git push heroku main\`

## Environment Variables

Copy \`.env.example\` to \`.env\` and fill in your values:

\`\`\`bash
cp .env.example .env
\`\`\`

## Local Development

\`\`\`bash
npm install
npm run develop
\`\`\`

## Production Build

\`\`\`bash
npm run build
npm start
\`\`\`

## Important Notes

1. **Database**: Use PostgreSQL for production (SQLite is only for development)
2. **Security**: Generate secure tokens for JWT_SECRET, ADMIN_JWT_SECRET, and APP_KEYS
3. **CORS**: Configure CORS settings in \`config/middlewares.js\` for your frontend domain
4. **API Token**: Create an API token in Strapi admin panel for your frontend to use

## After Deployment

1. Access your Strapi admin panel at: \`https://your-domain.com/admin\`
2. Create your admin user
3. Configure content types and permissions
4. Generate API token for your frontend
5. Update your Next.js app's \`NEXT_PUBLIC_STRAPI_URL\` environment variable

## Frontend Integration

Update your Next.js app's environment variables:

\`\`\`env
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-domain.com
STRAPI_API_TOKEN=your-api-token
\`\`\`
`;

  writeFileSync(join(deployDir, 'README.md'), deployReadme);
  console.log('✅ Created deployment README');

  // Create .gitignore if it doesn't exist
  const gitignorePath = join(deployDir, '.gitignore');
  if (!existsSync(gitignorePath)) {
    const gitignoreContent = `############################
# OS X
############################

.DS_Store
.AppleDouble
.LSOverride
Icon
.Spotlight-V100
.Trashes
._*

############################
# Linux
############################

*~

############################
# Windows
############################

Thumbs.db
ehthumbs.db
Desktop.ini
$RECYCLE.BIN/
*.cab
*.msi
*.msm
*.msp

############################
# Packages
############################

*.7z
*.csv
*.dat
*.dmg
*.gz
*.iso
*.jar
*.rar
*.tar
*.zip
*.com
*.class
*.dll
*.exe
*.o
*.seed
*.so
*.swo
*.swp
*.swn
*.swm
*.out
*.pid

############################
# Logs and databases
############################

.tmp
*.log
*.sql
*.sqlite
*.sqlite3

############################
# Misc.
############################

*#
ssl
.idea
nbproject
public/uploads/*
!public/uploads/.gitkeep

############################
# Node.js
############################

lib-cov
lcov.info
pids
logs
results
node_modules
.node_history

############################
# Tests
############################

coverage

############################
# Strapi
############################

.env
license.txt
exports
*.cache
dist
build
.strapi-updater.json
`;

    writeFileSync(gitignorePath, gitignoreContent);
    console.log('✅ Created .gitignore');
  }

  console.log('\n🎉 Strapi deployment setup completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. Navigate to the deployment directory:');
  console.log(`   cd ${deployDir}`);
  console.log('2. Initialize git repository:');
  console.log('   git init && git add . && git commit -m "Initial commit"');
  console.log('3. Push to GitHub and deploy on Railway/Render/Heroku');
  console.log('4. Update your Next.js environment variables with the deployed URL');
  console.log('\n📖 See STRAPI_DEPLOYMENT.md for detailed instructions');

} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}