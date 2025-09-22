#!/bin/sh
echo "🚀 Starting KUER Application on Railway..."
echo "📡 Server will run on ${HOST:-0.0.0.0}:${PORT:-3000}"
echo "🔧 Environment: ${NODE_ENV:-production}"

exec npx next start -p ${PORT:-3000} -H ${HOST:-0.0.0.0}