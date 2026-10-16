"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useRankings, sortByStanding } from "@/hooks/useRankings";

/**
 * Rankings preview on the /tournaments page.
 * Shows the current top 3 players and links to the full
 * /rankings page, which is the single place standings are displayed.
 */
export const ComingSoonSection = () => {
  const { data, loading, error } = useRankings();

  const topThree = useMemo(() => {
    if (!data) return [];
    return sortByStanding(data.rankings).slice(0, 3);
  }, [data]);

  const medal = (rank: number) => (rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉");
  const badgeClass = (rank: number) =>
    rank === 1
      ? "border-yellow-500/70 text-yellow-400"
      : rank === 2
        ? "border-gray-400/70 text-gray-300"
        : "border-orange-500/70 text-orange-400";

  return (
    <section className="w-full py-20 bg-black relative">
      {/* Background images */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          className="absolute top-1/2 left-20 w-2/4 h-2/4 object-contain -translate-x-1/2 -translate-y-1/2"
          alt=""
          src="/images/Mask Group.png"
        />
        <img
          className="absolute top-1/2 right-20 w-2/4 h-2/4 object-contain translate-x-1/2 -translate-y-1/2 scale-x-[-1]"
          alt=""
          src="/images/Mask Group.png"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="font-bold text-3xl md:text-[46px] tracking-[1.84px] mb-6">
            <span className="text-white tracking-[0.85px]">GAME </span>
            <span className="text-[#961c18] tracking-[0.85px]">RANKINGS</span>
          </h2>
          <p className="text-[#aaaaaa] text-lg md:text-2xl max-w-2xl mx-auto">
            Top performers from our tournaments — see who is leading the board.
          </p>
        </div>

        {/* Top 3 preview */}
        {loading ? (
          <div className="max-w-3xl mx-auto space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-20 border border-gray-800 bg-[#0a0a0a] animate-pulse" />
            ))}
          </div>
        ) : error || topThree.length === 0 ? (
          <div className="max-w-3xl mx-auto border-2 border-gray-800 bg-black p-10 text-center">
            <div className="text-4xl mb-4">🏆</div>
            <p className="text-[#aaaaaa] text-lg">
              Rankings will be published as tournaments progress.
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-3">
            {topThree.map((row, index) => {
              const position = index + 1;
              return (
              <div
                key={row.id}
                className="flex items-center gap-4 border border-gray-800 bg-[#0a0a0a] p-4 md:p-5 border-l-4 border-l-[#961c18]"
              >
                <span
                  className={`inline-flex items-center justify-center min-w-[44px] h-[44px] px-2 border-2 font-black text-lg ${badgeClass(position)}`}
                >
                  {medal(position)}
                </span>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-white font-bold truncate">{row.playerName}</div>
                  <div className="text-gray-400 text-xs md:text-sm truncate">{row.university}</div>
                  <span className="inline-block mt-1 px-2 py-0.5 border border-gray-700 text-gray-400 text-[10px] font-black uppercase tracking-wider">
                    {row.gameName}
                  </span>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-white font-black text-xl md:text-2xl leading-none">
                    {row.points}
                  </div>
                  <div className="text-[11px] font-bold mt-1">
                    <span className="text-green-400">{row.wins}W</span>
                    <span className="text-gray-600"> · </span>
                    <span className="text-red-400">{row.losses}L</span>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}

        {/* Full rankings CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/rankings"
            className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-[#961c18] to-[#b91c17] hover:from-[#b91c17] hover:to-[#961c18] text-white font-black text-sm uppercase tracking-wider transition-all duration-300"
          >
            View Full Rankings
            <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};
