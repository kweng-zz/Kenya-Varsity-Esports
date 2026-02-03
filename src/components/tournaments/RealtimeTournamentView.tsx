// src/components/tournaments/RealtimeTournamentView.tsx
'use client';

import React, { useMemo } from 'react';
import { useRealtimeTournament } from '@/hooks/useRealtimeTournament';
import { useRealtimeBracket } from '@/hooks/useRealtimeBracket';
import { TournamentBracket, type TournamentMatch } from '@/components/tournaments/TournamentBracket';
import { TournamentLeaderboard } from '@/components/tournaments/TournamentLeaderboard';
import { TournamentCard } from '@/components/tournaments/TournamentCard';
import { TournamentLoadingState } from '@/components/tournaments/TournamentLoadingStates';
import { AnimatedCard, Confetti } from '@/components/animations/MicroInteractions';
import { Badge } from '@/components/ui/badge';
import type { Tournament } from '@/types/tournament';
import type { LeaderboardEntry as RealtimeLeaderboardEntry } from '@/lib/realtime/types';

interface RealtimeTournamentViewProps {
  tournament: Tournament;
  initialMatches: TournamentMatch[];
  initialLeaderboard: RealtimeLeaderboardEntry[];
  currentUser?: string;
}

export function RealtimeTournamentView({
  tournament,
  initialMatches,
  initialLeaderboard,
  currentUser,
}: RealtimeTournamentViewProps) {
  const [showConfetti, setShowConfetti] = React.useState(false);

  // Real-time hooks
  const { 
    leaderboard, 
    tournamentStatus 
  } = useRealtimeTournament({
    tournamentId: tournament.id,
    autoConnect: true,
  });

  const { matches } = useRealtimeBracket({
    tournamentId: tournament.id,
    initialMatches,
    enabled: true,
  });

  // Use real-time data or fallback to initial
  const currentLeaderboard = leaderboard.length > 0 ? leaderboard : initialLeaderboard;
  const currentStatus = tournamentStatus || tournament.tournamentStatus || tournament.status;

  // Transform tournament for card (mapping types)
  const displayTournament: any = {
    ...tournament,
    status: currentStatus,
    isLive: currentStatus === 'ongoing',
  };

  // Memoize active matches for the "Live Matches" section if needed
  const liveMatches = useMemo(() => 
    matches.filter(m => m.status === 'live'), 
  [matches]);

  return (
    <div className="min-h-screen bg-black text-white">
      {showConfetti && <Confetti trigger={true} />}
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                {tournament.title || 'Tournament Details'}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={displayTournament.isLive ? 'success' : 'secondary'}>
                  {displayTournament.isLive ? 'LIVE NOW' : currentStatus.toUpperCase()}
                </Badge>
                <span className="text-gray-400">{tournament.gameName}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              {/* Additional actions can go here */}
            </div>
          </div>

          <AnimatedCard glow className="bg-gray-900/50 border-gray-800">
             <div className="p-6">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <div>
                   <p className="text-sm text-gray-400">Prize Pool</p>
                   <p className="text-2xl font-bold text-[#f59e0b]">
                     {tournament.currency} {(tournament.prizePool || 0).toLocaleString()}
                   </p>
                 </div>
                 <div>
                   <p className="text-sm text-gray-400">Participants</p>
                   <p className="text-2xl font-bold">
                     {tournament.currentParticipants || 0} / {tournament.maxParticipants || '∞'}
                   </p>
                 </div>
                 <div>
                   <p className="text-sm text-gray-400">Format</p>
                   <p className="text-2xl font-bold capitalize">
                     {tournament.format?.replace('-', ' ') || 'Standard'}
                   </p>
                 </div>
                 <div>
                   <p className="text-sm text-gray-400">Start Date</p>
                   <p className="text-xl font-bold">
                     {tournament.startDate ? new Date(tournament.startDate).toLocaleDateString() : 'TBA'}
                   </p>
                 </div>
               </div>
             </div>
          </AnimatedCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Bracket */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold">Tournament Bracket</h2>
            <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-800 min-h-[400px]">
              {matches.length > 0 ? (
                <TournamentBracket
                  matches={matches}
                  interactive={true}
                  variant={tournament.format as any || 'single'}
                  onMatchClick={(match) => console.log('Match clicked:', match)}
                />
              ) : (
                 <div className="flex items-center justify-center h-full text-gray-500">
                   Bracket generation pending or not started
                 </div>
              )}
            </div>
          </div>

          {/* Sidebar - Leaderboard & Feed */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Live Standings</h2>
             <TournamentLeaderboard
                entries={currentLeaderboard.map(e => ({
                  rank: e.rank,
                  userId: e.participantId,
                  username: e.playerName,
                  score: e.score,
                  teamName: e.teamName,
                  isCurrent: e.participantId === currentUser,
                  // Add other fields if available in metadata
                })) as any}
                tournament={{
                  id: tournament.id,
                  name: tournament.title || '',
                  game: tournament.gameName,
                  status: currentStatus,
                  isLive: currentStatus === 'ongoing'
                }}
                variant="compact"
                currentUser={currentUser}
                className="bg-gray-900/30 border-gray-800"
              />
          </div>
        </div>
      </div>
    </div>
  );
}
