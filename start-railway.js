#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting KUER Application for Railway...\n');

// Check if standalone build exists
const standalonePath = path.join(__dirname, '.next', 'standalone');
const useStandalone = fs.existsSync(standalonePath);

console.log(`📦 Using ${useStandalone ? 'standalone' : 'regular'} Next.js build`);

// For Railway, we'll just start Next.js
console.log('🌐 Starting Next.js Frontend...');

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
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: 'production',
    PORT: process.env.PORT || '3000',
    HOSTNAME: '0.0.0.0'
  }
});

// Handle process termination
const cleanup = () => {
  console.log('\n🛑 Shutting down server...');
  nextjs.kill('SIGTERM');
  setTimeout(() => process.exit(0), 1000);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

nextjs.on('exit', (code) => {
  console.log(`Next.js process exited with code ${code}`);
  process.exit(code);
});

console.log('\n✅ Frontend will be available at:');
console.log(`🌐 Frontend: http://localhost:${process.env.PORT || '3000'}`);
console.log('\n💡 Application starting...\n');