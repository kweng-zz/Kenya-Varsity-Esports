import { NextResponse } from 'next/server';
import { Client, Databases, ID, Query, Permission, Role } from 'node-appwrite';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

let client: Client | null = null;
let databases: Databases | null = null;

const initializeAppwrite = () => {
  if (!client) {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    const apiKey = process.env.APPWRITE_API_KEY;
    if (!endpoint || !projectId || !apiKey) return null;
    try {
      client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
      databases = new Databases(client);
    } catch { return null; }
  }
  return databases;
};

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';
const EXTERNAL_EVENTS_COLLECTION = 'external_events';

export async function GET() {
  try {
    const db = initializeAppwrite();
    if (!db) {
      return NextResponse.json({ success: true, data: [] });
    }

    const response = await db.listDocuments(DB_ID, EXTERNAL_EVENTS_COLLECTION, [
      Query.orderDesc('eventDate'),
      Query.limit(100),
    ]);

    return NextResponse.json({
      success: true,
      data: response.documents,
    });
  } catch (error: any) {
    console.error('External Events API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch external events' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = initializeAppwrite();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();

    const doc = await db.createDocument(
      DB_ID,
      EXTERNAL_EVENTS_COLLECTION,
      ID.unique(),
      {
        title: body.title,
        description: body.description || '',
        imageUrl: body.imageUrl,
        eventDate: body.eventDate ? new Date(body.eventDate).toISOString() : null,
        venue: body.venue || '',
        prizePool: body.prizePool || '',
        status: body.status || 'draft',
        tags: body.tags || [],
        isFeatured: body.isFeatured || false,
      },
      [
        Permission.read(Role.any()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );

    return NextResponse.json({ success: true, data: doc });
  } catch (error: any) {
    console.error('Create external event error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create external event' },
      { status: 500 }
    );
  }
}
