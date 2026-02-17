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
import { PDFViewer } from '@/components/PDFViewer';

interface TournamentRulesPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Disable caching for this page to ensure fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Generate metadata for SEO
export async function generateMetadata({ params }: TournamentRulesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  
  const tournamentData = await tournamentServiceSSR.getTournamentBySlug(slug);

  if (!tournamentData && !game) {
    return {
      title: 'Tournament Rules Not Found | KVE',
      description: 'The requested tournament rules could not be found.',
    };
  }

  const title = tournamentData?.gameName || game?.name || 'Tournament';

  return {
    title: `${title} Tournament Rules & Regulations | KVE`,
    description: `Complete rules and regulations for the ${title} tournament. Learn about game rules, conduct requirements, and tournament format.`,
    keywords: `${title}, tournament rules, regulations, esports, gaming, Kenya, university, competition`,
    openGraph: {
      title: `${title} Tournament Rules & Regulations`,
      description: `Complete rules and regulations for the ${title} tournament.`,
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kve.co.ke'}/games/${slug}/rules`,
      images: tournamentData?.featuredImageUrl ? [{ url: tournamentData.featuredImageUrl, width: 1200, height: 630, alt: title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} Tournament Rules & Regulations`,
      description: `Complete rules and regulations for the ${title} tournament.`,
      images: tournamentData?.featuredImageUrl ? [tournamentData.featuredImageUrl] : undefined,
    },
  };
}

export default async function TournamentRulesPage({ params }: TournamentRulesPageProps) {
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

  const currentPath = `/games/${slug}/rules`;

  // Determine hero background image
  const getHeroImage = () => {
    if (tournamentData?.featuredImageUrl) {
      return tournamentData.featuredImageUrl;
    }
    return game?.image || '/images/Mask Group.png';
  };

  const gameName = tournamentData?.gameName || game?.name || 'Tournament';

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'TBD';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString || 'TBD';
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative w-full h-140 bg-black mt-0">
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
      <section className="relative bg-black h-25">
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
                    <div className="absolute -bottom-2 left-0 w-full h-0.75 bg-[#8e130e]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Neo-Brutalist Rules Content */}
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
                <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#8c110d] mt-2 block">
                  {tournamentData?.rulesTitle || 'RULES & REGULATIONS'}
                </span>
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

          {/* PDF Documents Section */}
          {tournamentData?.pdfUrls && tournamentData.pdfUrls.length > 0 ? (
            <div className="mb-20">
              <div className="mb-12 border-l-4 border-[#8c110d] bg-black overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-[#8c110d] to-transparent opacity-30" />
                <div className="px-8 py-6 border-b border-gray-800/50">
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-4">
                    <span className="text-[#8c110d] text-xl font-black">📜</span>
                    <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Official Rules Documents
                    </span>
                  </h2>
                  <p className="text-gray-400 mt-2 text-sm">{tournamentData.pdfUrls.length} document{tournamentData.pdfUrls.length > 1 ? 's' : ''} available</p>
                </div>
                
                <div className="px-8 py-8 bg-gradient-to-b from-black to-[#080808]">
                  <div className="space-y-8">
                    {tournamentData.pdfUrls.map((pdf, index) => (
                      <div 
                        key={index} 
                        className="group relative transform transition-all duration-300"
                        style={{ 
                          animationDelay: `${index * 150}ms`,
                          animation: 'fadeInUp 0.6s ease-out forwards',
                          opacity: 0
                        }}
                      >
                        <div className="absolute -inset-2 border border-[#8c110d]/20 transform rotate-[0.5deg] opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="relative bg-black border-2 border-gray-800 group-hover:border-[#8c110d] transition-all duration-300 overflow-hidden">
                          {/* Corner accents */}
                          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#8c110d]" />
                          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#8c110d]" />
                          
                          {/* PDF Header */}
                          <div className="p-8 border-b border-gray-800/50">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                              <div>
                                <div className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-2">
                                  Document {index + 1} of {tournamentData?.pdfUrls?.length || 0}
                                </div>
                                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">
                                  📄 {pdf.title}
                                </h3>
                              </div>
                              
                              <div className="flex gap-4">
                                <a
                                  href={pdf.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group/btn inline-flex items-center px-6 py-3 bg-[#8c110d] hover:bg-[#b91c17] text-white font-black text-sm uppercase tracking-wider transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#8c110d]/50"
                                >
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  Download
                                </a>
                                <a
                                  href={pdf.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group/btn inline-flex items-center px-6 py-3 bg-black border-2 border-[#8c110d] hover:bg-[#8c110d] text-white font-black text-sm uppercase tracking-wider transition-all duration-300"
                                >
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  View Online
                                </a>
                              </div>
                            </div>
                          </div>
                          
                          {/* PDF Preview */}
                          <div className="p-8">
                            <PDFViewer pdfUrl={pdf.url} title={pdf.title} />
                          </div>
                          
                          <div className="h-1 bg-gradient-to-r from-[#8c110d] via-transparent to-[#8c110d] opacity-30" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Rules Not Yet Available — matching Tournament Not Configured style */
            <div className="mb-20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/10 to-transparent animate-pulse" />
              <div className="relative border-l-8 border-yellow-500 bg-black/50 backdrop-blur-sm p-8 rounded-r-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center text-2xl animate-pulse">📜</div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-yellow-400">Rules Not Yet Available</h2>
                </div>
                <p className="text-yellow-300 text-lg mb-2">
                  Tournament rules and regulations have not been published yet. Please check back later or contact the tournament organizers.
                </p>
                <p className="text-yellow-300/60 text-sm">
                  Tournament: <span className="font-black text-yellow-400">{gameName}</span>
                </p>
              </div>
            </div>
          )}

          {/* Tournament Status Cards — Neo-Brutalist Design */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-8 relative">
              <span className="relative z-10">Tournament Details</span>
              <div className="absolute -bottom-2 left-0 w-32 h-1 bg-[#8c110d]" />
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Format Card */}
              <div className="relative group transform transition-all duration-300 hover:scale-105">
                <div className="absolute -inset-2 border border-[#8c110d]/30 transform rotate-1" />
                <div className="absolute -inset-4 border border-[#8c110d]/15 transform -rotate-1" />
                
                <div className="relative bg-black border-2 border-gray-800 group-hover:border-[#8c110d] transition-all duration-300 p-8">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#8c110d]" />
                  
                  <div className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-3">Format</div>
                  <div className="text-xl font-black text-white uppercase leading-tight mb-4">
                    {tournamentData?.format?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'TBD'}
                  </div>
                  {tournamentData?.category && (
                    <div className="text-gray-400 text-sm">
                      <span className="font-bold">Category:</span> {tournamentData.category}
                    </div>
                  )}
                  <div className="text-gray-400 text-sm mt-1">
                    <span className="font-bold">Status:</span> {tournamentData?.tournamentStatus?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'TBD'}
                  </div>
                  <div className="mt-4 h-1 bg-gradient-to-r from-[#8c110d] to-transparent opacity-30" />
                </div>
              </div>

              {/* Dates Card */}
              <div className="relative group transform transition-all duration-300 hover:scale-105">
                <div className="absolute -inset-2 border border-[#8c110d]/30 transform -rotate-1" />
                <div className="absolute -inset-4 border border-[#8c110d]/15 transform rotate-1" />
                
                <div className="relative bg-black border-2 border-gray-800 group-hover:border-[#8c110d] transition-all duration-300 p-8">
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#8c110d]" />
                  
                  <div className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-3">Important Dates</div>
                  <div className="space-y-3 text-sm">
                    {tournamentData?.registrationDeadline && (
                      <div>
                        <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Registration Deadline</div>
                        <div className="text-white font-black text-lg">{formatDate(tournamentData.registrationDeadline).split(',')[0]}</div>
                      </div>
                    )}
                    {tournamentData?.startDate && (
                      <div>
                        <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Tournament Start</div>
                        <div className="text-white font-black text-lg">{formatDate(tournamentData.startDate).split(',')[0]}</div>
                      </div>
                    )}
                    {!tournamentData?.registrationDeadline && !tournamentData?.startDate && (
                      <div className="text-white font-black text-xl">TBD</div>
                    )}
                  </div>
                  <div className="mt-4 h-1 bg-gradient-to-r from-transparent to-[#8c110d] opacity-30" />
                </div>
              </div>

              {/* Details Card */}
              <div className="relative group transform transition-all duration-300 hover:scale-105">
                <div className="absolute -inset-2 border border-[#8c110d]/30 transform rotate-1" />
                <div className="absolute -inset-4 border border-[#8c110d]/15 transform -rotate-1" />
                
                <div className="relative bg-black border-2 border-gray-800 group-hover:border-[#8c110d] transition-all duration-300 p-8">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#8c110d]" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#8c110d]" />
                  
                  <div className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-3">Details</div>
                  <div className="space-y-3 text-sm">
                    {tournamentData?.maxParticipants && (
                      <div>
                        <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Max Participants</div>
                        <div className="text-white font-black text-lg">{tournamentData.maxParticipants}</div>
                      </div>
                    )}
                    {tournamentData?.awards && tournamentData.awards.length > 0 && (
                      <div>
                        <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Award Positions</div>
                        <div className="text-white font-black text-lg">{tournamentData.awards.length}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Game</div>
                      <div className="text-white font-black text-lg">{gameName}</div>
                    </div>
                  </div>
                  <div className="mt-4 h-1 bg-gradient-to-r from-[#8c110d] via-transparent to-[#8c110d] opacity-30" />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section — Neo-Brutalist CTA */}
          <div className="relative mb-20">
            <div className="absolute inset-0 bg-gradient-to-r from-[#8c110d] to-transparent transform -skew-y-1" />
            <div className="relative bg-black border-4 border-[#8c110d] rounded-lg p-12 transform hover:scale-[1.02] transition-transform duration-300">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div>
                  <div className="text-[#8c110d] font-black text-sm uppercase tracking-wider mb-4">Need Clarification?</div>
                  <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-4">
                    Questions About Rules?
                  </h2>
                  <p className="text-gray-300 text-lg max-w-xl">
                    If you have questions about the tournament rules or need clarification on any regulations, contact us through our official channels.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="/contact"
                    className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#8c110d] to-[#b91c17] hover:from-[#b91c17] hover:to-[#8c110d] text-white font-black text-sm uppercase tracking-wider transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#8c110d]/50"
                  >
                    <span>Contact Support</span>
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                  <a 
                    href="/discord"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center px-8 py-4 bg-black border-2 border-[#8c110d] hover:bg-[#8c110d] text-white font-black text-sm uppercase tracking-wider transition-all duration-300"
                  >
                    <span>Join Discord</span>
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
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