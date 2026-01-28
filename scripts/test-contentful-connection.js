#!/usr/bin/env node

/**
 * Test Contentful Connection Script
 * 
 * This script tests the Contentful connection and verifies that
 * the content models are set up correctly.
 */

import { createClient } from 'contentful';
import { createClient as createManagementClient } from 'contentful-management';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

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

async function testContentfulConnection() {
  log.title('🧪 CONTENTFUL CONNECTION TEST');

  // Check environment variables
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
  const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
  const environment = process.env.CONTENTFUL_ENVIRONMENT || 'master';

  log.step('Checking environment variables...');

  if (!spaceId) {
    log.error('CONTENTFUL_SPACE_ID is not set');
    return false;
  }
  log.success(`Space ID: ${spaceId}`);

  if (!accessToken) {
    log.error('CONTENTFUL_ACCESS_TOKEN is not set');
    return false;
  }
  log.success('Delivery API token is set');

  if (!managementToken) {
    log.warning('CONTENTFUL_MANAGEMENT_TOKEN is not set (required for creating/editing content)');
  } else {
    log.success('Management API token is set');
  }

  // Test Delivery API
  log.step('Testing Delivery API connection...');
  try {
    const client = createClient({
      space: spaceId,
      accessToken: accessToken,
      environment: environment
    });

    const space = await client.getSpace();
    log.success(`Connected to space: "${space.name}"`);

    // Test content types
    log.step('Checking content types...');
    
    try {
      const articles = await client.getEntries({
        content_type: 'article',
        limit: 1
      });
      log.success(`Article content type found (${articles.total} articles)`);
    } catch (error) {
      log.warning('Article content type not found or has no entries');
    }

    try {
      const categories = await client.getEntries({
        content_type: 'category',
        limit: 1
      });
      log.success(`Category content type found (${categories.total} categories)`);
    } catch (error) {
      log.warning('Category content type not found or has no entries');
    }

    try {
      const games = await client.getEntries({
        content_type: 'game',
        limit: 1
      });
      log.success(`Game content type found (${games.total} games)`);
    } catch (error) {
      log.warning('Game content type not found or has no entries');
    }

  } catch (error) {
    log.error(`Delivery API connection failed: ${error.message}`);
    return false;
  }

  // Test Management API if token is available
  if (managementToken) {
    log.step('Testing Management API connection...');
    try {
      const managementClient = createManagementClient({
        accessToken: managementToken
      });

      const space = await managementClient.getSpace(spaceId);
      const env = await space.getEnvironment(environment);
      
      log.success('Management API connection successful');

      // Check content types
      try {
        const contentTypes = await env.getContentTypes();
        const requiredTypes = ['article', 'category', 'game'];
        const existingTypes = contentTypes.items.map(ct => ct.sys.id);
        
        log.info(`Found content types: ${existingTypes.join(', ')}`);
        
        const missingTypes = requiredTypes.filter(type => !existingTypes.includes(type));
        if (missingTypes.length > 0) {
          log.warning(`Missing content types: ${missingTypes.join(', ')}`);
          log.info('Run "node scripts/setup-contentful.cjs" to create missing content types');
        } else {
          log.success('All required content types are present');
        }
      } catch (error) {
        log.warning(`Could not check content types: ${error.message}`);
      }

    } catch (error) {
      log.error(`Management API connection failed: ${error.message}`);
      return false;
    }
  }

  // Test the application's Contentful integration
  log.step('Testing application integration...');
  try {
    // Import the application's Contentful module
    const { contentfulAPI } = await import('../src/lib/contentful.ts');
    
    const articles = await contentfulAPI.getArticles({ pageSize: 1 });
    log.success(`Application integration working (found ${articles.meta.pagination.total} articles)`);
    
    const categories = await contentfulAPI.getCategories();
    log.success(`Categories loaded: ${categories.length} found`);
    
    const games = await contentfulAPI.getGames();
    log.success(`Games loaded: ${games.length} found`);
    
  } catch (error) {
    log.error(`Application integration test failed: ${error.message}`);
    return false;
  }

  log.title('🎉 ALL TESTS PASSED!');
  log.success('Contentful is properly configured and ready to use');
  
  if (process.env.NEXT_PUBLIC_FALLBACK_MODE === 'true') {
    log.warning('NEXT_PUBLIC_FALLBACK_MODE is set to true');
    log.info('Set NEXT_PUBLIC_FALLBACK_MODE=false in your .env.local to use Contentful');
  } else {
    log.success('Fallback mode is disabled - using Contentful');
  }

  return true;
}

// Run the test
testContentfulConnection().catch(error => {
  log.error(`Test failed: ${error.message}`);
  process.exit(1);
});