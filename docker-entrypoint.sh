#!/bin/bash
set -e

echo "🚀 Starting Strapi application..."

# Check if build directory exists
if [ ! -d "build" ]; then
    echo "❌ Build directory not found!"
    echo "📁 Contents of current directory:"
    ls -la
    exit 1
fi

echo "✅ Build directory found"

# Create .tmp directory if it doesn't exist (for SQLite database)
mkdir -p .tmp
mkdir -p kuer/.tmp
echo "📁 Created .tmp directories"

# Check for config files
echo "🔍 Checking for config files..."
if [ -f "config/database.js" ]; then
    echo "✅ Found config/database.js"
fi
if [ -f "kuer/config/database.js" ]; then
    echo "✅ Found kuer/config/database.js"
fi
if [ -f "kuer/config/database.ts" ]; then
    echo "✅ Found kuer/config/database.ts"
fi

# Set default environment variables if not provided
export NODE_ENV=${NODE_ENV:-production}
export HOST=${HOST:-0.0.0.0}
export PORT=${PORT:-8080}
export DATABASE_CLIENT=${DATABASE_CLIENT:-sqlite}
export DATABASE_FILENAME=${DATABASE_FILENAME:-.tmp/data.db}

# Generate default secrets if not provided (for development/testing)
if [ -z "$APP_KEYS" ]; then
    echo "⚠️  APP_KEYS not set, using default (not secure for production)"
    export APP_KEYS="defaultKey1,defaultKey2,defaultKey3,defaultKey4"
fi

if [ -z "$JWT_SECRET" ]; then
    echo "⚠️  JWT_SECRET not set, using default (not secure for production)"
    export JWT_SECRET="defaultJWTSecret"
fi

if [ -z "$ADMIN_JWT_SECRET" ]; then
    echo "⚠️  ADMIN_JWT_SECRET not set, using default (not secure for production)"
    export ADMIN_JWT_SECRET="defaultAdminJWTSecret"
fi

if [ -z "$API_TOKEN_SALT" ]; then
    echo "⚠️  API_TOKEN_SALT not set, using default (not secure for production)"
    export API_TOKEN_SALT="defaultAPITokenSalt"
fi

if [ -z "$TRANSFER_TOKEN_SALT" ]; then
    echo "⚠️  TRANSFER_TOKEN_SALT not set, using default (not secure for production)"
    export TRANSFER_TOKEN_SALT="defaultTransferTokenSalt"
fi

echo "✅ Environment variables configured"
echo "�� NODE_ENV: $NODE_ENV"
echo "🔧 HOST: $HOST"
echo "🔧 PORT: $PORT"
echo "🔧 DATABASE_CLIENT: $DATABASE_CLIENT"

# Debug: Show current directory and files
echo "🔍 Current working directory: $(pwd)"
echo "🔍 Directory contents:"
ls -la

echo "🔍 Config directory contents:"
if [ -d "config" ]; then
    ls -la config/
else
    echo "❌ No config directory found"
fi

echo "🔍 Kuer config directory contents:"
if [ -d "kuer/config" ]; then
    ls -la kuer/config/
else
    echo "❌ No kuer/config directory found"
fi

# Test database config loading
echo "🧪 Testing database config..."
if [ -f "config/database.js" ]; then
    echo "✅ Found config/database.js - testing..."
    node -e "try { const config = require('./config/database.js'); console.log('Config test result:', typeof config); } catch(e) { console.error('Config test error:', e.message); }"
fi

if [ -f "kuer/config/database.js" ]; then
    echo "✅ Found kuer/config/database.js - testing..."
    node -e "try { const config = require('./kuer/config/database.js'); console.log('Kuer config test result:', typeof config); } catch(e) { console.error('Kuer config test error:', e.message); }"
fi

# Start Strapi with more verbose logging
echo "🎯 Starting Strapi server..."
exec npm run start