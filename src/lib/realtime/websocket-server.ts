// src/lib/realtime/websocket-server.ts
/**
 * WebSocket server implementation using Socket.IO
 * Handles real-time tournament events, scoring, and leaderboard updates
 */

import 'server-only';
import { Server as SocketIOServer, Socket } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import {
  RealtimeEventType,
  RealtimeMessage,
  SubscriptionRequest,
  SubscriptionResponse,
  CHANNELS,
} from './types';

// Store active connections for monitoring
const activeConnections = new Map<string, {
  socket: Socket;
  userId?: string;
  subscribedChannels: Set<string>;
  connectedAt: number;
}>();

let io: SocketIOServer | null = null;

/**
 * Initialize WebSocket server
 */
export function initializeWebSocketServer(httpServer: HTTPServer): SocketIOServer {
  if (io) {
    console.log('WebSocket server already initialized');
    return io;
  }

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 20000,
    pingInterval: 25000,
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const sessionId = socket.handshake.auth.sessionId;
      
      // For public access (viewing leaderboards), allow anonymous connections
      if (!token && !sessionId) {
        socket.data.authenticated = false;
        socket.data.userId = null;
        return next();
      }
      
      // Validate session if provided
      if (sessionId) {
        // TODO: Validate session with Appwrite
        socket.data.authenticated = true;
        socket.data.sessionId = sessionId;
        return next();
      }
      
      next();
    } catch (error) {
      console.error('WebSocket authentication error:', error);
      next(new Error('Authentication failed'));
    }
  });

  // Connection handler
  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);
    
    // Track connection
    activeConnections.set(socket.id, {
      socket,
      userId: socket.data.userId,
      subscribedChannels: new Set(),
      connectedAt: Date.now(),
    });

    // Handle ping for connection health check
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() });
    });

    // Handle channel subscriptions
    socket.on(RealtimeEventType.SUBSCRIBE, async (request: SubscriptionRequest) => {
      const response = await handleSubscription(socket, request);
      socket.emit(RealtimeEventType.SUBSCRIBED, response);
    });

    // Handle unsubscription
    socket.on(RealtimeEventType.UNSUBSCRIBE, (request: SubscriptionRequest) => {
      socket.leave(request.channel);
      const connection = activeConnections.get(socket.id);
      if (connection) {
        connection.subscribedChannels.delete(request.channel);
      }
      console.log(`Client ${socket.id} unsubscribed from ${request.channel}`);
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
      activeConnections.delete(socket.id);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.id}:`, error);
    });
  });

  console.log('WebSocket server initialized');
  return io;
}

/**
 * Handle subscription requests
 */
async function handleSubscription(
  socket: Socket,
  request: SubscriptionRequest
): Promise<SubscriptionResponse> {
  try {
    const { channel, tournamentId } = request;
    
    // Validate channel format
    if (!channel || typeof channel !== 'string') {
      return { success: false, channel: '', message: 'Invalid channel' };
    }
    
    // Check permissions for authenticated channels
    if (channel.startsWith('user:') && !socket.data.authenticated) {
      return { success: false, channel, message: 'Authentication required' };
    }
    
    // Join the room
    await socket.join(channel);
    
    // Track subscription
    const connection = activeConnections.get(socket.id);
    if (connection) {
      connection.subscribedChannels.add(channel);
    }
    
    console.log(`Client ${socket.id} subscribed to ${channel}`);
    
    return { success: true, channel };
  } catch (error) {
    console.error('Subscription error:', error);
    return { 
      success: false, 
      channel: request.channel, 
      message: 'Subscription failed' 
    };
  }
}

/**
 * Broadcast message to a specific channel
 */
export function broadcastToChannel<T>(
  channel: string,
  eventType: RealtimeEventType,
  payload: T,
  excludeSocketId?: string
): void {
  if (!io) {
    console.warn('WebSocket server not initialized');
    return;
  }

  const message: RealtimeMessage<T> = {
    type: eventType,
    channel,
    payload,
    timestamp: Date.now(),
  };

  if (excludeSocketId) {
    io.to(channel).except(excludeSocketId).emit(eventType, message);
  } else {
    io.to(channel).emit(eventType, message);
  }
}

/**
 * Broadcast score update to tournament channel
 */
export function broadcastScoreUpdate(
  tournamentId: string,
  participantId: string,
  score: number,
  metadata?: Record<string, unknown>
): void {
  const channel = CHANNELS.leaderboard(tournamentId);
  broadcastToChannel(channel, RealtimeEventType.SCORE_UPDATE, {
    tournamentId,
    participantId,
    score,
    metadata,
    updatedAt: Date.now(),
  });
}

/**
 * Broadcast leaderboard update
 */
export function broadcastLeaderboardUpdate(
  tournamentId: string,
  entries: Array<{ rank: number; participantId: string; playerName: string; score: number }>
): void {
  const channel = CHANNELS.leaderboard(tournamentId);
  broadcastToChannel(channel, RealtimeEventType.LEADERBOARD_UPDATE, {
    tournamentId,
    entries,
    updatedAt: Date.now(),
  });
}

/**
 * Broadcast tournament status change
 */
export function broadcastTournamentStatus(
  tournamentId: string,
  previousStatus: string,
  newStatus: string,
  message?: string
): void {
  const channel = CHANNELS.tournament(tournamentId);
  broadcastToChannel(channel, RealtimeEventType.TOURNAMENT_STATUS_CHANGE, {
    tournamentId,
    previousStatus,
    newStatus,
    message,
    updatedAt: Date.now(),
  });
}

/**
 * Get server statistics
 */
export function getServerStats() {
  return {
    initialized: !!io,
    activeConnections: activeConnections.size,
    connections: Array.from(activeConnections.entries()).map(([id, conn]) => ({
      id,
      userId: conn.userId,
      subscribedChannels: Array.from(conn.subscribedChannels),
      connectedAt: conn.connectedAt,
    })),
  };
}

/**
 * Get the Socket.IO server instance
 */
export function getIO(): SocketIOServer | null {
  return io;
}

/**
 * Cleanup and close WebSocket server
 */
export async function closeWebSocketServer(): Promise<void> {
  if (io) {
    await io.close();
    io = null;
    activeConnections.clear();
    console.log('WebSocket server closed');
  }
}
