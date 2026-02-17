'use client';

import React from 'react';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Get your officials for your esports team/club',
    description:
      'Captain, Vice Captain, Treasurer and Lecturer/Teacher in charge',
    icon: '👥',
  },
  {
    number: 2,
    title: 'Have atleast 20 members',
    description:
      "Members should be at least 3 or more gaming titles team i.e efootball squad, CODM team, PUBG team, eafc team. This helps in understanding which titles to put based on the popularity among our member institutions.",
    icon: '🎮',
  },
  {
    number: 3,
    title: 'Complete the KVE Participation Agreement',
    description:
      'Covers student eligibility, fair play rules, branding use, and tournament protocols.',
    icon: '📋',
  },
  {
    number: 4,
    title: 'Do your own internal tournaments',
    description:
      'In order to grow ensure longevity in esports in your university you need to be active by hosting your own tournaments atleast once a year.',
    icon: '🏆',
  },
];

const featuredUniversitiesData = [
  { name: 'University of Nairobi', shortName: 'UoN' },
  { name: 'Kenyatta University', shortName: 'KU' },
  { name: 'Technical University of Kenya', shortName: 'TUK' },
  { name: 'Jomo Kenyatta University of Agriculture and Technology', shortName: 'JKUAT' },
  { name: 'Masinde Muliro University of Science and Technology', shortName: 'MMUST' },
  { name: 'Strathmore University', shortName: 'SU' },
  { name: 'Daystar University', shortName: 'DU' },
  { name: 'Multimedia University of Kenya', shortName: 'MMU' },
];

