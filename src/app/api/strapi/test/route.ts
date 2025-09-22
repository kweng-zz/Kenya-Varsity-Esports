import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function GET(request: NextRequest) {
  const testResults = {
    timestamp: new Date().toISOString(),
    environment: {
      STRAPI_URL,
      hasApiToken: !!STRAPI_API_TOKEN,
      nodeEnv: process.env.NODE_ENV,
    },
    tests: [] as Array<{
      name: string;
      status: 'pass' | 'fail' | 'warning';
      message: string;
      details?: any;
    }>
  };

  // Test 1: Basic Strapi connection
  try {
    const response = await fetch(`${STRAPI_URL}/api/articles?pagination[limit]=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
      },
    });

    if (response.ok) {
      const data = await response.json();
      testResults.tests.push({
        name: 'Strapi Connection',
        status: 'pass',
        message: `Successfully connected to Strapi at ${STRAPI_URL}`,
        details: {
          status: response.status,
          articlesFound: data.data?.length || 0,
          totalArticles: data.meta?.pagination?.total || 0
        }
      });
    } else {
      testResults.tests.push({
        name: 'Strapi Connection',
        status: 'fail',
        message: `Failed to connect to Strapi: ${response.status} ${response.statusText}`,
        details: {
          status: response.status,
          statusText: response.statusText
        }
      });
    }
  } catch (error) {
    testResults.tests.push({
      name: 'Strapi Connection',
      status: 'fail',
      message: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: { error: error instanceof Error ? error.message : String(error) }
    });
  }

  // Test 2: Check if articles exist
  try {
    const response = await fetch(`${STRAPI_URL}/api/articles?populate=image`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
      },
    });

    if (response.ok) {
      const data = await response.json();
      const articles = data.data || [];
      
      testResults.tests.push({
        name: 'Articles Check',
        status: articles.length > 0 ? 'pass' : 'warning',
        message: `Found ${articles.length} articles in Strapi`,
        details: {
          totalArticles: articles.length,
          sampleSlugs: articles.slice(0, 3).map((a: any) => a.slug || a.attributes?.slug).filter(Boolean),
          hasImages: articles.filter((a: any) => a.image || a.attributes?.image).length
        }
      });
    } else {
      testResults.tests.push({
        name: 'Articles Check',
        status: 'fail',
        message: `Failed to fetch articles: ${response.status}`,
        details: { status: response.status }
      });
    }
  } catch (error) {
    testResults.tests.push({
      name: 'Articles Check',
      status: 'fail',
      message: `Error fetching articles: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: { error: error instanceof Error ? error.message : String(error) }
    });
  }

  // Test 3: Check upload endpoint
  try {
    const response = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
      },
    });

    testResults.tests.push({
      name: 'Upload Endpoint',
      status: response.status === 200 || response.status === 405 ? 'pass' : 'fail',
      message: response.status === 405 ? 'Upload endpoint exists (405 expected for GET)' : `Upload endpoint status: ${response.status}`,
      details: { status: response.status }
    });
  } catch (error) {
    testResults.tests.push({
      name: 'Upload Endpoint',
      status: 'fail',
      message: `Upload endpoint error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: { error: error instanceof Error ? error.message : String(error) }
    });
  }

  // Test 4: Check specific article by slug (if provided)
  const url = new URL(request.url);
  const testSlug = url.searchParams.get('slug');
  
  if (testSlug) {
    try {
      const response = await fetch(`${STRAPI_URL}/api/articles?filters[slug][$eq]=${testSlug}&populate=image`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
        },
      });

      if (response.ok) {
        const data = await response.json();
        const found = data.data && data.data.length > 0;
        
        testResults.tests.push({
          name: `Slug Test: ${testSlug}`,
          status: found ? 'pass' : 'warning',
          message: found ? `Article found with slug: ${testSlug}` : `No article found with slug: ${testSlug}`,
          details: {
            found,
            articleData: found ? {
              id: data.data[0].id,
              title: data.data[0].title || data.data[0].attributes?.title,
              slug: data.data[0].slug || data.data[0].attributes?.slug,
              hasImage: !!(data.data[0].image || data.data[0].attributes?.image)
            } : null
          }
        });
      } else {
        testResults.tests.push({
          name: `Slug Test: ${testSlug}`,
          status: 'fail',
          message: `Failed to search for slug: ${response.status}`,
          details: { status: response.status }
        });
      }
    } catch (error) {
      testResults.tests.push({
        name: `Slug Test: ${testSlug}`,
        status: 'fail',
        message: `Error searching for slug: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error: error instanceof Error ? error.message : String(error) }
      });
    }
  }

  // Summary
  const passCount = testResults.tests.filter(t => t.status === 'pass').length;
  const failCount = testResults.tests.filter(t => t.status === 'fail').length;
  const warningCount = testResults.tests.filter(t => t.status === 'warning').length;

  return NextResponse.json({
    ...testResults,
    summary: {
      total: testResults.tests.length,
      passed: passCount,
      failed: failCount,
      warnings: warningCount,
      overallStatus: failCount > 0 ? 'fail' : warningCount > 0 ? 'warning' : 'pass'
    }
  });
}