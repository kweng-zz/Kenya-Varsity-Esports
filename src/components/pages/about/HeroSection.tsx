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
  items: string[];
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
        'Passion for Esports',
        'Fair Play & Integrity',
        'Community First',
        'Growth & Education',
      ],
    },
  };

  const currentContent = tabContent[activeTab];

  return (
    <section className="relative w-full bg-black py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              We are building the future of Higher Institutions Esports in Kenya
            </h1>

            <div className="space-y-4 text-gray-300 text-base sm:text-lg">
              <p>
                We are committed to developing a thriving esports ecosystem for 
                universities colleges and TVETs across Kenya. Our mission is to 
                provide students with consistent tournaments, opportunities and 
                esports education while supporting their academic growth.
              </p>
              <p>
                Our team works closely with higher institutions esports teams/clubs to strengthen competitive gaming, 
                empower talent, and expand esports culture across all Kenya's higher institutions.
              </p>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-80 sm:h-96 lg:h-full lg:min-h-125">
            <div className="relative w-full h-full rounded-lg overflow-hidden border border-red-900/30">
              <Image
                src="/images/Winners.jpg"
                alt="Esports team competing"
                fill
                className="object-cover"
                priority
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="space-y-8">
          {/* Tab Navigation */}
          <div className="flex gap-4 border-b border-gray-800">
            {(['mission', 'vision', 'values'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold text-lg transition-all duration-300 ${
                  activeTab === tab
                    ? 'text-white bg-red-600 rounded-t-lg'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab === 'mission' && 'Mission'}
                {tab === 'vision' && 'Vision'}
                {tab === 'values' && 'Our Values'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {activeTab === 'values' ? (
              // Values display - all items shown
              <>
                {(currentContent as ValuesTabContent).items?.map((item: string, index: number) => (
                  <div key={index} className="space-y-3">
                    <h3 className="text-xl font-bold text-white uppercase">
                      {item}
                    </h3>
                    <div className="flex items-start gap-3">
                      <svg
                        className="w-6 h-6 text-red-600 shrink-0 mt-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              // Mission/Vision display
              <div className="lg:col-span-3 space-y-4">
                <h3 className="text-2xl font-bold text-white uppercase">
                  {currentContent.title}
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
                  {currentContent.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
