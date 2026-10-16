'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useRankings, sortByStanding } from '@/hooks/useRankings';

interface GameRankingsSectionProps {
  slug: string;
  gameName?: string;
}

/**
 * Game-page rankings teaser: top 3 players for this game title
 * with a button to the full /rankings page (pre-filtered to this game).
 */
export const GameRankingsSection: React.FC<GameRankingsSectionProps> = ({ slug, gameName }) => {
  const { data, loading, error } = useRankings();

  const topThree = useMemo(() => {
    if (!data) return [];
    return sortByStanding(data.rankings.filter((r) => r.categoryId === slug)).slice(0, 3);
  }, [data, slug]);

  const medal = (rank: number) => (rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉');

  return (
    <div className="mb-16">
      <div className="bg-gradient-to-r from-[#8c110d]/20 to-transparent border-l-4 border-[#8c110d] p-8 rounded-r-lg relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#8c110d]/10 rounded-full -mr-12 -mb-12" />

        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-4">
            {gameName ? `${gameName} Rankings` : 'Game Rankings'}
          </h2>
          <p className="text-gray-300 text-lg mb-6">
            Top performers in this title. Standings are updated as tournament results come in.
          </p>

          {loading ? (
            <div className="space-y-3 mb-8">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-16 border border-gray-800 bg-[#0a0a0a] animate-pulse" />
              ))}
            </div>
          ) : !error && topThree.length > 0 ? (
            <div className="space-y-3 mb-8 max-w-3xl">
              {topThree.map((row) => (
                <div
                  key={row.id}
                  className="flex items-center gap-4 border border-gray-800 bg-black p-3 md:p-4"
                >
                  <span className="inline-flex items-center justify-center min-w-[40px] h-[40px] px-2 border-2 border-gray-700 font-black text-lg">
                    {medal(row.rank)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold truncate">{row.playerName}</div>
                    <div className="text-gray-400 text-xs truncate">{row.university}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-white font-black text-lg leading-none">{row.points}</div>
                    <div className="text-[11px] font-bold mt-1">
                      <span className="text-green-400">{row.wins}W</span>
                      <span className="text-gray-600"> · </span>
                      <span className="text-red-400">{row.losses}L</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-8 border border-gray-800 bg-black p-6 max-w-3xl">
              <p className="text-gray-400">
                No standings published yet for this game. Check back as the tournament progresses.
              </p>
            </div>
          )}

          <Link
            href={`/rankings?game=${encodeURIComponent(slug)}`}
            className="group inline-flex items-center px-8 py-4 bg-black border-2 border-[#8c110d] hover:bg-[#8c110d] text-white font-black text-sm uppercase tracking-wider transition-all duration-300"
          >
            <span>View Full Rankings</span>
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};
