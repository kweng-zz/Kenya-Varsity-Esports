// src/hooks/useRealtimeTournament.ts
/**
 * React hook for real-time tournament subscriptions
 */

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { getWebSocketClient, CHANNELS } from '@/lib/realtime';
import type { 
  ConnectionState, 
  LeaderboardEntry, 
  TournamentStatusUpdate 
} from '@/lib/realtime/types';

interface UseRealtimeTournamentOptions {
  tournamentId: string;
  autoConnect?: boolean;
  subscribeToLeaderboard?: boolean;
  subscribeToStatus?: boolean;
}

interface UseRealtimeTournamentReturn {
  connected: boolean;
  connecting: boolean;
  leaderboard: LeaderboardEntry[];
  tournamentStatus: string | null;
  lastUpdate: number | null;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
}

export function useRealtimeTournament(
  options: UseRealtimeTournamentOptions
): UseRealtimeTournamentReturn {
  const { 
    tournamentId, 
    autoConnect = true,
    subscribeToLeaderboard = true,
    subscribeToStatus = true,
  } = options;

  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [tournamentStatus, setTournamentStatus] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const cleanupRef = useRef<(() => void)[]>([]);

  const connect = useCallback(() => {
    try {
      setConnecting(true);
      setError(null);
      
      const client = getWebSocketClient();
      client.connect();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    const client = getWebSocketClient();
    client.disconnect();
    setConnected(false);
    setConnecting(false);
  }, []);

  useEffect(() => {
    if (!tournamentId) return;

    const client = getWebSocketClient();

    // Subscribe to connection state changes
    const unsubState = client.onStateChange((state: ConnectionState) => {
      setConnected(state.connected);
      setConnecting(state.reconnecting);
      if (state.error) {
        setError(state.error);
      }
    });
    cleanupRef.current.push(unsubState);

    // Auto-connect if enabled
    if (autoConnect && !client.isConnected()) {
      connect();
    }

    return () => {
      cleanupRef.current.forEach((cleanup) => cleanup());
      cleanupRef.current = [];
    };
  }, [tournamentId, autoConnect, connect]);

  // Subscribe to channels when connected
  useEffect(() => {
    if (!connected || !tournamentId) return;

    const client = getWebSocketClient();
    const subscriptions: (() => void)[] = [];

    const setupSubscriptions = async () => {
      // Subscribe to leaderboard channel
      if (subscribeToLeaderboard) {
        const leaderboardChannel = CHANNELS.leaderboard(tournamentId);
        await client.subscribe(leaderboardChannel, { tournamentId });
        
        const unsubLeaderboard = client.onLeaderboardUpdate((update) => {
          if (update.tournamentId === tournamentId) {
            setLeaderboard(update.entries);
            setLastUpdate(update.updatedAt);
          }
        });
        subscriptions.push(unsubLeaderboard);
      }

      // Subscribe to tournament status channel
      if (subscribeToStatus) {
        const tournamentChannel = CHANNELS.tournament(tournamentId);
        await client.subscribe(tournamentChannel, { tournamentId });
        
        const unsubStatus = client.onTournamentStatusChange((update) => {
          if (update.tournamentId === tournamentId) {
            setTournamentStatus(update.newStatus);
            setLastUpdate(update.updatedAt);
          }
        });
        subscriptions.push(unsubStatus);
      }
    };

    setupSubscriptions();

    return () => {
      subscriptions.forEach((unsub) => unsub());
    };
  }, [connected, tournamentId, subscribeToLeaderboard, subscribeToStatus]);

  return {
    connected,
    connecting,
    leaderboard,
    tournamentStatus,
    lastUpdate,
    error,
    connect,
    disconnect,
  };
}

/**
 * Simple hook for connection status only
 */
export function useRealtimeConnection() {
  const [state, setState] = useState<ConnectionState>({
    connected: false,
    reconnecting: false,
    reconnectAttempts: 0,
  });

  useEffect(() => {
    const client = getWebSocketClient();
    
    const unsub = client.onStateChange((newState) => {
      setState(newState);
    });

    // Initialize with current state
    setState(client.getState());

    return unsub;
  }, []);

  const connect = useCallback(() => {
    const client = getWebSocketClient();
    client.connect();
  }, []);

  const disconnect = useCallback(() => {
    const client = getWebSocketClient();
    client.disconnect();
  }, []);

  return {
    ...state,
    connect,
    disconnect,
  };
}
