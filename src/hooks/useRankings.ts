'use client';

import { useCallback, useEffect, useState } from 'react';
import type { RankingsData, RankingRow } from '@/types/rankings';

/**
 * Fetches the public game rankings from /api/rankings.
 * Used by the /rankings page, the tournaments-page preview
 * and the per-game rankings sections.
 */
export function useRankings() {
  const [data, setData] = useState<RankingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/rankings?t=${Date.now()}`, { cache: 'no-store' });
      const json = await res.json();
      if (json.success && json.data) {
        setData({
          games: Array.isArray(json.data.games) ? json.data.games : [],
          rankings: Array.isArray(json.data.rankings) ? json.data.rankings : [],
        });
      } else {
        throw new Error(json.error || 'Failed to load rankings');
      }
    } catch (err) {
      console.error('Error loading rankings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load rankings');
      setData({ games: [], rankings: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}

/** Sort helper: best (highest points) first, ties broken by wins, then name */
export function sortByStanding(rows: RankingRow[]): RankingRow[] {
  return [...rows].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.wins !== a.wins) return b.wins - a.wins;
    return a.playerName.localeCompare(b.playerName);
  });
}
