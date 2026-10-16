import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, Query, ID } from 'node-appwrite';
import { checkAdminAuth } from '@/lib/auth-check';

/**
 * Admin Rankings API — powers /admin/rankings.
 *
 * GET  ?categoryId=<slug>  → list ranking rows for a game category
 * POST { categoryId, rankings: [...] } → save rows (diff-based):
 *   - rows with an `id` are updated (stable document IDs across saves)
 *   - rows without an `id` are created
 *   - existing rows missing from the payload are deleted
 *   - an empty `rankings` array clears the category (after UI confirmation)
 */

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';
const RANKINGS_COLLECTION = 'game_category_rankings';

function initializeAppwrite(): Databases {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;

  if (!endpoint || !projectId || !apiKey) {
    throw new Error('Appwrite server configuration missing');
  }

  const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
  return new Databases(client);
}

interface RankingInput {
  id?: string;
  rank?: number | string;
  playerName?: string;
  university?: string;
  points?: number | string;
  wins?: number | string;
  losses?: number | string;
  image?: string;
}

function toRow(doc: any, categoryId: string) {
  const points = parseInt(doc.points, 10) || parseInt(doc.total, 10) || 0;
  return {
    id: doc.$id,
    rank: parseInt(doc.rank, 10) || 0,
    playerName: doc.playerName || '',
    university: doc.university || '',
    categoryId: doc.categoryId || categoryId,
    points,
    wins: parseInt(doc.wins, 10) || 0,
    losses: parseInt(doc.losses, 10) || 0,
    image: doc.image || '',
  };
}

function toDocData(row: RankingInput, categoryId: string, now: string) {
  const points = parseInt(String(row.points ?? 0), 10) || 0;
  return {
    categoryId: String(categoryId),
    rank: String(parseInt(String(row.rank ?? 0), 10) || 0),
    playerName: String(row.playerName || ''),
    university: String(row.university || ''),
    points: String(points),
    // `total` is kept in sync for schema compatibility
    total: String(points),
    wins: String(parseInt(String(row.wins ?? 0), 10) || 0),
    losses: String(parseInt(String(row.losses ?? 0), 10) || 0),
    image: String(row.image || ''),
    updatedAt: now,
  };
}

export async function GET(request: NextRequest) {
  const authError = await checkAdminAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const databases = initializeAppwrite();

    const queries: any[] = [Query.limit(500)];
    if (categoryId) queries.push(Query.equal('categoryId', categoryId));

    const response = await databases.listDocuments(DATABASE_ID, RANKINGS_COLLECTION, queries);
    const rows = (response.documents as any[])
      .map((doc) => toRow(doc, categoryId || ''))
      .sort((a, b) => a.rank - b.rank);

    return NextResponse.json({ success: true, data: rows, count: rows.length });
  } catch (error: any) {
    console.error('Admin rankings GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch rankings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authError = await checkAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { categoryId, rankings } = body as { categoryId?: string; rankings?: RankingInput[] };

    if (!categoryId || !Array.isArray(rankings)) {
      return NextResponse.json(
        { success: false, error: 'categoryId and rankings array are required' },
        { status: 400 }
      );
    }

    const databases = initializeAppwrite();
    const now = new Date().toISOString();

    const existingRes = await databases.listDocuments(DATABASE_ID, RANKINGS_COLLECTION, [
      Query.equal('categoryId', categoryId),
      Query.limit(500),
    ]);
    const existingById = new Map<string, any>(
      (existingRes.documents as any[]).map((doc) => [doc.$id, doc])
    );

    const incomingIds = new Set(rankings.map((r) => r.id).filter(Boolean) as string[]);

    // 1. Delete rows removed in the editor
    for (const doc of existingRes.documents as any[]) {
      if (!incomingIds.has(doc.$id)) {
        await databases.deleteDocument(DATABASE_ID, RANKINGS_COLLECTION, doc.$id);
      }
    }

    // 2. Update existing / create new — preserving payload order
    const saved: any[] = [];
    for (const row of rankings) {
      const data = toDocData(row, categoryId, now);
      if (row.id && existingById.has(row.id)) {
        const doc = await databases.updateDocument(DATABASE_ID, RANKINGS_COLLECTION, row.id, data);
        saved.push(toRow(doc, categoryId));
      } else {
        const doc = await databases.createDocument(DATABASE_ID, RANKINGS_COLLECTION, ID.unique(), {
          ...data,
          createdAt: now,
        });
        saved.push(toRow(doc, categoryId));
      }
    }

    return NextResponse.json({
      success: true,
      data: saved,
      count: saved.length,
      message:
        saved.length === 0
          ? `Cleared all rankings for ${categoryId}`
          : `Saved ${saved.length} ranking ${saved.length === 1 ? 'entry' : 'entries'} for ${categoryId}`,
    });
  } catch (error: any) {
    console.error('Admin rankings POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save rankings' },
      { status: 500 }
    );
  }
}
