// src/app/api/realtime/tournaments/[id]/events/route.ts
/**
 * Server-Sent Events endpoint for tournament updates
 * Provides real-time updates for tournament registrations and status changes
 */

import { NextRequest } from 'next/server';
import { sseManager } from '@/lib/realtime/sse-manager';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: tournamentId } = await params;
  const connectionId = `tournament_${tournamentId}_${Date.now()}_${Math.random()}`;

  // Create SSE response
  const stream = new ReadableStream({
    start(controller) {
      // Add connection to manager
      sseManager.addConnection(connectionId, controller);

      // Send initial connection event
      const welcomeEvent = {
        type: 'connected',
        data: {
          tournamentId,
          connectionId,
          message: 'Connected to tournament updates',
        },
        timestamp: Date.now(),
      };

      controller.enqueue(`event: connected\ndata: ${JSON.stringify(welcomeEvent)}\n\n`);

      // Cleanup on connection close
      request.signal.addEventListener('abort', () => {
        sseManager.removeConnection(connectionId);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
}