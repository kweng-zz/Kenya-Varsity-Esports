"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getTournamentsPageData, SeasonInfo, GameInfo, getSeasonGames, getActiveSeasonGames } from "@/lib/pagedata/tournaments";

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
            The gaming titles being featured in the current semester period
          </p>
        </div>

        {/* All games grid */}
        {allGames.length > 0 && renderGameGrid(allGames)}
      </div>

      {/* Coming Soon Modal */}
      {showComingSoonModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-[#961c18] rounded-lg max-w-md w-full p-8 text-center relative">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-[#961c18] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Icon */}
            <div className="w-16 h-16 bg-[#961c18] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            {/* Content */}
            <h2 className="text-2xl font-bold text-white mb-4">
              {selectedGame}
            </h2>
            <h3 className="text-xl font-semibold text-[#961c18] mb-4">
              Details Available Soon
            </h3>
            <p className="text-[#aaaaaa] mb-8 leading-relaxed">
              This tournament is scheduled for the upcoming semester. 
              Tournament details, registration information, and prize pools will be announced closer to the start date.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-[#961c18] hover:bg-[#961c18]/80 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-center"
                onClick={closeModal}
              >
                Return to Home
              </Link>
              <Link
                href="/tournaments"
                className="bg-transparent border border-[#961c18] text-[#961c18] hover:bg-[#961c18] hover:text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-center"
                onClick={closeModal}
              >
                View Current Tournaments
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-[#961c18]/30">
              <p className="text-[#aaaaaa] text-sm">
                Stay tuned for updates on our social media channels and website announcements.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};