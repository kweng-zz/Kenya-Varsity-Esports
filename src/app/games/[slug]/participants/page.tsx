import React from 'react';
import { notFound } from 'next/navigation';
import { getGameBySlug } from '@/lib/gamesData';
import { Navigation } from '@/components/Navigation';
import { FooterSection } from '@/components/Footer';
import { ParticipantsTable } from '@/components/ParticipantsTable';
import Link from 'next/link';

interface TournamentParticipantsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface TournamentNavItem {
  name: string;
  href: string;
}

import { TournamentHeader } from '@/components/tournaments/TournamentHeader';
import { participantsServiceSSR } from '@/lib/services/participantsServiceSSR';
import { tournamentServiceSSR } from '@/lib/services/tournamentServiceSSR';
import { Tournament } from '@/types/tournament';


export default async function TournamentParticipantsPage({ params }: TournamentParticipantsPageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  // Fetch participants server-side
  const teams = await participantsServiceSSR.getTournamentParticipants(slug);

  // Fetch tournament data for hero image
  let tournamentData: Tournament | null = null;
  try {
    tournamentData = await tournamentServiceSSR.getTournamentBySlug(slug);
  } catch (error) {
    console.error(`❌ Error fetching tournament data for ${slug}:`, error);
  }

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      <Navigation />
      
      {/* Hero Section with Integrated Command Center Navigation */}
      <TournamentHeader 
        slug={slug}
        gameName={tournamentData?.gameName || slug.replace('-', ' ')}
        subtitle="PARTICIPANTS"
        currentPath={`/games/${slug}/participants`}
        featuredImageUrl={tournamentData?.featuredImageUrl}
      />

      {/* Content Section */}
      <section className="relative w-full bg-black py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-[#080808] to-black" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-white font-['Hind']">
            <ParticipantsTable teams={teams} gameSlug={slug} />
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}