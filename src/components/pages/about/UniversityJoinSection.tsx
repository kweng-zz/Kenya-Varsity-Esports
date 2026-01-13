'use client';

import React from 'react';

interface Step {
  number: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Appoint a University Esports Coordinator',
    description:
      'A staff member, club leader, official representative who will handle all KUER communications.',
  },
  {
    number: 2,
    title: 'Verify Your Esports Club / Team',
    description:
      'Provide a short confirmation letter from the Dean of Students, Games Office, or an equivalent authority.',
  },
  {
    number: 3,
    title: 'Complete the KUER Participation Agreement',
    description:
      'Covers student eligibility, fair play rules, branding use, and tournament protocols.',
  },
  {
    number: 4,
    title: 'Create a KUER University Profile',
    description:
      'Add team names, primary game titles, club socials, and semester player rosters.',
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
  const handleDownload = () => {
    window.open('/kuer-participation-guide.pdf', '_blank');
  };

  return (
    <section className="relative w-full bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/5 via-transparent to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="mb-32 lg:mb-40">
          <div className="mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="text-red-800 font-semibold tracking-wider text-sm uppercase">
                JOINING PROCESS
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              How Universities Join{' '}
              <span className="text-red-800">KVE</span>
            </h2>
            <p className="text-gray-400 text-lg lg:text-xl max-w-3xl leading-relaxed">
              Your university can officially participate in Kenya Varsity Esports by 
              completing a simple 4-step verification process. This ensures fairness, accurate 
              rankings, and proper representation of your institution.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {steps.map((step, index) => (
                  <div 
                    key={index}
                    className="group relative bg-gray-900/40 rounded-xl p-6 border border-gray-800 hover:border-red-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/5"
                  >
                    <div className="absolute -top-3 -left-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-800 to-red-900 text-white font-bold flex items-center justify-center text-sm shadow-lg shadow-red-900/30">
                        {step.number}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 pr-6">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 text-base leading-relaxed">
                      {step.description}
                    </p>

                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg 
                        className="w-5 h-5 text-red-600" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M14 5l7 7m0 0l-7 7m7-7H3" 
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="relative bg-gray-900/30 rounded-2xl p-8 h-full border border-gray-800">
                <div className="flex flex-col h-full justify-center items-center text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-800 to-red-900 flex items-center justify-center shadow-lg shadow-red-900/30">
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
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4">
                    Download the Complete Guide
                  </h3>

                  <p className="text-gray-400 text-base mb-8 leading-relaxed">
                    Get the full PDF with detailed onboarding steps, branding guidelines, 
                    and semester timelines.
                  </p>

                  <button
                    onClick={handleDownload}
                    className="w-full bg-gradient-to-r from-red-800 to-red-900 text-white font-bold py-4 px-8 rounded-xl text-center transition-all duration-300 hover:shadow-lg hover:shadow-red-900/30 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className="flex items-center justify-center gap-3">
                      <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
                        />
                      </svg>
                      Download Guide
                    </span>
                  </button>

                  <p className="text-gray-500 text-sm mt-6">
                    PDF • 2.4 MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-20 lg:pt-32">
          <div className="mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="text-red-800 font-semibold tracking-wider text-sm uppercase">
                ACTIVE COMMUNITY
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Universities Already in{' '}
              <span className="text-red-800">KVE</span>
            </h2>
            <p className="text-gray-400 text-lg lg:text-xl max-w-3xl leading-relaxed">
              These institutions have completed the onboarding process and are active members 
              of the KVE ecosystem, participating in tournaments and rankings.
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-8">
                Featured Members{' '}
                <span className="text-red-500 font-normal text-lg">
                  ({featuredUniversitiesData.length} Universities)
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredUniversitiesData.map((uni, index) => (
                  <div
                    key={index}
                    className="group relative bg-gradient-to-br from-gray-900/60 to-gray-900/30 rounded-lg p-5 border border-gray-700 hover:border-red-500/70 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <span className="text-gray-100 font-semibold group-hover:text-red-400 transition-colors break-words">
                          {uni.shortName}
                        </span>
                        <p className="text-gray-500 text-xs mt-1 line-clamp-1">
                          {uni.name}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
