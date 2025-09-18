#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting KUER Application...\n');

// Start Strapi
console.log('📡 Starting Strapi CMS...');
const strapi = spawn('npm', ['run', 'develop'], {
  cwd: path.join(__dirname, 'kuer'),
  stdio: 'pipe',
  shell: true
});

strapi.stdout.on('data', (data) => {
  console.log(`[Strapi] ${data.toString().trim()}`);
});

strapi.stderr.on('data', (data) => {
  console.error(`[Strapi Error] ${data.toString().trim()}`);
});

// Wait a bit for Strapi to start, then start Next.js
setTimeout(() => {
  console.log('\n🌐 Starting Next.js Frontend...');
  const nextjs = spawn('npm', ['run', 'dev:next'], {
    stdio: 'pipe',
    shell: true
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

}, 3000);

console.log('\n✅ Both servers will be available at:');
console.log('🌐 Frontend: http://localhost:3000');
console.log('📡 Strapi Admin: http://localhost:1337/admin');
console.log('\n💡 Press Ctrl+C to stop both servers\n');