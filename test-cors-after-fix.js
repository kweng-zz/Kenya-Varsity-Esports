#!/usr/bin/env node

/**
 * Test CORS After Fix
 * 
 * This script tests if the CORS issue has been resolved
 */

import https from 'https';

const STRAPI_URL = 'https://kuer-strapi-backend-production.up.railway.app';
const FRONTEND_ORIGIN = 'https://www.kenyaesportsrankings.org';

console.log('🧪 Testing CORS Configuration After Fix\n');

function testCORS() {
  return new Promise((resolve) => {
    const options = {
      method: 'OPTIONS',
      headers: {
        'Origin': FRONTEND_ORIGIN,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    };
    
    console.log(`🔍 Testing CORS preflight request...`);
    console.log(`   Origin: ${FRONTEND_ORIGIN}`);
    console.log(`   Target: ${STRAPI_URL}/api/articles`);
    console.log();
    
    const req = https.request(STRAPI_URL + '/api/articles', options, (res) => {
      console.log(`📊 Response Status: ${res.statusCode}`);
      console.log(`📋 Response Headers:`);
      
      const corsHeaders = {
        'access-control-allow-origin': res.headers['access-control-allow-origin'],
        'access-control-allow-methods': res.headers['access-control-allow-methods'],
        'access-control-allow-headers': res.headers['access-control-allow-headers'],
        'access-control-allow-credentials': res.headers['access-control-allow-credentials']
      };
      
      Object.entries(corsHeaders).forEach(([key, value]) => {
        if (value !== undefined) {
          console.log(`   ${key}: ${value}`);
        }
      });
      
      console.log();
      
      const allowedOrigin = res.headers['access-control-allow-origin'];
      const corsWorking = allowedOrigin === FRONTEND_ORIGIN || allowedOrigin === '*';
      
      if (corsWorking) {
        console.log('✅ CORS Configuration: WORKING');
        console.log('   Your frontend should now be able to access the API');
      } else {
        console.log('❌ CORS Configuration: NOT WORKING');
        console.log(`   Expected Origin: ${FRONTEND_ORIGIN}`);
        console.log(`   Actual Origin: ${allowedOrigin || 'none'}`);
      }
      
      resolve({ working: corsWorking, status: res.statusCode, headers: corsHeaders });
    });
    
    req.on('error', (error) => {
      console.log('❌ Request Failed:', error.message);
      resolve({ working: false, error: error.message });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      console.log('❌ Request Timeout');
      resolve({ working: false, error: 'timeout' });
    });
    
    req.end();
  });
}

async function testActualAPI() {
  return new Promise((resolve) => {
    const options = {
      method: 'GET',
      headers: {
        'Origin': FRONTEND_ORIGIN,
        'Accept': 'application/json'
      }
    };
    
    console.log('\n🔍 Testing actual API request...');
    
    const req = https.request(STRAPI_URL + '/api/articles?pagination[pageSize]=1', options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📊 API Response Status: ${res.statusCode}`);
        
        if (res.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            console.log('✅ API Request: SUCCESS');
            console.log(`   Articles found: ${jsonData.data?.length || 0}`);
            console.log(`   Total articles: ${jsonData.meta?.pagination?.total || 0}`);
          } catch (e) {
            console.log('⚠️ API Request: Response not JSON');
          }
        } else {
          console.log('❌ API Request: FAILED');
          console.log(`   Status: ${res.statusCode}`);
        }
        
        resolve({ status: res.statusCode, success: res.statusCode === 200 });
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ API Request Failed:', error.message);
      resolve({ success: false, error: error.message });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      console.log('❌ API Request Timeout');
      resolve({ success: false, error: 'timeout' });
    });
    
    req.end();
  });
}

async function main() {
  console.log('⏳ Please wait while Railway deploys the changes...');
  console.log('   This may take 2-3 minutes\n');
  
  // Wait a bit for deployment
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const corsResult = await testCORS();
  const apiResult = await testActualAPI();
  
  console.log('\n📋 SUMMARY:');
  console.log(`   CORS Working: ${corsResult.working ? '✅ YES' : '❌ NO'}`);
  console.log(`   API Working: ${apiResult.success ? '✅ YES' : '❌ NO'}`);
  
  if (corsResult.working && apiResult.success) {
    console.log('\n🎉 SUCCESS! Your CORS issue should be resolved!');
    console.log('   Try refreshing your website now.');
  } else {
    console.log('\n⚠️ Issues detected. Possible solutions:');
    console.log('   1. Wait a few more minutes for Railway deployment');
    console.log('   2. Check Railway logs for deployment errors');
    console.log('   3. Verify your Railway service is running');
    console.log('   4. Try running this test again in 2-3 minutes');
  }
}

main().catch(console.error);