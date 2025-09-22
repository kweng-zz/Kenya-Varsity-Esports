#!/usr/bin/env node

/**
 * Deploy CORS Fix to Railway
 * 
 * This script helps you deploy the CORS configuration fix to Railway
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Deploying CORS Fix to Railway\n');

// Check if we're in the right directory
const currentDir = process.cwd();
const kuberDir = path.join(currentDir, 'kuer');

if (!fs.existsSync(kuberDir)) {
  console.error('❌ Error: kuer directory not found');
  console.error('   Make sure you\'re running this from the project root');
  process.exit(1);
}

// Check if middlewares files exist
const middlewaresTs = path.join(kuberDir, 'config', 'middlewares.ts');
const middlewaresJs = path.join(kuberDir, 'config', 'middlewares.js');

if (!fs.existsSync(middlewaresTs) || !fs.existsSync(middlewaresJs)) {
  console.error('❌ Error: Middleware files not found');
  console.error('   Expected files:');
  console.error('   - kuer/config/middlewares.ts');
  console.error('   - kuer/config/middlewares.js');
  process.exit(1);
}

console.log('✅ Found middleware configuration files');

// Check git status
try {
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
  
  if (gitStatus.includes('kuer/config/middlewares')) {
    console.log('📝 Committing CORS configuration changes...');
    
    execSync('git add kuer/config/middlewares.ts kuer/config/middlewares.js', { stdio: 'inherit' });
    execSync('git commit -m "Fix CORS configuration for production deployment"', { stdio: 'inherit' });
    
    console.log('✅ Changes committed to Git');
  } else {
    console.log('✅ No uncommitted changes found');
  }
  
  // Push to GitHub (which should trigger Railway deployment)
  console.log('📤 Pushing to GitHub...');
  execSync('git push', { stdio: 'inherit' });
  console.log('✅ Changes pushed to GitHub');
  
} catch (error) {
  console.error('❌ Git operation failed:', error.message);
  process.exit(1);
}

console.log('\n🎯 Next Steps:');
console.log('1. Railway should automatically deploy the changes');
console.log('2. Wait 2-3 minutes for deployment to complete');
console.log('3. Test your website to see if CORS errors are resolved');
console.log('4. Check Railway logs if issues persist');

console.log('\n🔍 To monitor deployment:');
console.log('- Visit your Railway dashboard');
console.log('- Check the deployment logs');
console.log('- Look for "Strapi started successfully" message');

console.log('\n🧪 To test the fix:');
console.log('- Open your website: https://www.kenyaesportsrankings.org');
console.log('- Check browser console for CORS errors');
console.log('- Verify articles are loading properly');

console.log('\n✅ CORS fix deployment initiated!');