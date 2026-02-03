// src/lib/websocket-init.ts
/**
 * WebSocket initialization for Next.js
 * Creates and manages WebSocket server alongside Next.js
 */

// Removed top-level import to prevent build errors
import { createServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';

let wsInitialized = false;

/**
 * Initialize WebSocket server if not already done
 * This can be called from API routes or middleware
 */
export async function ensureWebSocketInitialized() {
  if (wsInitialized) {
    return;
  }

  try {
    // Get the current server instance from Next.js
    const server = getCurrentServer();
    if (server) {
      // Dynamic import to avoid bundling socket.io on client
      const { initializeWebSocketServer } = await import('@/lib/realtime/websocket-server');
      initializeWebSocketServer(server);
      wsInitialized = true;
      console.log('✅ WebSocket server initialized successfully');
    } else {
      console.warn('⚠️ WebSocket server initialization postponed - no HTTP server available');
    }
  } catch (error) {
    console.error('❌ WebSocket initialization failed:', error);
  }
}

/**
 * Get the current HTTP server instance
 * In development, this may not be immediately available
 */
function getCurrentServer() {
  try {
    // Try to get the server from global scope (Next.js specific)
    const globalServer = (global as any).__NEXT_HTTP_SERVER;
    if (globalServer) {
      return globalServer;
    }
    
    // Fallback for development
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * API route middleware to ensure WebSocket is initialized
 */
export function withWebSocket(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Ensure WebSocket is initialized before handling the request
    await ensureWebSocketInitialized();
    return handler(req, res);
  };
}

/**
 * WebSocket ready state check
 */
export function isWebSocketReady(): boolean {
  return wsInitialized;
}

/**
 * Broadcast tournament updates via WebSocket
 */
export async function broadcastTournamentUpdate(
  tournamentId: string,
  eventType: 'participant_registered' | 'status_change' | 'score_update',
  data: any
) {
  await ensureWebSocketInitialized();
  
  const { broadcastToChannel } = await import('@/lib/realtime/websocket-server');
  const channel = `tournament:${tournamentId}`;
  
  broadcastToChannel(channel, eventType as any, data);
}