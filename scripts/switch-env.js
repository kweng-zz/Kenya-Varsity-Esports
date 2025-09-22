#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const environment = args[0];

if (!environment || !['railway', 'render', 'local'].includes(environment)) {
  console.log('Usage: npm run switch-env [railway|render|local]');
  console.log('');
  console.log('Examples:');
  console.log('  npm run switch-env railway  # Switch to Railway environment');
  console.log('  npm run switch-env render   # Switch to Render environment');
  console.log('  npm run switch-env local    # Switch to local development');
  process.exit(1);
}

const envFiles = {
  railway: '.env.railway',
  render: '.env.render',
  local: '.env.local'
};

const sourceFile = envFiles[environment];
const targetFile = '.env.local';

try {
  // Backup current .env.local
  if (fs.existsSync(targetFile)) {
    const backupFile = `.env.local.backup.${Date.now()}`;
    fs.copyFileSync(targetFile, backupFile);
    console.log(`📋 Backed up current environment to ${backupFile}`);
  }

  // Copy the selected environment file
  if (fs.existsSync(sourceFile)) {
    fs.copyFileSync(sourceFile, targetFile);
    console.log(`✅ Switched to ${environment} environment`);
    
    // Show current configuration
    const envContent = fs.readFileSync(targetFile, 'utf8');
    const strapiUrl = envContent.match(/NEXT_PUBLIC_STRAPI_URL=(.+)/)?.[1] || 'Not set';
    console.log(`🌐 Strapi URL: ${strapiUrl}`);
    
  } else {
    console.error(`❌ Environment file ${sourceFile} not found.`);
    console.log('Available environment files:');
    Object.entries(envFiles).forEach(([env, file]) => {
      const exists = fs.existsSync(file) ? '✅' : '❌';
      console.log(`  ${exists} ${env}: ${file}`);
    });
    process.exit(1);
  }

} catch (error) {
  console.error('❌ Error switching environment:', error.message);
  process.exit(1);
}