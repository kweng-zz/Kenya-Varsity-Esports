import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { FooterSection } from '@/components/Footer';
import { RankingsExplorer } from '@/components/pages/rankings/RankingsExplorer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'KVE Game Rankings | Kenya Varsity Esports',
  description:
    'Official KVE player standings across eFootball Mobile, PUBG Mobile and Call of Duty Mobile tournaments. See the top performers from Kenyan universities.',
  openGraph: {
    title: 'KVE Game Rankings | Kenya Varsity Esports',
    description:
      'Official KVE player standings across all game titles. See the top performers from Kenyan universities.',
  },
};

function ExplorerFallback() {
  return (
    <section className="w-full bg-[#080808] py-12 md:py-16">
      <div className="w-full px-4 md:px-8 max-w-6xl mx-auto space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-[72px] border border-gray-800 bg-[#0a0a0a] animate-pulse" />
        ))}
      </div>
    </section>
  );
}

export default function RankingsPage() {
  return (
    <main className="bg-black min-h-screen font-hind">
      {/* Navigation at the top */}
      <div className="w-full relative z-20">
        <Navigation />
      </div>

      {/* Hero */}
      <section className="relative w-full bg-[#080808] overflow-hidden border-b border-[#8c110d]/40">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-16 left-8 w-2 h-28 bg-[#8c110d] opacity-70 transform rotate-12" />
          <div className="absolute bottom-10 right-12 w-40 h-2 bg-[#8c110d] opacity-40 transform -rotate-3" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#8c110d] opacity-[0.08] blur-3xl" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="absolute top-1/2 right-4 w-72 h-72 object-contain -translate-y-1/2 opacity-[0.07] hidden md:block"
            alt=""
            src="/images/Mask Group.png"
          />
        </div>

        <div className="relative z-10 w-full pl-4 md:pl-8 pr-4 md:pr-8 pt-16 pb-14 md:pt-24 md:pb-20 max-w-6xl mx-auto">
          <div className="mb-5">
            <span className="bg-[#E73138] text-white text-xs font-bold px-3 py-1 uppercase tracking-wider italic transform -skew-x-12 inline-block">
              Official Standings
            </span>
          </div>

          <h1 className="text-white text-5xl md:text-7xl font-black italic uppercase leading-none tracking-tighter mb-6 max-w-4xl">
            <span className="block">KVE Game</span>
            <span className="block text-[#E73138]">Rankings</span>
          </h1>

          <p className="text-gray-300 text-lg md:text-xl max-w-2xl font-light">
            Top performers from our tournaments. Points are earned on the stage — follow your
            favourite players as the season unfolds.
          </p>
        </div>
      </section>

      {/* Rankings explorer (filters + table) */}
      <Suspense fallback={<ExplorerFallback />}>
        <RankingsExplorer />
      </Suspense>

      {/* CTA */}
      <section className="w-full bg-black py-16 md:py-20">
        <div className="w-full px-4 md:px-8 max-w-6xl mx-auto">
          <div className="relative border-4 border-[#8c110d] bg-black p-8 md:p-12 text-center">
            <div className="text-[#8c110d] font-black text-xs uppercase tracking-[0.3em] mb-4">
              Climb The Ladder
            </div>
            <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white mb-4">
              Think You Can <span className="text-[#E73138]">Top The Board?</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              Register for an upcoming tournament, play for your university and earn your place in
              the standings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/events"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#8c110d] to-[#b91c17] hover:from-[#b91c17] hover:to-[#8c110d] text-white font-black text-sm uppercase tracking-wider transition-all duration-300"
              >
                View Upcoming Events
              </Link>
              <Link
                href="/games/efootball-mobile/information"
                className="inline-flex items-center justify-center px-8 py-4 bg-black border-2 border-gray-700 hover:border-[#8c110d] text-gray-300 hover:text-white font-black text-sm uppercase tracking-wider transition-all duration-300"
              >
                Explore Game Titles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer section */}
      <FooterSection />
    </main>
  );
}
