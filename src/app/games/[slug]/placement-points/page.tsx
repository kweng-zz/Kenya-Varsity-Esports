import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { tournamentServiceSSR } from '@/lib/services/tournamentServiceSSR';
import { Tournament } from '@/types/tournament';
import { Navigation } from '@/components/Navigation';
import { FooterSection } from '@/components/Footer';
import { tournamentNavItems } from '@/lib/tournamentNavigation';
import Link from 'next/link';

interface TournamentPlacementPointsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Disable caching for this page to ensure fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Generate metadata for SEO
export async function generateMetadata({ params }: TournamentPlacementPointsPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const tournamentData = await tournamentServiceSSR.getTournamentBySlug(slug);

  if (!tournamentData) {
    return {
      title: 'Tournament Placement Points Not Found | Kuer',
      description: 'The requested tournament placement points could not be found.',
    };
  }

  const title = tournamentData.gameName || 'Tournament';

  return {
    title: `${title} Tournament Placement Points | Kuer`,
    description: `Learn about the placement points system for the ${title} tournament. Understand how points contribute to your university ranking.`,
    keywords: `${title}, tournament placement points, university ranking, esports, gaming, Kenya, university, competition`,
    openGraph: {
      title: `${title} Tournament Placement Points`,
      description: `Learn about the placement points system for the ${title} tournament.`,
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kuer.com'}/games/${slug}/placement-points`,
      images: tournamentData.featuredImageUrl ? [{ url: tournamentData.featuredImageUrl, width: 1200, height: 630, alt: title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} Tournament Placement Points`,
      description: `Learn about the placement points system for the ${title} tournament.`,
      images: tournamentData.featuredImageUrl ? [tournamentData.featuredImageUrl] : undefined,
    },
  };
}

export default async function TournamentPlacementPointsPage({ params }: TournamentPlacementPointsPageProps) {
  const { slug } = await params;
  
  // Fetch tournament data
  let tournamentData: Tournament | null = null;
  try {
    tournamentData = await tournamentServiceSSR.getTournamentBySlug(slug);
    
    if (!tournamentData) {
      const allTournaments = await tournamentServiceSSR.getPublishedTournaments();
      tournamentData = allTournaments.find(t => t.slug === slug) || null;
    }
  } catch (error) {
    console.error(`Error fetching tournament data for ${slug}:`, error);
  }

  if (!tournamentData) {
    notFound();
  }
  
  const currentPath = `/games/${slug}/placement-points`;

  // Determine hero background image
  const getHeroImage = () => {
    if (tournamentData?.featuredImageUrl) {
      return tournamentData.featuredImageUrl;
    }
    return '/images/Mask Group.png';
  };

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative w-full h-[560px] bg-black mt-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${getHeroImage()})` }}
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

      {/* Tournament Placement Points Content */}
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
          <div className="text-white font-['Hind'] font-bold">
            <h1 className="text-3xl md:text-4xl uppercase mb-8 text-white">
              {tournamentData.gameName} Tournament Placement Points
            </h1>
            
            {/* Back to Information Link */}
            <div className="mb-8">
              <Link 
                href={`/games/${slug}/information`}
                className="inline-flex items-center text-[#8c110d] hover:text-[#b91c17] transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Tournament Information
              </Link>
            </div>
            </div>

            {/* KUER Official Placement Points System */}
            <div className="mb-8">
              <div className="bg-[#1a1a1a] p-8 rounded-lg border border-[#8c110d]">
                <h2 className="text-2xl font-bold text-[#8c110d] mb-6">📋 KUER Official Placement Points System</h2>
                <div className="text-white text-lg leading-relaxed space-y-6">
                  <div className="bg-gradient-to-r from-[#8c110d]/20 to-transparent p-6 rounded-lg border-l-4 border-[#8c110d]">
                    <p className="text-xl font-semibold mb-4">
                      When you participate and get the following positions, the points go to your university ranking. 
                      The University with the most points becomes the ultimate winner of the season.
                    </p>
                    <div className="flex items-center space-x-2 text-[#8c110d]">
                      <span className="text-2xl">🏆</span>
                      <span className="font-bold">Official KUER Scoring System</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    {/* 1. Placement Points */}
                    <div className="bg-black/50 p-6 rounded-lg border border-[#8c110d]/30">
                      <div className="flex items-center mb-4">
                        <span className="text-2xl mr-3">🎯</span>
                        <h3 className="text-lg font-semibold text-[#8c110d]">1. Placement Points</h3>
                      </div>
                      <p className="text-sm text-gray-300 mb-4">Points awarded based on tournament placement:</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-gradient-to-r from-yellow-600/20 to-transparent rounded">
                          <span className="font-bold flex items-center"><span className="text-yellow-500 mr-2">🥇</span>1st Place:</span>
                          <span className="text-yellow-400 font-bold">100 points</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gradient-to-r from-gray-400/20 to-transparent rounded">
                          <span className="font-bold flex items-center"><span className="text-gray-400 mr-2">🥈</span>2nd Place:</span>
                          <span className="text-gray-300 font-bold">80 points</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gradient-to-r from-orange-600/20 to-transparent rounded">
                          <span className="font-bold flex items-center"><span className="text-orange-500 mr-2">🥉</span>3rd Place:</span>
                          <span className="text-orange-400 font-bold">65 points</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gradient-to-r from-blue-600/20 to-transparent rounded">
                          <span className="font-bold">4th Place:</span>
                          <span className="text-blue-400 font-bold">50 points</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gradient-to-r from-green-600/20 to-transparent rounded">
                          <span className="font-bold">5th-8th Place:</span>
                          <span className="text-green-400 font-bold">35 points</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gradient-to-r from-purple-600/20 to-transparent rounded">
                          <span className="font-bold">9th-16th Place:</span>
                          <span className="text-purple-400 font-bold">20 points</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gradient-to-r from-indigo-600/20 to-transparent rounded">
                          <span className="font-bold">17th & Beyond:</span>
                          <span className="text-indigo-400 font-bold">10 points</span>
                        </div>
                      </div>
                    </div>

                    {/* 2. Participation Points */}
                    <div className="bg-black/50 p-6 rounded-lg border border-[#8c110d]/30">
                      <div className="flex items-center mb-4">
                        <span className="text-2xl mr-3">🎮</span>
                        <h3 className="text-lg font-semibold text-[#8c110d]">2. Participation Points</h3>
                      </div>
                      <p className="text-sm text-gray-300 mb-4">Additional points for consistency and engagement:</p>
                      <div className="space-y-3 text-sm">
                        <div className="p-3 bg-gradient-to-r from-green-600/20 to-transparent rounded">
                          <p className="font-bold text-green-400 mb-2">University Participation Across Titles:</p>
                          <p className="text-gray-300">If a university competes in 50% or more of all KUER game titles → <span className="font-bold text-green-400">+50 points</span></p>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-blue-600/20 to-transparent rounded">
                          <p className="font-bold text-blue-400 mb-2">Tournament Appearances:</p>
                          <p className="text-gray-300">Each athlete/team representing the university in a KUER tournament → <span className="font-bold text-blue-400">+10 points</span></p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Social Media Points */}
                  <div className="bg-black/50 p-6 rounded-lg border border-[#8c110d]/30">
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-3">📱</span>
                      <h3 className="text-lg font-semibold text-[#8c110d]">3. Social Media Points</h3>
                    </div>
                    <p className="text-sm text-gray-300 mb-4">Bonus points for digital presence and branding:</p>
                    <div className="p-3 bg-gradient-to-r from-pink-600/20 to-transparent rounded">
                      <p className="text-gray-300"><span className="font-bold text-pink-400">+50 points</span> per verified social media mention by an athlete from that university (must tag KUER official accounts and/or use designated KUER hashtags)</p>
                    </div>
                  </div>

                  {/* 4. Important Notes */}
                  <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/50 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">📝</span>
                      <div>
                        <p className="text-blue-300 font-semibold mb-3">Important Notes:</p>
                        <div className="space-y-2 text-blue-200 text-sm">
                          <div className="flex items-start space-x-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <p>Points are cumulative across all game titles and tournaments in a season</p>
                          </div>
                          <div className="flex items-start space-x-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <p>Both team-based and individual game titles contribute equally to the university's overall ranking</p>
                          </div>
                          <div className="flex items-start space-x-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <p>KUER reserves the right to verify all participation and social media mentions before awarding points</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            

            
        </div>
      </section>

      <FooterSection />
    </div>
  );
}