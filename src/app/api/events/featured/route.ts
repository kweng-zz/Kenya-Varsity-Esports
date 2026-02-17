import { NextResponse } from 'next/server';
import { Client, Databases, Query } from 'node-appwrite';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Lazy init
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
const TOURNAMENTS_COLLECTION = 'tournaments';

export async function GET() {
  try {
    const db = initializeAppwrite();
    if (!db) {
      return NextResponse.json({ success: false, error: 'No featured event found' }, { status: 404 });
    }

    const response = await db.listDocuments(DB_ID, TOURNAMENTS_COLLECTION, [
      Query.equal('showInEvents', true),
      Query.equal('isFeatured', true),
      Query.equal('status', 'published'),
      Query.orderDesc('$updatedAt'),
      Query.limit(1),
    ]);

    if (response.documents.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No featured event found' },
        { status: 404 }
      );
    }

    const t = response.documents[0];

    const prizeStr = t.prizePool
      ? `${t.currency || 'KES'} ${Number(t.prizePool).toLocaleString()}`
      : 'TBD';

    let dateStr = '';
    if (t.startDate) {
      const d = new Date(t.startDate);
      dateStr = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
    }

    let timeStr = '';
    if (t.startDate) {
      const d = new Date(t.startDate);
      timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    const featuredEvent = {
      $id: t.$id,
      title: t.title || t.gameName,
      gameSlug: t.slug,
      image: t.featuredImageUrl || '/images/hero-bg.jpg',
      date: dateStr,
      time: timeStr,
      prizePool: prizeStr,
      registrationLink: `/tournament-registration`,
    };

    return NextResponse.json({
      success: true,
      data: featuredEvent,
    });
  } catch (error: any) {
    console.error('Featured Event API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch featured event' },
      { status: 500 }
    );
  }
}
