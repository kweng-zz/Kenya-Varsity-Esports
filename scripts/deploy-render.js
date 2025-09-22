#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Deploying to Render...');

// Check if render.yaml exists
const renderConfigPath = path.join(__dirname, '..', 'render.yaml');
if (!fs.existsSync(renderConfigPath)) {
  console.error('❌ render.yaml not found. Please create it first.');
  process.exit(1);
}

// Check if .env.render exists
const renderEnvPath = path.join(__dirname, '..', '.env.render');
if (!fs.existsSync(renderEnvPath)) {
  console.error('❌ .env.render not found. Please create it first.');
  process.exit(1);
}

try {
  // Build the project
  console.log('📦 Building project...');
  execSync('npm run build', { stdio: 'inherit' });

  // Check git status
  console.log('📋 Checking git status...');
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
  
  if (gitStatus.trim()) {
    console.log('📝 Committing changes...');
    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "Deploy to Render - ${new Date().toISOString()}"`, { stdio: 'inherit' });
  }

  console.log('🔄 Pushing to git (this will trigger Render deployment)...');
  execSync('git push origin main', { stdio: 'inherit' });

  console.log('✅ Deployment initiated! Check Render dashboard for progress.');
  console.log('🌐 Your app will be available at: https://kuer.onrender.com');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}