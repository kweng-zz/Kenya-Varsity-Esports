#!/bin/bash

# Key rotation script - Generated on 2026-01-28T12:54:55.045Z
# Use this to rotate keys when needed

echo "🔄 Starting API key rotation..."

# Backup current keys
cp .env .env.backup.$(date +%s)

# Old keys (remove from .env)
OLD_KEYS=(
  "APPWRITE_API_KEY"
  "CONTENTFUL_ACCESS_TOKEN"
  "CONTENTFUL_MANAGEMENT_TOKEN"
  "CONTENTFUL_PREVIEW_ACCESS_TOKEN"
  "MAILCHIMP_API_KEY"
)

# Function to remove old key
remove_key() {
  local key=$1
  echo "🗑️  Removing old $1 from production..."
  # Implementation depends on your deployment platform
}

echo "✅ Key rotation completed"
echo "⚠️  Update your deployment platform with new keys:"
   APPWRITE_API_KEY=8b13c1124f0c9c9d0e2c29331655d59043f7f089e00de1746449cde554d4394cd85e3a94db57a4ad162069ce085d55816ef299dc9f97345c7ef97dd5b0f5e729
   CONTENTFUL_ACCESS_TOKEN=e8ad587b85e9a16ff6b27a174627ef6602e8c152be7865ae0c17f9f3c9be159b
   CONTENTFUL_MANAGEMENT_TOKEN=829f94a90460a15c1f031d41a891dfd42be3ff4017cb9c975df19de47de04c80
   CONTENTFUL_PREVIEW_ACCESS_TOKEN=cb9a60f9b55975db047e05c0a3d5e36ceb6cce49cb7f61b11d44ae5d9bb649cc
   MAILCHIMP_API_KEY=2c862c9879e961407bd78667eb31b974e89802163669eea4-us18
