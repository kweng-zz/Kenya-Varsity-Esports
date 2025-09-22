#!/usr/bin/env node

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
