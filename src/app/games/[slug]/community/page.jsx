import React from 'react';
import { notFound } from 'next/navigation';
import { getGameBySlug } from '@/lib/gamesData';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { FooterSection } from '@/components/Footer';
import { UniversitySelector } from '@/components/UniversitySelector';
import { universities, SUPPORT_WHATSAPP } from '@/lib/universitiesData';
import { tournamentNavItems } from '@/lib/tournamentNavigation';
export default async function GameCommunityPage({ params }) {
    const { slug } = await params;
    const game = getGameBySlug(slug);
    // If game doesn't exist, show 404
    if (!game) {
        notFound();
    }
    // Function to check if a nav item is active - for community page, check if current path matches
    const isActiveRoute = (href) => {
        return href.includes('/community');
    };
    return (<div className="relative w-full min-h-screen bg-black overflow-hidden">
      <Navigation />
      {/* Hero Section */}
      <section className="relative w-full h-[560px] bg-black mt-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${game.image})` }}></div>

        <div className="absolute inset-0 bg-[#0F0F13] opacity-0"></div>

        <div className="absolute inset-0" style={{
            background: 'linear-gradient(182.1deg, #0F0F13 22.17%, rgba(12, 14, 17, 0) 74.51%)',
        }}></div>

        <div className="absolute inset-0" style={{
            background: 'linear-gradient(0deg, rgba(15, 15, 19, 0.9) 22.17%, rgba(12, 14, 17, 0) 74.51%)',
        }}></div>

        <div className="absolute inset-0 overflow-hidden">
          <img className="absolute top-105 left-19 w-2/4 h-2/4 object-contain -translate-x-1/2 -translate-y-1/2" alt="Background Left" src="/images/Mask Group.png"/>
          
          <img className="absolute top-105 right-19 w-2/4 h-2/4 object-contain translate-x-1/2 -translate-y-1/2 scale-x-[-1]" alt="Background Right" src="/images/Mask Group.png"/>
        </div>
      </section>

      {/* Tournament Navigation Section */}
      <section className="relative bg-black h-[100px]">
        {/* Background image */}
        <img className="absolute w-full h-full object-cover opacity-20" alt="Background" src="https://c.animaapp.com/md6ebassseX7AK/img/group-44.png"/>

        {/* White line at bottom */}
        <div className="absolute bottom-1 left-0 w-full h-[0.5px] bg-white/50 z-5"></div>

        {/* Navigation content */}
        <div className="relative z-10 h-full">
          {/* Centered navigation items */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex space-x-12">
            {tournamentNavItems.map((item, index) => {
            const itemHref = item.href.replace('[slug]', game.slug);
            return (<div key={`tournament-nav-${index}`} className="relative">
                  <Link href={itemHref} className={`text-xl font-bold font-hind tracking-wide transition-colors ${isActiveRoute(item.href)
                    ? 'text-[#8c110d]'
                    : 'text-[#8c110d] hover:text-[#b91c17]'}`}>
                    {item.name}
                  </Link>
                  {isActiveRoute(item.href) && (<div className="absolute -bottom-1 left-0 w-full h-[3px] bg-[#8e130e]"/>)}
                </div>);
        })}
          </div>
        </div>
      </section>

      {/* Tournament Community Section */}
      <section id="tournament-community" className="relative w-full bg-black py-16">
        <div className="absolute inset-0 overflow-hidden">
          {/* Left background image */}
          <img className="absolute top-105 left-20 w-2/4 h-2/4 object-contain -translate-x-1/2 -translate-y-1/2" alt="Background Left" src="/images/Mask Group.png"/>
          
          {/* Right background image - inverted */}
          <img className="absolute top-105 right-20 w-2/4 h-2/4 object-contain translate-x-1/2 -translate-y-1/2 scale-x-[-1]" alt="Background Right" src="/images/Mask Group.png"/>
        </div>

        {/* Content Container - Tournament Community */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8">
          <div className="text-white font-sans">
            <h2 className="text-2xl md:text-3xl font-bold uppercase mb-8 text-center">Join Your Tournament Community</h2>
            <p className="text-lg text-center mb-12 text-gray-300">
              Connect with fellow players from your university and stay updated on tournament news, schedules, and results.
            </p>
            
            {/* University Selector Container */}
            <div className="relative bg-black/60 border border-gray-600 p-8 md:p-12 rounded-lg" style={{
            backgroundImage: 'url(/images/Mask Group.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay'
        }}>
              <div className="relative z-10">
                <h3 className="text-xl md:text-2xl font-bold mb-6 text-center text-white">Select Your University</h3>
                
               
                
                <UniversitySelector universities={universities} supportContact={game.captainWhatsappLink || SUPPORT_WHATSAPP} contactType={game.captainWhatsappLink ? 'whatsapp' : 'whatsapp'}/>
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
    </div>);
}
