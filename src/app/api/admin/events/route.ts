import { NextResponse } from 'next/server';
import { Client, Databases, Query } from 'node-appwrite';

const initializeAppwrite = () => {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;
  if (!endpoint || !projectId || !apiKey) return null;
  try {
    const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
    return new Databases(client);
  } catch {
    return null;
  }
};

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';
const TOURNAMENTS_COLLECTION = 'tournaments';
const EXTERNAL_EVENTS_COLLECTION = 'external_events';

interface CandidateEvent {
  id: string;
  title: string;
  game: string;
  slug: string;
  source: 'tournament' | 'external';
  date: string | null;
  status: string;
}

export async function GET() {
  try {
    const db = initializeAppwrite();
    if (!db) {
      return NextResponse.json({ success: true, data: [] });
    }

    const events: CandidateEvent[] = [];

    // Tournaments (per-game events)
    try {
      const tournaments = await db.listDocuments(DB_ID, TOURNAMENTS_COLLECTION, [
        Query.orderDesc('$createdAt'),
        Query.limit(200),
      ]);
      for (const t of tournaments.documents as any[]) {
        events.push({
          id: t.$id,
          title: t.title || t.gameName || 'Untitled tournament',
          game: t.gameName || '',
          slug: t.slug || '',
          source: 'tournament',
          date: t.startDate || null,
          status: t.status || 'draft',
        });
      }
    } catch (err) {
      console.warn('Admin events: tournaments unavailable', err);
    }

    // External events
    try {
      const external = await db.listDocuments(DB_ID, EXTERNAL_EVENTS_COLLECTION, [
        Query.orderDesc('eventDate'),
        Query.limit(200),
      ]);
      for (const e of external.documents as any[]) {
        events.push({
          id: e.$id,
          title: e.title || 'Untitled event',
          game: '',
          slug: '',
          source: 'external',
          date: e.eventDate || null,
          status: e.status || 'draft',
        });
      }
    } catch (err) {
      console.warn('Admin events: external events unavailable', err);
    }

    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    console.error('Admin events list error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch events' }, { status: 500 });
  }
}