#!/usr/bin/env node

import { spawn } from 'child_process';

console.log('🚀 Starting KUER Application on Railway...\n');

// Railway should only run the Next.js frontend
// Strapi is running on a separate Railway service
console.log('🌐 Starting Next.js Frontend for Railway deployment...');

const port = process.env.PORT || 3000;
console.log(`📡 Server will run on port: ${port}`);

const nextjs = spawn('npx', ['next', 'start', '-p', port], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: 'production',
    SKIP_STRAPI_BUILD: 'true'
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Next.js server...');
  nextjs.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down Next.js server...');
  nextjs.kill('SIGTERM');
  process.exit(0);
});

nextjs.on('error', (error) => {
  console.error('❌ Failed to start Next.js:', error);
  process.exit(1);
});

nextjs.on('exit', (code) => {
  console.log(`Next.js process exited with code ${code}`);
  process.exit(code);
});

console.log('\n✅ Next.js server starting...');
console.log(`🌐 Frontend will be available at: http://localhost:${port}`);
console.log('\n💡 Railway deployment in progress...\n');