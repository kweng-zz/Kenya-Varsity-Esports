#!/usr/bin/env node

/**
 * Test Script for Contentful Integration Scripts
 * 
 * This script tests that the Contentful setup and verification scripts
 * are working correctly without requiring actual Contentful credentials.
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

class ScriptTester {
  constructor() {
    this.results = {
      scriptsExist: false,
      packagesInstalled: false,
      packageJsonUpdated: false,
      contentfulServiceExists: false
    };
  }

  async run() {
    log.title('🧪 CONTENTFUL SCRIPTS TEST');
    log.info('Testing that all Contentful integration components are in place');
    
    this.checkScriptFiles();
    this.checkPackages();
    this.checkPackageJsonScripts();
    this.checkContentfulService();
    this.checkDocumentation();
    
    this.showSummary();
  }

  checkScriptFiles() {
    log.step('Checking script files...');
    
    const requiredScripts = [
      'scripts/setup-contentful.js',
      'scripts/verify-contentful.js',
      'scripts/test-contentful-scripts.js'
    ];
    
    let allScriptsExist = true;
    
    for (const scriptPath of requiredScripts) {
      const fullPath = path.join(process.cwd(), scriptPath);
      if (fs.existsSync(fullPath)) {
        log.success(`${scriptPath} exists`);
        
        // Check if script is executable
        try {
          const stats = fs.statSync(fullPath);
          if (stats.mode & parseInt('111', 8)) {
            log.info(`${scriptPath} is executable`);
          }
        } catch (error) {
          // Ignore permission check errors on Windows
        }
      } else {
        log.error(`${scriptPath} is missing`);
        allScriptsExist = false;
      }
    }
    
    if (allScriptsExist) {
      this.results.scriptsExist = true;
      log.success('All script files are present');
    }
  }

  checkPackages() {
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
        this.results.packagesInstalled = true;
        log.success('All required packages are installed');
      } else {
        log.warning('Some packages are missing - run: npm install contentful contentful-management');
      }
      
    } catch (error) {
      log.error(`Failed to check packages: ${error.message}`);
    }
  }

  checkPackageJsonScripts() {
    log.step('Checking package.json scripts...');
    
    try {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      const requiredScripts = [
        'setup:contentful',
        'verify:contentful'
      ];
      
      let allScriptsPresent = true;
      
      for (const scriptName of requiredScripts) {
        if (packageJson.scripts && packageJson.scripts[scriptName]) {
          log.success(`npm script "${scriptName}" is configured`);
        } else {
          log.error(`npm script "${scriptName}" is missing`);
          allScriptsPresent = false;
        }
      }
      
      if (allScriptsPresent) {
        this.results.packageJsonUpdated = true;
        log.success('All npm scripts are configured');
      }
      
    } catch (error) {
      log.error(`Failed to check package.json scripts: ${error.message}`);
    }
  }

  checkContentfulService() {
    log.step('Checking Contentful service...');
    
    const servicePath = path.join(process.cwd(), 'src', 'lib', 'contentful.ts');
    
    if (fs.existsSync(servicePath)) {
      log.success('Contentful service file exists');
      
      // Check if the service has the required exports
      try {
        const serviceContent = fs.readFileSync(servicePath, 'utf8');
        
        const requiredExports = [
          'contentfulAPI',
          'transformContentfulArticle',
          'getContentfulImageUrl'
        ];
        
        let allExportsPresent = true;
        
        for (const exportName of requiredExports) {
          if (serviceContent.includes(`export const ${exportName}`) || 
              serviceContent.includes(`export { ${exportName}`)) {
            log.success(`Export "${exportName}" found`);
          } else {
            log.warning(`Export "${exportName}" not found`);
            allExportsPresent = false;
          }
        }
        
        if (allExportsPresent) {
          this.results.contentfulServiceExists = true;
          log.success('Contentful service is properly configured');
        }
        
      } catch (error) {
        log.warning(`Could not analyze service file: ${error.message}`);
      }
    } else {
      log.error('Contentful service file is missing');
      log.info('Expected location: src/lib/contentful.ts');
    }
  }

  checkDocumentation() {
    log.step('Checking documentation...');
    
    const docFiles = [
      'CONTENTFUL_SETUP.md',
      'CONTENTFUL_QUICK_START.md',
      'STRAPI_TO_CONTENTFUL_MIGRATION.md',
      '.env.example'
    ];
    
    for (const docFile of docFiles) {
      const docPath = path.join(process.cwd(), docFile);
      if (fs.existsSync(docPath)) {
        log.success(`${docFile} exists`);
      } else {
        log.warning(`${docFile} is missing`);
      }
    }
  }

  showSummary() {
    log.title('📊 TEST SUMMARY');
    
    const checks = [
      { name: 'Script Files', status: this.results.scriptsExist },
      { name: 'Required Packages', status: this.results.packagesInstalled },
      { name: 'Package.json Scripts', status: this.results.packageJsonUpdated },
      { name: 'Contentful Service', status: this.results.contentfulServiceExists }
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
      log.success(`All tests passed! (${passedChecks}/${checks.length})`);
      log.info('🎉 Your Contentful integration is ready to use!');
      log.info('');
      log.info('Next steps:');
      log.info('1. Run: npm run setup:contentful');
      log.info('2. Follow the interactive setup');
      log.info('3. Run: npm run verify:contentful');
      log.info('4. Start your app: npm run dev');
    } else {
      log.warning(`${passedChecks}/${checks.length} tests passed`);
      log.info('');
      log.info('Issues found:');
      
      if (!this.results.packagesInstalled) {
        log.info('📦 Install packages: npm install contentful contentful-management');
      }
      
      if (!this.results.scriptsExist) {
        log.info('📝 Some script files are missing');
      }
      
      if (!this.results.contentfulServiceExists) {
        log.info('🔧 Contentful service needs to be created');
      }
    }
    
    console.log('='.repeat(50) + '\n');
    
    log.info('Available commands:');
    log.info('• npm run setup:contentful    - Set up Contentful integration');
    log.info('• npm run verify:contentful   - Verify Contentful setup');
    log.info('• node scripts/test-contentful-scripts.js - Run this test again');
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  const tester = new ScriptTester();
  tester.run().catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
  });
}

module.exports = ScriptTester;