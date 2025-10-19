'use client';

import React, { useState, useEffect, use } from 'react';
import Link from "next/link";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FooterSection, Navigation } from '@/components';

// Helper function to get game-specific table headers
const getGameHeaders = (gameSlug: string) => {
  const headerMap: Record<string, { col1: string; col2: string; col3: string; col4: string }> = {
    "pubg": {
      col1: "KILLS",
      col2: "PLACEMENT",
      col3: "SURVIVAL",
      col4: "CHICKEN DINNERS"
    },
    "pubgm": {
      col1: "KILLS",
      col2: "PLACEMENT",
      col3: "SURVIVAL",
      col4: "CHICKEN DINNERS"
    },
    "codm": {
      col1: "KILLS",
      col2: "WINS",
      col3: "PLACEMENT",
      col4: "MVP COUNT"
    },
    "codm-mp": {
      col1: "KILLS",
      col2: "WINS",
      col3: "K/D RATIO",
      col4: "MVP COUNT"
    },
    "efootball": {
      col1: "GOALS",
      col2: "WINS",
      col3: "CLEAN SHEETS",
      col4: "MATCHES WON"
    },
    "eafc-2v2": {
      col1: "GOALS",
      col2: "WINS",
      col3: "ASSISTS",
      col4: "MATCHES WON"
    },
    "eafc-women": {
      col1: "GOALS",
      col2: "WINS",
      col3: "ASSISTS",
      col4: "MATCHES WON"
    }
  };

  return headerMap[gameSlug] || {
    col1: "SCORE 1",
    col2: "SCORE 2",
    col3: "SCORE 3",
    col4: "SCORE 4"
  };
};

interface GameRankingPageProps {
  params: Promise<{ game: string }>;
}

interface GameCategoryRanking {
  id: string;
  university: string;
  rank: number;
  plnum: number;
  ccumW: number;
  ccumMW: number;
  bonuses: number;
  total: number;
}

interface GameCategoryInfo {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
  isActive: boolean;
  universities: GameCategoryRanking[];
}

interface SeasonData {
  seasonName: 'september' | 'january';
  title: string;
  description: string;
  isActive: boolean;
  categories: GameCategoryInfo[];
}