export const UniversityJoinSection = () => {
  return (
    <section className="relative w-full bg-[#080808] overflow-hidden">
      {/* Neo-brutalist background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#080808] to-black" />
        
        {/* Accent elements */}
        <div className="absolute top-40 right-10 w-2 h-32 bg-[#8c110d] opacity-70 transform rotate-12" />
        <div className="absolute top-48 right-20 w-32 h-2 bg-[#8c110d] opacity-50 transform -rotate-6" />
        <div className="absolute bottom-60 left-12 w-2 h-28 bg-[#8c110d] opacity-60 transform -rotate-12" />
        <div className="absolute bottom-52 left-6 w-28 h-2 bg-[#8c110d] opacity-40 transform rotate-6" />
        
        {/* Subtle glow */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#8c110d] opacity-[0.06] blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-[#8c110d] opacity-[0.08] blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        {/* ========== JOINING PROCESS ========== */}
        <div className="mb-32 lg:mb-40">
          {/* Section Header */}
          <div className="mb-16 relative">
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-black opacity-20 rotate-12" />
            
            <div className="relative">
              <div className="mb-4">
                <span className="text-[#8c110d] font-black text-sm tracking-[0.3em] uppercase">JOINING PROCESS</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none">
                <span className="block">How Institutions</span>
                <span className="block text-[#8c110d]">Join KVE</span>
              </h2>
              <p className="text-gray-400 text-lg lg:text-xl max-w-3xl leading-relaxed mt-6">
                Your university can officially participate in Kenya Varsity Esports by 
                completing a simple 4-step verification process.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Steps Grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {steps.map((step, index) => (
                  <div 
                    key={index}
                    className="group relative transform transition-all duration-300 hover:scale-105"
                  >
                    {/* Offset border */}
                    <div className="absolute -inset-2 border border-[#8c110d]/20 transform rotate-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative bg-black border-2 border-gray-800 group-hover:border-[#8c110d] transition-all duration-300 p-8">
                      {/* Corner accents */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#8c110d]" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#8c110d] opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Step number badge */}
                      <div className="absolute -top-4 -left-4 w-10 h-10 bg-[#8c110d] flex items-center justify-center font-black text-white text-lg shadow-lg shadow-[#8c110d]/30">
                        {step.number}
                      </div>
                      
                      <div className="pt-2">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-2xl">{step.icon}</span>
                          <div className="text-gray-400 text-xs font-black uppercase tracking-[0.3em]">Step {step.number}</div>
                        </div>
                        
                        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3 leading-tight">
                          {step.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                      
                      <div className="mt-6 h-0.5 bg-gradient-to-r from-[#8c110d] to-transparent opacity-30" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Card */}
            <div className="lg:col-span-1">
              <div className="relative group transform transition-all duration-300 hover:scale-[1.02] h-full">
                <div className="absolute -inset-3 border border-[#8c110d]/30 transform -rotate-1" />
                <div className="absolute -inset-6 border border-[#8c110d]/15 transform rotate-1" />
                
                <div className="relative bg-black border-2 border-gray-800 group-hover:border-[#8c110d] transition-all duration-300 p-8 h-full flex flex-col justify-center items-center text-center">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#8c110d]" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#8c110d]" />
                  
                  <div className="mb-8">
                    <div className="w-16 h-16 bg-[#8c110d] flex items-center justify-center mx-auto shadow-lg shadow-[#8c110d]/30">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-4">Complete Guide</div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
                    View the Full Guide
                  </h3>
                  <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                    Get the full guide with detailed onboarding steps, branding guidelines, 
                    and semester timelines.
                  </p>

                  <button
                    onClick={() => window.location.href = '/participation-guide'}
                    className="group/btn w-full inline-flex items-center justify-center px-8 py-5 bg-gradient-to-r from-[#8c110d] to-[#b91c17] hover:from-[#b91c17] hover:to-[#8c110d] text-white font-black text-sm uppercase tracking-wider transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#8c110d]/50"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Full Guide
                  </button>

                  <p className="text-gray-500 text-xs mt-6 font-bold uppercase tracking-wider">
                    Web Page • Updated Jan 2026
                  </p>
                  
                  <div className="mt-6 h-1 bg-gradient-to-r from-[#8c110d] via-transparent to-[#8c110d] opacity-30 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== FEATURED UNIVERSITIES ========== */}
        <div className="relative">
          {/* Section divider */}
          <div className="mb-16 h-px bg-gradient-to-r from-transparent via-[#8c110d]/50 to-transparent" />
          
          {/* Section Header */}
          <div className="mb-16 relative">
            <div className="mb-4">
              <span className="text-[#8c110d] font-black text-sm tracking-[0.3em] uppercase">ACTIVE COMMUNITY</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none">
              <span className="block">Institutions</span>
              <span className="block">Already in <span className="text-[#8c110d]">KVE</span></span>
            </h2>
            <p className="text-gray-400 text-lg lg:text-xl max-w-3xl leading-relaxed mt-6">
              These institutions have completed the onboarding process and are active members 
              of the KVE ecosystem, participating in tournaments and rankings.
            </p>
          </div>

          {/* Universities Header */}
          <div className="mb-8 border-l-4 border-[#8c110d] pl-6">
            <h3 className="text-2xl font-black uppercase tracking-tight text-white">
              Featured Members
            </h3>
            <span className="text-[#8c110d] font-bold text-sm">
              {featuredUniversitiesData.length} Institutions
            </span>
          </div>

          {/* Universities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredUniversitiesData.map((uni, index) => (
              <div
                key={index}
                className="group relative transform transition-all duration-300 hover:scale-105"
              >
                {/* Offset border on hover */}
                <div className="absolute -inset-1 border border-[#8c110d]/20 transform rotate-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative bg-black border-2 border-gray-800 group-hover:border-[#8c110d] transition-all duration-300 p-6">
                  {/* Corner accent */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#8c110d] opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-center gap-4">
                    {/* Status indicator */}
                    <div className="w-3 h-3 bg-[#8c110d] flex-shrink-0 group-hover:shadow-lg group-hover:shadow-[#8c110d]/50 transition-shadow" />
                    
                    <div className="min-w-0">
                      <div className="text-white font-black text-lg uppercase tracking-tight group-hover:text-[#8c110d] transition-colors">
                        {uni.shortName}
                      </div>
                      <p className="text-gray-500 text-xs truncate mt-0.5">
                        {uni.name}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 h-0.5 bg-gradient-to-r from-[#8c110d] to-transparent opacity-0 group-hover:opacity-50 transition-opacity" />
                </div>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#8c110d] to-transparent transform -skew-y-1" />
            <div className="relative bg-black border-4 border-[#8c110d] p-10 text-center transform hover:scale-[1.01] transition-transform duration-300">
              <div className="text-[#8c110d] font-black text-sm uppercase tracking-wider mb-3">Join the Movement</div>
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-4">
                Want Your Institution Listed?
              </h3>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Get your esports team registered and start competing with the best universities across Kenya.
              </p>
              <a 
                href="/contact"
                className="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-[#8c110d] to-[#b91c17] hover:from-[#b91c17] hover:to-[#8c110d] text-white font-black text-sm uppercase tracking-wider transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#8c110d]/50"
              >
                <span>Get Started</span>
                <svg className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
