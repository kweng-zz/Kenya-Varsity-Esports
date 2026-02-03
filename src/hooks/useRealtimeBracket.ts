// src/hooks/useRealtimeBracket.ts
/**
 * React hook for real-time bracket updates
 */

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { getWebSocketClient, CHANNELS } from '@/lib/realtime';
import type { TournamentMatch } from '@/components/tournaments/TournamentBracket';

interface UseRealtimeBracketOptions {
  tournamentId: string;
  initialMatches: TournamentMatch[];
  enabled?: boolean;
}

interface UseRealtimeBracketReturn {
  matches: TournamentMatch[];
  lastUpdate: number | null;
  connected: boolean;
}

export function useRealtimeBracket({
  tournamentId,
  initialMatches,
  enabled = true,
}: UseRealtimeBracketOptions): UseRealtimeBracketReturn {
  const [matches, setMatches] = useState<TournamentMatch[]>(initialMatches);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  
  // Update matches when initial prop changes
  useEffect(() => {
    setMatches(initialMatches);
  }, [initialMatches]);

  useEffect(() => {
    if (!enabled || !tournamentId) return;

    const client = getWebSocketClient();
    
    // Connect if not connected
    if (!client.isConnected()) {
      client.connect();
    }

    const subscriptions: (() => void)[] = [];

    const setupSubscriptions = async () => {
      // Subscribe to tournament channel (broadcasting match updates here for now)
      // In a more granular system, we might subscribe to individual matches or a 'bracket' channel
      const channel = CHANNELS.tournament(tournamentId);
      await client.subscribe(channel, { tournamentId });
      
      // Listen for match updates
      const unsubMatch = client.onMatchUpdate((update) => {
        if (update.tournamentId !== tournamentId) return;

        setMatches((currentMatches) => {
          const index = currentMatches.findIndex(m => m.id === update.matchId);
          if (index === -1) return currentMatches;

          const newMatches = [...currentMatches];
          const match = { ...newMatches[index] };

          // Update match fields
          if (update.status) match.status = update.status;
          if (update.score) match.score = update.score;
          if (update.winner) match.winner = update.winner;

          newMatches[index] = match;
          return newMatches;
        });
        
        setLastUpdate(Date.now());
      });
      subscriptions.push(unsubMatch);

      // Listen for connection state
      const unsubState = client.onStateChange((state) => {
        setConnected(state.connected);
      });
      subscriptions.push(unsubState);
      
      // Set initial connection state
      setConnected(client.isConnected());
    };

    setupSubscriptions();

    return () => {
      subscriptions.forEach(unsub => unsub());
    };
  }, [tournamentId, enabled]);

  return {
    matches,
    lastUpdate,
    connected,
  };
}