export default function GameRankingPage({ params }: GameRankingPageProps) {
  // Use the use() hook to unwrap the Promise
  const { game } = use(params);
  
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [gameData, setGameData] = useState<GameCategoryInfo | null>(null);
  const [seasonsData, setSeasonsData] = useState<SeasonData[]>([]);
  const [loading, setLoading] = useState(true);

  // Define the missing functions
  const handleSeasonClick = (season: SeasonData) => {
    if (!season.isActive) {
      setSelectedSeason(season.title);
      setShowComingSoonModal(true);
    }
  };

  const closeModal = () => {
    setShowComingSoonModal(false);
    setSelectedSeason('');
  };

  const getCurrentSeason = () => {
    return seasonsData.find(s => s.isActive);
  };

  const getUpcomingSeason = () => {
    return seasonsData.find(s => !s.isActive);
  };

  useEffect(() => {
    // Load game categories and rankings from Appwrite via API
    const loadGameData = async () => {
      try {
        setLoading(true);

        // Fetch all rankings data from Appwrite API
        const response = await fetch('/api/rankings?category=all');
        let appwriteData = null;
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            appwriteData = result.data;
          }
        }

        // Sample rankings data as fallback
        const sampleRankings: GameCategoryRanking[] = [
          {
            id: "1",
            university: "TECHNICAL UNIVERSITY OF KENYA",
            rank: 1,
            plnum: 17,
            ccumW: 842,
            ccumMW: 0,
            bonuses: 3,
            total: 862,
          },
          {
            id: "2",
            university: "UNIVERSITY OF NAIROBI",
            rank: 2,
            plnum: 15,
            ccumW: 720,
            ccumMW: 2,
            bonuses: 5,
            total: 740,
          },
          {
            id: "3",
            university: "KENYATTA UNIVERSITY",
            rank: 3,
            plnum: 12,
            ccumW: 650,
            ccumMW: 1,
            bonuses: 2,
            total: 663,
          },
        ];

        // Game categories mapping
        const gameCategories: Record<string, GameCategoryInfo> = {
          "pubg": {
            id: "pubg",
            name: "PUBGM",
            title: "PUBGM RANKINGS",
            description: "Current standings for PUBGM tournament",
            image: "/images/PUBGM.jpeg",
            isActive: true,
            universities: sampleRankings,
          },
          "pubgm": {
            id: "pubgm",
            name: "PUBGM",
            title: "PUBGM RANKINGS",
            description: "Current standings for PUBGM tournament",
            image: "/images/PUBGM.jpeg",
            isActive: true,
            universities: sampleRankings,
          },
          "codm": {
            id: "codm",
            name: "CALL OF DUTY MOBILE",
            title: "CODM RANKINGS",
            description: "Current standings for CODM tournament",
            image: "/images/CODM-BR.png",
            isActive: true,
            universities: sampleRankings,
          },
          "efootball": {
            id: "efootball",
            name: "EFOOTBALL",
            title: "EFOOTBALL RANKINGS",
            description: "Current standings for EFOOTBALL tournament",
            image: "/images/EFootball-Mobile.png",
            isActive: true,
            universities: sampleRankings,
          },
          "codm-mp": {
            id: "codm-mp",
            name: "CODM-MULTIPLAYER",
            title: "CODM-MULTIPLAYER RANKINGS",
            description: "Current standings for CODM-MULTIPLAYER tournament",
            image: "/images/CODM-MP.png",
            isActive: true,
            universities: sampleRankings,
          },
          "eafc-2v2": {
            id: "eafc-2v2",
            name: "EAFC-2V2",
            title: "EAFC-2V2 RANKINGS",
            description: "Current standings for EAFC-2V2 tournament",
            image: "/images/EAFC--Open.png",
            isActive: true,
            universities: sampleRankings,
          },
          "eafc-women": {
            id: "eafc-women",
            name: "EAFC-WOMEN",
            title: "EAFC-WOMEN RANKINGS",
            description: "Current standings for EAFC-Women tournament",
            image: "/images/EAFC-Women.png",
            isActive: true,
            universities: sampleRankings,
          },
        };

        // If we have Appwrite data, use it to populate the game categories
        if (appwriteData) {
          const allCategories = [
            ...(appwriteData.septemberMain || []),
            ...(appwriteData.septemberAdded || [])
          ];

          allCategories.forEach((category: any) => {
            if (gameCategories[category.id]) {
              gameCategories[category.id] = {
                ...gameCategories[category.id],
                name: category.name,
                title: category.title,
                description: category.description,
                image: category.image,
                isActive: category.isActive,
                universities: category.universities.length > 0 ? category.universities : sampleRankings
              };
            }
          });
        }

        // Use the 'game' variable from the awaited params
        const gameInfo = gameCategories[game];
        setGameData(gameInfo);

        // Set up seasons data - only September season is active for these categories
        const seasons: SeasonData[] = [
          {
            seasonName: 'september',
            title: 'KUER SEASON 2',
            description: 'Current rankings for the September 2024 semester',
            isActive: true,
            categories: Object.values(gameCategories),
          },
        ];

        setSeasonsData(seasons);
        setLoading(false);
      } catch (error) {
        console.error('Error loading game data:', error);
        setLoading(false);
      }
    };

    loadGameData();
  }, [game]); // Update dependency to use 'game' instead of 'params.game'

  const renderRankingsTable = (universities: GameCategoryRanking[], isActive: boolean) => {
    if (isActive) {
      return (
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="bg-black bg-opacity-60 rounded-lg p-6 backdrop-blur-sm">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-600 hover:bg-transparent">
                  <TableHead className="text-white text-sm font-semibold py-3 px-2">
                    UNIVERSITY
                  </TableHead>
                  <TableHead className="text-white text-sm font-semibold py-3 px-2 text-center">
                    RANK
                  </TableHead>
                  <TableHead className="text-white text-sm font-semibold py-3 px-2 text-center">
                    {getGameHeaders(game).col1}
                  </TableHead>
                  <TableHead className="text-white text-sm font-semibold py-3 px-2 text-center">
                    {getGameHeaders(game).col2}
                  </TableHead>
                  <TableHead className="text-white text-sm font-semibold py-3 px-2 text-center">
                    {getGameHeaders(game).col3}
                  </TableHead>
                  <TableHead className="text-white text-sm font-semibold py-3 px-2 text-center">
                    {getGameHeaders(game).col4}
                  </TableHead>
                  <TableHead className="text-white text-sm font-semibold py-3 px-2 text-center">
                    TOTAL
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {universities.map((university) => (
                  <TableRow key={university.id} className="border-b border-gray-600 hover:bg-gray-800 hover:bg-opacity-50">
                    <TableCell className="text-white text-sm py-3 px-2 font-medium">
                      {university.university}
                    </TableCell>
                    <TableCell className="text-white text-sm py-3 px-2 text-center font-bold text-yellow-400">
                      {university.rank}
                    </TableCell>
                    <TableCell className="text-white text-sm py-3 px-2 text-center">
                      {university.plnum}
                    </TableCell>
                    <TableCell className="text-white text-sm py-3 px-2 text-center">
                      {university.ccumW}
                    </TableCell>
                    <TableCell className="text-white text-sm py-3 px-2 text-center">
                      {university.ccumMW}
                    </TableCell>
                    <TableCell className="text-white text-sm py-3 px-2 text-center">
                      {university.bonuses}
                    </TableCell>
                    <TableCell className="text-white text-sm py-3 px-2 text-center font-bold text-green-400">
                      {university.total}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-full max-w-6xl mx-auto px-4">
          <div onClick={() => handleSeasonClick(getUpcomingSeason()!)} className="bg-black bg-opacity-40 rounded-lg p-8 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:bg-opacity-60 group border border-gray-600">
            <div className="text-center">
              <h3 className="text-white text-2xl font-bold mb-4">Rankings Coming Soon</h3>
              <p className="text-[#aaaaaa] text-lg mb-4">
                {gameData?.title} will be available in January 2026
              </p>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white/90 text-sm">Click for more details</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="bg-black flex flex-col items-center w-full min-h-screen">
        <div className="bg-black w-full max-w-[1440px] relative">
          <Navigation />
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-white text-xl">Loading...</div>
          </div>
          <FooterSection />
        </div>
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className="bg-black flex flex-col items-center w-full min-h-screen">
        <div className="bg-black w-full max-w-[1440px] relative">
          <Navigation />
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-white text-3xl font-bold mb-4">Game Category Not Found</h1>
              <p className="text-[#aaaaaa] text-lg mb-8">The game category you&apos;re looking for doesn&apos;t exist.</p>
              <Link href="/rankings" className="bg-[#961c18] hover:bg-[#961c18]/80 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                Back to Rankings
              </Link>
            </div>
          </div>
          <FooterSection />
        </div>
      </div>
    );
  }

  const currentSeason = getCurrentSeason();
  const upcomingSeason = getUpcomingSeason();
  const isCurrentSeasonGame = currentSeason?.categories.some((c: GameCategoryInfo) => c.id === gameData.id);
  const isUpcomingSeasonGame = upcomingSeason?.categories.some((c: GameCategoryInfo) => c.id === gameData.id);

  return (
      <main className="bg-black w-full min-h-screen">
      {/* Navigation at the top */}
      <div className="w-full relative z-20">
        <Navigation />
      </div>

      {/* Main content */}
      <section className="w-full relative">
        <div className="relative w-full min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${gameData.image})` }}>
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="container mx-auto px-4 relative z-10">
            {/* Back to Rankings Link */}
            <div className="pt-8 pb-4">
              <Link href="/rankings" className="inline-flex items-center text-white hover:text-[#961c18] transition-colors duration-300">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to All Rankings
              </Link>
            </div>

            {/* Current Season (if game is active) */}
            {isCurrentSeasonGame && currentSeason && (
              <>
                <div className="text-center py-16">
                  <h1 className="font-bold text-[46px] tracking-[1.84px] mb-6">
                    <span className="text-white tracking-[0.85px]">{currentSeason.title}</span>
                    <br />
                    <span className="text-[#961c18] tracking-[0.85px]">{gameData.title}</span>
                  </h1>
                  <p className="text-[#aaaaaa] text-[24px] max-w-4xl mx-auto">
                    {gameData.description}
                  </p>
                </div>

                {/* Current Season Rankings Table */}
                {renderRankingsTable(gameData.universities, gameData.isActive)}
              </>
            )}

            {/* Upcoming Season (if game is in upcoming season) */}
            {isUpcomingSeasonGame && upcomingSeason && (
              <>
                <div className="text-center py-16">
                  <h2 className="font-bold text-[46px] tracking-[1.84px] mb-6">
                    <span className="text-white tracking-[0.85px]">{upcomingSeason.title}</span>
                    <br />
                    <span className="text-[#961c18] tracking-[0.85px]">{gameData.title}</span>
                  </h2>
                  <p className="text-[#aaaaaa] text-[24px] max-w-4xl mx-auto">
                    {gameData.description}
                  </p>
                </div>

                {/* Upcoming Season Rankings Table */}
                {renderRankingsTable(gameData.universities, gameData.isActive)}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Coming Soon Modal */}
      {showComingSoonModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-[#961c18] rounded-lg max-w-md w-full p-8 text-center relative">
            {/* Close button */}
            <button onClick={closeModal} className="absolute top-4 right-4 text-white hover:text-[#961c18] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Icon */}
            <div className="w-16 h-16 bg-[#961c18] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>

            {/* Content */}
            <h2 className="text-2xl font-bold text-white mb-4">
              {selectedSeason}
            </h2>
            <h3 className="text-xl font-semibold text-[#961c18] mb-4">
              Rankings Available Soon
            </h3>
            <p className="text-[#aaaaaa] mb-8 leading-relaxed">
              Rankings for {gameData.name} will be available in January 2026. Stay tuned for updates on university standings and competition results.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/rankings" className="bg-[#961c18] hover:bg-[#961c18]/80 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-center" onClick={closeModal}>
                View Other Rankings
              </Link>
              <Link href="/tournaments" className="bg-transparent border border-[#961c18] text-[#961c18] hover:bg-[#961c18] hover:text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-center" onClick={closeModal}>
                View Tournaments
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-[#961c18]/30">
              <p className="text-[#aaaaaa] text-sm">
                Follow us for the latest updates on rankings and competitions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <FooterSection />
    </main>
  );
}