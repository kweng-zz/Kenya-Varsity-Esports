'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { FooterSection } from '@/components/Footer';

const ParticipationGuidePage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <Navigation />
      
      {/* Hero Section — Neo-Brutalist */}
      <section className="relative w-full bg-[#080808] overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#080808] via-black to-[#080808]" />
          <div className="absolute top-20 left-10 w-2 h-32 bg-[#8c110d] opacity-80 transform rotate-12" />
          <div className="absolute top-24 left-20 w-32 h-2 bg-[#8c110d] opacity-60 transform -rotate-12" />
          <div className="absolute bottom-10 right-16 w-2 h-24 bg-[#8c110d] opacity-70 transform -rotate-6" />
          <div className="absolute bottom-16 right-8 w-24 h-2 bg-[#8c110d] opacity-50 transform rotate-12" />
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#8c110d] opacity-10 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#8c110d] opacity-[0.08] blur-3xl" />
          <img className="absolute top-1/2 left-20 w-2/4 h-2/4 object-contain -translate-x-1/2 -translate-y-1/2 sm:opacity-10 opacity-5" alt="" src="/images/Mask Group.png" />
          <img className="absolute top-1/2 right-20 w-2/4 h-2/4 object-contain translate-x-1/2 -translate-y-1/2 scale-x-[-1] sm:opacity-10 opacity-5" alt="" src="/images/Mask Group.png" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-20 lg:py-32">
          {/* Back Link */}
          <div className="mb-12">
            <button 
              onClick={() => router.push('/about')}
              className="group inline-flex items-center px-6 py-3 bg-black border-2 border-gray-700 hover:border-[#8c110d] text-gray-300 hover:text-white font-black text-sm uppercase tracking-wider transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to About
            </button>
          </div>

          {/* Brutalist Header */}
          <div className="relative">
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-black opacity-20 rotate-12" />
            <div className="mb-4">
              <span className="text-[#8c110d] font-black text-sm tracking-[0.3em] uppercase">OFFICIAL GUIDE</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none mb-4">
              <span className="block">Kenya Varsity</span>
              <span className="block">Esports</span>
              <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#8c110d] mt-2 block">MEMBERSHIP & PARTICIPATION GUIDE</span>
            </h1>
          </div>

          {/* Intro card */}
          <div className="mt-12 relative max-w-4xl">
            <div className="absolute -inset-2 border border-[#8c110d]/20 transform rotate-[0.5deg]" />
            <div className="relative bg-black border-2 border-gray-800 p-8">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#8c110d]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#8c110d]" />
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#8c110d] to-transparent" />
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed pl-6">
                  Building a strong, sustainable, and professional esports ecosystem across higher learning institutions in Kenya.
                  This guide outlines the requirements for Universities, Colleges, and TVETs to actively participate in the KVE ecosystem.
                </p>
              </div>
              <div className="mt-6 h-1 bg-gradient-to-r from-[#8c110d] via-transparent to-[#8c110d] opacity-30" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative bg-[#080808]">
        {/* Background accents */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#8c110d] opacity-[0.04] blur-3xl" />
          <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-[#8c110d] opacity-[0.06] blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-24 space-y-20">

          {/* ====== 1. OFFICIAL ESPORTS TEAMS ====== */}
          <section>
            <div className="mb-8 border-l-4 border-[#8c110d] bg-black overflow-hidden relative">
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-[#8c110d] to-transparent opacity-30" />
              <div className="px-8 py-6 border-b border-gray-800/50">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-4">
                  <span className="text-[#8c110d] text-xl font-black">👥</span>
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    1. Formation of Official Esports Teams
                  </span>
                </h2>
                <p className="text-gray-400 mt-2 text-sm">Leadership Structure</p>
              </div>

              <div className="px-8 py-8 bg-gradient-to-b from-black to-[#080808]">
                <p className="text-gray-300 mb-8 text-lg">
                  Each participating higher institution must establish an officially recognized esports team with the following mandatory leadership structure:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { role: 'Team Captain', desc: 'Leads the team and main point of contact.', icon: '🎖️' },
                    { role: 'Vice-Captain', desc: 'Assists the captain and deputizes in their absence.', icon: '⚡' },
                    { role: 'Treasurer', desc: 'Manages team finances and fundraising.', icon: '💰' },
                    { role: 'Team Patron', desc: 'Lecturer in Charge or Sports Director providing institutional oversight.', icon: '🏫' }
                  ].map((item, i) => (
                    <div key={i} className="group relative transform transition-all duration-300 hover:scale-105">
                      <div className="relative bg-black border-2 border-gray-800 group-hover:border-[#8c110d] transition-all duration-300 p-6">
                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#8c110d] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-start gap-4">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <h4 className="font-black text-white uppercase tracking-tight text-lg">{item.role}</h4>
                            <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
                          </div>
                        </div>
                        <div className="mt-4 h-0.5 bg-gradient-to-r from-[#8c110d] to-transparent opacity-30" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Note */}
                <div className="mt-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/10 to-transparent" />
                  <div className="relative border-l-4 border-yellow-500 bg-black/50 p-6">
                    <p className="text-sm text-yellow-200">
                      <strong className="text-yellow-400 font-black uppercase tracking-wider text-xs">Note:</strong>{' '}
                      All office bearers must sign and formally agree to their roles to ensure accountability and effective communication between students, KVE, and institutional administration.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ====== 2. MINIMUM MEMBERSHIP ====== */}
          <section>
            <div className="mb-8 border-l-4 border-[#8c110d] bg-black overflow-hidden relative">
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-[#8c110d] to-transparent opacity-30" />
              <div className="px-8 py-6 border-b border-gray-800/50">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-4">
                  <span className="text-[#8c110d] text-xl font-black">🎮</span>
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    2. Minimum Membership Requirement
                  </span>
                </h2>
                <p className="text-gray-400 mt-2 text-sm">Team Composition</p>
              </div>

              <div className="px-8 py-8 bg-gradient-to-b from-black to-[#080808]">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Membership Size */}
                  <div className="group relative transform transition-all duration-300 hover:scale-[1.02]">
                    <div className="absolute -inset-2 border border-[#8c110d]/20 transform rotate-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative bg-black border-2 border-gray-800 group-hover:border-[#8c110d] transition-all duration-300 p-8">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#8c110d]" />
                      <div className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-3">Membership Size</div>
                      <p className="text-gray-300 mb-4">
                        Each institution&apos;s esports team must consist of a <strong className="text-white font-black">minimum of 20 active members</strong>.
                      </p>
                      <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#8c110d]/20 to-transparent border-l-4 border-[#8c110d]">
                        <span className="text-[#8c110d] font-black text-3xl">20+</span>
                        <span className="text-[#8c110d]/70 font-bold text-sm ml-2 uppercase tracking-wider">members</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-4 italic">
                        *Institutions may optionally introduce an internal membership fee for their club members.
                      </p>
                      <div className="mt-4 h-0.5 bg-gradient-to-r from-[#8c110d] to-transparent opacity-30" />
                    </div>
                  </div>

                  {/* Competitive Titles */}
                  <div className="group relative transform transition-all duration-300 hover:scale-[1.02]">
                    <div className="absolute -inset-2 border border-[#8c110d]/20 transform -rotate-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative bg-black border-2 border-gray-800 group-hover:border-[#8c110d] transition-all duration-300 p-8">
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#8c110d]" />
                      <div className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-3">Competitive Titles</div>
                      <p className="text-gray-300 mb-4">Teams must represent major competitive titles:</p>
                      <div className="space-y-2">
                        {['PUBG Mobile', 'Call of Duty Mobile', 'eFootball Mobile', 'EA FC', 'Tekken / Mortal Kombat'].map((title, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-[#8c110d] flex-shrink-0" />
                            <span className="text-gray-200 font-bold text-sm">{title}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-4">
                        Each title may appoint a Sub-Captain to assist in coordination and performance monitoring.
                      </p>
                      <div className="mt-4 h-0.5 bg-gradient-to-r from-transparent to-[#8c110d] opacity-30" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ====== 3. INTERNAL EVENTS ====== */}
          <section>
            <div className="mb-8 border-l-4 border-[#8c110d] bg-black overflow-hidden relative">
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-[#8c110d] to-transparent opacity-30" />
              <div className="px-8 py-6 border-b border-gray-800/50">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-4">
                  <span className="text-[#8c110d] text-xl font-black">🏟️</span>
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    3. Internal Esports Event Requirement
                  </span>
                </h2>
                <p className="text-gray-400 mt-2 text-sm">Promoting Campus Culture</p>
              </div>

              <div className="px-8 py-8 bg-gradient-to-b from-black to-[#080808]">
                <div className="relative mb-8">
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#8c110d] to-transparent" />
                  <p className="text-xl text-white font-bold pl-6">
                    Each institution <span className="text-[#8c110d]">must host at least one internal esports event annually</span>, organized primarily by students.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="group relative transform transition-all duration-300 hover:scale-105">
                    <div className="relative bg-black border-2 border-gray-800 group-hover:border-green-500/50 transition-all duration-300 p-6">
                      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-green-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-3">Suggested Implementation</div>
                      <ul className="space-y-3 text-sm text-gray-300">
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-500 flex-shrink-0 mt-1.5" />
                          <span>Integrate esports events into inter-school or inter-faculty activities.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-500 flex-shrink-0 mt-1.5" />
                          <span>Host an internal tournament in any preferred competitive title.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-500 flex-shrink-0 mt-1.5" />
                          <span>Introduce ticketing where proceeds support esports development.</span>
                        </li>
                      </ul>
                      <div className="mt-4 h-0.5 bg-gradient-to-r from-green-500 to-transparent opacity-30" />
                    </div>
                  </div>

                  <div className="group relative transform transition-all duration-300 hover:scale-105">
                    <div className="relative bg-black border-2 border-gray-800 group-hover:border-blue-500/50 transition-all duration-300 p-6 flex flex-col justify-center">
                      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-3">KVE Support</div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Invite Kenya Varsity Esports to attend, support, document, or promote the event.
                      </p>
                      <div className="mt-4 h-0.5 bg-gradient-to-r from-transparent to-blue-500 opacity-30" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ====== 4. FEES & COSTS ====== */}
          <section>
            <div className="mb-8 border-l-4 border-[#8c110d] bg-black overflow-hidden relative">
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-[#8c110d] to-transparent opacity-30" />
              <div className="px-8 py-6 border-b border-gray-800/50">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-4">
                  <span className="text-[#8c110d] text-xl font-black">💰</span>
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    4. Participation Fees & Operational Costs
                  </span>
                </h2>
                <p className="text-gray-400 mt-2 text-sm">Financial Model</p>
              </div>

              <div className="px-8 py-8 bg-gradient-to-b from-black to-[#080808]">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    {/* Fee highlight card */}
                    <div className="relative group transform transition-all duration-300 hover:scale-105">
                      <div className="absolute -inset-2 border border-[#8c110d]/30 transform rotate-1" />
                      <div className="relative bg-[#8c110d] p-8">
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white/30" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white/30" />
                        <div className="text-white/70 text-xs font-black uppercase tracking-[0.3em] mb-2">Participation Fee</div>
                        <div className="text-5xl font-black text-white mb-2">KES 5,000</div>
                        <p className="text-white/80 text-sm">Per registered squad/team per competition</p>
                      </div>
                    </div>

                    {/* Fee allocation */}
                    <div className="bg-black border-2 border-gray-800 p-6">
                      <div className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-6">Fee Allocation</div>
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-green-400 font-black uppercase tracking-wider text-xs">Prize Pool</span>
                            <span className="text-white font-black">50%</span>
                          </div>
                          <div className="w-full bg-gray-800 h-3">
                            <div className="bg-gradient-to-r from-green-500 to-green-400 h-3 w-1/2" />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-blue-400 font-black uppercase tracking-wider text-xs">Operational Costs</span>
                            <span className="text-white font-black">50%</span>
                          </div>
                          <div className="w-full bg-gray-800 h-3">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 w-1/2" />
                          </div>
                          <p className="text-xs text-gray-500 mt-2">Administration, production, logistics, officiating, broadcasting, staffing, and ecosystem development.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Future subscription */}
                  <div className="group relative transform transition-all duration-300 hover:scale-[1.02]">
                    <div className="absolute -inset-2 border border-indigo-500/20 transform -rotate-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative bg-black border-2 border-gray-800 group-hover:border-indigo-500/50 transition-all duration-300 p-8 h-full">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-indigo-500/50" />
                      <div className="text-indigo-400 text-xs font-black uppercase tracking-[0.3em] mb-4">Coming Soon</div>
                      <h4 className="text-xl font-black text-white uppercase tracking-tight mb-4">Future Subscription Model</h4>
                      <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                        Kenya Varsity Esports plans to transition to an annual subscription model designed to promote affordability, sustainability, and broader participation.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-indigo-500 flex-shrink-0 mt-1.5" />
                          <span className="text-gray-300 text-sm">Members pay a yearly subscription fee.</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-indigo-500 flex-shrink-0 mt-1.5" />
                          <span className="text-gray-300 text-sm">Register multiple teams without per-squad fees.</span>
                        </div>
                      </div>
                      <p className="text-xs text-indigo-400/50 mt-6 italic">
                        Further details will be communicated prior to implementation.
                      </p>
                      <div className="mt-6 h-0.5 bg-gradient-to-r from-indigo-500 to-transparent opacity-30" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ====== 5. TRANSPORTATION ====== */}
          <section>
            <div className="mb-8 border-l-4 border-[#8c110d] bg-black overflow-hidden relative">
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-[#8c110d] to-transparent opacity-30" />
              <div className="px-8 py-6 border-b border-gray-800/50">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-4">
                  <span className="text-[#8c110d] text-xl font-black">🚌</span>
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    5. Transportation & Accommodation
                  </span>
                </h2>
                <p className="text-gray-400 mt-2 text-sm">Logistics</p>
              </div>

              <div className="px-8 py-8 bg-gradient-to-b from-black to-[#080808]">
                <p className="text-gray-300 mb-8 text-lg">
                  All transportation, accommodation, and related logistical arrangements for teams participating in physical or hybrid events shall be the responsibility of the institutional esports club.
                </p>

                <div className="group relative transform transition-all duration-300 hover:scale-[1.02]">
                  <div className="relative bg-black border-2 border-gray-800 group-hover:border-[#8c110d] transition-all duration-300 p-8">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#8c110d]" />
                    <div className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-4">Clubs are required to</div>
                    <div className="space-y-4">
                      {[
                        'Liaise with their Sports Director, Lecturer in Charge, or Team Patron.',
                        'Coordinate approvals, travel plans, and accommodation where necessary.',
                        'Ensure player welfare and institutional compliance during events.'
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-[#8c110d]/20 rounded-full flex items-center justify-center flex-shrink-0 text-[#8c110d] font-black text-xs">
                            {idx + 1}
                          </div>
                          <span className="text-gray-300 pt-1">{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 h-0.5 bg-gradient-to-r from-[#8c110d] to-transparent opacity-30" />
                  </div>
                </div>

                <p className="text-gray-500 mt-6 text-sm">
                  Kenya Varsity Esports will communicate event venues and schedules in advance to allow institutions adequate planning time.
                </p>
              </div>
            </div>
          </section>

          {/* ====== 6. STUDENT OPPORTUNITIES ====== */}
          <section>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#8c110d] to-transparent transform -skew-y-1" />
              <div className="relative bg-black border-4 border-[#8c110d] p-12 transform hover:scale-[1.01] transition-transform duration-300">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                  <div>
                    <div className="text-[#8c110d] font-black text-sm uppercase tracking-wider mb-4">6. Career Development</div>
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-4">
                      Opportunities After Graduation
                    </h2>
                    <p className="text-gray-300 text-lg max-w-xl leading-relaxed">
                      Students who demonstrate <strong className="text-white font-black">leadership, commitment, and strong organizational skills</strong> through team management and internal event execution may be considered for part-time or developmental roles within the KVE and Tunza Esports ecosystem after graduation.
                    </p>
                  </div>
                  <button
                    onClick={() => router.push('/tournament-registration')}
                    className="group flex-shrink-0 inline-flex items-center px-10 py-5 bg-gradient-to-r from-[#8c110d] to-[#b91c17] hover:from-[#b91c17] hover:to-[#8c110d] text-white font-black text-sm uppercase tracking-wider transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#8c110d]/50"
                  >
                    <span>Register Your Team</span>
                    <svg className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ====== 7. PURPOSE ====== */}
          <section>
            <div className="mb-8 border-l-4 border-[#8c110d] bg-black overflow-hidden relative">
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-[#8c110d] to-transparent opacity-30" />
              <div className="px-8 py-6 border-b border-gray-800/50">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-4">
                  <span className="text-[#8c110d] text-xl font-black">🎯</span>
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    7. Purpose of These Requirements
                  </span>
                </h2>
                <p className="text-gray-400 mt-2 text-sm">Strategic Goals</p>
              </div>

              <div className="px-8 py-8 bg-gradient-to-b from-black to-[#080808]">
                <p className="text-gray-300 mb-8">These requirements are designed to:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Encourage institutional ownership of esports development",
                    "Establish structured esports teams comparable to traditional sports clubs",
                    "Promote wide participation across multiple competitive titles",
                    "Strengthen leadership, governance, and event management capacity",
                    "Build a sustainable pipeline of future esports leaders and professionals"
                  ].map((goal, idx) => (
                    <div key={idx} className="group relative transform transition-all duration-300 hover:scale-105">
                      <div className="relative bg-black border-2 border-gray-800 group-hover:border-[#8c110d] transition-all duration-300 p-5 flex items-start gap-4">
                        <div className="w-6 h-6 bg-[#8c110d]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-[#8c110d]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-300 text-sm font-medium">{goal}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ====== CONCLUSION ====== */}
          <section className="relative">
            <div className="h-px bg-gradient-to-r from-transparent via-[#8c110d]/50 to-transparent mb-16" />

            <div className="relative max-w-3xl mx-auto text-center">
              <div className="absolute -inset-4 border border-[#8c110d]/15 transform rotate-1" />
              <div className="relative bg-black border-2 border-gray-800 p-12">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#8c110d]" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#8c110d]" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#8c110d]" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#8c110d]" />

                <div className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-4">Final Words</div>
                <h3 className="text-3xl font-black uppercase tracking-tight text-white mb-6">Conclusion</h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Kenya Varsity Esports values collaboration with Universities, Colleges, TVETs, Sports Directors, and student leaders nationwide. By implementing these requirements, varsity esports in Kenya will become more organized, competitive, and impactful.
                </p>
                <p className="text-white font-bold mb-6">
                  We look forward to working with your institution as you establish or strengthen your esports team.
                </p>
                <p className="text-[#8c110d] font-black uppercase tracking-wider text-sm">
                  For any questions or support, please feel free to reach out to us.
                </p>
                <div className="mt-8 h-1 bg-gradient-to-r from-[#8c110d] via-transparent to-[#8c110d] opacity-30" />
              </div>
            </div>
          </section>

        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default ParticipationGuidePage;
