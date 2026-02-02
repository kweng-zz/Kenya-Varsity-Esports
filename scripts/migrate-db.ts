#!/usr/bin/env node

/**
 * Database Migration CLI
 * 
 * Usage:
 *   npm run migrate:db              # Run migration with default options
 *   npm run migrate:db --dry-run  # Preview migration without making changes
 *   npm run migrate:db --batch-size 500  # Use custom batch size
 */

import { runMigrationCLI } from '../src/lib/database-migrator';
import { MigrationOptions } from '../src/lib/database-migrator';

// Parse command line arguments
const args = process.argv.slice(2);
const options: MigrationOptions = {};

// Parse options
for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--dry-run':
      options.dryRun = true;
      console.log('🔍 Dry run mode enabled');
      break;
      
    case '--batch-size':
      if (i + 1 < args.length) {
        const batchSize = parseInt(args[i + 1]);
        if (!isNaN(batchSize) && batchSize > 0) {
          options.batchSize = batchSize;
          console.log(`📦 Using batch size: ${batchSize}`);
        } else {
          console.error('❌ Invalid batch size. Must be a positive number.');
          process.exit(1);
        }
      } else {
        console.error('❌ --batch-size requires a value');
        process.exit(1);
      }
      break;
      
    case '--continue-on-error':
      options.continueOnError = true;
      console.log('⚠️  Continue on error mode enabled');
      break;
      
    case '--help':
    case '-h':
      console.log(`
🗄️  Database Migration CLI

Usage:
  npm run migrate:db [options]

Options:
  --dry-run                    Preview migration without making changes
  --batch-size <number>         Number of records to process in each batch (default: 1000)
  --continue-on-error          Continue migration even if errors occur
  --help, -h                  Show this help message

Examples:
  npm run migrate:db                    # Run migration
  npm run migrate:db --dry-run             # Preview migration
  npm run migrate:db --batch-size 500     # Use smaller batches
  npm run migrate:db --continue-on-error    # Continue on errors
      `);
      process.exit(0);
      
    default:
      console.error(`❌ Unknown option: ${args[i]}`);
      console.log('Use --help for available options');
      process.exit(1);
  }
}

// Validate environment
if (!process.env.POSTGRES_URL) {
  console.error('❌ POSTGRES_URL environment variable is required');
  console.error('');
  console.error('Choose your setup:');
  console.error('');
  console.error('1. Local PostgreSQL:');
  console.error('   POSTGRES_URL=postgresql://user:password@localhost:5432/blog_prod');
  console.error('');
  console.error('2. Supabase (Recommended):');
  console.error('   POSTGRES_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres');
  console.error('');
  console.error('Get details: https://supabase.com/dashboard/project/[YOUR-PROJECT-REF]/settings/database');
  process.exit(1);
}

console.log('🚀 Starting database migration...');
console.log(`📊 Options:`, options);

// Run the migration
runMigrationCLI(options)
  .then(() => {
    console.log('\n✅ Migration process completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  });