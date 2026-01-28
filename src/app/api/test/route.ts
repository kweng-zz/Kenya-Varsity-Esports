import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'API is working correctly',
    timestamp: new Date().toISOString(),
    environment: {
      fallbackMode: process.env.NEXT_PUBLIC_FALLBACK_MODE,
      contentfulSpaceId: process.env.CONTENTFUL_SPACE_ID ? '✅ Present' : '❌ Missing',
      contentfulAccessToken: process.env.CONTENTFUL_ACCESS_TOKEN ? '✅ Present' : '❌ Missing',
      contentfulManagementToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN ? '✅ Present' : '❌ Missing'
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: 'POST request processed successfully',
      data: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to process POST request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: 'PUT request processed successfully',
      data: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to process PUT request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'DELETE request processed successfully',
    timestamp: new Date().toISOString()
  });
}