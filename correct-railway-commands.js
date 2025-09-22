#!/usr/bin/env node

/**
 * Correct Railway CLI Commands
 * 
 * The Railway CLI syntax uses --set flag, not 'set' command
 */

console.log('🔧 CORRECT Railway CLI Commands\n');

console.log('📋 COPY AND PASTE THESE COMMANDS:');
console.log('=================================\n');

const envVars = {
  JWT_SECRET: "I38ifgStkLURKgOTvCerY5ynoxbU389f",
  APP_KEYS: "Hoap3rKQ7eY2rStqElm1lg4eXWq6XvAiHLKiJHZgIpIg8NWK0yNltzAuCoXrGKRUuTM7RjTzhCS4tUhrZPNmQbjmKi5LxtxiGLNTUJZIXRGrNg7bAsz8Hleif5U6JZH7",
  API_TOKEN_SALT: "bXWMLsC1lJsHaZdmJVWKv5EPkc6qS4VI",
  ADMIN_JWT_SECRET: "UXHzwKkoXP5uN8Gg2aa5xawl4d75rPaW",
  TRANSFER_TOKEN_SALT: "oDUg82zY58DCZgousfNkCZ6TW54Q7Dls",
  HOST: "0.0.0.0",
  NODE_ENV: "production",
  SERVE_ADMIN_PANEL: "true",
  STRAPI_TELEMETRY_DISABLED: "true",
  FRONTEND_URL: "https://kenyaesportsrankings.org"
};

// Generate individual commands
Object.entries(envVars).forEach(([key, value]) => {
  console.log(`railway variables --set "${key}=${value}"`);
});

console.log('\n🚀 OR SET ALL AT ONCE:');
console.log('======================');

const allVars = Object.entries(envVars)
  .map(([key, value]) => `--set "${key}=${value}"`)
  .join(' ');

console.log(`railway variables ${allVars}`);

console.log('\n⚡ ALTERNATIVE: Use Railway Dashboard');
console.log('====================================');
console.log('1. Go to: https://railway.app/dashboard');
console.log('2. Open your "respectful-kindness" project');
console.log('3. Click "Variables" tab');
console.log('4. Add each variable manually');
console.log('');
console.log('Variables to add:');
Object.entries(envVars).forEach(([key, value]) => {
  console.log(`${key} = ${value}`);
});

console.log('\n🎯 WHAT HAPPENS NEXT:');
console.log('=====================');
console.log('1. Railway will automatically redeploy');
console.log('2. Strapi will start successfully');
console.log('3. Admin panel will be available at:');
console.log('   https://respectful-kindness-production.up.railway.app/admin');
console.log('4. Create your admin account');
console.log('5. Start managing content!');