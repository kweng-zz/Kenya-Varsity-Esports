#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Fixing Railway Strapi Backend Deployment...\n');

// Step 1: Check if we're in the right directory and find the correct Strapi directory
const possibleDirs = ['kuer', 'kuer-backend'];
let strapiDir = null;

for (const dir of possibleDirs) {
  const fullPath = path.join(__dirname, dir);
  const packageJsonPath = path.join(fullPath, 'package.json');
  
  if (fs.existsSync(fullPath) && fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (packageJson.dependencies && packageJson.dependencies['@strapi/strapi']) {
        strapiDir = fullPath;
        console.log(`✅ Found Strapi directory: ${dir}`);
        break;
      }
    } catch (error) {
      // Continue checking other directories
    }
  }
}

if (!strapiDir) {
  console.error('❌ No Strapi directory found!');
  console.log('Please make sure you have either kuer/ or kuer-backend/ directory with Strapi installed.');
  process.exit(1);
}

process.chdir(strapiDir);
console.log(`📁 Changed to directory: ${path.basename(strapiDir)}`);

// Step 2: Check Railway CLI
try {
  execSync('railway --version', { stdio: 'pipe' });
  console.log('✅ Railway CLI is installed');
} catch (error) {
  console.log('❌ Railway CLI not found. Installing...');
  try {
    execSync('npm install -g @railway/cli', { stdio: 'inherit' });
    console.log('✅ Railway CLI installed');
  } catch (installError) {
    console.error('❌ Failed to install Railway CLI. Please install manually:');
    console.error('npm install -g @railway/cli');
    process.exit(1);
  }
}

// Step 3: Check if logged in to Railway
try {
  const whoami = execSync('railway whoami', { encoding: 'utf8', stdio: 'pipe' });
  console.log(`✅ Logged in to Railway as: ${whoami.trim()}`);
} catch (error) {
  console.log('❌ Not logged in to Railway. Please run:');
  console.log('railway login');
  console.log('Then run this script again.');
  process.exit(1);
}

// Step 4: Check current project status
try {
  const status = execSync('railway status', { encoding: 'utf8', stdio: 'pipe' });
  console.log('📊 Current Railway project status:');
  console.log(status);
} catch (error) {
  console.log('⚠️  No Railway project linked. Please link to your project:');
  console.log('railway link');
  console.log('Then run this script again.');
  process.exit(1);
}

// Step 5: Check and set environment variables
console.log('🔧 Checking environment variables...');

const requiredEnvVars = {
  'NODE_ENV': 'production',
  'HOST': '0.0.0.0',
  'PORT': '1337',
  'DATABASE_CLIENT': 'postgres'
};

// Check existing variables
let existingVars = {};
try {
  const varsOutput = execSync('railway variables', { encoding: 'utf8', stdio: 'pipe' });
  console.log('📋 Current environment variables:');
  console.log(varsOutput);
  
  // Parse existing variables (basic parsing)
  const lines = varsOutput.split('\n');
  for (const line of lines) {
    if (line.includes('=')) {
      const [key] = line.split('=');
      existingVars[key.trim()] = true;
    }
  }
} catch (error) {
  console.log('⚠️  Could not fetch current variables');
}

// Set required variables if missing
for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!existingVars[key]) {
    try {
      execSync(`railway variables set ${key}="${value}"`, { stdio: 'pipe' });
      console.log(`✅ Set ${key}=${value}`);
    } catch (error) {
      console.log(`⚠️  Could not set ${key}: ${error.message}`);
    }
  } else {
    console.log(`✅ ${key} already exists`);
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
  if (!existingVars[key]) {
    const value = key === 'APP_KEYS' 
      ? `${generateSecureKey()},${generateSecureKey()},${generateSecureKey()},${generateSecureKey()}`
      : generateSecureKey();
    
    try {
      execSync(`railway variables set ${key}="${value}"`, { stdio: 'pipe' });
      console.log(`✅ Generated and set ${key}`);
    } catch (setError) {
      console.log(`⚠️  Could not set ${key}: ${setError.message}`);
    }
  } else {
    console.log(`✅ ${key} already exists`);
  }
}

// Step 7: Check package.json and install dependencies
console.log('📦 Checking dependencies...');
try {
  if (!fs.existsSync('node_modules')) {
    console.log('Installing dependencies...');
    execSync('npm ci', { stdio: 'inherit' });
  } else {
    console.log('✅ Dependencies already installed');
  }
} catch (error) {
  console.log('⚠️  Error with dependencies:', error.message);
}

// Step 8: Build the project
console.log('🔨 Building Strapi...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.log('❌ Build failed:', error.message);
  console.log('This might be why your deployment is failing.');
  console.log('Please check the build errors above.');
}

// Step 9: Deploy to Railway
console.log('🚀 Deploying to Railway...');
try {
  execSync('railway up --detach', { stdio: 'inherit' });
  console.log('✅ Deployment initiated!');
  
  console.log('\n⏳ Deployment in progress...');
  console.log('You can monitor the deployment at: https://railway.app/dashboard');
  
  // Wait a bit and check status
  console.log('Waiting 30 seconds before checking status...');
  setTimeout(() => {
    try {
      const logs = execSync('railway logs --tail 20', { encoding: 'utf8', stdio: 'pipe' });
      console.log('📋 Recent deployment logs:');
      console.log(logs);
    } catch (error) {
      console.log('Could not fetch logs, check Railway dashboard');
    }
  }, 30000);
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  console.log('\n🔧 Troubleshooting steps:');
  console.log('1. Check Railway dashboard for detailed logs');
  console.log('2. Verify all environment variables are set correctly');
  console.log('3. Make sure your database service is running');
  console.log('4. Check if there are any build errors');
}

console.log('\n🎉 Railway deployment script completed!');
console.log('\n📝 Next steps:');
console.log('1. Monitor deployment at: https://railway.app/dashboard');
console.log('2. Test endpoints once deployed:');
console.log('   • https://kuer-strapi-backend-production.up.railway.app/admin');
console.log('   • https://kuer-strapi-backend-production.up.railway.app/api/articles');
console.log('3. If still having issues, check Railway logs for errors');

console.log('\n🧪 Test command:');
console.log('curl -I https://kuer-strapi-backend-production.up.railway.app');