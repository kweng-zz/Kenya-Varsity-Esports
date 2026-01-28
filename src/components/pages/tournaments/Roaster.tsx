"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getTournamentsPageData, SeasonInfo, GameInfo, getSeasonGames, getActiveSeasonGames } from "@/lib/pagedata/tournaments";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const TeamRosterSection = () => {
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string>('');
  const [allGames, setAllGames] = useState<GameInfo[]>([]);
  const [seasons, setSeasons] = useState<SeasonInfo[]>([]);

  useEffect(() => {
    const data = getTournamentsPageData();
    setSeasons(data.seasons);
    
    // Get all games from both seasons
    const games = [
      ...getSeasonGames('january', 'main'),
      ...getSeasonGames('january', 'added'),
      ...getSeasonGames('september', 'main'),
      ...getSeasonGames('september', 'added')
    ];
    
    // Sort games to ensure a consistent display (active first, then maybe alphabetical)
    const sortedGames = [...games].sort((a, b) => {
      if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    setAllGames(sortedGames);
  }, []);

  const handleGameClick = (game: GameInfo) => {
    if (!game.isActive) {
      setSelectedGame(game.name);
      setShowComingSoonModal(true);
    }
  };

  const closeModal = () => {
    setShowComingSoonModal(false);
    setSelectedGame('');
  };

  const renderGameGrid = (games: GameInfo[]) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 justify-items-center">
        {games.map((game, index) => {
          const isGameActive = game.isActive;
          
          if (isGameActive) {
            return (
              <Link
                key={`game-${game.id}-${index}`}
                href={game.route}
                className="relative w-[360px] h-[430px] overflow-hidden bg-black cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20"
              >
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-[360px] h-[430px] object-cover border border-white/70"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/Mask Group.png';
                  }}
                />
              </Link>
            );
          } else {
            return (
              <div
                key={`game-${game.id}-${index}`}
                onClick={() => handleGameClick(game)}
                className="relative w-[360px] h-[430px] overflow-hidden bg-black cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20 group"
              >
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-[360px] h-[430px] object-cover border border-white/70 opacity-50"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/Mask Group.png';
                  }}
                />
                
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-center">
                    <h3 className="text-white text-xl font-bold mb-2">COMING SOON</h3>
                    <p className="text-white/90 text-sm">Click for details</p>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
    );
  };

  return (
    <section id="roaster-section" className="w-full py-20 bg-black">
      <div className="container mx-auto px-4">
        {/* Unified Header */}
        <div id="roaster-header" className="mb-16 text-center">
          <h2 className="font-bold text-[46px] tracking-[1.84px] mb-6">
            <span className="text-white tracking-[0.85px]">KVE </span>
            <span className="text-[#961c18] tracking-[0.85px]">GAME </span>
            <span className="text-white tracking-[0.85px]">TITLES</span>
          </h2>
          <p className="text-[#aaaaaa] text-[32px] max-w-4xl mx-auto">
            KVE will be hosting 1 big tournament yearly and the following are the
            game titles that will be featured. Tournament dates, information and 
            announcements will be shared halfway through the year.
          </p>
        </div>

        {/* All games grid */}
        {allGames.length > 0 && renderGameGrid(allGames)}
      </div>

      
    </section>
  );
};