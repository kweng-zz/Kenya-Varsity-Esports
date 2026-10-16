"use client";

import React, { useState, useEffect } from 'react';
import { Tournament } from '@/types/tournament';
import { TournamentHeader } from '@/components/tournaments/TournamentHeader';
import { GameRankingsSection } from '@/components/pages/tournaments/GameRankingsSection';

interface TournamentInformationContentProps {
  tournamentData?: Tournament | null;
  slug: string;
  currentPath?: string;
}

// Neo-Brutalist Expandable Section Component
const ExpandableSection: React.FC<{
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  icon?: string;
}> = ({ title, children, defaultExpanded = true, icon = '▶' }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="mb-12 border-l-4 border-[#8c110d] bg-black overflow-hidden transition-all duration-300 relative">
      {/* Brutalist accent line */}
      <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-[#8c110d] to-transparent opacity-30" />
      
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-[#8c110d]/5 transition-all duration-300 group border-b border-gray-800/50"
      >
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-4">
          <span className={`text-[#8c110d] transition-transform duration-300 inline-block text-xl font-black ${isExpanded ? 'rotate-90' : ''}`}>
            {icon}
          </span>
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {title}
          </span>
        </h2>
        <div className="px-4 py-2 border-2 border-gray-700 group-hover:border-[#8c110d] transition-colors duration-300">
          <span className="text-gray-400 group-hover:text-[#8c110d] font-black text-sm uppercase tracking-wider">
            {isExpanded ? 'COLLAPSE' : 'EXPAND'}
          </span>
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-8 py-8 bg-gradient-to-b from-black to-[#080808]">
          {children}
            </div>


          </div>
        </div>
  );
};

// Neo-Brutalist Status Badge Component
const StatusBadge: React.FC<{
  status: string;
  variant: 'live' | 'upcoming' | 'completed' | 'registration' | 'closed';
  pulse?: boolean;
}> = ({ status, variant, pulse = false }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'live':
        return 'bg-[#8c110d] text-white border-[#8c110d] shadow-lg shadow-[#8c110d]/50';
      case 'upcoming':
        return 'bg-black text-[#8c110d] border-[#8c110d]';
      case 'completed':
        return 'bg-black text-gray-400 border-gray-400';
      case 'registration':
        return 'bg-black text-green-400 border-green-400';
      case 'closed':
        return 'bg-black text-red-400 border-red-400';
      default:
        return 'bg-black text-gray-400 border-gray-400';
    }
  };

  return (
    <div className={`relative inline-flex items-center gap-3 px-6 py-3 border-2 font-black text-sm uppercase tracking-wider transition-all duration-300 ${getVariantStyles()}`}>
      <div className={`relative flex items-center gap-2`}>
        <div className={`w-3 h-3 rounded-full bg-current ${pulse ? 'animate-ping' : ''}`} />
      </div>
      <span className="relative z-10">{status}</span>
    </div>
  );
};

