#!/usr/bin/env node

/**
 * Contentful Token Checker
 * 
 * This script helps you identify which tokens you have and what they're for.
 */

const { createClient } = require('contentful');
const { createClient: createManagementClient } = require('contentful-management');

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

async function checkToken(spaceId, token, tokenType) {
  log.step(`Testing ${tokenType} token...`);
  
  try {
    if (tokenType === 'Delivery API') {
      const client = createClient({
        space: spaceId,
        accessToken: token
      });
      
      const space = await client.getSpace();
      log.success(`${tokenType} token is valid - Space: "${space.name}"`);
      return true;
    } else if (tokenType === 'Preview API') {
      const client = createClient({
        space: spaceId,
        accessToken: token,
        host: 'preview.contentful.com'
      });
      
      const space = await client.getSpace();
      log.success(`${tokenType} token is valid - Space: "${space.name}"`);
      return true;
    } else if (tokenType === 'Management API') {
      const client = createManagementClient({
        accessToken: token
      });
      
      const space = await client.getSpace(spaceId);
      log.success(`${tokenType} token is valid - Space: "${space.name}"`);
      return true;
    }
  } catch (error) {
    log.error(`${tokenType} token is invalid: ${error.message}`);
    return false;
  }
}

async function main() {
  log.title('🔑 CONTENTFUL TOKEN CHECKER');
  
  const spaceId = 'gk83salrhozo';
  const tokens = {
    'tb8HyulKWftPO7KL7FeY5u1JauthKI_fyquKQ8NSImA': 'Unknown',
    'hb7rwiSlTyveNS3UgOLHkRnybu4U33BqR6T6BSUfHjg': 'Unknown'
  };
  
  log.info(`Testing tokens for Space ID: ${spaceId}`);
  
  for (const [token, type] of Object.entries(tokens)) {
    log.info(`\nTesting token: ${token.substring(0, 10)}...${token.substring(token.length - 6)}`);
    
    // Test as Delivery API token
    const isDelivery = await checkToken(spaceId, token, 'Delivery API');
    
    // Test as Preview API token
    const isPreview = await checkToken(spaceId, token, 'Preview API');
    
    // Test as Management API token
    const isManagement = await checkToken(spaceId, token, 'Management API');
    
    if (isDelivery) {
      log.success(`✅ This is a DELIVERY API token`);
      log.info('Use this for: NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN');
    }
    
    if (isPreview) {
      log.success(`✅ This is a PREVIEW API token`);
      log.info('Use this for: CONTENTFUL_PREVIEW_ACCESS_TOKEN');
    }
    
    if (isManagement) {
      log.success(`✅ This is a MANAGEMENT API token`);
      log.info('Use this for: CONTENTFUL_MANAGEMENT_TOKEN');
    }
    
    if (!isDelivery && !isPreview && !isManagement) {
      log.error('❌ This token is not valid for any API');
    }
    
    console.log('---');
  }
  
  log.title('📋 SUMMARY');
  log.info('You need these tokens for your application:');
  log.info('1. DELIVERY API token - for reading published content');
  log.info('2. MANAGEMENT API token - for creating/editing content');
  log.info('3. PREVIEW API token - for reading draft content (optional)');
  
  log.warning('\nIf you need a Management API token:');
  log.info('1. Go to https://app.contentful.com/');
  log.info('2. Select your space');
  log.info('3. Go to Settings > API keys');
  log.info('4. Create a new "Content management token"');
  log.info('5. Copy the token immediately (it won\'t be shown again)');
}

main().catch(console.error);