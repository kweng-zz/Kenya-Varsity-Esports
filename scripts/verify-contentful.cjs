#!/usr/bin/env node

/**
 * Contentful Integration Verification Script
 * 
 * This script will:
 * 1. Check if Contentful packages are installed
 * 2. Verify environment variables
 * 3. Test the Contentful connection
 * 4. Validate content models
 * 5. Test the application integration
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  step: (msg) => console.log(`${colors.cyan}🔧${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.magenta}${msg}${colors.reset}\n`)
};

class ContentfulVerifier {
  constructor() {
    this.results = {
      packages: false,
      environment: false,
      connection: false,
      contentModels: false,
      integration: false
    };
  }

  async run() {
    log.title('🔍 CONTENTFUL INTEGRATION VERIFICATION');
    
    await this.checkPackages();
    await this.checkEnvironmentVariables();
    await this.testConnection();
    await this.validateContentModels();
    await this.testIntegration();
    
    this.showSummary();
  }

  async checkPackages() {
    log.step('Checking required packages...');
    
    try {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      const requiredPackages = ['contentful', 'contentful-management'];
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      let allPackagesInstalled = true;
      
      for (const pkg of requiredPackages) {
        if (dependencies[pkg]) {
          log.success(`${pkg} is installed (${dependencies[pkg]})`);
        } else {
          log.error(`${pkg} is not installed`);
          allPackagesInstalled = false;
        }
      }
      
      if (allPackagesInstalled) {
        log.success('All required packages are installed');
        this.results.packages = true;
      } else {
        log.error('Some required packages are missing');
        log.info('Run: npm install contentful contentful-management');
      }
      
    } catch (error) {
      log.error(`Failed to check packages: ${error.message}`);
    }
  }

  async checkEnvironmentVariables() {
    log.step('Checking environment variables...');
    
    const requiredVars = [
      'CONTENTFUL_SPACE_ID',
      'CONTENTFUL_ACCESS_TOKEN'
    ];
    
    const optionalVars = [
      'CONTENTFUL_PREVIEW_ACCESS_TOKEN',
      'CONTENTFUL_ENVIRONMENT'
    ];
    
    // Check .env files
    const envFiles = ['.env.local', '.env', '.env.development'];
    let envVars = {};
    
    for (const envFile of envFiles) {
      const envPath = path.join(process.cwd(), envFile);
      if (fs.existsSync(envPath)) {
        log.info(`Found ${envFile}`);
        const content = fs.readFileSync(envPath, 'utf8');
        const lines = content.split('\n');
        
        for (const line of lines) {
          const [key, value] = line.split('=');
          if (key && value && !key.startsWith('#')) {
            envVars[key.trim()] = value.trim();
          }
        }
      }
    }
    
    let allRequiredPresent = true;
    
    for (const varName of requiredVars) {
      if (envVars[varName] && envVars[varName] !== 'your_value_here') {
        log.success(`${varName} is configured`);
      } else {
        log.error(`${varName} is missing or not configured`);
        allRequiredPresent = false;
      }
    }
    
    for (const varName of optionalVars) {
      if (envVars[varName] && envVars[varName] !== 'your_value_here') {
        log.success(`${varName} is configured (optional)`);
      } else {
        log.warning(`${varName} is not configured (optional)`);
      }
    }
    
    // Check fallback mode
    const fallbackMode = envVars['NEXT_PUBLIC_FALLBACK_MODE'];
    if (fallbackMode === 'false') {
      log.success('Fallback mode is disabled - will use Contentful');
    } else {
      log.warning('Fallback mode is enabled - will use demo data');
      log.info('Set NEXT_PUBLIC_FALLBACK_MODE=false to use Contentful');
    }
    
    if (allRequiredPresent) {
      this.results.environment = true;
    }
  }

  async testConnection() {
    log.step('Testing Contentful connection...');
    
    if (!this.results.environment) {
      log.warning('Skipping connection test - environment variables not configured');
      return;
    }
    
    try {
      // Try to load environment variables
      require('dotenv').config({ path: '.env.local' });
      require('dotenv').config({ path: '.env' });
      
      const spaceId = process.env.CONTENTFUL_SPACE_ID;
      const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
      
      if (!spaceId || !accessToken) {
        log.error('Environment variables not loaded properly');
        return;
      }
      
      const { createClient } = require('contentful');
      const client = createClient({
        space: spaceId,
        accessToken: accessToken
      });
      
      const space = await client.getSpace();
      log.success(`Connected to Contentful space: "${space.name}"`);
      log.info(`Space ID: ${space.sys.id}`);
      log.info(`Default locale: ${space.defaultLocale}`);
      
      this.results.connection = true;
      
    } catch (error) {
      log.error(`Connection test failed: ${error.message}`);
      
      if (error.message.includes('401')) {
        log.error('Authentication failed - check your access token');
      } else if (error.message.includes('404')) {
        log.error('Space not found - check your space ID');
      } else if (error.message.includes('ENOTFOUND')) {
        log.error('Network error - check your internet connection');
      }
    }
  }

  async validateContentModels() {
    log.step('Validating content models...');
    
    if (!this.results.connection) {
      log.warning('Skipping content model validation - no connection');
      return;
    }
    
    try {
      const { createClient } = require('contentful');
      const client = createClient({
        space: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
      });
      
      const requiredContentTypes = ['article', 'category', 'game'];
      let allContentTypesExist = true;
      
      for (const contentType of requiredContentTypes) {
        try {
          const entries = await client.getEntries({
            content_type: contentType,
            limit: 1
          });
          
          log.success(`Content type "${contentType}" exists (${entries.total} entries)`);
        } catch (error) {
          if (error.message.includes('Unknown content type')) {
            log.error(`Content type "${contentType}" does not exist`);
            allContentTypesExist = false;
          } else {
            throw error;
          }
        }
      }
      
      if (allContentTypesExist) {
        log.success('All required content types exist');
        this.results.contentModels = true;
      } else {
        log.error('Some content types are missing');
        log.info('Run the setup script to create them: npm run setup:contentful');
      }
      
    } catch (error) {
      log.error(`Content model validation failed: ${error.message}`);
    }
  }

  async testIntegration() {
    log.step('Testing application integration...');
    
    if (!this.results.connection) {
      log.warning('Skipping integration test - no connection');
      return;
    }
    
    try {
      // Test the contentful service
      const contentfulPath = path.join(process.cwd(), 'src', 'lib', 'contentful.ts');
      
      if (!fs.existsSync(contentfulPath)) {
        log.error('Contentful service file not found at src/lib/contentful.ts');
        return;
      }
      
      log.success('Contentful service file exists');
      
      // Try to import and test the service
      const { contentfulAPI } = require('../src/lib/contentful.ts');
      
      // Test getting articles
      const articlesResponse = await contentfulAPI.getArticles({ pageSize: 1 });
      log.success(`Integration test passed - found ${articlesResponse.meta.pagination.total} articles`);
      
      // Test getting categories
      const categories = await contentfulAPI.getCategories();
      log.success(`Found ${categories.length} categories`);
      
      // Test getting games
      const games = await contentfulAPI.getGames();
      log.success(`Found ${games.length} games`);
      
      this.results.integration = true;
      
    } catch (error) {
      log.error(`Integration test failed: ${error.message}`);
      
      if (error.message.includes('Cannot find module')) {
        log.info('Make sure you have built the TypeScript files or are running in development mode');
      }
    }
  }

  showSummary() {
    log.title('📊 VERIFICATION SUMMARY');
    
    const checks = [
      { name: 'Required Packages', status: this.results.packages },
      { name: 'Environment Variables', status: this.results.environment },
      { name: 'Contentful Connection', status: this.results.connection },
      { name: 'Content Models', status: this.results.contentModels },
      { name: 'Application Integration', status: this.results.integration }
    ];
    
    let passedChecks = 0;
    
    for (const check of checks) {
      if (check.status) {
        log.success(`${check.name}: PASSED`);
        passedChecks++;
      } else {
        log.error(`${check.name}: FAILED`);
      }
    }
    
    console.log('\n' + '='.repeat(50));
    
    if (passedChecks === checks.length) {
      log.success(`All checks passed! (${passedChecks}/${checks.length})`);
      log.info('Your Contentful integration is working correctly');
      log.info('You can now use Contentful in your application');
    } else {
      log.warning(`${passedChecks}/${checks.length} checks passed`);
      
      if (!this.results.packages) {
        log.info('📦 Install packages: npm install contentful contentful-management');
      }
      
      if (!this.results.environment) {
        log.info('⚙️  Configure environment: Run npm run setup:contentful');
      }
      
      if (!this.results.contentModels) {
        log.info('📝 Create content models: Run npm run setup:contentful');
      }
    }
    
    console.log('='.repeat(50) + '\n');
  }
}

// Run the verification if this script is executed directly
if (require.main === module) {
  const verifier = new ContentfulVerifier();
  verifier.run().catch(error => {
    console.error('Verification failed:', error);
    process.exit(1);
  });
}

module.exports = ContentfulVerifier;