export const TournamentInformationContent: React.FC<TournamentInformationContentProps> = ({
  tournamentData,
  slug,
  currentPath
}) => {
  const [previewData, setPreviewData] = useState<Tournament | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Check for localStorage draft on mount
  useEffect(() => {
    if (tournamentData?.id) {
      const draftKey = `tournament-draft-${tournamentData.id}`;
      const savedDraft = localStorage.getItem(draftKey);
      
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          setPreviewData(parsed);
          console.log('📝 Found draft for tournament:', tournamentData.id);
        } catch (error) {
          console.warn('Failed to parse saved draft:', error);
          localStorage.removeItem(draftKey);
        }
      }
    }
  }, [tournamentData?.id]);

  // Use preview data if available and preview mode is on, otherwise use CMS data
  const displayData = (showPreview && previewData) ? previewData : tournamentData;
  const displayName = displayData?.gameName || slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  // Check if we have tournament data
  const hasTournamentData = !!displayData;

  const handleDiscardDraft = () => {
    if (tournamentData?.id) {
      const draftKey = `tournament-draft-${tournamentData.id}`;
      localStorage.removeItem(draftKey);
      setPreviewData(null);
      setShowPreview(false);
      console.log('🗑️ Discarded draft for tournament:', tournamentData.id);
    }
  };
  
  // Enhanced tournament status
  const getStatusDisplay = (status?: Tournament['tournamentStatus']) => {
    switch (status) {
      case 'upcoming':
        return { text: 'UPCOMING', variant: 'upcoming' as const, pulse: true };
      case 'registration_open':
        return { text: 'REGISTRATION OPEN', variant: 'registration' as const, pulse: true };
      case 'ongoing':
        return { text: 'LIVE NOW', variant: 'live' as const, pulse: true };
      case 'completed':
        return { text: 'COMPLETED', variant: 'completed' as const, pulse: false };
      case 'registration_closed':
        return { text: 'REGISTRATION CLOSED', variant: 'closed' as const, pulse: false };
      default:
        return { text: 'TBD', variant: 'upcoming' as const, pulse: false };
    }
  };

  const statusDisplay = getStatusDisplay(displayData?.tournamentStatus);

  // Format dates with robust fallback
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'TBD';
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return dateString; // Return original string if valid
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      console.warn('Error formatting date:', e);
      return dateString || 'TBD';
    }
  };

  return (
    <div className="bg-black min-h-screen">
      <TournamentHeader 
        slug={slug}
        gameName={displayName}
        subtitle="INFORMATION"
        currentPath={currentPath || `/games/${slug}/information`}
        featuredImageUrl={displayData?.featuredImageUrl}
        actions={previewData && (
          <>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`group relative px-6 py-3 font-black text-sm uppercase tracking-wider transition-all duration-300 ${
                showPreview 
                  ? 'bg-[#8c110d] text-white shadow-lg shadow-[#8c110d]/50 scale-105' 
                  : 'bg-gray-900 text-gray-300 border-2 border-gray-700 hover:border-[#8c110d] hover:text-[#8c110d]'
              }`}
            >
              <span className="relative z-10">
                {showPreview ? '👁️ VIEWING DRAFT' : '📝 PREVIEW DRAFT'}
              </span>
              {showPreview && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#8c110d] to-[#b91c17] opacity-75 animate-pulse" />
              )}
            </button>
            <button
              onClick={handleDiscardDraft}
              className="group px-4 py-3 bg-red-900 hover:bg-red-700 text-white font-black text-sm uppercase tracking-wider border-2 border-red-700 hover:border-red-500 transition-all duration-300 transform hover:scale-105"
              title="Discard draft"
            >
              🗑️ DISCARD
            </button>
          </>
        )}
      >
        <StatusBadge 
          status={statusDisplay.text} 
          variant={statusDisplay.variant}
          pulse={statusDisplay.pulse}
        />
      </TournamentHeader>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12">
        
        {/* Enhanced No Tournament Data Message */}
        {!hasTournamentData && (
          <div className="mb-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-transparent animate-pulse" />
            <div className="relative border-l-8 border-red-500 bg-black/50 backdrop-blur-sm p-8 rounded-r-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-2xl animate-pulse">⚠️</div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-red-400">Tournament Not Configured</h2>
              </div>
              <p className="text-red-300 text-lg">Details about this tournament will be updated soon.</p>
            </div>
          </div>
        )}

        {/* Tournament Status Cards - Neo-Brutalist Design */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Registration Status Card */}
            <div className="relative group transform transition-all duration-300 hover:scale-105">
              {/* Brutalist frame */}
              <div className="absolute -inset-2 border border-[#8c110d]/30 transform rotate-1" />
              <div className="absolute -inset-4 border border-[#8c110d]/15 transform -rotate-1" />
              
              <div className="relative bg-black border-2 border-gray-800 group-hover:border-[#8c110d] transition-all duration-300 p-8">
                {/* Corner accent */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#8c110d]" />
                
                <div className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-3">Registration</div>
                <div className="text-2xl font-black text-white uppercase leading-tight">
                  {(() => {
                    if (!displayData) return 'TBD';
                    const deadline = displayData.registrationDeadline ? formatDate(displayData.registrationDeadline) : null;
                    switch (displayData.tournamentStatus) {
                      case 'registration_open':
                        return deadline ? `OPEN UNTIL ${deadline.split(' ')[0]}` : 'OPEN';
                      case 'upcoming':
                        return deadline ? `OPENS ${deadline.split(' ')[0]}` : 'NOT OPEN';
                      case 'ongoing':
                      case 'completed':
                      case 'registration_closed':
                        return 'CLOSED';
                      default:
                        return 'TBD';
                    }
                  })()}
                </div>
                {/* Status indicator line */}
                <div className="mt-4 h-1 bg-gradient-to-r from-[#8c110d] to-transparent opacity-30" />
              </div>
            </div>

            {/* Tournament Status Card */}
            <div className="relative group transform transition-all duration-300 hover:scale-105">
              {/* Brutalist frame */}
              <div className="absolute -inset-2 border border-[#8c110d]/30 transform -rotate-1" />
              <div className="absolute -inset-4 border border-[#8c110d]/15 transform -rotate-1" />
              
              <div className="relative bg-black border-2 border-gray-800 group-hover:border-[#8c110d] transition-all duration-300 p-8">
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#8c110d]" />
                
                <div className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-3">Tournament</div>
                <div className="text-2xl font-black text-white uppercase leading-tight">{statusDisplay.text}</div>
                {/* Status indicator line */}
                <div className="mt-4 h-1 bg-gradient-to-r from-transparent to-[#8c110d] opacity-30" />
              </div>
            </div>
            {/* Dates Card */}
            <div className="relative group transform transition-all duration-300 hover:scale-105">
              {/* Brutalist frame */}
              <div className="absolute -inset-2 border border-[#8c110d]/30 transform -rotate-1" />
              <div className="absolute -inset-4 border border-[#8c110d]/15 transform -rotate-1" />
              
              <div className="relative bg-black border-2 border-gray-800 group-hover:border-[#8c110d] transition-all duration-300 p-8">
                {/* Corner accent */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#8c110d]" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#8c110d]" />
                
                <div className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-3">Dates</div>
                <div className="text-xl font-black text-white uppercase leading-tight">
                  {displayData?.startDate ? formatDate(displayData.startDate).split(',')[0] : 'TBD'}
                  {displayData?.endDate && ` - ${formatDate(displayData.endDate).split(',')[0]}`}
                </div>
                {/* Status indicator line */}
                <div className="mt-4 h-1 bg-gradient-to-r from-[#8c110d] via-transparent to-[#8c110d] opacity-30" />
              </div>
            </div>
          </div>
        </div>

        {/* Tournament Description with Enhanced Design */}
        <ExpandableSection title="Tournament Description" defaultExpanded={true} icon="📋">
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#8c110d] to-transparent" />
              <p className="text-lg md:text-xl leading-relaxed text-gray-300 pl-6">
                {displayData?.description || 'Tournament description will be available soon.'}
              </p>
            </div>
            
            {displayData?.format && (
              <div className="bg-gradient-to-r from-[#8c110d]/10 to-transparent border-l-4 border-[#8c110d] p-4 rounded-r-lg">
                <div className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Format</div>
                <div className="text-white font-black text-lg uppercase">{displayData.format.replace(/-/g, ' ')}</div>
              </div>
            )}
          </div>
        </ExpandableSection>

        {/* Detailed Tournament Information */}
        {displayData?.detailedDescription && (
          <ExpandableSection title="Detailed Information" defaultExpanded={false} icon="ℹ️">
            <div className="bg-gradient-to-br from-gray-900/50 to-black border border-gray-800 rounded-lg p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 w-16 h-16 bg-[#8c110d]/10 rounded-full blur-xl" />
              <p className="text-lg md:text-xl leading-relaxed text-gray-300 relative z-10">
                {displayData.detailedDescription}
              </p>
            </div>
          </ExpandableSection>
        )}

        {/* Tournament Rules & Information - Enhanced Card Design */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-[#8c110d]/20 to-transparent border-l-4 border-[#8c110d] p-8 rounded-r-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#8c110d]/10 rounded-full -mr-16 -mt-16" />
            
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-2">
                  Tournament Rules & Information
                </h2>
                <p className="text-gray-400">Official regulations and guidelines</p>
              </div>
              
              <a 
                href={`/games/${slug}/rules`}
                className="group inline-flex items-center px-8 py-4 bg-[#8c110d] hover:bg-[#b91c17] text-white font-black text-sm uppercase tracking-wider transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#8c110d]/50"
              >
                <span>View Complete Rules</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Placement Points System - Enhanced Design */}
        <div className="mb-16">
          <div className="bg-gradient-to-l from-[#8c110d]/20 to-transparent border-r-4 border-[#8c110d] p-8 rounded-l-lg relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#8c110d]/10 rounded-full -ml-12 -mb-12" />
            
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-4">
                Placement Points System
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                When you participate and get the following positions, the points go to your university ranking. 
                The University with the most points becomes the ultimate winner of the season.
              </p>
              
              <a 
                href={`/games/${slug}/placement-points`}
                className="group inline-flex items-center px-8 py-4 bg-black border-2 border-[#8c110d] hover:bg-[#8c110d] text-white font-black text-sm uppercase tracking-wider transition-all duration-300"
              >
                <span>View Complete System</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Game Rankings — top performers with link to /rankings */}
        <GameRankingsSection slug={slug} gameName={displayData?.gameName} />

        {/* Tournament Rules - Enhanced List Design */}
        {displayData?.rules && displayData.rules.length > 0 && (
          <ExpandableSection title="Tournament Rules" defaultExpanded={false} icon="📜">
            <div className="space-y-4">
              {displayData.rules.map((rule, idx) => (
                <div 
                  key={idx} 
                  className="group relative bg-gradient-to-r from-gray-900/50 to-black border-l-4 border-[#8c110d] p-6 rounded-r-lg hover:border-[#b91c17] transition-colors duration-300"
                >
                  <div className="absolute -left-2 top-6 w-8 h-8 bg-[#8c110d] rounded-full flex items-center justify-center text-black font-black text-sm group-hover:scale-110 transition-transform duration-300">
                    {idx + 1}
                  </div>
                  <div className="ml-8 text-gray-300 text-lg leading-relaxed">{rule}</div>
                </div>
              ))}
            </div>
          </ExpandableSection>
        )}

        {/* Tournament Requirements - Enhanced Design */}
        {displayData?.requirements && displayData.requirements.length > 0 && (
          <ExpandableSection title="Requirements" defaultExpanded={true} icon="⚡">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayData.requirements.map((requirement, idx) => (
                <div 
                  key={idx} 
                  className="group relative bg-black border border-gray-800 hover:border-[#8c110d] transition-all duration-300 p-6 rounded-lg hover:shadow-lg hover:shadow-[#8c110d]/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#8c110d]/20 rounded-full flex items-center justify-center text-[#8c110d] font-black text-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="text-gray-300 leading-relaxed">{requirement}</div>
                  </div>
                </div>
              ))}
            </div>
          </ExpandableSection>
        )}

        {/* Awards - Stunning Prize Cards */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-8 relative">
            <span className="relative z-10">Awards</span>
            <div className="absolute -bottom-2 left-0 w-32 h-1 bg-[#8c110d]" />
          </h2>
          
          {displayData?.awards && displayData.awards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displayData.awards.map((award, index) => (
                <div 
                  key={award.id} 
                  className="group relative transform hover:scale-105 transition-all duration-500"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards',
                    opacity: 0
                  }}
                >
                  {/* Glowing background effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#8c110d] to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur" />
                  
                  <div className="relative bg-black border-2 border-gray-800 group-hover:border-[#8c110d] transition-all duration-500 rounded-none p-8 text-center">
                    {/* Award icon/image */}
                    {award.imageUrl ? (
                      <div className="w-20 h-20 mx-auto mb-6 relative">
                        <div className="absolute inset-0 bg-[#8c110d]/20 rounded-full blur-xl animate-pulse" />
                        <img 
                          src={award.imageUrl} 
                          alt={award.title}
                          className="relative w-full h-full object-contain z-10"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                        <div className="text-5xl">
                          {award.position === 1 ? '🥇' : award.position === 2 ? '🥈' : award.position === 3 ? '🥉' : '🏆'}
                        </div>
                      </div>
                    )}
                    
                    {/* Position Badge */}
                    <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#8c110d] to-[#b91c17] rounded-none mb-4">
                      <span className="text-white font-black text-sm uppercase tracking-wider">
                        {award.position === 1 ? '1ST PLACE' : award.position === 2 ? '2ND PLACE' : award.position === 3 ? '3RD PLACE' : `${award.position}TH PLACE`}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-black uppercase tracking-tight text-white mb-3">
                      {award.title}
                    </h3>
                    
                    {award.description && (
                      <p className="text-gray-400 mb-4 text-sm">{award.description}</p>
                    )}
                    
                    {award.prize && (
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#8c110d]/20 to-transparent rounded-none blur-xl" />
                        <div className="relative bg-black border border-[#8c110d] rounded-none p-4">
                          <div className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Prize Pool</div>
                          <div className="text-2xl font-black text-white">
                            {award.currency || displayData.currency || 'KSH'} {award.prize.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-block px-6 py-3 bg-gray-900 border border-gray-800 rounded-lg">
                <p className="text-gray-400 text-lg">Awards will be announced soon.</p>
              </div>
            </div>
          )}
        </div>

        {/* Registration - CTA Section */}
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

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};