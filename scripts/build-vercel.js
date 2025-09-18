#!/usr/bin/env node

/**
 * Vercel-specific build script
 * This script builds only the Next.js app for deployment
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';

console.log('🚀 Starting Vercel build process...');

try {
  // Check if we're in a Vercel environment
  const isVercel = process.env.VERCEL === '1';
  
  if (isVercel) {
    console.log('📦 Building for Vercel deployment (Next.js only)...');
    
    // Only build Next.js for Vercel
    execSync('next build --turbopack', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    console.log('✅ Vercel build completed successfully!');
  } else {
    console.log('🏠 Building for local development (Full stack)...');
    
    // Check if Strapi directory exists
    if (existsSync('./kuer')) {
      console.log('📦 Building Strapi...');
      execSync('cd kuer && npm run build', { 
        stdio: 'inherit',
        cwd: process.cwd()
      });
    } else {
      console.log('⚠️ Strapi directory not found, skipping Strapi build');
    }
    
    console.log('📦 Building Next.js...');
    execSync('next build --turbopack', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    console.log('✅ Full build completed successfully!');
  }
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}