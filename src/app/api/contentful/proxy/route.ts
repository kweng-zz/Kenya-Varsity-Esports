import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const contentType = searchParams.get('contentType') || 'blogPost';
  const limit = searchParams.get('limit') || '10';

  try {
    const contentful = require('contentful');
    const client = contentful.createClient({
      spaceId: process.env.CONTENTFUL_SPACE_ID,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    });

    const entries = await client.getEntries({
      content_type: contentType,
      limit: parseInt(limit),
    });

    return NextResponse.json({ items: entries.items });
  } catch (error) {
    console.error('Contentful API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentfulManagement = require('contentful-management');
    const client = contentfulManagement.createClient({
      accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
    });

    const body = await request.json();
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');

    const entry = await environment.createEntry(body.contentType, {
      fields: body.fields,
    });

    return NextResponse.json({ entry });
  } catch (error) {
    console.error('Contentful management error:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}