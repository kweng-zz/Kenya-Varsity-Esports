import { NextResponse } from 'next/server';
import { Client, Databases } from 'node-appwrite';

export const dynamic = 'force-dynamic';

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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = initializeAppwrite();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, any> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.eventDate !== undefined) updateData.eventDate = body.eventDate ? new Date(body.eventDate).toISOString() : null;
    if (body.venue !== undefined) updateData.venue = body.venue;
    if (body.prizePool !== undefined) updateData.prizePool = body.prizePool;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;

    const doc = await db.updateDocument(
      DB_ID,
      EXTERNAL_EVENTS_COLLECTION,
      id,
      updateData
    );

    return NextResponse.json({ success: true, data: doc });
  } catch (error: any) {
    console.error('Update external event error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update external event' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = initializeAppwrite();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { id } = await params;

    await db.deleteDocument(DB_ID, EXTERNAL_EVENTS_COLLECTION, id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete external event error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete external event' },
      { status: 500 }
    );
  }
}
