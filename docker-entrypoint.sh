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
echo "📁 Build directory contents:"
ls -la build/

# Check if we have proper environment variables
if [ -z "$APP_KEYS" ]; then
    echo "❌ APP_KEYS environment variable is not set!"
    exit 1
fi

if [ -z "$JWT_SECRET" ]; then
    echo "❌ JWT_SECRET environment variable is not set!"
    exit 1
fi

echo "✅ Environment variables are set"

# Create .tmp directory if it doesn't exist (for SQLite database)
mkdir -p .tmp

# Start Strapi
echo "🎯 Starting Strapi server..."
exec npm run start