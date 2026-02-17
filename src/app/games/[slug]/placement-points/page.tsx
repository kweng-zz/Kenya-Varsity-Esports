import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { tournamentServiceSSR } from '@/lib/services/tournamentServiceSSR';
import { getGameBySlug } from '@/lib/gamesData';
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
  const game = getGameBySlug(slug);
  
  const tournamentData = await tournamentServiceSSR.getTournamentBySlug(slug);

  if (!tournamentData && !game) {
    return {
      title: 'Tournament Placement Points Not Found | KVE',
      description: 'The requested tournament placement points could not be found.',
    };
  }

  const title = tournamentData?.gameName || game?.name || 'Tournament';

  return {
    title: `${title} Tournament Placement Points | KVE`,
    description: `Learn about the placement points system for the ${title} tournament. Understand how points contribute to your university ranking.`,
    keywords: `${title}, tournament placement points, university ranking, esports, gaming, Kenya, university, competition`,
    openGraph: {
      title: `${title} Tournament Placement Points`,
      description: `Learn about the placement points system for the ${title} tournament.`,
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kve.co.ke'}/games/${slug}/placement-points`,
      images: tournamentData?.featuredImageUrl ? [{ url: tournamentData.featuredImageUrl, width: 1200, height: 630, alt: title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} Tournament Placement Points`,
      description: `Learn about the placement points system for the ${title} tournament.`,
      images: tournamentData?.featuredImageUrl ? [tournamentData.featuredImageUrl] : undefined,
    },
  };
}

export default async function TournamentPlacementPointsPage({ params }: TournamentPlacementPointsPageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  // If game slug doesn't exist in our games data, show 404
  if (!game) {
    notFound();
  }
  
  // Fetch tournament data from CMS
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

  const currentPath = `/games/${slug}/placement-points`;

  // Determine hero background image
  const getHeroImage = () => {
    if (tournamentData?.featuredImageUrl) {
      return tournamentData.featuredImageUrl;
    }
    return game?.image || '/images/Mask Group.png';
  };

  const gameName = tournamentData?.gameName || game?.name || 'Tournament';

  // Placement points data
  const placementPoints = [
    { place: '1st Place', points: 100, icon: '🥇', gradient: 'from-yellow-600/30 to-yellow-900/10', border: 'border-yellow-500/50', text: 'text-yellow-400', glow: 'shadow-yellow-500/20' },
    { place: '2nd Place', points: 80, icon: '🥈', gradient: 'from-gray-400/20 to-gray-700/10', border: 'border-gray-400/50', text: 'text-gray-300', glow: 'shadow-gray-400/20' },
    { place: '3rd Place', points: 65, icon: '🥉', gradient: 'from-orange-600/25 to-orange-900/10', border: 'border-orange-500/50', text: 'text-orange-400', glow: 'shadow-orange-500/20' },
    { place: '4th Place', points: 50, icon: '🏅', gradient: 'from-blue-600/20 to-blue-900/10', border: 'border-blue-500/40', text: 'text-blue-400', glow: 'shadow-blue-500/15' },
    { place: '5th-8th', points: 35, icon: '⚔️', gradient: 'from-green-600/20 to-green-900/10', border: 'border-green-500/40', text: 'text-green-400', glow: 'shadow-green-500/15' },
    { place: '9th-16th', points: 20, icon: '🎯', gradient: 'from-purple-600/20 to-purple-900/10', border: 'border-purple-500/40', text: 'text-purple-400', glow: 'shadow-purple-500/15' },
    { place: '17th+', points: 10, icon: '🎮', gradient: 'from-indigo-600/15 to-indigo-900/10', border: 'border-indigo-500/30', text: 'text-indigo-400', glow: 'shadow-indigo-500/10' },
  ];

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

      {/* Neo-Brutalist Placement Points Content */}
      <section className="relative w-full bg-[#080808] min-h-screen py-20 md:py-32">
        {/* Enhanced Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#080808] via-black to-[#080808]" />
          
          {/* Neo-brutalist accent elements */}
          <div className="absolute top-20 left-10 w-2 h-32 bg-[#8c110d] opacity-80 transform rotate-12" />
          <div className="absolute top-24 left-20 w-32 h-2 bg-[#8c110d] opacity-60 transform -rotate-12" />
          <div className="absolute bottom-40 right-20 w-2 h-40 bg-[#8c110d] opacity-70 transform -rotate-6" />
          <div className="absolute bottom-48 right-10 w-40 h-2 bg-[#8c110d] opacity-50 transform rotate-12" />
          
          {/* Subtle red glow corners */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#8c110d] opacity-10 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#8c110d] opacity-[0.08] blur-3xl" />
          
          {/* Background mask images */}
          <img
            className="absolute top-105 left-20 w-2/4 h-2/4 object-contain -translate-x-1/2 -translate-y-1/2 sm:opacity-10 opacity-5"
            alt="Background Left"
            src="/images/Mask Group.png"
          />
          <img
            className="absolute top-105 right-20 w-2/4 h-2/4 object-contain translate-x-1/2 -translate-y-1/2 scale-x-[-1] sm:opacity-10 opacity-5"
            alt="Background Right"
            src="/images/Mask Group.png"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Brutalist Header */}
          <div className="mb-16 relative">
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-black opacity-20 rotate-12" />
            
            <div className="relative">
              <div className="mb-4">
                <span className="text-[#8c110d] font-black text-sm tracking-[0.3em] uppercase">TOURNAMENT</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none">
                <span className="block">{gameName}</span>
                <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#8c110d] mt-2 block">PLACEMENT POINTS</span>
              </h1>
            </div>

            {/* Back Link */}
            <div className="mt-8">
              <Link 
                href={`/games/${slug}/information`}
                className="group inline-flex items-center px-6 py-3 bg-black border-2 border-gray-700 hover:border-[#8c110d] text-gray-300 hover:text-white font-black text-sm uppercase tracking-wider transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Information
              </Link>
            </div>
          </div>

          {/* KVE Official System — Main Intro Card */}
          <div className="mb-20 relative">
            <div className="absolute -inset-2 border border-[#8c110d]/30 transform rotate-1" />
            <div className="absolute -inset-4 border border-[#8c110d]/15 transform -rotate-1" />
            
            <div className="relative bg-black border-2 border-gray-800 p-8 md:p-12">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#8c110d]" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#8c110d]" />
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl">🏆</span>
                <div>
                  <div className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-1">Official KVE</div>
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">Scoring System</h2>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#8c110d] to-transparent" />
                <p className="text-lg md:text-xl leading-relaxed text-gray-300 pl-6">
                  When you participate and get the following positions, the points go to your university ranking. 
                  The University with the most points becomes the ultimate winner of the season.
                </p>
              </div>
              
              <div className="mt-6 h-1 bg-gradient-to-r from-[#8c110d] via-transparent to-[#8c110d] opacity-30" />
            </div>
          </div>

          {/* 1. Placement Points — Stunning Card Grid */}
          <div className="mb-20">
            <div className="mb-12 border-l-4 border-[#8c110d] bg-black overflow-hidden relative">
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-[#8c110d] to-transparent opacity-30" />
              <div className="px-8 py-6 border-b border-gray-800/50">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-4">
                  <span className="text-[#8c110d] text-xl font-black">🎯</span>
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    1. Placement Points
                  </span>
                </h2>
                <p className="text-gray-400 mt-2 text-sm">Points awarded based on tournament placement</p>
              </div>
              
              <div className="px-8 py-8 bg-gradient-to-b from-black to-[#080808]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {placementPoints.map((item, index) => (
                    <div 
                      key={index} 
                      className="group relative transform transition-all duration-500 hover:scale-105"
                      style={{ 
                        animationDelay: `${index * 100}ms`,
                        animation: 'fadeInUp 0.6s ease-out forwards',
                        opacity: 0
                      }}
                    >
                      {/* Glowing background effect */}
                      <div className={`absolute -inset-1 bg-gradient-to-r ${item.gradient} rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur`} />
                      
                      <div className={`relative bg-black border-2 border-gray-800 group-hover:${item.border} transition-all duration-500 p-6 text-center shadow-lg ${item.glow}`}>
                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#8c110d] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#8c110d] opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="text-4xl mb-3">{item.icon}</div>
                        <div className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-2">{item.place}</div>
                        <div className={`text-3xl font-black ${item.text}`}>{item.points}</div>
                        <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-1">points</div>
                        
                        <div className={`mt-4 h-0.5 bg-gradient-to-r ${item.gradient} opacity-50`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Participation Points */}
          <div className="mb-20">
            <div className="mb-12 border-l-4 border-[#8c110d] bg-black overflow-hidden relative">
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-[#8c110d] to-transparent opacity-30" />
              <div className="px-8 py-6 border-b border-gray-800/50">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-4">
                  <span className="text-[#8c110d] text-xl font-black">🎮</span>
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    2. Participation Points
                  </span>
                </h2>
                <p className="text-gray-400 mt-2 text-sm">Additional points for consistency and engagement</p>
              </div>
              
              <div className="px-8 py-8 bg-gradient-to-b from-black to-[#080808]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* University Participation */}
                  <div className="group relative transform transition-all duration-300 hover:scale-105">
                    <div className="absolute -inset-2 border border-green-500/20 transform rotate-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative bg-black border-2 border-gray-800 group-hover:border-green-500/50 transition-all duration-300 p-8">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-3">University Participation</div>
                      <p className="text-gray-300 leading-relaxed mb-4">
                        If a university competes in 50% or more of all KVE game titles
                      </p>
                      <div className="inline-block px-4 py-2 bg-gradient-to-r from-green-600/20 to-transparent border-l-4 border-green-500">
                        <span className="text-green-400 font-black text-2xl">+50</span>
                        <span className="text-green-400/70 font-bold text-sm ml-2 uppercase tracking-wider">points</span>
                      </div>
                      
                      <div className="mt-4 h-1 bg-gradient-to-r from-green-500 to-transparent opacity-30" />
                    </div>
                  </div>

                  {/* Tournament Appearances */}
                  <div className="group relative transform transition-all duration-300 hover:scale-105">
                    <div className="absolute -inset-2 border border-blue-500/20 transform -rotate-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative bg-black border-2 border-gray-800 group-hover:border-blue-500/50 transition-all duration-300 p-8">
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-3">Tournament Appearances</div>
                      <p className="text-gray-300 leading-relaxed mb-4">
                        Each athlete/team representing the university in a KVE tournament
                      </p>
                      <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600/20 to-transparent border-l-4 border-blue-500">
                        <span className="text-blue-400 font-black text-2xl">+10</span>
                        <span className="text-blue-400/70 font-bold text-sm ml-2 uppercase tracking-wider">points</span>
                      </div>
                      
                      <div className="mt-4 h-1 bg-gradient-to-r from-transparent to-blue-500 opacity-30" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Social Media Points */}
          <div className="mb-20">
            <div className="mb-12 border-l-4 border-[#8c110d] bg-black overflow-hidden relative">
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-[#8c110d] to-transparent opacity-30" />
              <div className="px-8 py-6 border-b border-gray-800/50">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-4">
                  <span className="text-[#8c110d] text-xl font-black">📱</span>
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    3. Social Media Points
                  </span>
                </h2>
                <p className="text-gray-400 mt-2 text-sm">Bonus points for digital presence and branding</p>
              </div>
              
              <div className="px-8 py-8 bg-gradient-to-b from-black to-[#080808]">
                <div className="group relative transform transition-all duration-300 hover:scale-[1.02]">
                  <div className="absolute -inset-2 border border-pink-500/20 transform rotate-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative bg-black border-2 border-gray-800 group-hover:border-pink-500/50 transition-all duration-300 p-8">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-pink-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-pink-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div>
                        <div className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-3">Verified Social Media Mention</div>
                        <p className="text-gray-300 leading-relaxed max-w-xl">
                          Per verified social media mention by an athlete from that university — must tag KVE official accounts and/or use designated KVE hashtags.
                        </p>
                      </div>
                      <div className="flex-shrink-0 px-6 py-4 bg-gradient-to-r from-pink-600/20 to-transparent border-l-4 border-pink-500">
                        <span className="text-pink-400 font-black text-3xl">+50</span>
                        <span className="text-pink-400/70 font-bold text-sm ml-2 uppercase tracking-wider">points</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 h-1 bg-gradient-to-r from-pink-500 via-transparent to-pink-500 opacity-30" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes — Enhanced Design */}
          <div className="mb-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-transparent" />
            <div className="relative border-l-8 border-blue-500 bg-black/50 backdrop-blur-sm p-8 rounded-r-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-2xl">📝</div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-blue-300">Important Notes</h2>
              </div>
              
              <div className="space-y-4">
                {[
                  'Points are cumulative across all game titles and tournaments in a season',
                  'Both team-based and individual game titles contribute equally to the university\'s overall ranking',
                  'KVE reserves the right to verify all participation and social media mentions before awarding points',
                ].map((note, idx) => (
                  <div 
                    key={idx} 
                    className="group relative bg-gradient-to-r from-blue-900/20 to-transparent border-l-4 border-blue-500/50 p-4 rounded-r-lg hover:border-blue-400 transition-colors duration-300"
                  >
                    <div className="absolute -left-2 top-4 w-6 h-6 bg-blue-500/30 rounded-full flex items-center justify-center text-blue-300 font-black text-xs group-hover:scale-110 transition-transform duration-300">
                      {idx + 1}
                    </div>
                    <div className="ml-6 text-blue-200 leading-relaxed">{note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Registration CTA */}
          <div className="relative mb-20">
            <div className="absolute inset-0 bg-gradient-to-r from-[#8c110d] to-transparent transform -skew-y-1" />
            <div className="relative bg-black border-4 border-[#8c110d] rounded-lg p-12 text-center transform hover:scale-[1.02] transition-transform duration-300">
              <div className="mb-8">
                <div className="text-[#8c110d] font-black text-sm uppercase tracking-wider mb-4">Registration</div>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-4">
                  Ready to Compete?
                </h2>
                <p className="text-gray-300 text-lg mb-8">
                  Join the tournament and showcase your skills against the best players in Kenya
                </p>
              </div>
              
              <a 
                href="/tournament-registration" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group inline-flex items-center px-12 py-6 bg-gradient-to-r from-[#8c110d] to-[#b91c17] hover:from-[#b91c17] hover:to-[#8c110d] text-white font-black text-lg uppercase tracking-wider transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#8c110d]/50"
              >
                <span>Register Now</span>
                <svg className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>


      </section>

      <FooterSection />
    </div>
  );
}