#!/usr/bin/env node

/**
 * Test Strapi Connection Script
 * 
 * This script tests the connection to your Strapi backend and validates the API token.
 * Run with: node test-strapi-connection.js
 */

import https from 'https';
import http from 'http';
import { config } from 'dotenv';

// Load environment variables
config();

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

console.log('🔍 Testing Strapi Connection...\n');
console.log(`📍 Strapi URL: ${STRAPI_URL}`);
console.log(`🔑 API Token: ${STRAPI_API_TOKEN ? '✅ Present' : '❌ Missing'}\n`);

async function testConnection() {
  try {
    // Test 1: Basic connection (no auth)
    console.log('📡 Test 1: Basic connection (public access)...');
    const publicResponse = await fetch(`${STRAPI_URL}/api/articles?pagination[limit]=1`);
    console.log(`   Status: ${publicResponse.status}`);
    
    if (publicResponse.ok) {
      const data = await publicResponse.json();
      console.log(`   ✅ Public access works! Found ${data.data?.length || 0} articles`);
    } else {
      console.log(`   ❌ Public access failed: ${publicResponse.statusText}`);
    }

    // Test 2: Authenticated connection
    if (STRAPI_API_TOKEN) {
      console.log('\n🔐 Test 2: Authenticated connection...');
      const authResponse = await fetch(`${STRAPI_URL}/api/articles?pagination[limit]=1`, {
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`   Status: ${authResponse.status}`);
      
      if (authResponse.ok) {
        console.log('   ✅ Authentication works!');
      } else {
        const errorText = await authResponse.text();
        console.log(`   ❌ Authentication failed: ${errorText}`);
        
        if (authResponse.status === 401) {
          console.log('\n💡 Solution: Generate a new API token in Strapi admin panel');
          console.log('   1. Go to Settings → API Tokens');
          console.log('   2. Create new token with Article permissions');
          console.log('   3. Update STRAPI_API_TOKEN in .env file');
        }
      }

      // Test 3: Try to create a test article
      console.log('\n📝 Test 3: Article creation test...');
      const createResponse = await fetch(`${STRAPI_URL}/api/articles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            title: 'Connection Test Article',
            description: 'Test article created by connection script',
            content: [
              {
                type: 'paragraph',
                children: [{ type: 'text', text: 'This is a test article.' }]
              }
            ],
            slug: `test-connection-${Date.now()}`,
            category: 'Test',
            author: 'Connection Test',
            featured: false,
            tags: ['test'],
            publishedAt: new Date().toISOString()
          }
        })
      });

      console.log(`   Status: ${createResponse.status}`);
      
      if (createResponse.ok) {
        const createdArticle = await createResponse.json();
        console.log('   ✅ Article creation works!');
        console.log(`   📄 Created article: ${createdArticle.data?.title}`);
      } else {
        const errorText = await createResponse.text();
        console.log(`   ❌ Article creation failed: ${errorText}`);
        
        if (createResponse.status === 403) {
          console.log('\n💡 Solution: Enable Article permissions');
          console.log('   1. Go to Settings → Users & Permissions → Roles');
          console.log('   2. Edit your API token or Public role');
          console.log('   3. Enable create, update, delete for Article');
        }
      }
    } else {
      console.log('\n⚠️  Skipping authenticated tests - no API token provided');
    }

    // Test 4: Admin panel accessibility
    console.log('\n🔧 Test 4: Admin panel accessibility...');
    const adminResponse = await fetch(`${STRAPI_URL}/admin`);
    console.log(`   Status: ${adminResponse.status}`);
    
    if (adminResponse.ok || adminResponse.status === 200) {
      console.log(`   ✅ Admin panel accessible at: ${STRAPI_URL}/admin`);
    } else {
      console.log(`   ⚠️  Admin panel may not be accessible`);
    }

  } catch (error) {
    console.error('\n❌ Connection test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Solution: Strapi server is not running');
      console.log('   - Check if the Strapi backend is deployed and running');
      console.log('   - Verify the STRAPI_URL is correct');
    }
  }
}

// Polyfill fetch for older Node.js versions
if (typeof fetch === 'undefined') {
  global.fetch = async (url, options = {}) => {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const client = urlObj.protocol === 'https:' ? https : http;
      
      const req = client.request(url, {
        method: options.method || 'GET',
        headers: options.headers || {}
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            statusText: res.statusMessage,
            text: () => Promise.resolve(data),
            json: () => Promise.resolve(JSON.parse(data))
          });
        });
      });
      
      req.on('error', reject);
      
      if (options.body) {
        req.write(options.body);
      }
      
      req.end();
    });
  };
}

testConnection().then(() => {
  console.log('\n🏁 Connection test completed!');
}).catch(error => {
  console.error('\n💥 Test failed:', error);
  process.exit(1);
});