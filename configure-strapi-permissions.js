#!/usr/bin/env node

import fetch from 'node-fetch';

const STRAPI_URL = 'https://kuer-strapi-backend-production.up.railway.app';

console.log('🔧 Configuring Strapi Permissions...\n');

async function configurePermissions() {
  try {
    // First, check if we can access the API
    console.log('🔍 Checking Strapi API...');
    const healthCheck = await fetch(`${STRAPI_URL}/api/articles`);
    
    if (healthCheck.status === 403) {
      console.log('✅ Strapi is running but permissions need configuration');
      console.log('\n📋 MANUAL SETUP REQUIRED:');
      console.log('\n1. Go to: https://kuer-strapi-backend-production.up.railway.app/admin');
      console.log('2. Create your admin account');
      console.log('3. Go to Settings > Users & Permissions Plugin > Roles');
      console.log('4. Click on "Public" role');
      console.log('5. Under "Article", check the following permissions:');
      console.log('   ✅ find');
      console.log('   ✅ findOne');
      console.log('6. Click "Save"');
      console.log('\n7. Go to Content Manager > Article');
      console.log('8. Create some test articles');
      console.log('\n9. Your frontend should now work!');
      
      return;
    }
    
    if (healthCheck.status === 200) {
      console.log('✅ Strapi API is accessible!');
      const data = await healthCheck.json();
      console.log('📊 Articles found:', data.data?.length || 0);
      return;
    }
    
    console.log(`❌ Unexpected status: ${healthCheck.status}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n📋 MANUAL SETUP REQUIRED:');
    console.log('\n1. Go to: https://kuer-strapi-backend-production.up.railway.app/admin');
    console.log('2. Create your admin account');
    console.log('3. Configure permissions as described above');
  }
}

configurePermissions();