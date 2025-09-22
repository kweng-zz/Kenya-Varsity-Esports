#!/bin/bash
set -e

echo "🚀 Starting KUER Application..."
echo "📍 Current directory: $(pwd)"

echo "🔧 Environment variables:"
echo "NODE_ENV: ${NODE_ENV}"
echo "PORT: ${PORT}"
echo "HOSTNAME: ${HOSTNAME}"

echo "📦 Node.js version: $(node --version)"

echo "🌐 Starting Next.js server directly..."
# Use node directly to avoid any shell command issues
exec node ./node_modules/next/dist/bin/next start -p ${PORT} -H ${HOSTNAME}