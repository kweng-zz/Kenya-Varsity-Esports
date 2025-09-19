#!/usr/bin/env node

import fetch from 'node-fetch';

const NEXT_URL = process.env.NEXT_URL || 'http://localhost:3000';
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

console.log('🏥 KUER Health Check\n');

async function checkService(name, url, endpoint = '') {
  try {
    console.log(`Checking ${name}...`);
    const response = await fetch(`${url}${endpoint}`, {
      method: 'GET',
      timeout: 5000
    });
    
    if (response.ok) {
      console.log(`✅ ${name} is healthy (${response.status})`);
      return true;
    } else {
      console.log(`❌ ${name} returned ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${name} is not accessible: ${error.message}`);
    return false;
  }
}

async function checkAppwrite() {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  
  if (!endpoint || !projectId) {
    console.log('⚠️  Appwrite configuration missing');
    return false;
  }
  
  try {
    console.log('Checking Appwrite...');
    const response = await fetch(`${endpoint}/health`, {
      method: 'GET',
      timeout: 5000
    });
    
    if (response.ok) {
      console.log('✅ Appwrite is healthy');
      return true;
    } else {
      console.log(`❌ Appwrite returned ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Appwrite is not accessible: ${error.message}`);
    return false;
  }
}

async function runHealthCheck() {
  const results = await Promise.all([
    checkService('Next.js', NEXT_URL, '/api/health'),
    checkService('Strapi', STRAPI_URL, '/api/articles?pagination[pageSize]=1'),
    checkAppwrite()
  ]);
  
  const allHealthy = results.every(result => result);
  
  console.log('\n📊 Health Check Summary:');
  console.log(`Status: ${allHealthy ? '✅ All services healthy' : '❌ Some services have issues'}`);
  console.log(`Next.js: ${results[0] ? '✅' : '❌'}`);
  console.log(`Strapi: ${results[1] ? '✅' : '❌'}`);
  console.log(`Appwrite: ${results[2] ? '✅' : '❌'}`);
  
  if (!allHealthy) {
    console.log('\n🔧 Troubleshooting:');
    if (!results[0]) console.log('- Check if Next.js is running on port 3000');
    if (!results[1]) console.log('- Check if Strapi is running on port 1337');
    if (!results[2]) console.log('- Check Appwrite configuration and network connectivity');
  }
  
  process.exit(allHealthy ? 0 : 1);
}

runHealthCheck();