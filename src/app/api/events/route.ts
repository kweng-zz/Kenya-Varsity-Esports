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

// Map a tournament document to the event shape expected by the frontend
function toEvent(t: any) {
  const prizeStr = t.prizePool
    ? `${t.currency || 'KES'} ${Number(t.prizePool).toLocaleString()}`
    : 'TBD';

  // Format start date 
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

  // Map tournamentStatus to event-style status
  let status: 'OPEN' | 'LEAGUE' | 'PRO' = 'OPEN';
  if (t.tournamentStatus === 'registration_open') status = 'OPEN';
  else if (t.tournamentStatus === 'ongoing') status = 'LEAGUE';
  else if (t.tournamentStatus === 'completed') status = 'PRO';

  return {
    $id: t.$id,
    title: t.title || t.gameName,
    gameSlug: t.slug,
    image: t.featuredImageUrl || '/images/hero-bg.jpg',
    date: dateStr,
    time: timeStr,
    prizePool: prizeStr,
    entryFee: 'KES 5,000',
    status,
    tags: [t.gameName?.toUpperCase(), t.category?.toUpperCase()].filter(Boolean),
    registrationLink: `/tournament-registration`,
    detailsLink: `/games/${t.slug}/information`,
    isActive: true,
    isFeatured: t.isFeatured || false,
  };
}

export async function GET(request: Request) {
  try {
    const db = initializeAppwrite();
    if (!db) {
      return NextResponse.json({ success: true, data: [] });
    }

    const response = await db.listDocuments(DB_ID, TOURNAMENTS_COLLECTION, [
      Query.equal('showInEvents', true),
      Query.equal('status', 'published'),
      Query.orderDesc('startDate'),
      Query.limit(50),
    ]);

    const events = response.documents.map(toEvent);

    return NextResponse.json({
      success: true,
      data: events,
    });
  } catch (error: any) {
    console.error('Events API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
