// src/lib/realtime/websocket-client.ts
/**
 * WebSocket client for browser-side real-time connections
 */

import { io, Socket } from 'socket.io-client';
import type {
  RealtimeEventType,
  RealtimeMessage,
  SubscriptionRequest,
  SubscriptionResponse,
  ConnectionState,
  LeaderboardUpdate,
  ScoreUpdate,
  TournamentStatusUpdate,
} from './types';

type EventCallback<T = unknown> = (message: RealtimeMessage<T>) => void;

class WebSocketClient {
  private socket: Socket | null = null;
  private connectionState: ConnectionState = {
    connected: false,
    reconnecting: false,
    reconnectAttempts: 0,
  };
  private eventListeners = new Map<string, Set<EventCallback>>();
  private subscriptions = new Set<string>();

  /**
   * Connect to WebSocket server
   */
  connect(options?: { token?: string; sessionId?: string }): void {
    if (this.socket?.connected) {
      console.log('Already connected');
      return;
    }

    const url = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 
      (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

    this.socket = io(url, {
      auth: {
        token: options?.token,
        sessionId: options?.sessionId,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.connectionState = {
        connected: true,
        reconnecting: false,
        reconnectAttempts: 0,
        lastConnected: Date.now(),
      };
      this.notifyStateChange();
      
      // Resubscribe to previous channels
      this.resubscribeChannels();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.connectionState = {
        ...this.connectionState,
        connected: false,
      };
      this.notifyStateChange();
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.connectionState = {
        ...this.connectionState,
        connected: false,
        error: error.message,
      };
      this.notifyStateChange();
    });

    this.socket.io.on('reconnect_attempt', (attempt) => {
      this.connectionState = {
        ...this.connectionState,
        reconnecting: true,
        reconnectAttempts: attempt,
      };
      this.notifyStateChange();
    });

    this.socket.on('pong', (data: { timestamp: number }) => {
      const latency = Date.now() - data.timestamp;
      console.log(`WebSocket latency: ${latency}ms`);
    });
  }

  /**
   * Subscribe to a channel
   */
  async subscribe(channel: string, options?: { tournamentId?: string }): Promise<boolean> {
    if (!this.socket?.connected) {
      console.warn('Not connected, cannot subscribe');
      return false;
    }

    return new Promise((resolve) => {
      const request: SubscriptionRequest = {
        channel,
        tournamentId: options?.tournamentId,
      };

      this.socket!.emit('subscribe', request);

      this.socket!.once('subscribed', (response: SubscriptionResponse) => {
        if (response.success) {
          this.subscriptions.add(channel);
          console.log(`Subscribed to ${channel}`);
        }
        resolve(response.success);
      });

      // Timeout after 5 seconds
      setTimeout(() => resolve(false), 5000);
    });
  }

  /**
   * Unsubscribe from a channel
   */
  unsubscribe(channel: string): void {
    if (!this.socket?.connected) return;
    
    this.socket.emit('unsubscribe', { channel });
    this.subscriptions.delete(channel);
    this.eventListeners.delete(channel);
  }

  /**
   * Listen for events on a channel
   */
  on<T = unknown>(event: string, callback: EventCallback<T>): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
      
      // Set up socket listener
      this.socket?.on(event, (message: RealtimeMessage<T>) => {
        const listeners = this.eventListeners.get(event);
        listeners?.forEach((cb) => cb(message as RealtimeMessage<unknown>));
      });
    }

    this.eventListeners.get(event)!.add(callback as EventCallback);

    // Return unsubscribe function
    return () => {
      this.eventListeners.get(event)?.delete(callback as EventCallback);
    };
  }

  /**
   * Listen for leaderboard updates
   */
  onLeaderboardUpdate(
    callback: (update: LeaderboardUpdate) => void
  ): () => void {
    return this.on('leaderboard:update', (message) => {
      callback(message.payload as LeaderboardUpdate);
    });
  }

  /**
   * Listen for score updates
   */
  onScoreUpdate(callback: (update: ScoreUpdate) => void): () => void {
    return this.on('score:update', (message) => {
      callback(message.payload as ScoreUpdate);
    });
  }

  /**
   * Listen for match updates
   */
  onMatchUpdate(
    callback: (update: {
      tournamentId: string;
      matchId: string;
      status: 'pending' | 'live' | 'completed';
      score?: { team1: number; team2: number };
      winner?: string;
      metadata?: Record<string, unknown>;
    }) => void
  ): () => void {
    return this.on('match:update', (message) => {
      callback(message.payload as any);
    });
  }

  /**
   * Listen for tournament status changes
   */
  onTournamentStatusChange(
    callback: (update: TournamentStatusUpdate) => void
  ): () => void {
    return this.on('tournament:status_change', (message) => {
      callback(message.payload as TournamentStatusUpdate);
    });
  }

  /**
   * Listen for connection state changes
   */
  onStateChange(callback: (state: ConnectionState) => void): () => void {
    return this.on('_state_change', (message) => {
      callback(message.payload as ConnectionState);
    });
  }

  private notifyStateChange(): void {
    const listeners = this.eventListeners.get('_state_change');
    if (listeners) {
      const message: RealtimeMessage<ConnectionState> = {
        type: 'connect' as any,
        payload: this.connectionState,
        timestamp: Date.now(),
      };
      listeners.forEach((cb) => cb(message));
    }
  }

  private resubscribeChannels(): void {
    this.subscriptions.forEach((channel) => {
      this.socket?.emit('subscribe', { channel });
    });
  }

  /**
   * Check connection health
   */
  ping(): void {
    if (this.socket?.connected) {
      this.socket.emit('ping');
    }
  }

  /**
   * Get current connection state
   */
  getState(): ConnectionState {
    return { ...this.connectionState };
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connectionState.connected;
  }

  /**
   * Disconnect from server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.subscriptions.clear();
      this.eventListeners.clear();
      this.connectionState = {
        connected: false,
        reconnecting: false,
        reconnectAttempts: 0,
      };
    }
  }
}

// Singleton instance
let clientInstance: WebSocketClient | null = null;

export function getWebSocketClient(): WebSocketClient {
  if (!clientInstance) {
    clientInstance = new WebSocketClient();
  }
  return clientInstance;
}

export { WebSocketClient };
