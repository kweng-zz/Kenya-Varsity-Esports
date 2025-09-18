"use client";

import React, { useState, useEffect } from 'react';
import { Tournament } from '@/types/tournament';

interface TournamentInformationContentProps {
  tournamentData?: Tournament | null;
  slug: string;
}

export const TournamentInformationContent: React.FC<TournamentInformationContentProps> = ({
  tournamentData,
  slug
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
  
  // Format tournament status
  const getStatusDisplay = (status?: Tournament['tournamentStatus']) => {
    switch (status) {
      case 'upcoming':
        return { text: 'Upcoming', color: 'text-blue-400' };
      case 'registration_open':
        return { text: 'Registration Open', color: 'text-green-400' };
      case 'ongoing':
        return { text: 'Ongoing', color: 'text-yellow-400' };
      case 'completed':
        return { text: 'Completed', color: 'text-gray-400' };
      case 'registration_closed':
        return { text: 'Registration Closed', color: 'text-red-400' };
      default:
        return { text: 'TBD', color: 'text-gray-400' };
    }
  };

  const statusDisplay = getStatusDisplay(displayData?.tournamentStatus);

  // Format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl uppercase text-white">
              {displayName} Tournament Information
            </h1>
            
            {/* Draft Preview Controls */}
            {previewData && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    showPreview 
                      ? 'bg-orange-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {showPreview ? '👁️ Viewing Draft' : '📝 Preview Draft'}
                </button>
                <button
                  onClick={handleDiscardDraft}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                  title="Discard draft"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>
          
          {/* Show message if no tournament data is configured */}
          {!hasTournamentData && (
            <div className="mb-8 p-6 bg-red-900/20 border border-red-500 rounded-lg">
              <h2 className="text-xl font-bold text-red-400 mb-4">Tournament Not Configured</h2>
              <p className="text-red-300">Details about this tournament will be updated soon.</p>
            </div>
          )}

          {/* Tournament Status - CMS Driven */}
          <h2 className="text-2xl md:text-3xl font-bold uppercase mb-6">Tournament Status</h2>
          <div className="mb-8 text-base md:text-lg">
            <p className="mb-2">
              <span className="font-bold">Registration:</span>
              <span
                className={`ml-2 ${displayData?.tournamentStatus === 'registration_open' ? 'text-green-400' : displayData?.tournamentStatus === 'upcoming' ? 'text-blue-400' : 'text-gray-400'}`}
              >
                {(() => {
                  if (!displayData) return 'TBD';
                  const deadline = displayData.registrationDeadline ? formatDate(displayData.registrationDeadline) : null;
                  switch (displayData.tournamentStatus) {
                    case 'registration_open':
                      return deadline ? `Open • closes ${deadline}` : 'Open';
                    case 'upcoming':
                      return deadline ? `Opens until ${deadline}` : 'Not open yet';
                    case 'ongoing':
                    case 'completed':
                    case 'registration_closed':
                      return 'Closed';
                    default:
                      return 'TBD';
                  }
                })()}
              </span>
            </p>
            <p className="mb-2">
              <span className="font-bold">Tournaments:</span>
              <span className={`ml-2 ${statusDisplay.color}`}>{statusDisplay.text}</span>
            </p>
            {(displayData?.startDate || displayData?.endDate) && (
              <p className="mb-6">
                <span className="font-bold">Dates:</span>
                <span className="ml-2">
                  {displayData?.startDate ? formatDate(displayData.startDate) : 'TBD'}
                  {displayData?.endDate ? ` - ${formatDate(displayData.endDate)}` : ''}
                </span>
              </p>
            )}
          </div>

          {/* Tournament Description - CMS Driven */}
          <h2 className="text-2xl md:text-3xl font-bold uppercase mb-6">Tournament Description</h2>
          <div className="mb-8 text-base md:text-lg leading-relaxed">
            <p className="mb-4">
              {displayData?.description || 'Tournament description will be available soon.'}
            </p>
            {displayData?.format && (
              <p className="mb-6">
                Format: <span className="font-semibold capitalize">{displayData.format.replace(/-/g, ' ')}</span>
              </p>
            )}
          </div>

          {/* Detailed Tournament Information - CMS Driven */}
          {displayData?.detailedDescription && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold uppercase mb-6">Detailed Information</h2>
              <div className="mb-8 text-base md:text-lg leading-relaxed">
                <p className="mb-4">
                  {displayData.detailedDescription}
                </p>
              </div>
            </>
          )}

          {/* Tournament Rules & Information - EXACT SAME FORMAT FOR ALL GAMES */}
          <h2 className="text-2xl md:text-3xl font-bold uppercase mb-6">Tournament Rules & Information</h2>
          <div className="mb-8">
            <div className="p-6 bg-[#1a1a1a] border border-[#8c110d] rounded-lg">
              <p className="text-white text-lg mb-4 font-bold">
                📋 Read Here
              </p>
              <a 
                href={`/games/${slug}/rules`}
                className="inline-flex items-center px-6 py-3 bg-[#8c110d] hover:bg-[#b91c17] text-white font-bold rounded-lg transition-colors"
              >
                View Complete Rules & Regulations
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          {/* Official KUER Placement Points System - EXACT SAME FORMAT FOR ALL GAMES */}
          <h2 className="text-2xl md:text-3xl font-bold uppercase mb-6"> Placement Points </h2>
          <div className="mb-8 text-base md:text-lg leading-relaxed">
            <p className="mb-4">
              When you participate and get the following positions, the points go to your university ranking. 
              The University with the most points becomes the ultimate winner of the season.
            </p>
            <div className="p-6 bg-[#1a1a1a] border border-[#8c110d] rounded-lg">
              <p className="text-white text-lg mb-4 font-bold">
                📋 Read Here
              </p>
              <a 
                href={`/games/${slug}/placement-points`}
                className="inline-flex items-center px-6 py-3 bg-[#8c110d] hover:bg-[#b91c17] text-white font-bold rounded-lg transition-colors"
              >
                View Complete Placement Points System
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          {/* Tournament Rules - CMS Driven */}
          {displayData?.rules && displayData.rules.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold uppercase mb-6">Tournament Rules</h2>
              <div className="bg-[#1a1a1a] border border-[#8c110d] rounded-lg p-6">
                <ul className="space-y-3 text-base md:text-lg">
                  {displayData.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-[#8c110d] font-bold mr-3 mt-1">{idx + 1}.</span>
                      <span className="text-gray-300">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tournament Requirements - CMS Driven */}
          {displayData?.requirements && displayData.requirements.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold uppercase mb-6">Requirements</h2>
              <div className="bg-[#1a1a1a] border border-[#8c110d] rounded-lg p-6">
                <ul className="space-y-3 text-base md:text-lg">
                  {displayData.requirements.map((requirement, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-[#8c110d] mr-3 mt-1">•</span>
                      <span className="text-gray-300">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Awards - CMS Driven */}
          <h2 className="text-2xl md:text-3xl font-bold uppercase mb-6">Awards</h2>
          <div className="mb-8">
            {displayData?.awards && displayData.awards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {displayData.awards.map((award) => (
                  <div key={award.id} className="bg-[#1a1a1a] border border-[#8c110d] rounded-lg p-6 text-center">
                    {award.imageUrl && (
                      <img 
                        src={award.imageUrl} 
                        alt={award.title}
                        className="w-16 h-16 mx-auto mb-4 object-contain"
                      />
                    )}
                    <h3 className="text-lg font-bold mb-2 text-[#8c110d]">
                      {award.position === 1 ? '🥇' : award.position === 2 ? '🥈' : award.position === 3 ? '🥉' : `#${award.position}`} {award.title}
                    </h3>
                    {award.description && (
                      <p className="text-gray-400 text-sm mb-2">{award.description}</p>
                    )}
                    {award.prize && (
                      <p className="text-white font-bold text-lg">
                        {award.currency || displayData.currency || 'KSH'} {award.prize.toLocaleString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mb-6 text-base md:text-lg">Awards will be announced soon.</p>
            )}

                      </div>

          {/* Registration - CMS Driven */}
          <h2 className="text-2xl md:text-3xl font-bold uppercase mb-6">Registration</h2>
          <div className="mb-8 text-base md:text-lg leading-relaxed">
            <div className="p-6 bg-[#1a1a1a] border border-[#8c110d] rounded-lg">
              <p className="text-white text-lg mb-4 font-bold">
                Register here
              </p>
              <a 
                href="/profile/tournament-registration"
                className="inline-flex items-center px-6 py-3 bg-[#8c110d] hover:bg-[#b91c17] text-white font-bold rounded-lg transition-colors"
              >
                Register for Tournament
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};