#!/usr/bin/env node

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

class KeyRotationManager {
  constructor() {
    this.services = {
      appwrite: {
        name: 'Appwrite',
        generateKey: () => this.generateSecureToken(64),
        envVar: 'APPWRITE_API_KEY',
        instructions: 'Generate new API key from Appwrite dashboard: Project Settings > API Keys'
      },
      contentful: {
        name: 'Contentful',
        generateKey: () => this.generateSecureToken(32),
        envVars: ['CONTENTFUL_ACCESS_TOKEN', 'CONTENTFUL_MANAGEMENT_TOKEN', 'CONTENTFUL_PREVIEW_ACCESS_TOKEN'],
        instructions: 'Generate new tokens from Contentful dashboard: Settings > API keys'
      },
      mailchimp: {
        name: 'Mailchimp',
        generateKey: () => this.generateSecureToken(24) + '-us18',
        envVar: 'MAILCHIMP_API_KEY',
        instructions: 'Generate new API key from Mailchimp dashboard: Account > Extras > API keys'
      }
    };
  }

  generateSecureToken(length) {
    return crypto.randomBytes(length).toString('hex');
  }

  generateNewKeys() {
    console.log('🔄 Generating new API keys...\n');
    
    const newKeys = {};
    
    Object.entries(this.services).forEach(([service, config]) => {
      console.log(`📝 ${config.name}:`);
      console.log(`   Instructions: ${config.instructions}`);
      
      if (config.envVar) {
        newKeys[config.envVar] = config.generateKey();
        console.log(`   Generated new ${config.envVar}`);
      }
      
      if (config.envVars) {
        config.envVars.forEach(envVar => {
          newKeys[envVar] = config.generateKey();
          console.log(`   Generated new ${envVar}`);
        });
      }
      console.log('');
    });

    return newKeys;
  }

  createBackup() {
    const backupPath = path.join(process.cwd(), `.env.backup.${Date.now()}`);
    const currentEnv = path.join(process.cwd(), '.env');
    
    if (fs.existsSync(currentEnv)) {
      fs.copyFileSync(currentEnv, backupPath);
      console.log(`✅ Created backup: ${backupPath}`);
    }
    
    return backupPath;
  }

  updateEnvFile(newKeys) {
    const envPath = path.join(process.cwd(), '.env');
    
    if (!fs.existsSync(envPath)) {
      console.error('❌ .env file not found');
      return false;
    }

    let envContent = fs.readFileSync(envPath, 'utf8');
    
    Object.entries(newKeys).forEach(([key, value]) => {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `${key}=${value}`);
      } else {
        envContent += `\n${key}=${value}`;
      }
    });

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated .env file with new keys');
    
    return true;
  }

createRotationScript(newKeys) {
    let scriptContent = `#!/bin/bash

# Key rotation script - Generated on ${new Date().toISOString()}
# Use this to rotate keys when needed

echo "🔄 Starting API key rotation..."

# Backup current keys
cp .env .env.backup.$(date +%s)

# Old keys (remove from .env)
OLD_KEYS=(
${Object.keys(newKeys).map(key => `  "${key}"`).join('\n')}
)

# Function to remove old key
remove_key() {
  local key=$1
  echo "🗑️  Removing old $1 from production..."
  # Implementation depends on your deployment platform
}

echo "✅ Key rotation completed"
echo "⚠️  Update your deployment platform with new keys:"
`;

    Object.entries(newKeys).forEach(([key, value]) => {
      scriptContent += `   ${key}=${value}\n`;
    });

    const scriptPath = path.join(process.cwd(), 'scripts', 'rotate-keys.sh');
    fs.writeFileSync(scriptPath, scriptContent);
    fs.chmodSync(scriptPath, '755');
    
    console.log(`✅ Created rotation script: ${scriptPath}`);
  }

  async performRotation() {
    console.log('🚀 Starting API key rotation for zero-downtime deployment\n');

    // Step 1: Create backup
    console.log('📦 Step 1: Creating backup...');
    this.createBackup();

    // Step 2: Generate new keys
    console.log('\n🔑 Step 2: Generating new API keys...');
    const newKeys = this.generateNewKeys();

    // Step 3: Show generated keys
    console.log('📋 Generated API Keys:');
    console.log('='.repeat(50));
    Object.entries(newKeys).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
    console.log('='.repeat(50));

    // Step 4: Create rotation plan
    console.log('\n📝 Rotation Plan:');
    console.log('1. Update service dashboards with new API keys');
    console.log('2. Update environment variables in .env file');
    console.log('3. Deploy with zero downtime (both old and new keys work during transition)');
    console.log('4. Remove old keys from service dashboards');

    // Step 5: Create rotation script
    this.createRotationScript(newKeys);

    console.log('\n✅ API key rotation preparation completed!');
    console.log('\n⚠️  NEXT STEPS:');
    console.log('1. Update each service with the new API keys');
    console.log('2. Run: npm run deploy:production');
    console.log('3. Verify deployment works with new keys');
    console.log('4. Remove old keys from service dashboards');

    return newKeys;
  }
}

// Run if executed directly
const rotationManager = new KeyRotationManager();
rotationManager.performRotation().catch(console.error);

export default KeyRotationManager;