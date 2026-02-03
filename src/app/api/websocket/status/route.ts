// src/app/api/websocket/status/route.ts
/**
 * WebSocket status endpoint
 * Returns WebSocket server status and stats
 */

import { NextRequest, NextResponse } from 'next/server';
import { sseManager } from '@/lib/realtime/sse-manager';
import '@/lib/startup'; // Trigger startup initialization

export async function GET(request: NextRequest) {
  try {
    // Get SSE manager stats
    const stats = sseManager.getStats();
    
    return NextResponse.json({
      success: true,
      data: {
        ready: true,
        type: 'SSE',
        stats: stats,
        connectionCount: sseManager.getConnectionCount(),
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('[SSE Status] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get SSE status',
        ready: false 
      },
      { status: 500 }
    );
  }
}