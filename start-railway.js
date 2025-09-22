#!/usr/bin/env node

import { spawn } from 'child_process';

console.log('🚀 Starting KUER Application on Railway...\n');

// Railway should only run the Next.js frontend
// Strapi is running on a separate Railway service
console.log('🌐 Starting Next.js Frontend for Railway deployment...');

const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

console.log(`📡 Server will run on ${host}:${port}`);
console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);

// Start Next.js with explicit configuration
const nextjs = spawn('npx', ['next', 'start', '-p', port, '-H', host], {
  stdio: ['inherit', 'inherit', 'inherit'],
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: 'production',
    SKIP_STRAPI_BUILD: 'true',
    PORT: port,
    HOST: host
  }
});

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down Next.js server...');
  nextjs.kill('SIGINT');
  setTimeout(() => process.exit(0), 1000);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down Next.js server...');
  nextjs.kill('SIGTERM');
  setTimeout(() => process.exit(0), 1000);
});

nextjs.on('error', (error) => {
  console.error('❌ Failed to start Next.js:', error);
  process.exit(1);
});

nextjs.on('exit', (code, signal) => {
  if (signal) {
    console.log(`Next.js process killed by signal ${signal}`);
  } else {
    console.log(`Next.js process exited with code ${code}`);
  }
  process.exit(code || 0);
});

console.log('\n✅ Next.js server starting...');
console.log(`🌐 Frontend will be available at: http://${host}:${port}`);
console.log('\n💡 Railway deployment in progress...\n');