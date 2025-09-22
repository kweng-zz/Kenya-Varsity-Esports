#!/bin/bash

# Production Strapi Deployment Script
echo "🚀 Deploying Strapi to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
    echo "✅ Railway CLI installed"
fi

# Navigate to Strapi directory
cd kuer

echo "📋 Deployment Steps:"
echo "1. Login to Railway"
echo "2. Create new project for Strapi"
echo "3. Add PostgreSQL database"
echo "4. Deploy Strapi"
echo "5. Configure environment variables"

echo ""
echo "🔧 Run these commands manually:"
echo "cd kuer"
echo "railway login"
echo "railway new"
echo "railway add postgresql"
echo "railway up"

echo ""
echo "📝 After deployment:"
echo "1. Copy environment variables from .env.production.template"
echo "2. Set them in Railway dashboard"
echo "3. Update your frontend .env with the new Strapi URL"
echo "4. Test the connection"
