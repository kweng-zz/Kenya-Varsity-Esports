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
const EXTERNAL_EVENTS_COLLECTION = 'external_events';

export async function GET() {
  try {
    const db = initializeAppwrite();
    if (!db) {
      return NextResponse.json({ success: false, error: 'No featured event found' }, { status: 404 });
    }

    // 1. Fetch latest featured tournament
    const tournamentResponse = await db.listDocuments(DB_ID, TOURNAMENTS_COLLECTION, [
      Query.equal('showInEvents', true),
      Query.equal('isFeatured', true),
      Query.equal('status', 'published'),
      Query.orderDesc('$updatedAt'),
      Query.limit(1),
    ]);

    // 2. Fetch latest featured external event
    let externalEvent: any = null;
    try {
      const externalResponse = await db.listDocuments(DB_ID, EXTERNAL_EVENTS_COLLECTION, [
        Query.equal('isFeatured', true),
        Query.equal('status', 'published'),
        Query.orderDesc('$updatedAt'),
        Query.limit(1),
      ]);
      if (externalResponse.documents.length > 0) {
        externalEvent = externalResponse.documents[0];
      }
    } catch (err) {
      console.warn('External events collection fetch error:', err);
    }

    const tournament = tournamentResponse.documents.length > 0 ? tournamentResponse.documents[0] : null;

    // 3. Determine which is more recent or just pick the available one
    let winner: any = null;
    let isExternal = false;

    if (tournament && externalEvent) {
      const tDate = new Date(tournament.$updatedAt).getTime();
      const eDate = new Date(externalEvent.$updatedAt).getTime();
      if (eDate > tDate) {
        winner = externalEvent;
        isExternal = true;
      } else {
        winner = tournament;
        isExternal = false;
      }
    } else if (externalEvent) {
      winner = externalEvent;
      isExternal = true;
    } else if (tournament) {
      winner = tournament;
      isExternal = false;
    }

    if (!winner) {
      return NextResponse.json(
        { success: false, error: 'No featured event found' },
        { status: 404 }
      );
    }

    let featuredEvent: any = {};

    if (isExternal) {
      let dateStr = '';
      let timeStr = '';
      if (winner.eventDate) {
        const d = new Date(winner.eventDate);
        dateStr = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
        timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      }

      featuredEvent = {
        $id: winner.$id,
        title: winner.title,
        image: winner.imageUrl || '/images/hero-bg.jpg',
        date: dateStr,
        time: timeStr,
        prizePool: 'FEATURED EVENT',
        gameSlug: 'external',
        registrationLink: winner.externalUrl,
        isExternal: true,
        externalUrl: winner.externalUrl,
      };
    } else {
      const t = winner;
      const prizeStr = t.prizePool
        ? `${t.currency || 'KES'} ${Number(t.prizePool).toLocaleString()}`
        : 'TBD';

      let dateStr = '';
      let timeStr = '';
      if (t.startDate) {
        const d = new Date(t.startDate);
        dateStr = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
        timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      }

      featuredEvent = {
        $id: t.$id,
        title: t.title || t.gameName,
        gameSlug: t.slug,
        image: t.featuredImageUrl || '/images/hero-bg.jpg',
        date: dateStr,
        time: timeStr,
        prizePool: prizeStr,
        registrationLink: `/tournament-registration`,
        isExternal: false,
      };
    }

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
