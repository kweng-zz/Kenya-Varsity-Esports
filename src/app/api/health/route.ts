import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if environment variables are configured
    const appwriteConfigured = !!(
      process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT &&
      process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_APPWRITE_DB_ID
    );

    const strapiConfigured = !!(
      process.env.NEXT_PUBLIC_STRAPI_URL &&
      process.env.NEXT_PUBLIC_STRAPI_API_TOKEN
    );

    // Test Strapi connection
    let strapiHealthy = false;
    if (strapiConfigured) {
      try {
        const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
        const response = await fetch(`${strapiUrl}/api/articles?pagination[pageSize]=1`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          // Add timeout
          signal: AbortSignal.timeout(5000)
        });
        strapiHealthy = response.ok;
      } catch (error) {
        console.error('Strapi health check failed:', error);
        strapiHealthy = false;
      }
    }

    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        nextjs: {
          status: 'healthy',
          version: process.env.npm_package_version || 'unknown'
        },
        appwrite: {
          status: appwriteConfigured ? 'configured' : 'not_configured',
          endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'not_set'
        },
        strapi: {
          status: strapiConfigured ? (strapiHealthy ? 'healthy' : 'unhealthy') : 'not_configured',
          url: process.env.NEXT_PUBLIC_STRAPI_URL || 'not_set'
        }
      },
      environment: {
        node_env: process.env.NODE_ENV || 'unknown',
        vercel: process.env.VERCEL === '1' ? 'true' : 'false'
      }
    };

    const allHealthy = strapiHealthy && appwriteConfigured;
    
    return NextResponse.json(health, { 
      status: allHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Health check failed',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}