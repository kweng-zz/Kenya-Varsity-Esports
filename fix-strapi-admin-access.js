#!/usr/bin/env node

/**
 * Fix Strapi Admin Access
 * 
 * This script helps you access the correct Strapi admin panel by:
 * 1. Starting the local Strapi development server
 * 2. Providing instructions for accessing the admin panel
 * 3. Helping you deploy Strapi separately if needed
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Fixing Strapi Admin Access...\n');

// Check if Strapi directory exists
const strapiDir = path.join(__dirname, 'kuer');
const strapiPackageJson = path.join(strapiDir, 'package.json');

if (!fs.existsSync(strapiPackageJson)) {
  console.error('❌ Strapi installation not found in ./kuer directory');
  process.exit(1);
}

console.log('✅ Found Strapi installation in ./kuer directory');

// Function to start local Strapi development server
function startLocalStrapi() {
  console.log('\n🚀 Starting local Strapi development server...');
  console.log('This will start Strapi on http://localhost:1337');
  console.log('The admin panel will be available at http://localhost:1337/admin');
  console.log('\nPress Ctrl+C to stop the server\n');

  const strapiProcess = spawn('npm', ['run', 'develop'], {
    cwd: strapiDir,
    stdio: 'inherit',
    shell: true
  });

  strapiProcess.on('error', (error) => {
    console.error('❌ Error starting Strapi:', error.message);
  });

  strapiProcess.on('close', (code) => {
    console.log(`\nStrapi process exited with code ${code}`);
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping Strapi server...');
    strapiProcess.kill('SIGINT');
    process.exit(0);
  });
}

// Function to provide deployment instructions
function provideDeploymentInstructions() {
  console.log('\n📋 Strapi Admin Access Solutions:');
  console.log('=====================================\n');

  console.log('🔧 OPTION 1: Access Local Strapi Admin (Recommended for Development)');
  console.log('1. Run this script with --local flag: node fix-strapi-admin-access.js --local');
  console.log('2. Wait for Strapi to start (may take a few minutes on first run)');
  console.log('3. Open http://localhost:1337/admin in your browser');
  console.log('4. Create your admin account if this is the first time\n');

  console.log('🚀 OPTION 2: Deploy Separate Strapi Backend to Railway');
  console.log('1. Create a new Railway project specifically for Strapi');
  console.log('2. Deploy the ./kuer directory as a separate service');
  console.log('3. Add PostgreSQL database to the Railway project');
  console.log('4. Configure environment variables for the Strapi service');
  console.log('5. Update NEXT_PUBLIC_STRAPI_URL to point to the new Strapi service\n');

  console.log('🔍 OPTION 3: Check Current Railway Deployment');
  console.log('1. Log into your Railway dashboard');
  console.log('2. Check if you have multiple services deployed');
  console.log('3. Look for a service that should be serving Strapi');
  console.log('4. Verify the service is running the correct code (./kuer directory)\n');

  console.log('⚠️  CURRENT ISSUE:');
  console.log('The URL https://kuer-strapi-backend-production.up.railway.app');
  console.log('is serving your Next.js frontend instead of Strapi backend.');
  console.log('This means either:');
  console.log('- The wrong code is deployed to that service');
  console.log('- You need to deploy Strapi as a separate service');
  console.log('- The deployment configuration is incorrect\n');
}

// Function to create Railway deployment script for Strapi
function createStrapiDeploymentScript() {
  const deployScript = `#!/usr/bin/env node

/**
 * Deploy Strapi to Railway
 * 
 * This script helps deploy your Strapi backend as a separate Railway service
 */

import { spawn } from 'child_process';
import fs from 'fs';

console.log('🚀 Deploying Strapi to Railway...');

// Check if Railway CLI is installed
function checkRailwayCLI() {
  return new Promise((resolve) => {
    const process = spawn('railway', ['--version'], { stdio: 'pipe' });
    process.on('close', (code) => {
      resolve(code === 0);
    });
  });
}

async function deployStrapi() {
  const hasRailway = await checkRailwayCLI();
  
  if (!hasRailway) {
    console.log('❌ Railway CLI not found. Installing...');
    console.log('Run: npm install -g @railway/cli');
    console.log('Then run: railway login');
    return;
  }

  console.log('✅ Railway CLI found');
  console.log('');
  console.log('📋 Manual Deployment Steps:');
  console.log('1. Create a new Railway project for Strapi');
  console.log('2. Add PostgreSQL database');
  console.log('3. Deploy the ./kuer directory');
  console.log('4. Set environment variables');
  console.log('');
  console.log('🔧 Commands to run:');
  console.log('cd kuer');
  console.log('railway login');
  console.log('railway new');  // Create new project
  console.log('railway add postgresql');  // Add database
  console.log('railway up');  // Deploy
  console.log('');
  console.log('After deployment, update your .env file with the new Strapi URL');
}

deployStrapi();
`;

  const scriptPath = path.join(__dirname, 'deploy-strapi-railway.js');
  fs.writeFileSync(scriptPath, deployScript);
  console.log(`✅ Created deployment script: ${scriptPath}`);
}

// Main function
function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--local') || args.includes('-l')) {
    startLocalStrapi();
  } else {
    provideDeploymentInstructions();
    createStrapiDeploymentScript();
    
    console.log('🎯 Quick Start:');
    console.log('===============');
    console.log('To start local Strapi admin panel right now:');
    console.log('node fix-strapi-admin-access.js --local');
    console.log('');
    console.log('Then open: http://localhost:1337/admin');
  }
}

main();