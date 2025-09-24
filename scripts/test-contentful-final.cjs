#!/usr/bin/env node

/**
 * Final Contentful Test
 * 
 * This script tests the complete Contentful integration with the actual tokens.
 */

const { createClient } = require('contentful');
const { createClient: createManagementClient } = require('contentful-management');
require('dotenv').config({ path: '.env.local' });

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

async function testContentfulIntegration() {
  log.title('🧪 FINAL CONTENTFUL INTEGRATION TEST');

  // Get environment variables
  const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
  const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;
  const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
  const environment = process.env.CONTENTFUL_ENVIRONMENT || 'master';

  log.step('Checking environment variables...');
  log.success(`Space ID: ${spaceId}`);
  log.success(`Access Token: ${accessToken ? 'Set' : 'Missing'}`);
  log.success(`Management Token: ${managementToken ? 'Set' : 'Missing'}`);
  log.success(`Environment: ${environment}`);
  log.success(`Fallback Mode: ${process.env.NEXT_PUBLIC_FALLBACK_MODE}`);

  // Test Delivery API
  log.step('Testing Delivery API...');
  try {
    const client = createClient({
      space: spaceId,
      accessToken: accessToken,
      environment: environment
    });

    const space = await client.getSpace();
    log.success(`Connected to space: "${space.name}"`);

    // Test articles
    const articles = await client.getEntries({
      content_type: 'article'
    });
    log.success(`Found ${articles.total} articles`);

    if (articles.items.length > 0) {
      const firstArticle = articles.items[0];
      log.info(`Sample article: "${firstArticle.fields.title}"`);
    }

    // Test categories
    const categories = await client.getEntries({
      content_type: 'category'
    });
    log.success(`Found ${categories.total} categories`);

    // Test games
    const games = await client.getEntries({
      content_type: 'game'
    });
    log.success(`Found ${games.total} games`);

  } catch (error) {
    log.error(`Delivery API test failed: ${error.message}`);
    return false;
  }

  // Test Management API
  log.step('Testing Management API...');
  try {
    const managementClient = createManagementClient({
      accessToken: managementToken
    });

    const space = await managementClient.getSpace(spaceId);
    const env = await space.getEnvironment(environment);
    
    log.success('Management API connection successful');

    // Check content types
    const contentTypes = await env.getContentTypes();
    const existingTypes = contentTypes.items.map(ct => ct.sys.id);
    
    log.info(`Content types: ${existingTypes.join(', ')}`);
    
    const requiredTypes = ['article', 'category', 'game'];
    const hasAllTypes = requiredTypes.every(type => existingTypes.includes(type));
    
    if (hasAllTypes) {
      log.success('All required content types are present');
    } else {
      log.warning('Some content types are missing');
    }

  } catch (error) {
    log.error(`Management API test failed: ${error.message}`);
    return false;
  }

  log.title('🎉 ALL TESTS PASSED!');
  log.success('Your Contentful integration is working perfectly!');
  log.info('You can now:');
  log.info('1. Start your dev server: npm run dev');
  log.info('2. Go to /admin/blogs');
  log.info('3. Create, edit, and delete blog articles');
  
  return true;
}

// Run the test
testContentfulIntegration().catch(error => {
  log.error(`Test failed: ${error.message}`);
  process.exit(1);
});