import { NextResponse } from 'next/server';
import { Client, Databases, Query } from 'node-appwrite';
import { shortGameLabel } from '@/types/rankings';

/**
 * Public game rankings API.
 *
 * Serves the `game_category_rankings` collection — the same data the
 * admin Rankings Management page edits — so the frontend always matches
 * what admins enter.
 *
 * Response shape:
 * {
 *   success: true,
 *   data: {
 *     games: [{ id, name, shortName }],
 *     rankings: [{ id, rank, playerName, university, categoryId, gameName, points, wins, losses, image }]
 *   }
 * }
 */

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';
const RANKINGS_COLLECTION = 'game_category_rankings';
const TOURNAMENTS_COLLECTION = 'tournaments';

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

export async function GET() {
  try {
    const databases = initializeAppwrite();

    // 1. Games list comes from the published tournaments (the 4 real game titles)
    const games: { id: string; name: string; shortName: string; order: number }[] = [];
    try {
      const tournamentsRes = await databases.listDocuments(DATABASE_ID, TOURNAMENTS_COLLECTION, [
        Query.equal('status', 'published'),
        Query.orderAsc('$createdAt'),
        Query.limit(100),
      ]);
      for (const t of tournamentsRes.documents as any[]) {
        const id = t.slug || String(t.gameName || '').toLowerCase().replace(/\s+/g, '-');
        if (!id || games.some((g) => g.id === id)) continue;
        games.push({
          id,
          name: t.gameName || t.title || id,
          shortName: shortGameLabel(t.gameName || t.title || id),
          order: games.length,
        });
      }
    } catch (tournamentError) {
      console.warn('Rankings API: could not load tournaments for game list:', tournamentError);
    }

    // 2. Rankings rows
    const response = await databases.listDocuments(DATABASE_ID, RANKINGS_COLLECTION, [
      Query.limit(500),
    ]);

    const rankings = (response.documents as any[]).map((doc) => {
      const categoryId = doc.categoryId || doc.game || '';
      const known = games.find((g) => g.id === categoryId);
      const points = parseInt(doc.points, 10) || parseInt(doc.total, 10) || 0;
      return {
        id: doc.$id,
        rank: parseInt(doc.rank, 10) || 0,
        playerName: doc.playerName || '',
        university: doc.university || '',
        categoryId,
        gameName: known?.name || categoryId,
        points,
        wins: parseInt(doc.wins, 10) || 0,
        losses: parseInt(doc.losses, 10) || 0,
        image: doc.image || '',
      };
    });

    // Include any category present in rankings but missing from tournaments
    for (const row of rankings) {
      if (row.categoryId && !games.some((g) => g.id === row.categoryId)) {
        games.push({
          id: row.categoryId,
          name: row.categoryId,
          shortName: shortGameLabel(row.categoryId),
          order: games.length,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        games: games.map(({ id, name, shortName }) => ({ id, name, shortName })),
        rankings,
      },
    });
  } catch (error: any) {
    console.error('Rankings API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to load rankings' },
      { status: 500 }
    );
  }
}
