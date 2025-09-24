#!/usr/bin/env node

import http from 'http';

const STRAPI_URL = 'http://localhost:1337';

console.log('🔍 Checking Strapi backend status...');

// Check if Strapi is running
const checkStrapi = () => {
  return new Promise((resolve, reject) => {
    const req = http.get(`${STRAPI_URL}/api`, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
};

// Check admin panel
const checkAdmin = () => {
  return new Promise((resolve, reject) => {
    const req = http.get(`${STRAPI_URL}/admin`, (res) => {
      resolve({
        status: res.statusCode,
        message: 'Admin panel accessible'
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Admin request timeout'));
    });
  });
};

async function main() {
  try {
    console.log('📡 Testing API endpoint...');
    const apiResult = await checkStrapi();
    console.log('✅ API Status:', apiResult.status);
    
    console.log('🔧 Testing Admin panel...');
    const adminResult = await checkAdmin();
    console.log('✅ Admin Status:', adminResult.status);
    
    console.log('\n🎉 Strapi backend is running correctly!');
    console.log('🌐 API URL:', `${STRAPI_URL}/api`);
    console.log('⚙️  Admin URL:', `${STRAPI_URL}/admin`);
    
  } catch (error) {
    console.log('\n❌ Strapi backend is not running or not accessible');
    console.log('Error:', error.message);
    console.log('\n🚀 To start Strapi backend:');
    console.log('   npm run strapi:dev');
    console.log('   or');
    console.log('   cd kuer && npm run develop');
    
    process.exit(1);
  }
}

main();