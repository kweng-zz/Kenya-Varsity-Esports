'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { FooterSection } from "@/components/Footer";

const ParticipationGuidePage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans">
      {/* Hero Section */}
      <section className="relative w-full py-20 bg-gradient-to-b from-red-900/10 to-transparent">
        {/* Back Button */}
        <button 
          onClick={() => router.push('/about')}
          className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group z-10"
        >
          <svg 
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="hidden sm:inline">Back to About</span>
        </button>

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-['Hind',_Helvetica]">
            KENYA VARSITY ESPORTS
            <span className="block text-[#961c18] mt-2">MEMBERSHIP & PARTICIPATION GUIDE</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Building a strong, sustainable, and professional esports ecosystem across higher learning institutions in Kenya.
            This guide outlines the requirements for Universities, Colleges, and TVETs to actively participate in the KVE ecosystem.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 pb-24 space-y-16">
        
        {/* 1. Official Esports Teams */}
        <section className="space-y-8">
          <div className="border-l-4 border-[#961c18] pl-6">
            <h2 className="text-3xl font-bold text-white mb-2">1. Formation of Official Esports Teams</h2>
            <p className="text-[#961c18] font-semibold tracking-wider uppercase">Leadership Structure</p>
          </div>
          
          <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800">
            <p className="text-gray-300 mb-6 text-lg">
              Each participating higher institution (University, College, or TVET) must establish an officially recognized esports team with the following mandatory leadership structure:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { role: 'Team Captain', desc: 'Leads the team and main point of contact.' },
                { role: 'Vice-Captain', desc: 'Assists the captain and deputizes in their absence.' },
                { role: 'Treasurer', desc: 'Manages team finances and fundraising.' },
                { role: 'Team Patron', desc: 'Lecturer in Charge or Sports Director providing institutional oversight.' }
              ].map((item, i) => (
                <div key={i} className="bg-black/40 p-4 rounded-lg border border-gray-700 flex items-start gap-4">
                  <div className="bg-[#961c18]/20 p-2 rounded-full text-[#961c18]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{item.role}</h4>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 bg-[#961c18]/10 border border-[#961c18]/30 p-4 rounded-lg">
              <p className="text-sm text-gray-300">
                <strong className="text-white">Note:</strong> All office bearers must sign and formally agree to their roles to ensure accountability and effective communication between students, KVE, and institutional administration.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Minimum Membership */}
        <section className="space-y-8">
          <div className="border-l-4 border-[#961c18] pl-6">
            <h2 className="text-3xl font-bold text-white mb-2">2. Minimum Membership Requirement</h2>
            <p className="text-[#961c18] font-semibold tracking-wider uppercase">Team Composition</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4">Membership Size</h3>
              <p className="text-gray-300 mb-4">
                Each institution's esports team must consist of a <strong className="text-white">minimum of 20 active members</strong>.
              </p>
              <p className="text-sm text-gray-400 italic">
                *(Institutions may optionally introduce an internal membership fee for their club members.)
              </p>
            </div>

            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4">Competitive Titles</h3>
              <p className="text-gray-300 mb-4">Teams must represent major competitive titles including:</p>
              <ul className="space-y-2 text-gray-300 columns-2">
                <li className="flex items-center gap-2"><span className="text-[#961c18]">•</span> PUBG Mobile</li>
                <li className="flex items-center gap-2"><span className="text-[#961c18]">•</span> Call of Duty Mobile</li>
                <li className="flex items-center gap-2"><span className="text-[#961c18]">•</span> eFootball Mobile</li>
                <li className="flex items-center gap-2"><span className="text-[#961c18]">•</span> EA FC</li>
                <li className="flex items-center gap-2"><span className="text-[#961c18]">•</span> Tekken / Mortal Kombat</li>
              </ul>
              <p className="text-sm text-gray-400 mt-4">
                Each title may appoint a Sub-Captain to assist the Esports Captain in coordination, communication, and performance monitoring.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Internal Events */}
        <section className="space-y-8">
           <div className="border-l-4 border-[#961c18] pl-6">
            <h2 className="text-3xl font-bold text-white mb-2">3. Internal Institutional Esports Event Requirement</h2>
            <p className="text-[#961c18] font-semibold tracking-wider uppercase">Promoting Campus Culture</p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl border border-gray-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#961c18]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <p className="text-xl text-white font-medium mb-6 relative z-10">
              Each institution <span className="text-[#961c18]">must host at least one internal esports event annually</span>, organized primarily by students.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 relative z-10">
              <div className="bg-gray-800/50 p-4 rounded border border-gray-700">
                <h4 className="font-bold text-white mb-2">Suggested Implementation</h4>
                <ul className="space-y-2 text-sm text-gray-400 list-disc list-inside">
                  <li>Integrate esports events into inter-school or inter-faculty activities.</li>
                  <li>Host an internal tournament in any preferred competitive title.</li>
                  <li>Introduce ticketing where proceeds support esports development within the institution.</li>
                </ul>
              </div>
              <div className="bg-gray-800/50 p-4 rounded border border-gray-700 flex flex-col justify-center">
                <h4 className="font-bold text-white mb-2">KVE Support</h4>
                <p className="text-sm text-gray-400">
                  Invite Kenya Varsity Esports to attend, support, document, or promote the event.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Fees & Costs */}
        <section className="space-y-8">
          <div className="border-l-4 border-[#961c18] pl-6">
            <h2 className="text-3xl font-bold text-white mb-2">4. Participation Fees, Prize Pool & Operational Costs</h2>
            <p className="text-[#961c18] font-semibold tracking-wider uppercase">Financial Model</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-[#961c18] text-white p-6 rounded-xl shadow-lg shadow-red-900/20">
                <h3 className="text-2xl font-bold mb-2">Participation Fee</h3>
                <div className="text-4xl font-bold mb-1">KES 5,000</div>
                <p className="opacity-90">Per registered squad/team per competition</p>
              </div>
              
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                 <h4 className="font-bold text-white mb-4">Fee Allocation</h4>
                 <div className="space-y-4">
                   <div>
                     <div className="flex justify-between text-sm mb-1">
                       <span className="text-green-400">Prize Pool</span>
                       <span className="text-white">50%</span>
                     </div>
                     <div className="w-full bg-gray-700 rounded-full h-2">
                       <div className="bg-green-500 h-2 rounded-full w-1/2"></div>
                     </div>
                   </div>
                   <div>
                     <div className="flex justify-between text-sm mb-1">
                       <span className="text-blue-400">Operational Costs</span>
                       <span className="text-white">50%</span>
                     </div>
                     <div className="w-full bg-gray-700 rounded-full h-2">
                       <div className="bg-blue-500 h-2 rounded-full w-1/2"></div>
                     </div>
                     <p className="text-xs text-gray-500 mt-2">Includes administration, production, logistics, officiating, broadcasting, staffing, and ecosystem development.</p>
                   </div>
                 </div>
              </div>
            </div>

            <div className="space-y-6">
               <div className="bg-indigo-900/20 rounded-xl p-6 border border-indigo-500/30">
                <h4 className="font-bold text-indigo-300 mb-2">Future Subscription Model (Planned)</h4>
                <p className="text-gray-400 text-sm mb-3">
                  Kenya Varsity Esports plans to transition to an annual subscription model designed to promote affordability, sustainability, and broader participation.
                </p>
                <ul className="space-y-2 text-sm text-gray-400 list-disc list-inside">
                  <li>Members or institutions pay a yearly subscription fee.</li>
                  <li>Subscribed members may register multiple teams across different titles without paying per-squad participation fees.</li>
                </ul>
                <p className="text-xs text-indigo-400/70 mt-3 italic">
                  Further details will be communicated prior to implementation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Transportation & Accommodation */}
        <section className="space-y-8">
          <div className="border-l-4 border-[#961c18] pl-6">
            <h2 className="text-3xl font-bold text-white mb-2">5. Transportation & Accommodation Responsibility</h2>
            <p className="text-[#961c18] font-semibold tracking-wider uppercase">Logistics</p>
          </div>

          <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800">
            <p className="text-gray-300 mb-6 text-lg">
              All transportation, accommodation, and related logistical arrangements for teams participating in physical or hybrid events shall be the responsibility of the institutional esports club.
            </p>
            
            <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
              <h4 className="font-bold text-white mb-4">Clubs are required to:</h4>
              <ul className="space-y-3 text-gray-300 list-disc list-inside">
                <li>Liaise with their Sports Director, Lecturer in Charge, or Team Patron.</li>
                <li>Coordinate approvals, travel plans, and accommodation where necessary.</li>
                <li>Ensure player welfare and institutional compliance during events.</li>
              </ul>
            </div>
            
            <p className="text-gray-400 mt-6 text-sm">
              Kenya Varsity Esports will communicate event venues and schedules in advance to allow institutions adequate planning time.
            </p>
          </div>
        </section>

        {/* 6. Student Opportunities */}
        <section className="space-y-8">
          <div className="border-l-4 border-[#961c18] pl-6">
            <h2 className="text-3xl font-bold text-white mb-2">6. Opportunities for Students After Graduation</h2>
            <p className="text-[#961c18] font-semibold tracking-wider uppercase">Career Development</p>
          </div>

          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-gray-300 max-w-xl text-lg leading-relaxed">
                Kenya Varsity Esports is committed to developing future esports professionals. Students who demonstrate <strong className="text-white">leadership, commitment, and strong organizational skills</strong> through team management and internal event execution may be considered for part-time or developmental roles within the KVE and Tunza Esports ecosystem after graduation.
              </p>
            </div>
            <div>
              <Button onClick={() => router.push('/tournament-registration')} className="bg-[#961c18] hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg shadow-red-900/30 whitespace-nowrap">
                Register Your Team
              </Button>
            </div>
          </div>
        </section>

        {/* 7. Purpose */}
        <section className="space-y-8">
          <div className="border-l-4 border-[#961c18] pl-6">
            <h2 className="text-3xl font-bold text-white mb-2">7. Purpose of These Requirements</h2>
            <p className="text-[#961c18] font-semibold tracking-wider uppercase">Strategic Goals</p>
          </div>

          <div className="bg-gray-900/30 p-8 rounded-xl border border-gray-800">
            <p className="text-gray-300 mb-6">These requirements are designed to:</p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Encourage institutional ownership of esports development",
                "Establish structured esports teams comparable to traditional sports clubs",
                "Promote wide participation across multiple competitive titles",
                "Strengthen leadership, governance, and event management capacity",
                "Build a sustainable pipeline of future esports leaders and professionals"
              ].map((goal, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-black/20 p-4 rounded border border-gray-700/50">
                  <span className="text-[#961c18] font-bold">✓</span>
                  <span className="text-gray-300">{goal}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section className="text-center pt-12 pb-8 border-t border-gray-800 max-w-3xl mx-auto">
           <h3 className="text-2xl font-bold text-white mb-4">Conclusion</h3>
           <p className="text-gray-400 leading-relaxed mb-6">
             Kenya Varsity Esports values collaboration with Universities, Colleges, TVETs, Sports Directors, and student leaders nationwide. By implementing these requirements, varsity esports in Kenya will become more organized, competitive, and impactful.
           </p>
           <p className="text-white font-medium mb-8">
             We look forward to working with your institution as you establish or strengthen your esports team.
           </p>
           <p className="text-[#961c18] font-bold">
             For any questions or support, please feel free to reach out to us.
           </p>
        </section>

      </div>
      <FooterSection />
    </div>
  );
};

export default ParticipationGuidePage;
