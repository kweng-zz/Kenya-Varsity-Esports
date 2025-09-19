#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting KUER Application (Standalone Mode)...\n');

// Check if standalone build exists
const standalonePath = path.join(__dirname, '.next', 'standalone');
const useStandalone = fs.existsSync(standalonePath);

console.log(`📦 Using ${useStandalone ? 'standalone' : 'regular'} Next.js build`);

// Start Strapi in production mode
console.log('📡 Starting Strapi CMS in production...');
const strapi = spawn('npm', ['run', 'start'], {
  cwd: path.join(__dirname, 'kuer'),
  stdio: 'pipe',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: 'production',
    PORT: '1337',
    HOST: '0.0.0.0'
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
  
  let nextjsCmd, nextjsArgs, nextjsCwd;
  
  if (useStandalone) {
    nextjsCmd = 'node';
    nextjsArgs = ['server.js'];
    nextjsCwd = standalonePath;
  } else {
    nextjsCmd = 'npm';
    nextjsArgs = ['run', 'start:next'];
    nextjsCwd = __dirname;
  }
  
  const nextjs = spawn(nextjsCmd, nextjsArgs, {
    cwd: nextjsCwd,
    stdio: 'pipe',
    shell: true,
    env: {
      ...process.env,
      NODE_ENV: 'production',
      PORT: '3000',
      HOSTNAME: '0.0.0.0'
    }
  });

  nextjs.stdout.on('data', (data) => {
    console.log(`[Next.js] ${data.toString().trim()}`);
  });

  nextjs.stderr.on('data', (data) => {
    console.error(`[Next.js Error] ${data.toString().trim()}`);
  });

  // Handle process termination
  const cleanup = () => {
    console.log('\n🛑 Shutting down servers...');
    strapi.kill('SIGTERM');
    nextjs.kill('SIGTERM');
    setTimeout(() => process.exit(0), 1000);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

}, 8000); // Give Strapi more time to start in production

console.log('\n✅ Both servers will be available at:');
console.log('🌐 Frontend: http://localhost:3000');
console.log('📡 Strapi Admin: http://localhost:1337/admin');
console.log('\n💡 Application starting in production mode...\n');