#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Fixing Railway Strapi Deployment...\n');

// Step 1: Check if we're in the right directory
const kuberDir = path.join(__dirname, 'kuer');
if (!fs.existsSync(kuberDir)) {
  console.error('❌ kuer directory not found!');
  process.exit(1);
}

process.chdir(kuberDir);
console.log('📁 Changed to kuer directory');

// Step 2: Check Railway CLI
try {
  execSync('railway --version', { stdio: 'pipe' });
  console.log('✅ Railway CLI is installed');
} catch (error) {
  console.log('📦 Installing Railway CLI...');
  try {
    execSync('npm install -g @railway/cli', { stdio: 'inherit' });
  } catch (installError) {
    console.error('❌ Failed to install Railway CLI. Please install manually:');
    console.error('npm install -g @railway/cli');
    process.exit(1);
  }
}

// Step 3: Check if logged in to Railway
try {
  execSync('railway whoami', { stdio: 'pipe' });
  console.log('✅ Logged in to Railway');
} catch (error) {
  console.log('🔐 Please log in to Railway:');
  console.log('Run: railway login');
  process.exit(1);
}

// Step 4: Check current project
try {
  const projectInfo = execSync('railway status', { encoding: 'utf8' });
  console.log('📊 Current Railway project status:');
  console.log(projectInfo);
} catch (error) {
  console.log('⚠️  No Railway project linked. Linking to existing project...');
  try {
    // Try to link to the existing project
    execSync('railway link', { stdio: 'inherit' });
  } catch (linkError) {
    console.error('❌ Failed to link Railway project');
    process.exit(1);
  }
}

// Step 5: Set environment variables
console.log('🔧 Setting up environment variables...');

const envVars = {
  'NODE_ENV': 'production',
  'HOST': '0.0.0.0',
  'PORT': '1337',
  'DATABASE_CLIENT': 'postgres',
  'SERVE_ADMIN_PANEL': 'true',
  'STRAPI_PROXY': 'true'
};

// Set basic environment variables
for (const [key, value] of Object.entries(envVars)) {
  try {
    execSync(`railway variables set ${key}="${value}"`, { stdio: 'pipe' });
    console.log(`✅ Set ${key}`);
  } catch (error) {
    console.log(`⚠️  Could not set ${key}: ${error.message}`);
  }
}

// Step 6: Generate secure keys if they don't exist
console.log('🔐 Checking secure keys...');

function generateSecureKey() {
  return require('crypto').randomBytes(32).toString('base64');
}

const secureKeys = [
  'APP_KEYS',
  'API_TOKEN_SALT', 
  'ADMIN_JWT_SECRET',
  'TRANSFER_TOKEN_SALT',
  'JWT_SECRET'
];

for (const key of secureKeys) {
  try {
    // Check if key exists
    execSync(`railway variables get ${key}`, { stdio: 'pipe' });
    console.log(`✅ ${key} already exists`);
  } catch (error) {
    // Key doesn't exist, generate it
    const value = key === 'APP_KEYS' 
      ? `${generateSecureKey()},${generateSecureKey()},${generateSecureKey()},${generateSecureKey()}`
      : generateSecureKey();
    
    try {
      execSync(`railway variables set ${key}="${value}"`, { stdio: 'pipe' });
      console.log(`✅ Generated and set ${key}`);
    } catch (setError) {
      console.log(`⚠️  Could not set ${key}: ${setError.message}`);
    }
  }
}

// Step 7: Build and deploy
console.log('🏗️  Building and deploying...');

try {
  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm ci', { stdio: 'inherit' });
  
  // Build the project
  console.log('🔨 Building Strapi...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Deploy to Railway
  console.log('🚀 Deploying to Railway...');
  execSync('railway up', { stdio: 'inherit' });
  
  console.log('\n✅ Deployment completed!');
  console.log('🌐 Your Strapi backend should be available at:');
  console.log('https://kuer-strapi-backend-production.up.railway.app');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  console.log('\n🔧 Troubleshooting steps:');
  console.log('1. Check Railway dashboard for logs');
  console.log('2. Verify database connection');
  console.log('3. Check environment variables');
  process.exit(1);
}

console.log('\n🎉 Railway Strapi deployment fixed!');
console.log('📝 Next steps:');
console.log('1. Test the API endpoints');
console.log('2. Check admin panel access');
console.log('3. Verify CORS configuration');