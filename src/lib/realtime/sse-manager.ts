// src/lib/realtime/sse-manager.ts
/**
 * Server-Sent Events Manager
 * Real-time updates using SSE instead of WebSocket for better Next.js compatibility
 */

import { NextRequest } from 'next/server';

interface SSEConnection {
  id: string;
  response: any; // NextResponse.stream() response
  lastPing: number;
}

interface SSEMessage {
  type: string;
  data: any;
  timestamp: number;
}

class SSEManager {
  private connections = new Map<string, SSEConnection>();
  private pingInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Start ping interval to keep connections alive
    this.startPingInterval();
  }

  /**
   * Create a new SSE connection
   */
  addConnection(id: string, response: any): void {
    this.connections.set(id, {
      id,
      response,
      lastPing: Date.now(),
    });

    console.log(`SSE connection added: ${id}`);
  }

  /**
   * Remove a connection
   */
  removeConnection(id: string): void {
    this.connections.delete(id);
    console.log(`SSE connection removed: ${id}`);
  }

  /**
   * Send a message to all connections for a specific tournament
   */
  broadcastToTournament(tournamentId: string, type: string, data: any): void {
    const message: SSEMessage = {
      type,
      data,
      timestamp: Date.now(),
    };

    const eventData = this.formatEvent(`tournament:${tournamentId}`, message);
    
    this.connections.forEach((connection) => {
      try {
        connection.response.write(eventData);
        connection.lastPing = Date.now();
      } catch (error) {
        console.error(`Failed to send to connection ${connection.id}:`, error);
        this.removeConnection(connection.id);
      }
    });

    console.log(`Broadcasted to ${this.connections.size} connections for tournament ${tournamentId}`);
  }

  /**
   * Format an SSE event
   */
  private formatEvent(event: string, data: SSEMessage): string {
    return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  }

  /**
   * Send ping to all connections
   */
  private ping(): void {
    const pingMessage = this.formatEvent('ping', {
      type: 'ping',
      data: { timestamp: Date.now() },
      timestamp: Date.now(),
    });
    
    this.connections.forEach((connection) => {
      try {
        connection.response.write(pingMessage);
        connection.lastPing = Date.now();
      } catch (error) {
        this.removeConnection(connection.id);
      }
    });
  }

  /**
   * Start ping interval
   */
  private startPingInterval(): void {
    this.pingInterval = setInterval(() => {
      this.ping();
    }, 30000); // Ping every 30 seconds
  }

  /**
   * Stop ping interval
   */
  stop(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    // Close all connections
    this.connections.forEach((connection) => {
      try {
        connection.response.end();
      } catch (error) {
        // Ignore cleanup errors
      }
    });

    this.connections.clear();
  }

  /**
   * Get connection count
   */
  getConnectionCount(): number {
    return this.connections.size;
  }

  /**
   * Get connection stats
   */
  getStats() {
    return {
      activeConnections: this.connections.size,
      connections: Array.from(this.connections.keys()),
    };
  }
}

// Singleton instance
export const sseManager = new SSEManager();