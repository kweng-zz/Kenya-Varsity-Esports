"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getTournamentsPageData, SeasonInfo, GameInfo, getSeasonGames, getActiveSeasonGames } from "@/lib/pagedata/tournaments";

export const TeamRosterSection = () => {
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string>('');
  const [seasons, setSeasons] = useState<SeasonInfo[]>([]);
  const [gamesData, setGamesData] = useState<{
    septemberMain: GameInfo[];
    septemberAdded: GameInfo[];
    januaryMain: GameInfo[];
    januaryAdded: GameInfo[];
  }>({
    septemberMain: [],
    septemberAdded: [],
    januaryMain: [],
    januaryAdded: []
  });

  useEffect(() => {
    const data = getTournamentsPageData();
    setSeasons(data.seasons);
    
    // Get all games (both active and inactive) for display
    setGamesData({
      septemberMain: getSeasonGames('september', 'main'),
      septemberAdded: getSeasonGames('september', 'added'),
      januaryMain: getSeasonGames('january', 'main'),
      januaryAdded: getSeasonGames('january', 'added')
    });
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

  const getSeason = (seasonName: 'september' | 'january') => {
    return seasons.find(s => s.name === seasonName);
  };

  const renderGameGrid = (games: GameInfo[], seasonName: 'september' | 'january') => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 justify-items-center">
        {games.map((game, index) => {
          // Show active games as clickable links
          // Show inactive games with coming soon overlay
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
                
                {/* Coming Soon Overlay */}
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
        {/* September Season */}
        {getSeason('september') && (
          <>
            <div id="september-season" className="mb-16 text-center">
              <h2 className="font-bold text-[46px] tracking-[1.84px] mb-6">
                <span className="text-white tracking-[0.85px]">{getSeason('september')?.title.split(' ').slice(0, 2).join(' ')} </span>
                <span className="text-[#961c18] tracking-[0.85px]">{getSeason('september')?.title.split(' ').slice(2, 4).join(' ')}</span>
                <span className="text-white tracking-[0.85px]">
                  {" "}
                  {getSeason('september')?.title.split(' ').slice(4).join(' ')}
                </span>
              </h2>
              <p className="text-[#aaaaaa] text-[32px] max-w-4xl mx-auto">
                {getSeason('september')?.description}
              </p>
            </div>

            {/* September Season - Main games */}
            {gamesData.septemberMain.length > 0 && renderGameGrid(gamesData.septemberMain, 'september')}

            {/* "Added for September Season" text */}
            {gamesData.septemberAdded.length > 0 && (
              <div className="text-center mb-16">
                <h3 className="text-[#aaaaaa] text-[32px]">
                  Added for the September Season
                </h3>
              </div>
            )}

            {/* September Season - Added games */}
            {gamesData.septemberAdded.length > 0 && (
              <div className="mb-32">
                {renderGameGrid(gamesData.septemberAdded, 'september')}
              </div>
            )}
          </>
        )}

        {/* January Season */}
        {getSeason('january') && (
          <>
            <div id="january-season" className="mb-16 text-center">
              <h2 className="font-bold text-[46px] tracking-[1.84px] mb-6">
                <span className="text-white tracking-[0.85px]">{getSeason('january')?.title.split(' ').slice(0, 2).join(' ')} </span>
                <span className="text-[#961c18] tracking-[0.85px]">{getSeason('january')?.title.split(' ').slice(2, 4).join(' ')}</span>
                <span className="text-white tracking-[0.85px]">
                  {" "}
                  {getSeason('january')?.title.split(' ').slice(4).join(' ')}
                </span>
              </h2>
              <p className="text-[#aaaaaa] text-[32px] max-w-4xl mx-auto">
                {getSeason('january')?.description}
              </p>
            </div>

            {/* January Season - Main games */}
            {gamesData.januaryMain.length > 0 && renderGameGrid(gamesData.januaryMain, 'january')}

            {/* "Added for January Season" text */}
            {gamesData.januaryAdded.length > 0 && (
              <div className="text-center mb-16">
                <h3 className="text-[#aaaaaa] text-[32px]">
                  Added for the January Season
                </h3>
              </div>
            )}

            {/* January Season - Added games */}
            {gamesData.januaryAdded.length > 0 && renderGameGrid(gamesData.januaryAdded, 'january')}
          </>
        )}
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
              This tournament is scheduled for the January 2026 semester. 
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