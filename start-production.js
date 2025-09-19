#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting KUER Application in Production Mode...\n');

// Start Strapi in production mode
console.log('📡 Starting Strapi CMS in production...');
const strapi = spawn('npm', ['run', 'start'], {
  cwd: path.join(__dirname, 'kuer'),
  stdio: 'pipe',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: 'production',
    PORT: '1337'
  }
});

strapi.stdout.on('data', (data) => {
  console.log(`[Strapi] ${data.toString().trim()}`);
});

strapi.stderr.on('data', (data) => {
  console.error(`[Strapi Error] ${data.toString().trim()}`);
});

// Wait for Strapi to start, then start Next.js
setTimeout(() => {
  console.log('\n🌐 Starting Next.js Frontend in production...');
  const nextjs = spawn('npm', ['run', 'start:next'], {
    stdio: 'pipe',
    shell: true,
    env: {
      ...process.env,
      NODE_ENV: 'production',
      PORT: '3000'
    }
  });

  nextjs.stdout.on('data', (data) => {
    console.log(`[Next.js] ${data.toString().trim()}`);
  });

  nextjs.stderr.on('data', (data) => {
    console.error(`[Next.js Error] ${data.toString().trim()}`);
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...');
    strapi.kill('SIGINT');
    nextjs.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down servers...');
    strapi.kill('SIGTERM');
    nextjs.kill('SIGTERM');
    process.exit(0);
  });

}, 5000); // Give Strapi more time to start in production

console.log('\n✅ Both servers will be available at:');
console.log('🌐 Frontend: http://localhost:3000');
console.log('📡 Strapi Admin: http://localhost:1337/admin');
console.log('\n💡 Application starting in production mode...\n');