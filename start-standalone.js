#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting KUER Application (Standalone Next.js only)...\n');

// Only start Next.js - useful when Strapi is hosted separately
console.log('🌐 Starting Next.js Frontend...');
const nextjs = spawn('npm', ['run', 'start:next'], {
  stdio: 'inherit',
  shell: true
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

console.log('\n✅ Next.js server will be available at:');
console.log('🌐 Frontend: http://localhost:3000');
console.log('\n💡 Press Ctrl+C to stop the server\n');