import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { tournamentServiceSSR } from '@/lib/services/tournamentServiceSSR';
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
  
  const tournamentData = await tournamentServiceSSR.getTournamentBySlug(slug);

  if (!tournamentData) {
    return {
      title: 'Tournament Rules Not Found | KVE',
      description: 'The requested tournament rules could not be found.',
    };
  }

  const title = tournamentData.gameName || 'Tournament';

  return {
    title: `${title} Tournament Rules & Regulations | KVE`,
    description: `Complete rules and regulations for the ${title} tournament. Learn about game rules, conduct requirements, and tournament format.`,
    keywords: `${title}, tournament rules, regulations, esports, gaming, Kenya, university, competition`,
    openGraph: {
      title: `${title} Tournament Rules & Regulations`,
      description: `Complete rules and regulations for the ${title} tournament.`,
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kenyaesportsrankings.org'}/games/${slug}/rules`,
      images: tournamentData.featuredImageUrl ? [{ url: tournamentData.featuredImageUrl, width: 1200, height: 630, alt: title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} Tournament Rules & Regulations`,
      description: `Complete rules and regulations for the ${title} tournament.`,
      images: tournamentData.featuredImageUrl ? [tournamentData.featuredImageUrl] : undefined,
    },
  };
}

export default async function TournamentRulesPage({ params }: TournamentRulesPageProps) {
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
  
  const currentPath = `/games/${slug}/rules`;

  // Determine hero background image
  const getHeroImage = () => {
    if (tournamentData?.featuredImageUrl) {
      return tournamentData.featuredImageUrl;
    }
    return '/images/Mask Group.png';
  };

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

      {/* Tournament Rules Content */}
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
          <div className="text-white font-hind font-bold">
            <h1 className="text-3xl md:text-4xl uppercase mb-8 text-white">
              {tournamentData.rulesTitle || `${tournamentData.gameName} Tournament Rules & Regulations`}
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

            
            {/* PDF Documents with Book Animation */}
            {tournamentData.pdfUrls && tournamentData.pdfUrls.length > 0 ? (
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold uppercase mb-6">Official Rules Documents</h2>
                <div className="space-y-6">
                  {tournamentData.pdfUrls.map((pdf, index) => (
                    <div key={index} className="bg-[#1a1a1a] border border-[#8c110d] rounded-lg overflow-hidden">
                      <div className="p-6 border-b border-[#8c110d]">
                        <h3 className="text-xl font-bold text-[#8c110d] mb-2">
                          📄 {pdf.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">
                          Document {index + 1} of {tournamentData.pdfUrls?.length || 0}
                        </p>
                        <div className="flex gap-4">
                          <a
                            href={pdf.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-[#8c110d] hover:bg-[#b91c17] text-white rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download PDF
                          </a>
                          <a
                            href={pdf.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Online
                          </a>
                        </div>
                      </div>
                      
                      {/* PDF Preview with Book Animation */}
                      <div className="p-6">
                        <PDFViewer pdfUrl={pdf.url} title={pdf.title} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-8">
                <div className="p-8 bg-yellow-900/20 border border-yellow-500 rounded-lg">
                  <h2 className="text-xl font-bold text-yellow-400 mb-4">Rules Not Yet Available</h2>
                  <p className="text-yellow-300 mb-4">
                    Tournament rules and regulations have not been published yet. Please check back later or contact the tournament organizers.
                  </p>
                  <p className="text-yellow-300 text-sm">
                    Tournament: <code className="bg-yellow-900/30 px-2 py-1 rounded">{tournamentData.gameName}</code>
                  </p>
                </div>
              </div>
            )}

            {/* Tournament Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#8c110d]">
                <h3 className="text-lg font-semibold mb-4 text-[#8c110d]">Tournament Format</h3>
                <div className="space-y-2 text-sm">
                  {tournamentData.format && (
                    <p><span className="font-bold">Format:</span> {tournamentData.format.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                  )}
                  {tournamentData.category && (
                    <p><span className="font-bold">Category:</span> {tournamentData.category}</p>
                  )}
                  <p><span className="font-bold">Status:</span> {tournamentData.tournamentStatus?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'TBD'}</p>
                </div>
              </div>

              <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#8c110d]">
                <h3 className="text-lg font-semibold mb-4 text-[#8c110d]">Important Dates</h3>
                <div className="space-y-2 text-sm">
                  {tournamentData.registrationDeadline && (
                    <p><span className="font-bold">Registration Deadline:</span> {formatDate(tournamentData.registrationDeadline)}</p>
                  )}
                  {tournamentData.startDate && (
                    <p><span className="font-bold">Tournament Start:</span> {formatDate(tournamentData.startDate)}</p>
                  )}
                  {tournamentData.endDate && (
                    <p><span className="font-bold">Tournament End:</span> {formatDate(tournamentData.endDate)}</p>
                  )}
                </div>
              </div>

              <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#8c110d]">
                <h3 className="text-lg font-semibold mb-4 text-[#8c110d]">Tournament Details</h3>
                <div className="space-y-2 text-sm">
                  {tournamentData.maxParticipants && (
                    <p><span className="font-bold">Max Participants:</span> {tournamentData.maxParticipants}</p>
                  )}
                  {tournamentData.awards && tournamentData.awards.length > 0 && (
                    <p><span className="font-bold">Awards:</span> {tournamentData.awards.length} positions</p>
                  )}
                  <p><span className="font-bold">Game:</span> {tournamentData.gameName}</p>
                </div>
              </div>
            </div>

            {/* Contact Information for Rules Clarification */}
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#8c110d]">
              <h3 className="text-lg font-semibold mb-4 text-[#8c110d]">Need Clarification?</h3>
              <p className="text-white mb-4">
                If you have questions about the tournament rules or need clarification on any regulations, please contact the tournament organizers through our official channels.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="/contact" 
                  className="inline-flex items-center px-4 py-2 bg-[#8c110d] hover:bg-[#b91c17] text-white rounded-lg transition-colors"
                >
                  Contact Support
                </a>
                <a 
                  href="/discord" 
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Discord
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}