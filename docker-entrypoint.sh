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

# Start Strapi with more verbose logging
echo "🎯 Starting Strapi server..."
exec npm run start