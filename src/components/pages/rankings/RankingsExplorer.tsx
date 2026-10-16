'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useRankings, sortByStanding } from '@/hooks/useRankings';

const ALL_GAMES = 'all';

function rankBadgeClasses(rank: number): string {
  if (rank === 1) return 'border-yellow-500/70 text-yellow-400';
  if (rank === 2) return 'border-gray-400/70 text-gray-300';
  if (rank === 3) return 'border-orange-500/70 text-orange-400';
  return 'border-gray-800 text-gray-500';
}

function rankMedal(rank: number): string {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
}

function RankBadge({ rank }: { rank: number }) {
  return (
    <span
      className={`inline-flex items-center justify-center min-w-[44px] h-[44px] px-2 border-2 font-black text-sm md:text-base ${rankBadgeClasses(rank)}`}
    >
      {rankMedal(rank)}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="space-y-3">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="h-[72px] border border-gray-800 bg-[#0a0a0a] animate-pulse" />
      ))}
    </div>
  );
}

export function RankingsExplorer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { data, loading, error, reload } = useRankings();
  const [selected, setSelected] = useState<string>(ALL_GAMES);

  const games = data?.games ?? [];

  // Apply ?game=<slug> deep link once the games list is loaded
  useEffect(() => {
    if (!data) return;
    const gameParam = searchParams.get('game');
    if (gameParam && data.games.some((g) => g.id === gameParam)) {
      setSelected(gameParam);
    }
  }, [data, searchParams]);

  const rows = useMemo(() => {
    if (!data) return [];
    const filtered =
      selected === ALL_GAMES
        ? data.rankings
        : data.rankings.filter((r) => r.categoryId === selected);
    return sortByStanding(filtered);
  }, [data, selected]);

  const selectedGame = games.find((g) => g.id === selected);

  function pickGame(id: string) {
    setSelected(id);
    const url = id === ALL_GAMES ? pathname : `${pathname}?game=${encodeURIComponent(id)}`;
    router.replace(url, { scroll: false });
  }

  return (
    <section className="relative w-full bg-[#080808] py-12 md:py-16 overflow-hidden">
      {/* Neo-brutalist accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-6 w-2 h-24 bg-[#8c110d] opacity-60 transform rotate-12" />
        <div className="absolute bottom-16 right-10 w-2 h-28 bg-[#8c110d] opacity-40 transform -rotate-6" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#8c110d] opacity-[0.06] blur-3xl" />
      </div>

      <div className="relative z-10 w-full px-4 md:px-8 max-w-6xl mx-auto">
        {/* Game filter tabs */}
        <div className="-mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto pb-2">
          <div className="flex flex-nowrap md:flex-wrap gap-3 min-w-max md:min-w-0">
            <button
              onClick={() => pickGame(ALL_GAMES)}
              className={`px-5 py-2.5 border-2 font-black text-xs uppercase tracking-wider whitespace-nowrap transition-all duration-200 ${
                selected === ALL_GAMES
                  ? 'bg-[#8c110d] border-[#8c110d] text-white'
                  : 'border-gray-700 text-gray-300 hover:border-[#8c110d] hover:text-white'
              }`}
            >
              All Games
            </button>
            {games.map((game) => (
              <button
                key={game.id}
                onClick={() => pickGame(game.id)}
                className={`px-5 py-2.5 border-2 font-black text-xs uppercase tracking-wider whitespace-nowrap transition-all duration-200 ${
                  selected === game.id
                    ? 'bg-[#8c110d] border-[#8c110d] text-white'
                    : 'border-gray-700 text-gray-300 hover:border-[#8c110d] hover:text-white'
                }`}
              >
                {game.shortName}
              </button>
            ))}
          </div>
        </div>

        {/* Result summary */}
        <div className="mt-6 mb-4 flex items-center justify-between gap-4">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            {selectedGame ? (
              <>
                {selectedGame.shortName} <span className="text-[#8c110d]">Standings</span>
              </>
            ) : (
              <>
                Overall <span className="text-[#8c110d]">Standings</span>
              </>
            )}
          </h2>
          {!loading && !error && rows.length > 0 && (
            <span className="text-gray-500 text-xs font-bold uppercase tracking-wider whitespace-nowrap">
              {rows.length} {rows.length === 1 ? 'player' : 'players'}
            </span>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <LoadingState />
        ) : error ? (
          <div className="border-2 border-red-900/50 bg-red-950/20 p-8 text-center">
            <p className="text-red-400 font-bold mb-4">Could not load rankings.</p>
            <button
              onClick={reload}
              className="px-6 py-2.5 border-2 border-red-800 text-red-300 hover:bg-red-900/30 font-black text-xs uppercase tracking-wider transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : rows.length === 0 ? (
          <div className="border-2 border-gray-800 bg-black p-10 md:p-16 text-center">
            <div className="text-5xl mb-6">🏆</div>
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white mb-3">
              No rankings yet
            </h3>
            <p className="text-gray-400 max-w-md mx-auto mb-8">
              {selectedGame
                ? `Standings for ${selectedGame.name} will be published as the tournament progresses.`
                : 'Standings will be published as tournaments progress. Compete to make the board.'}
            </p>
            <Link
              href="/events"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#8c110d] to-[#b91c17] hover:from-[#b91c17] hover:to-[#8c110d] text-white font-black text-sm uppercase tracking-wider transition-all duration-300"
            >
              Browse Tournaments
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block border border-gray-800 bg-black overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#8c110d] bg-[#0a0a0a]">
                    <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-400 w-24">Rank</th>
                    <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-400">Player</th>
                    <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-400">University</th>
                    {selected === ALL_GAMES && (
                      <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-400">Game</th>
                    )}
                    <th className="px-4 py-4 text-center text-xs font-black uppercase tracking-wider text-gray-400 w-16">W</th>
                    <th className="px-4 py-4 text-center text-xs font-black uppercase tracking-wider text-gray-400 w-16">L</th>
                    <th className="px-4 py-4 text-right text-xs font-black uppercase tracking-wider text-gray-400 w-24">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => {
                    const displayRank = selected === ALL_GAMES ? index + 1 : row.rank;
                    return (
                    <tr
                      key={row.id}
                      className={`border-b border-white/10 hover:bg-white/5 transition-colors ${
                        displayRank <= 3 ? 'bg-[#8c110d]/5' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <RankBadge rank={displayRank} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {row.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={row.image} alt={row.playerName} className="w-9 h-9 object-cover border border-gray-800" />
                          ) : (
                            <div className="w-9 h-9 flex items-center justify-center bg-[#8c110d]/15 border border-[#8c110d]/30 text-[#e73138] font-black text-sm">
                              {row.playerName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="text-white font-bold">{row.playerName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{row.university}</td>
                      {selected === ALL_GAMES && (
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 border border-gray-700 text-gray-300 text-[10px] font-black uppercase tracking-wider">
                            {games.find((g) => g.id === row.categoryId)?.shortName || row.categoryId}
                          </span>
                        </td>
                      )}
                      <td className="px-4 py-3 text-center text-green-400 font-bold">{row.wins}</td>
                      <td className="px-4 py-3 text-center text-red-400 font-bold">{row.losses}</td>
                      <td className="px-4 py-3 text-right text-white font-black text-lg">{row.points}</td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {rows.map((row, index) => {
                const displayRank = selected === ALL_GAMES ? index + 1 : row.rank;
                return (
                <div
                  key={row.id}
                  className={`flex items-center gap-4 border border-gray-800 bg-[#0a0a0a] p-4 ${
                    displayRank <= 3 ? 'border-l-4 border-l-[#8c110d]' : ''
                  }`}
                >
                  <RankBadge rank={displayRank} />
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold truncate">{row.playerName}</div>
                    <div className="text-gray-400 text-xs truncate">{row.university}</div>
                    {selected === ALL_GAMES && (
                      <span className="inline-block mt-1 px-2 py-0.5 border border-gray-700 text-gray-400 text-[10px] font-black uppercase tracking-wider">
                        {games.find((g) => g.id === row.categoryId)?.shortName || row.categoryId}
                      </span>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-white font-black text-xl leading-none">{row.points}</div>
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

            <p className="mt-6 text-gray-500 text-xs uppercase tracking-wider text-center md:text-left">
              Standings are updated after each tournament round.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
