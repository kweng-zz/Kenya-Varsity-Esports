// src/app/tournaments/[id]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { tournamentManagement } from '@/lib/services/tournamentManagement';
import { bracketGeneration } from '@/lib/services/bracketGeneration';
import { RealtimeTournamentView } from '@/components/tournaments/RealtimeTournamentView';
import { Navigation } from '@/components/Navigation';
import { FooterSection } from '@/components/Footer';

// Force dynamic rendering since we're fetching data
export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    id: string;
  };
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tournament = await tournamentManagement.getById(params.id);
  
  if (!tournament) {
    return {
      title: 'Tournament Not Found',
    };
  }

  return {
    title: `${tournament.title} | Varsity Esports`,
    description: tournament.description || `Join the ${tournament.gameName} tournament!`,
  };
}

export default async function TournamentDetailPage({ params }: PageProps) {
  const tournament = await tournamentManagement.getById(params.id);

  if (!tournament) {
    notFound();
  }

  // Fetch bracket matches if available
  const bracket = bracketGeneration.getBracket(params.id);
  
  // Transform matches to UI format if needed
  // UI expects TournamentMatch, Service returns Match
  const initialMatches = bracket ? bracket.matches.map(m => ({
    id: m.id,
    round: m.round,
    matchNumber: m.matchNumber,
    team1: m.participant1Id ? { id: m.participant1Id, name: m.participant1Name || 'TBD' } : undefined,
    team2: m.participant2Id ? { id: m.participant2Id, name: m.participant2Name || 'TBD' } : undefined,
    winner: m.winnerId,
    score: (m.participant1Score !== undefined && m.participant2Score !== undefined) ? {
      team1: m.participant1Score,
      team2: m.participant2Score
    } : undefined,
    status: (m.status === 'in_progress' ? 'live' : m.status === 'bye' ? 'completed' : m.status) as any,
    startTime: m.scheduledAt ? new Date(m.scheduledAt) : undefined
  })) : [];
  
  const initialLeaderboard: any[] = [];

  // Note: Since we are on the server, we might need to map the Tournament type 
  // if the service returns a different shape than what the component expects.
  // The service returns Tournament from types/tournament.ts which matches.

  return (
    <main className="bg-black min-h-screen">
      <div className="relative z-20">
        <Navigation />
      </div>
      
      <RealtimeTournamentView
        tournament={tournament as any}
        initialMatches={initialMatches}
        initialLeaderboard={initialLeaderboard}
      />

      <FooterSection />
    </main>
  );
}
