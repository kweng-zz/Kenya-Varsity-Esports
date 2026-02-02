# 🗄️ PostgreSQL Migration Guide

This guide walks you through migrating the blog ecosystem from SQLite to PostgreSQL for production deployment.

## 🎯 Why Migrate to PostgreSQL?

- **Better Performance**: PostgreSQL handles concurrent connections better than SQLite
- **Scalability**: Designed for production workloads with proper indexing
- **Reliability**: ACID compliance with proper transaction handling
- **Features**: Advanced queries, better full-text search, JSON support
- **Connections**: Supports connection pooling for high-traffic scenarios

## 📋 Prerequisites

1. **PostgreSQL Server**: Install PostgreSQL 14+ 
2. **Database**: Create database for the blog application
3. **Environment**: Set up database connection string

## 🔧 Installation

### 1. Install PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS (Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Windows:**
```bash
# Download from postgresql.org or use package manager
# PostgreSQL typically installs to C:\Program Files\PostgreSQL\15
```

### 2. Create Database (Choose ONE option)

**Option A: Local PostgreSQL (Self-Managed)**
```bash
# Switch to postgres user
sudo -u postgres psql

# Create database
CREATE DATABASE blog_prod;

# Create user (optional, you can use existing user)
CREATE USER blog_user WITH PASSWORD 'your_secure_password';

# Grant permissions
GRANT ALL PRIVILEGES ON DATABASE blog_prod TO blog_user;
```

**Option B: Supabase (Recommended - Managed)**
```bash
# 1. Create account at supabase.com
# 2. Note your Project URL: https://[PROJECT-REF].supabase.co
# 3. Get connection string from dashboard
# No server setup required!
```

### 3. Configure Connection

Update your `.env` file:

**Option A: Local PostgreSQL**
```env
POSTGRES_URL=postgresql://blog_user:your_secure_password@localhost:5432/blog_prod
DB_TYPE=postgresql
```

**Option B: Supabase (Recommended)**
```env
POSTGRES_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
DB_TYPE=postgresql
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]
```

**Getting Supabase Details:**
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **Database**
4. Copy the **Connection string** or individual parameters
5. Update your `.env` file

**Connection String Format:**
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

## 🚀 Migration Process

### Option 1: Automated Migration (Recommended)

Run the migration script with built-in safety features:

```bash
# Preview migration (no changes)
npm run migrate:db:dry-run

# Run actual migration
npm run migrate:db

# Custom batch size (for large datasets)
npm run migrate:db:preview

# Continue on errors (for problematic data)
npm run migrate:db --continue-on-error
```

### Option 2: Step-by-Step Manual Migration

1. **Backup Current Data**:
```bash
cp data/blog-features.db data/blog-features-backup.db
```

2. **Configure Application**:
```bash
# Stop current server
npm run dev

# Update environment variables
export DB_TYPE=postgresql
export POSTGRES_URL=postgresql://user:pass@localhost:5432/blog_prod

# Start server with PostgreSQL
npm run dev
```

3. **Verify Migration**:
```bash
# Check application health
npm run health-check

# Test bookmark functionality
curl -X POST http://localhost:3000/api/articles/test/bookmarks \
  -H "Content-Type: application/json" \
  -d '{"articleId":"test","userId":"test"}'
```

## 🔍 Migration Features

### ✅ Automatic Backup
- Creates timestamped backup before migration
- Backup stored in `data/` directory
- Rollback capability if migration fails

### ✅ Batch Processing
- Processes data in configurable batches (default: 1000 records)
- Prevents memory issues with large datasets
- Progress logging every 100 records

### ✅ Data Integrity
- Pre-migration data validation
- Post-migration verification
- Row-by-row comparison between SQLite and PostgreSQL
- Detailed mismatch reporting

### ✅ Transaction Safety
- All database operations wrapped in transactions
- Rollback on any failure within batch
- Connection pooling to prevent overload

### ✅ Performance Monitoring
- Migration progress tracking
- Timing information for each table
- Memory usage monitoring
- Connection pool health checks

## 📊 Migration Report

After migration, you'll see output like:

