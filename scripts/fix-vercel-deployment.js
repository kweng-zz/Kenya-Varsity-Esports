#!/usr/bin/env node

/**
 * Fix Vercel deployment issues for Next.js frontend
 * This script configures your project for proper Vercel deployment
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🔧 Fixing Vercel deployment configuration...');

try {
  // 1. Update vercel.json for proper configuration
  const vercelConfigPath = join(projectRoot, 'vercel.json');
  const vercelConfig = {
    "version": 2,
    "buildCommand": "npm run build:next",
    "outputDirectory": ".next",
    "installCommand": "npm install",
    "framework": "nextjs",
    "regions": ["iad1"],
    "env": {
      "SKIP_STRAPI_BUILD": "true"
    },
    "build": {
      "env": {
        "SKIP_STRAPI_BUILD": "true"
      }
    },
    "functions": {
      "src/app/api/**/*.js": {
        "runtime": "nodejs18.x"
      },
      "src/app/api/**/*.ts": {
        "runtime": "nodejs18.x"
      }
    },
    "rewrites": [
      {
        "source": "/api/:path*",
        "destination": "/api/:path*"
      }
    ],
    "headers": [
      {
        "source": "/(.*)",
        "headers": [
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          }
        ]
      }
    ]
  };

  writeFileSync(vercelConfigPath, JSON.stringify(vercelConfig, null, 2));
  console.log('✅ Updated vercel.json');

  // 2. Update Next.js config for Vercel
  const nextConfigPath = join(projectRoot, 'next.config.ts');
  const nextConfig = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for Vercel deployment
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: [
      'localhost',
      'your-strapi-domain.onrender.com', // Replace with your actual Render domain
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.onrender.com',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      }
    ],
  },

  // Environment variables
  env: {
    SKIP_STRAPI_BUILD: process.env.SKIP_STRAPI_BUILD || 'true',
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Ignore Strapi files during build
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/node_modules/**',
        '**/kuer/**',
        '**/kuer-backend/**',
        '**/.strapi/**',
        '**/strapi-render-deploy/**',
      ],
    };

    return config;
  },

  // Experimental features
  experimental: {
    // Enable if you're using app directory features
    serverComponentsExternalPackages: ['@strapi/strapi'],
  },

  // TypeScript configuration
  typescript: {
    // Skip type checking during build (Vercel will handle this)
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // Skip ESLint during build if needed
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;`;

  writeFileSync(nextConfigPath, nextConfig);
  console.log('✅ Updated next.config.ts');

  // 3. Create .vercelignore to exclude unnecessary files
  const vercelIgnorePath = join(projectRoot, '.vercelignore');
  const vercelIgnoreContent = `# Strapi backend files
kuer/
kuer-backend/
strapi-render-deploy/
.strapi/
.tmp/

# Database files
*.db
*.sqlite
*.sqlite3

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment files (except .env.example)
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/
.next/
out/

# Dependencies
node_modules/

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Temporary files
.tmp/
temp/

# Documentation
*.md
!README.md

# Scripts that aren't needed for deployment
scripts/deploy-*.js
scripts/setup-*.js
`;

  writeFileSync(vercelIgnorePath, vercelIgnoreContent);
  console.log('✅ Created .vercelignore');

  // 4. Update package.json scripts for Vercel
  const packageJsonPath = join(projectRoot, 'package.json');
  if (existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    
    // Update scripts for Vercel deployment
    packageJson.scripts = {
      ...packageJson.scripts,
      "build:vercel": "SKIP_STRAPI_BUILD=true next build",
      "build:next": "next build",
      "build:frontend": "next build",
      "start:next": "next start",
      "dev:frontend": "next dev",
      "type-check": "tsc --noEmit",
      "lint:fix": "eslint --fix .",
    };

    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Updated package.json scripts');
  }

  // 5. Create environment variables template for Vercel
  const envVercelPath = join(projectRoot, '.env.vercel.example');
  const envVercelContent = `# Vercel Environment Variables for KUER Frontend
# Copy these to your Vercel project settings

# Strapi Backend URL (Replace with your Render deployment URL)
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-app.onrender.com
STRAPI_API_TOKEN=your-strapi-api-token-here

# Appwrite Configuration (Keep your existing values)
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DB_ID=your-database-id
APPWRITE_API_KEY=your-api-key

# App Configuration
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
NODE_ENV=production

# Build Configuration
SKIP_STRAPI_BUILD=true
`;

  writeFileSync(envVercelPath, envVercelContent);
  console.log('✅ Created Vercel environment variables template');

  // 6. Create deployment instructions
  const deployInstructionsPath = join(projectRoot, 'VERCEL_DEPLOYMENT.md');
  const deployInstructions = `# Vercel Deployment Guide for KUER Frontend

## 🚀 Quick Deploy

### Prerequisites
1. ✅ Strapi backend deployed on Render
2. �� GitHub repository with your code
3. ✅ Vercel account

### Step 1: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js and configure build settings
5. Click "Deploy"

### Step 2: Configure Environment Variables
In your Vercel project dashboard:

1. Go to "Settings" → "Environment Variables"
2. Add these variables:

\`\`\`
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-app.onrender.com
STRAPI_API_TOKEN=your-strapi-api-token
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DB_ID=your-database-id
APPWRITE_API_KEY=your-api-key
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
SKIP_STRAPI_BUILD=true
\`\`\`

### Step 3: Update Build Settings (if needed)
- **Build Command**: \`npm run build:vercel\`
- **Output Directory**: \`.next\`
- **Install Command**: \`npm install\`

### Step 4: Configure Custom Domain (Optional)
1. Go to "Settings" → "Domains"
2. Add your custom domain
3. Update DNS records as instructed

## 🔧 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify Node.js version compatibility

### CORS Issues
- Update your Strapi CORS configuration
- Add your Vercel domain to allowed origins

### Images Not Loading
- Check image domains in \`next.config.ts\`
- Verify Strapi media URLs are accessible

### API Calls Failing
- Verify \`NEXT_PUBLIC_STRAPI_URL\` is correct
- Check Strapi API token permissions
- Ensure Strapi is running and accessible

## 🔄 Automatic Deployments

Vercel automatically deploys when you push to your main branch:
1. Push changes to GitHub
2. Vercel detects changes
3. Builds and deploys automatically
4. Preview deployments for pull requests

## 📊 Monitoring

- **Analytics**: Enable Vercel Analytics in project settings
- **Logs**: Check function logs in Vercel dashboard
- **Performance**: Monitor Core Web Vitals

## 🔒 Security

- Environment variables are encrypted
- Automatic HTTPS
- DDoS protection included
- Edge caching for performance

## 📝 Notes

- Frontend deploys to Vercel
- Backend (Strapi) deploys to Render
- Database can be on Render (PostgreSQL)
- Media files served from Strapi/Render
`;

  writeFileSync(deployInstructionsPath, deployInstructions);
  console.log('✅ Created Vercel deployment guide');

  console.log('\n🎉 Vercel deployment configuration completed!');
  console.log('\n📋 Next Steps for Vercel:');
  console.log('1. Commit and push your changes:');
  console.log('   git add .');
  console.log('   git commit -m "Configure for Vercel deployment"');
  console.log('   git push origin main');
  console.log('2. Go to vercel.com and import your repository');
  console.log('3. Set environment variables in Vercel dashboard');
  console.log('4. Deploy!');
  console.log('\n📖 See VERCEL_DEPLOYMENT.md for detailed instructions');

} catch (error) {
  console.error('❌ Vercel configuration failed:', error.message);
  process.exit(1);
}