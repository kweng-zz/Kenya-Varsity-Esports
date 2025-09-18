'use client';

import React from 'react';
import { useParams, usePathname } from 'next/navigation';
import { FooterSection } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import ProtectedRoute from "@/components/auth/ProotectedRoute";
import Link from "next/link";
import { getGameBySlug } from '@/lib/pagedata/tournaments';
import { initializeTournamentData } from '@/lib/database/tournament-schema';

interface TournamentLayoutProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Custom fallback component for tournament pages
const TournamentAuthFallback = ({ gameName }: { gameName: string }) => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="max-w-lg w-full mx-4">
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Join {gameName} Tournament</h2>
          <p className="text-gray-300 text-lg mb-4">
            Access exclusive {gameName} tournaments and compete with students from across Kenya.
          </p>
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="text-[#961c18] font-semibold mb-2">🏆 What You'll Get Access To:</h3>
            <ul className="text-gray-400 text-sm space-y-1 text-left">
              <li>• {gameName} tournament registration</li>
              <li>• Live tournament brackets</li>
              <li>• Team formation and management</li>
              <li>• Prize pools and rewards</li>
              <li>• Community leaderboards</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <Link
            href="/register"
            className="w-full bg-[#961c18] hover:bg-[#7a1514] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 block"
          >
            Create Account & Join Tournament
          </Link>

          <Link
            href="/login"
            className="w-full bg-transparent border-2 border-[#961c18] text-[#961c18] hover:bg-[#961c18] hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 block"
          >
            Already Have an Account? Sign In
          </Link>

          <Link
            href="/tournaments"
            className="text-gray-400 hover:text-white transition-colors duration-200 text-sm block"
          >
            ← Back to All Tournaments
          </Link>
        </div>
      </div>
    </div>
  </div>
);

// Navigation tabs for tournament sections
const TournamentNavigation = ({ gameSlug, currentPath }: { gameSlug: string; currentPath: string }) => {
  const tabs = [
    { name: 'Overview', path: `/games/${gameSlug}`, icon: '🏠' },
    { name: 'Information', path: `/games/${gameSlug}/information`, icon: 'ℹ️' },
    { name: 'Calendar', path: `/games/${gameSlug}/calendar`, icon: '📅' },
    { name: 'Participants', path: `/games/${gameSlug}/participants`, icon: '👥' },
    { name: 'Community', path: `/games/${gameSlug}/community`, icon: '💬' }
  ];

  return (
    <div className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-6xl mx-auto px-4">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = currentPath === tab.path;
            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-[#961c18] text-[#961c18]'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default function TournamentLayout({ children, fallback }: TournamentLayoutProps) {
  const params = useParams();
  const pathname = usePathname();
  const slug = params.slug as string;
  
  // Get game data from tournaments data
  const game = getGameBySlug(slug);
  
  // If game doesn't exist, show 404
  if (!game) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="max-w-lg w-full mx-4">
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-3">Game Not Found</h1>
            <p className="text-gray-300 text-lg mb-6">
              The tournament game you're looking for doesn't exist or may have been removed.
            </p>
            <Link
              href="/tournaments"
              className="bg-[#961c18] hover:bg-[#7a1514] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              View All Tournaments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Initialize tournament data when component mounts
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeTournamentData(slug, game.name);
    }
  }, [slug, game.name]);

  const defaultFallback = <TournamentAuthFallback gameName={game.name} />;

  return (
    <ProtectedRoute fallback={fallback || defaultFallback}>
      <main className="bg-black w-full min-h-screen">
        {/* Navigation at the top - full width across entire page */}
        <div className="w-full relative z-20">
          <Navigation />
        </div>

        {/* Tournament Navigation */}
        <TournamentNavigation gameSlug={slug} currentPath={pathname} />

        {/* Main Content */}
        <div className="min-h-screen">
          {children}
        </div>

        {/* Footer section - full width */}
        <FooterSection />
      </main>
    </ProtectedRoute>
  );
}

// Export game data hook for use in child components
export const useTournamentGame = () => {
  const params = useParams();
  const slug = params.slug as string;
  return getGameBySlug(slug);
};