```
🚀 Starting database migration from SQLite to PostgreSQL...
🔍 DRY RUN MODE - No data will be modified
📊 Found 1,247 views to migrate
📊 Found 856 likes to migrate  
📊 Found 423 bookmarks to migrate
📊 Found 156 comments to migrate
📊 Found 89 follows to migrate

  Migrated 100 views...
  Migrated 200 views...
  ...

✅ Migration completed successfully!
📊 Results: {
  likesMigrated: 856,
  commentsMigrated: 156,
  bookmarksMigrated: 423,
  viewsMigrated: 1247,
  followsMigrated: 89
}

💾 Backup saved at: data/blog-features-backup-2024-01-15T10-30-00Z.db
```

## 🛠️ Troubleshooting

### Connection Issues

**Problem:** `Connection refused` or `authentication failed`
**Solution:** 
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -h localhost -U blog_user -d blog_prod -W

# Common fixes:
# 1. Check pg_hba.conf for authentication settings
# 2. Ensure PostgreSQL is running on correct port
# 3. Verify firewall settings
```

### Migration Errors

**Problem:** `Table doesn't exist` errors
**Solution:**
```bash
# Create tables manually in PostgreSQL
psql -d blog_prod -U blog_user -f create-tables.sql
```

**Problem:** `Data type mismatch` errors  
**Solution:**
- Check PostgreSQL version compatibility
- Verify UTF-8 encoding settings
- Review migration script for type conversions

### Performance Issues

**Problem:** Migration is very slow
**Solutions:**
```bash
# 1. Reduce batch size
npm run migrate:db --batch-size 100

# 2. Increase PostgreSQL resources
# Edit postgresql.conf
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 64MB

# 3. Use connection pooling
# Application handles this automatically
```

## 🔒 Security Considerations

### Database Security
```sql
-- Create limited-privilege user for application
CREATE USER blog_app_user WITH PASSWORD 'app_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO blog_app_user;
GRANT USAGE ON SCHEMA public TO blog_app_user;

-- Row Level Security (RLS) for multi-tenant
ALTER TABLE article_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_bookmarks_policy ON article_bookmarks
    FOR ALL TO blog_app_user
    USING (user_id = current_user_id());
```

### Connection Security
```bash
# SSL/TLS configuration
ssl = on
ssl_cert_file = '/path/to/server.crt'
ssl_key_file = '/path/to/server.key'

# Limit connections
max_connections = 100
superuser_reserved_connections = 3
```

## 📈 Production Optimization

### Connection Pooling
The PostgreSQL adapter is configured with:
- **Max Connections**: 20
- **Idle Timeout**: 30 seconds
- **Connection Timeout**: 2 seconds

### Indexing Strategy
Automatically created indexes:
- Primary keys on all tables
- Foreign key indexes
- Query optimization indexes
- Full-text search indexes (if needed)

### Monitoring Setup
```bash
# Enable PostgreSQL logging
log_statement = 'all'
log_duration = on
log_min_duration_statement = 1000

# Monitor connections
SELECT * FROM pg_stat_activity WHERE state = 'active';

# Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(tablename) AS size,
  pg_total_relation_size(tablename) AS total_size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename) DESC;
```

## 🔄 Switching Between Databases

You can easily switch between SQLite and PostgreSQL:

```env
# Use SQLite (development)
DB_TYPE=sqlite
# POSTGRES_URL=not-needed

# Use PostgreSQL (production)  
DB_TYPE=postgresql
POSTGRES_URL=postgresql://user:pass@localhost:5432/blog_prod
```

The application automatically detects `DB_TYPE` and uses the appropriate adapter.

## 🎯 Next Steps

After successful migration:

1. **Test Application**: Verify all functionality works
2. **Performance Test**: Load test with realistic traffic
3. **Monitoring Setup**: Implement database monitoring
4. **Backup Strategy**: Set up automated backups
5. **Scaling Plan**: Plan for horizontal scaling

## 📞 Support

If you encounter issues during migration:

1. Check the troubleshooting section above
2. Review PostgreSQL logs: `sudo tail -f /var/log/postgresql/postgresql.log`
3. Verify environment variables: `cat .env | grep POSTGRES`
4. Test connection: `psql $POSTGRES_URL -c "SELECT version();"`

## ✅ Migration Complete!

Once migrated, your blog ecosystem will be production-ready with:
- ✅ Enterprise-grade database
- ✅ Better performance and scalability
- ✅ ACID compliance and reliability
- ✅ Connection pooling and optimization
- ✅ Comprehensive error handling
- ✅ Rollback capability

Welcome to production-ready infrastructure! 🚀