#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🚀 Setting up Strapi for Railway deployment...\n');

// Check if kuer directory exists
if (!fs.existsSync('./kuer')) {
  console.error('❌ Error: kuer directory not found!');
  console.log('Make sure you run this script from the root of your project.');
  process.exit(1);
}

try {
  // Create kuer-backend directory
  console.log('📁 Creating kuer-backend directory...');
  if (fs.existsSync('./kuer-backend')) {
    console.log('⚠️  kuer-backend directory already exists, removing...');
    fs.rmSync('./kuer-backend', { recursive: true, force: true });
  }
  
  fs.mkdirSync('./kuer-backend');
  
  // Copy files from kuer to kuer-backend
  console.log('📋 Copying Strapi files...');
  
  // Windows-compatible file copying
  function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    
    if (isDirectory) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
      }
      fs.readdirSync(src).forEach(function(childItemName) {
        copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  }
  
  copyRecursiveSync('./kuer', './kuer-backend');
  
  // Create .gitignore for the backend
  const gitignoreContent = `############################
# OS X
############################

.DS_Store
.AppleDouble
.LSOverride
Icon
.Spotlight-V100
.Trashes
._*

############################
# Linux
############################

*~

############################
# Windows
############################

Thumbs.db
ehthumbs.db
Desktop.ini
$RECYCLE.BIN/
*.cab
*.msi
*.msm
*.msp

############################
# Packages
############################

*.7z
*.csv
*.dat
*.dmg
*.gz
*.iso
*.jar
*.rar
*.tar
*.zip
*.com
*.class
*.dll
*.exe
*.o
*.seed
*.so
*.swo
*.swp
*.swn
*.swm
*.out
*.pid

############################
# Logs and databases
############################

.tmp
*.log
*.sql
*.sqlite
*.sqlite3

############################
# Misc.
############################

*#
ssl
.idea
nbproject
public/uploads/*
!public/uploads/.gitkeep

############################
# Node.js
############################

lib-cov
lcov.info
pids
logs
results
node_modules
.node_history

############################
# Tests
############################

coverage

############################
# Strapi
############################

.env
license.txt
exports
*.cache
dist
build
.strapi-updater.json
.strapi

############################
# Environment
############################
.env.local
.env.development.local
.env.test.local
.env.production.local`;

  fs.writeFileSync('./kuer-backend/.gitignore', gitignoreContent);
  
  console.log('✅ Setup complete!');
  console.log('\n��� Next steps:');
  console.log('1. cd kuer-backend');
  console.log('2. git init');
  console.log('3. git add .');
  console.log('4. git commit -m "Initial Strapi backend for Railway"');
  console.log('5. Create a new GitHub repository');
  console.log('6. git remote add origin <your-github-repo-url>');
  console.log('7. git push -u origin main');
  console.log('8. Deploy to Railway using the GitHub repository');
  
} catch (error) {
  console.error('❌ Error during setup:', error.message);
  process.exit(1);
}