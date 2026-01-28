"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface RankingEntry {
  id?: string;
  rank: number;
  playerName: string;
  game?: string;
  categoryId?: string;
  points: number;
  wins: number;
  losses: number;
  university: string;
  total?: number;
}

export const ComingSoonSection = () => {
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [selectedGame, setSelectedGame] = useState<string>("All Games");
  const [games, setGames] = useState<string[]>([]);

  useEffect(() => {
    loadRankings();
    
    // Refresh rankings every 30 seconds to catch updates from admin panel
    const interval = setInterval(loadRankings, 30000);
    
    // Also listen for visibility changes - refresh when tab becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadRankings();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const loadRankings = async () => {
    try {
      // Add cache-busting parameter to force fresh data
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/rankings?t=${timestamp}`);
      const result = await response.json();

      if (result.success && result.data) {
        // Transform API data to match RankingEntry format
        const transformedRankings = result.data.map((ranking: any) => ({
          id: ranking.id,
          rank: ranking.rank,
          playerName: ranking.playerName,
          game: ranking.game || ranking.categoryId,
          categoryId: ranking.categoryId,
          points: ranking.points || ranking.total || 0,
          wins: ranking.wins,
          losses: ranking.losses,
          university: ranking.university,
          total: ranking.total
        }));

        setRankings(transformedRankings);

        // Extract unique games
        const uniqueGames: string[] = ["All Games", ...new Set(transformedRankings.map((r: RankingEntry) => r.game).filter(Boolean) as string[])];
        setGames(uniqueGames);
      } else {
        // Fallback to empty state if API fails
        setRankings([]);
        setGames(["All Games"]);
      }
    } catch (error) {
      console.error('Error loading rankings:', error);
      // Fallback to empty state
      setRankings([]);
      setGames(["All Games"]);
    }
  };

  const filteredRankings = selectedGame === "All Games" 
    ? rankings 
    : rankings.filter((r: RankingEntry) => r.game === selectedGame);

  return (
    <section className="w-full py-20 bg-black relative">
      {/* Background images */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Left background image */}
        <img
          className="absolute top-105 left-20 w-2/4 h-2/4 object-contain -translate-x-1/2 -translate-y-1/2"
          alt="Background Left"
          src="/images/Mask Group.png"
        />
        
        {/* Right background image - inverted */}
        <img
          className="absolute top-105 right-20 w-2/4 h-2/4 object-contain translate-x-1/2 -translate-y-1/2 scale-x-[-1]"
          alt="Background Right"
          src="/images/Mask Group.png"
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Rankings Header */}
        <div className="mb-16 text-center">
          <h2 className="font-bold text-[46px] tracking-[1.84px] mb-6">
            <span className="text-white tracking-[0.85px]">PREVIOUS </span>
            <span className="text-[#961c18] tracking-[0.85px]">GAME </span>
            <span className="text-white tracking-[0.85px]">RANKINGS</span>
          </h2>
          <p className="text-[#aaaaaa] text-[32px] max-w-4xl mx-auto">
            Top performers from our previous tournaments. 
            <br /> 
          </p>
        </div>

        {/* Game Filter */}
        <div className="mb-12 flex justify-center gap-4 flex-wrap">
          {games.map((game) => (
            <button
              key={game}
              onClick={() => setSelectedGame(game)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                selectedGame === game
                  ? "bg-[#961c18] text-white"
                  : "bg-white/10 text-[#aaaaaa] hover:bg-white/20"
              }`}
            >
              {game}
            </button>
          ))}
        </div>

        {/* Rankings Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-[#961c18]">
                <th className="px-4 py-4 text-left text-white font-bold text-lg">Rank</th>
                <th className="px-4 py-4 text-left text-white font-bold text-lg">Player Name</th>
                <th className="px-4 py-4 text-left text-white font-bold text-lg">Game</th>
                <th className="px-4 py-4 text-center text-white font-bold text-lg">Points</th>
                <th className="px-4 py-4 text-center text-white font-bold text-lg">Wins</th>
                <th className="px-4 py-4 text-center text-white font-bold text-lg">Losses</th>
                <th className="px-4 py-4 text-left text-white font-bold text-lg">University</th>
              </tr>
            </thead>
            <tbody>
              {filteredRankings.map((entry, index) => (
                <tr 
                  key={`${entry.rank}-${index}`}
                  className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200"
                >
                  <td className="px-4 py-4 text-[#961c18] font-bold text-lg">#{entry.rank}</td>
                  <td className="px-4 py-4 text-white font-semibold">{entry.playerName}</td>
                  <td className="px-4 py-4 text-[#aaaaaa]">{entry.game}</td>
                  <td className="px-4 py-4 text-center text-white font-semibold">{entry.points}</td>
                  <td className="px-4 py-4 text-center text-green-400 font-semibold">{entry.wins}</td>
                  <td className="px-4 py-4 text-center text-red-400 font-semibold">{entry.losses}</td>
                  <td className="px-4 py-4 text-[#aaaaaa]">{entry.university}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRankings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#aaaaaa] text-xl">No rankings available for this game yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};