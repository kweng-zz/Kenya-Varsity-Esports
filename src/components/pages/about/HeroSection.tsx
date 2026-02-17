'use client';

import React, { useState } from 'react';
import Image from 'next/image';

type TabType = 'mission' | 'vision' | 'values';

interface BaseTabContent {
  title: string;
}

interface TextTabContent extends BaseTabContent {
  description: string;
}

interface ValuesTabContent extends BaseTabContent {
  description: null;
  items: { label: string; detail: string }[];
}

type TabContent = TextTabContent | ValuesTabContent;

export const HeroSection = () => {
  const [activeTab, setActiveTab] = useState<TabType>('mission');

  const tabContent: Record<TabType, TabContent> = {
    mission: {
      title: 'MISSION',
      description:
        'To build and maintain Kenya\'s most reliable, inclusive, and competitive esports structures in higher institutions through tournaments, rankings, partnerships, and educational programs.',
    },
    vision: {
      title: 'VISION',
      description:
        'A Kenya where every higher institution has a thriving esports community that creates opportunities for competition, careers, and personal development.',
    },
    values: {
      title: 'OUR VALUES',
      description: null,
      items: [
        { label: 'Passion for Esports', detail: 'We live and breathe competitive gaming' },
        { label: 'Fair Play & Integrity', detail: 'Honesty and sportsmanship above all' },
        { label: 'Community First', detail: 'Building bridges through gaming culture' },
        { label: 'Growth & Education', detail: 'Developing talent on and off screen' },
      ],
    },
  };

  const currentContent = tabContent[activeTab];

  return (
    <section className="relative w-full bg-[#080808] overflow-hidden">
      {/* Neo-brutalist background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#080808] via-black to-[#080808]" />
        
        {/* Accent line elements */}
        <div className="absolute top-20 left-10 w-2 h-32 bg-[#8c110d] opacity-80 transform rotate-12" />
        <div className="absolute top-24 left-20 w-32 h-2 bg-[#8c110d] opacity-60 transform -rotate-12" />
        <div className="absolute bottom-20 right-16 w-2 h-24 bg-[#8c110d] opacity-70 transform -rotate-6" />
        <div className="absolute bottom-28 right-8 w-24 h-2 bg-[#8c110d] opacity-50 transform rotate-12" />
        
        {/* Glow corners */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#8c110d] opacity-10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#8c110d] opacity-[0.08] blur-3xl" />
        
        {/* Background mask images */}
        <img
          className="absolute top-1/2 left-20 w-2/4 h-2/4 object-contain -translate-x-1/2 -translate-y-1/2 sm:opacity-10 opacity-5"
          alt=""
          src="/images/Mask Group.png"
        />
        <img
          className="absolute top-1/2 right-20 w-2/4 h-2/4 object-contain translate-x-1/2 -translate-y-1/2 scale-x-[-1] sm:opacity-10 opacity-5"
          alt=""
          src="/images/Mask Group.png"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        {/* Main Hero Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
          {/* Left Content */}
          <div className="relative">
            <div className="mb-6">
              <span className="text-[#8c110d] font-black text-sm tracking-[0.3em] uppercase">ABOUT KVE</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none mb-8">
              <span className="block">We are building</span>
              <span className="block">the future of</span>
              <span className="block text-[#8c110d]">Esports in Kenya</span>
            </h1>

            <div className="space-y-6">
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#8c110d] to-transparent" />
                <p className="text-lg leading-relaxed text-gray-300 pl-6">
                  We are committed to developing a thriving esports ecosystem for 
                  universities, colleges, and TVETs across Kenya. Our mission is to 
                  provide students with consistent tournaments, opportunities, and 
                  esports education while supporting their academic growth.
                </p>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Our team works closely with higher institutions esports teams/clubs to strengthen competitive gaming, 
                empower talent, and expand esports culture across all Kenya&apos;s higher institutions.
              </p>
            </div>
          </div>

          {/* Right Image — Brutalist Frame */}
          <div className="relative group">
            <div className="absolute -inset-3 border border-[#8c110d]/30 transform rotate-2" />
            <div className="absolute -inset-6 border border-[#8c110d]/15 transform -rotate-2" />
            
            <div className="relative h-80 sm:h-96 lg:h-[500px] overflow-hidden border-2 border-gray-800 group-hover:border-[#8c110d] transition-all duration-500">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#8c110d] z-10" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#8c110d] z-10" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#8c110d] z-10" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#8c110d] z-10" />
              
              <Image
                src="/images/Winners.jpg"
                alt="Esports team competing"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Image caption bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-4 border-t border-[#8c110d]/30">
                <div className="text-[#8c110d] text-xs font-black uppercase tracking-[0.3em]">Kenya Varsity Esports</div>
                <div className="text-white font-bold text-sm mt-1">Building Champions Across Kenya</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section — Neo-Brutalist */}
        <div className="relative">
          {/* Section header */}
          <div className="mb-10 border-l-4 border-[#8c110d] pl-6">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Our Foundation
              </span>
            </h2>
            <p className="text-gray-400 mt-2 text-sm">Mission, vision, and the values that drive us</p>
          </div>

          {/* Tab Navigation — Brutalist Style */}
          <div className="flex gap-2 mb-10">
            {(['mission', 'vision', 'values'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 font-black text-sm uppercase tracking-wider transition-all duration-300 border-2 ${
                  activeTab === tab
                    ? 'bg-[#8c110d] border-[#8c110d] text-white shadow-lg shadow-[#8c110d]/30'
                    : 'bg-black border-gray-700 text-gray-400 hover:border-[#8c110d] hover:text-white'
                }`}
              >
                {tab === 'mission' && 'Mission'}
                {tab === 'vision' && 'Vision'}
                {tab === 'values' && 'Our Values'}
              </button>
            ))}
          </div>

          {/* Tab Content — Brutalist Frame */}
          <div className="relative">
            <div className="absolute -inset-2 border border-[#8c110d]/20 transform rotate-[0.5deg]" />
            
            <div className="relative bg-black border-2 border-gray-800 overflow-hidden">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#8c110d]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#8c110d]" />
              
              {activeTab === 'values' ? (
                <div className="p-8 md:p-12">
                  <div className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-8">What We Stand For</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {(currentContent as ValuesTabContent).items?.map((item, index) => (
                      <div 
                        key={index} 
                        className="group relative transform transition-all duration-300 hover:scale-105"
                      >
                        <div className="relative bg-black border-2 border-gray-800 group-hover:border-[#8c110d] transition-all duration-300 p-6">
                          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#8c110d] opacity-0 group-hover:opacity-100 transition-opacity" />
                          
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-8 h-8 bg-[#8c110d]/20 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-[#8c110d]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tight">{item.label}</h3>
                          </div>
                          <p className="text-gray-400 text-sm pl-12">{item.detail}</p>
                          
                          <div className="mt-4 h-0.5 bg-gradient-to-r from-[#8c110d] to-transparent opacity-30" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 md:p-12">
                  <div className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-4">{currentContent.title}</div>
                  <div className="relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#8c110d] to-transparent" />
                    <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-4xl pl-6 font-medium">
                      {(currentContent as TextTabContent).description}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="h-1 bg-gradient-to-r from-[#8c110d] via-transparent to-[#8c110d] opacity-30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
