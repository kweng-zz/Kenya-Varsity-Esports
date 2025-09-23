#!/usr/bin/env node

// Simple diagnostic to check Strapi server configuration
console.log('🔍 Strapi Server Configuration Debug\n');

// Check if we can read the server config
const path = require('path');
const fs = require('fs');

const serverConfigPath = path.join(__dirname, 'kuer', 'config', 'server.ts');

if (fs.existsSync(serverConfigPath)) {
  console.log('✅ Server config file exists');
  
  // Read the config
  const configContent = fs.readFileSync(serverConfigPath, 'utf8');
  
  // Check for key patterns
  const hasHostConfig = configContent.includes("host: env('HOST'");
  const hasPortConfig = configContent.includes("port: env.int('PORT'");
  const hasDefaultHost = configContent.includes("'0.0.0.0'");
  
  console.log(`✅ Host configuration: ${hasHostConfig ? 'Found' : 'Missing'}`);
  console.log(`✅ Port configuration: ${hasPortConfig ? 'Found' : 'Missing'}`);
  console.log(`✅ Default host 0.0.0.0: ${hasDefaultHost ? 'Found' : 'Missing'}`);
  
  if (hasHostConfig && hasPortConfig && hasDefaultHost) {
    console.log('\n✅ Server configuration looks correct');
    console.log('\n🔧 The issue is likely with Railway environment variables');
    console.log('\n📋 Please verify in Railway Dashboard → Variables:');
    console.log('   HOST=0.0.0.0');
    console.log('   NODE_ENV=production');
    console.log('   (Plus all the security keys)');
    
    console.log('\n🚨 CRITICAL: Make sure there are NO extra spaces or characters');
    console.log('   HOST should be exactly: 0.0.0.0');
    console.log('   NODE_ENV should be exactly: production');
    
    console.log('\n🔄 After verifying variables:');
    console.log('   1. Redeploy the service');
    console.log('   2. Wait 2-3 minutes');
    console.log('   3. Test with: node test-backend.cjs');
    
  } else {
    console.log('\n❌ Server configuration has issues');
    console.log('The server.ts file might need to be updated');
  }
  
} else {
  console.log('❌ Server config file not found');
  console.log('Expected location:', serverConfigPath);
}

console.log('\n🌐 Expected behavior after fix:');
console.log('   • Strapi should bind to 0.0.0.0:PORT (Railway port)');
console.log('   • Should be accessible at Railway URL');
console.log('   • Admin panel should work');
console.log('   • API endpoints should respond');

console.log('\n📞 If still not working after verifying variables:');
console.log('   • Check Railway deployment logs for errors');
console.log('   • Verify no typos in environment variable names');
console.log('   • Try deleting and re-adding the HOST variable');