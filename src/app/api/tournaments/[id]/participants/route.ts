// src/app/api/tournaments/[id]/participants/route.ts
/**
 * Participant Management API
 * GET: List participants
 * POST: Register new participant
 */

import { NextRequest, NextResponse } from 'next/server';
import { participantManagement } from '@/lib/services/participantManagement';
import { checkRateLimit } from '@/lib/redis-rate-limit';
import { z } from 'zod';
import { TournamentRegistrationPayloadSchema, validateTournamentPayload } from '@/components/tournament-registration/schema';
import { sseManager } from '@/lib/realtime/sse-manager';
import '@/lib/startup'; // Trigger startup initialization

/**
 * GET /api/tournaments/[id]/participants
 * List tournament participants
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tournamentId } = await params;
    const { searchParams } = new URL(request.url);

    const filters = {
      status: searchParams.get('status') as any,
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1', 10),
      pageSize: Math.min(100, parseInt(searchParams.get('pageSize') || '50', 10)),
    };

    const result = await participantManagement.listByTournament(tournamentId, filters);

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('[Participants API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tournaments/[id]/participants
 * Register new participant
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimitResponse = await checkRateLimit(request, 'AUTHENTICATED');
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { id: tournamentId } = await params;
    const body = await request.json();

    // Validate payload using TournamentRegistrationPayloadSchema
    const validationResult = TournamentRegistrationPayloadSchema.safeParse({
      ...body,
      tournamentId,
      registrationDate: new Date().toISOString(),
      status: 'pending',
      userId: body.userId || `user_${body.email}`,
    });

    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues.map((issue: any) => issue.message);
      return NextResponse.json(
        { 
          success: false, 
          error: 'VALIDATION_ERROR', 
          message: 'Invalid request payload',
          details: errorMessages
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Check if already registered
    const isRegistered = await participantManagement.isRegistered(
      tournamentId,
      validatedData.email
    );
    if (isRegistered) {
      return NextResponse.json(
        { success: false, error: 'ALREADY_REGISTERED', message: 'Email already registered for this tournament' },
        { status: 409 }
      );
    }

    // Register participant with full payload
    const result = await participantManagement.register(tournamentId, {
      tournamentId,
      playerName: validatedData.playerName,
      email: validatedData.email,
      studentId: validatedData.studentId,
      university: validatedData.university,
      teamName: validatedData.teamName,
      players: validatedData.players, // JSON string containing team members
      additionalInfo: validatedData.additionalInfo,
      userId: validatedData.userId,
    });

    if (!result.success) {
      // Handle specific error cases
      if (result.error?.includes('already registered') || result.error?.includes('already exists')) {
        return NextResponse.json(
          { success: false, error: 'CONFLICT', message: result.error },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'REGISTRATION_FAILED', message: result.error },
        { status: 400 }
      );
    }

    // Broadcast real-time update via SSE
    sseManager.broadcastToTournament(tournamentId, 'participant_registered', {
      participant: result.participant,
      tournamentId,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: result.participant,
    }, { status: 201 });

  } catch (error) {
    console.error('[Participants API] Error:', error);
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError && 'message' in error && error.message.includes('JSON')) {
      return NextResponse.json(
        { success: false, error: 'INVALID_JSON', message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
