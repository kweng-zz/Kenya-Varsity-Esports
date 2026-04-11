import React from 'react';
import { notFound } from 'next/navigation';
import { getGameBySlug } from '@/lib/gamesData';
import { Navigation } from '@/components/Navigation';
import { FooterSection } from '@/components/Footer';
import { TournamentHeader } from '@/components/tournaments/TournamentHeader';
import { UniversitySelector } from '@/components/UniversitySelector';
import { universities, SUPPORT_EMAIL, SUPPORT_WHATSAPP } from '@/lib/universitiesData';

interface GameCommunityPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function GameCommunityPage({ params }: GameCommunityPageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  // If game doesn't exist, show 404
  if (!game) {
    notFound();
  }

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      <Navigation />
      {/* Hero Section with Integrated Command Center Navigation */}
      <TournamentHeader 
        slug={slug}
        gameName={game.name}
        subtitle="COMMUNITY"
        currentPath={`/games/${slug}/community`}
        featuredImageUrl={game.image}
      />

      {/* Tournament Community Section */}
      <section id="tournament-community" className="relative w-full bg-black py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-[#080808] to-black" />
        </div>

        {/* Content Container - Tournament Community */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8">
          <div className="text-white font-sans">
            <h2 className="text-2xl md:text-3xl font-bold uppercase mb-8 text-center">Join Your Tournament Community</h2>
            <p className="text-lg text-center mb-12 text-gray-300">
              Connect with fellow players from your university and stay updated on tournament news, schedules, and results.
            </p>
            
            {/* University Selector Container */}
            <div 
              className="relative bg-black/60 border border-gray-600 p-8 md:p-12 rounded-lg"
              style={{
                backgroundImage: 'url(/images/Mask Group.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundBlendMode: 'overlay'
              }}
            >
              <div className="relative z-10">
                <h3 className="text-xl md:text-2xl font-bold mb-6 text-center text-white">Select Your University</h3>
                
               
                
                <UniversitySelector 
                  universities={universities} 
                  supportContact={game.captainWhatsappLink || SUPPORT_WHATSAPP}
                  contactType={game.captainWhatsappLink ? 'whatsapp' : 'whatsapp'}
                />
              </div>
            </div>
            
            {/* Additional Information */}
            <div className="mt-12 text-center">
              <h3 className="text-xl font-bold mb-4 text-red-400">Why Join Your University Group?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-gray-900/50 p-6 border border-gray-700 rounded-lg">
                  <div className="text-3xl mb-3">📢</div>
                  <h4 className="font-bold text-lg mb-2 text-white">Tournament Updates</h4>
                  <p className="text-gray-300">Get real-time updates about matches, schedules, and results directly from organizers</p>
                </div>
                <div className="bg-gray-900/50 p-6 border border-gray-700 rounded-lg">
                  <div className="text-3xl mb-3">🤝</div>
                  <h4 className="font-bold text-lg mb-2 text-white">Team Formation</h4>
                  <p className="text-gray-300">Find teammates and form competitive teams with fellow students from your university</p>
                </div>
                <div className="bg-gray-900/50 p-6 border border-gray-700 rounded-lg">
                  <div className="text-3xl mb-3">🎮</div>
                  <h4 className="font-bold text-lg mb-2 text-white">Community Support</h4>
                  <p className="text-gray-300">Connect with your university&apos;s gaming community and get tips from experienced players</p>
                </div>
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="mt-12 bg-gray-900/30 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4 text-white">Community Guidelines</h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• Be respectful to all community members</li>
                <li>• Keep discussions relevant to gaming and tournaments</li>
                <li>• No spam or promotional content without permission</li>
                <li>• Help newcomers and share your gaming knowledge</li>
                <li>• Follow WhatsApp group rules set by administrators</li>
              </ul>
            </div>
            
          </div>
        </div>
      </section>
      
      <FooterSection />
    </div>
  );
}