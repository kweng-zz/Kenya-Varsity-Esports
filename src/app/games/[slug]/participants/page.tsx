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

import { tournamentNavItems } from '@/lib/tournamentNavigation';
import { participantsServiceSSR } from '@/lib/services/participantsServiceSSR';


export default async function TournamentParticipantsPage({ params }: TournamentParticipantsPageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  const currentPath = `/games/${slug}/participants`;

  // Fetch participants server-side
  // We use the SSR service which handles environment variables correctly for server context
  const teams = await participantsServiceSSR.getTournamentParticipants(slug);

  console.log(`🎮 Participants Page: Fetched ${teams.length} teams for ${slug}`);

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative w-full h-[560px] bg-black mt-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${game.image})` }}
        ></div>

        <div className="absolute inset-0 bg-[#0F0F13] opacity-0"></div>

        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(182.1deg, #0F0F13 22.17%, rgba(12, 14, 17, 0) 74.51%)',
          }}
        ></div>

        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(0deg, rgba(15, 15, 19, 0.9) 22.17%, rgba(12, 14, 17, 0) 74.51%)',
          }}
        ></div>

        <div className="absolute inset-0 overflow-hidden">
          <img
            className="absolute top-105 left-19 w-2/4 h-2/4 object-contain -translate-x-1/2 -translate-y-1/2"
            alt="Background Left"
            src="/images/Mask Group.png"
          />
          
          <img
            className="absolute top-105 right-19 w-2/4 h-2/4 object-contain translate-x-1/2 -translate-y-1/2 scale-x-[-1]"
            alt="Background Right"
            src="/images/Mask Group.png"
          />
        </div>
      </section>

      {/* Tournament Navigation Section */}
      <section className="relative bg-black h-[100px]">
        <img
          className="absolute w-full h-full object-cover opacity-20"
          alt="Background"
          src="https://c.animaapp.com/md6ebassseX7AK/img/group-44.png"
        />

        <div className="absolute bottom-1 left-0 w-full h-[0.5px] bg-white/50 z-5"></div>

        <div className="relative z-10 h-full">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex space-x-12">
            {tournamentNavItems.map((item, index) => {
              const itemHref = item.href.replace('[slug]', slug);
              const isActive = currentPath === itemHref;
              
              return (
                <div key={`tournament-nav-${index}`} className="relative">
                  <Link
                    href={itemHref}
                    className={`text-xl font-bold font-hind tracking-wide transition-colors ${
                      isActive
                        ? 'text-[#8c110d]' 
                        : 'text-[#8c110d] hover:text-[#b91c17]'
                    }`}
                  >
                    {item.name}
                  </Link>
                  {isActive && (
                    <div className="absolute -bottom-2 left-0 w-full h-[3px] bg-[#8e130e]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Content Section - Empty for now */}
      <section className="relative w-full bg-black py-16">
        <div className="absolute inset-0 overflow-hidden">
          <img
            className="absolute top-105 left-20 w-2/4 h-2/4 object-contain -translate-x-1/2 -translate-y-1/2"
            alt="Background Left"
            src="/images/Mask Group.png"
          />
          
          <img
            className="absolute top-105 right-20 w-2/4 h-2/4 object-contain translate-x-1/2 -translate-y-1/2 scale-x-[-1]"
            alt="Background Right"
            src="/images/Mask Group.png"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-white font-['Hind']">
            <ParticipantsTable teams={teams} gameSlug={slug} />
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}