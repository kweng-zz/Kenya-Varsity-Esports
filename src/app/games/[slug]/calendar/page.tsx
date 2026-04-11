// src/app/games/[slug]/calendar/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { getGameBySlug } from '@/lib/gamesData';
// Import Supabase calendar service instead of Sanity
import { calendarService } from '@/lib/services/calendarService';
import { tournamentServiceSSR } from '@/lib/services/tournamentServiceSSR';
import { Tournament } from '@/types/tournament';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { FooterSection } from '@/components/Footer';
import { TournamentCalendar } from '@/components/TournamentCalendar';
import { TournamentHeader } from '@/components/tournaments/TournamentHeader';

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CalendarPage({ params }: PageProps) {
  const { slug } = await params
  const game = getGameBySlug(slug)

  if (!game) {
    notFound()
  }

  const calendarData = await calendarService.getCalendarData(slug)
  const events = calendarData?.events || []

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
        gameName={tournamentData?.gameName || game?.name || 'Tournament'}
        subtitle="CALENDAR"
        currentPath={`/games/${slug}/calendar`}
        featuredImageUrl={tournamentData?.featuredImageUrl}
      />

      {/* Tournament Calendar Content Section */}
      <section id="tournament-info" className="relative w-full bg-black py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-[#080808] to-black" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-white font-['Hind']">
            <TournamentCalendar events={events} gameSlug={slug} />
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  )
}
