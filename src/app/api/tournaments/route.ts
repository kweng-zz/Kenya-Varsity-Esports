// src/app/api/tournaments/route.ts
/**
 * Tournaments API
 * GET: List all tournaments with optional filtering
 */

import { NextRequest, NextResponse } from 'next/server';
import { tournamentService } from '@/lib/services/tournamentService';

/**
 * GET /api/tournaments
 * List all tournaments
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get filtering parameters
    const status = searchParams.get('status');
    const tournamentStatus = searchParams.get('tournamentStatus');
    const game = searchParams.get('game');
    const category = searchParams.get('category');

    console.log('📋 API - Fetching tournaments with filters:', { status, tournamentStatus, game, category });

    // Get all published tournaments
    const tournaments = await tournamentService.getPublishedTournaments();
    
    // Debug: Log the tournament statuses we found
    console.log('📋 API - Tournament statuses found:', tournaments.map(t => ({
      id: t.id,
      title: t.title,
      tournamentStatus: t.tournamentStatus,
      status: t.status
    })));

    // Apply filters
    let filteredTournaments = tournaments;

    if (tournamentStatus) {
      console.log('📋 API - Filtering by tournamentStatus:', tournamentStatus);
      console.log('📋 API - Available statuses:', [...new Set(tournaments.map(t => t.tournamentStatus))]);
      
      // Support comma-separated values for multiple statuses (e.g., "registration_open,upcoming")
      const statusesToMatch = tournamentStatus.split(',').map(s => s.trim().toLowerCase());
      
      filteredTournaments = filteredTournaments.filter(t => {
        const tourStatus = (t.tournamentStatus || '').toLowerCase();
        const matches = statusesToMatch.includes(tourStatus);
        console.log(`📋 API - Tournament "${t.title}" status: "${t.tournamentStatus}" -> matches: ${matches}`);
        return matches;
      });
    }

    if (game) {
      filteredTournaments = filteredTournaments.filter(t => 
        t.gameName.toLowerCase().includes(game.toLowerCase()) ||
        t.slug === game
      );
    }

    if (category) {
      filteredTournaments = filteredTournaments.filter(t => t.category === category);
    }

    // Log the results
    console.log(`📋 API - Returning ${filteredTournaments.length} tournaments`);

    return NextResponse.json({
      success: true,
      data: filteredTournaments,
      total: filteredTournaments.length,
    });

  } catch (error) {
    console.error('[Tournaments API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR', message: 'Failed to fetch tournaments' },
      { status: 500 }
    );
  }
}