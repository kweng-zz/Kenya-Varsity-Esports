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
        {/* Back Button - Positioned absolute to the section for more separation */}
        <button 
          onClick={() => router.push('/about')}
          className="absolute left-2 top-2 md:left-8 md:top-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group z-10"
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
            <span className="block text-[#961c18] mt-2">PARTICIPATION GUIDE</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Welcome to KVE! This guide covers everything you need to know about eligibility, registration, rules, and how to represent your university in the premier competitive gaming platform for Kenyan students.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 pb-24 space-y-16">
        
        {/* Eligibility Requirements */}
        <section className="space-y-8">
          <div className="border-l-4 border-[#961c18] pl-6">
            <h2 className="text-3xl font-bold text-white mb-2">Eligibility Requirements</h2>
            <p className="text-[#961c18] font-semibold tracking-wider uppercase">Who can compete?</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="bg-[#961c18] w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                Student Status
              </h3>
              <ul className="space-y-3 list-disc list-inside text-gray-300 ml-2">
                <li>Must be a bonafide student at a registered Kenyan university</li>
                <li>Must provide proof of enrollment (Student ID or Portal Access)</li>
                <li>Can only represent <strong>ONE</strong> university</li>
                <li>Must verify status during check-in</li>
              </ul>
            </div>
            
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="bg-[#961c18] w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                Age & Consent
              </h3>
              <ul className="space-y-3 list-disc list-inside text-gray-300 ml-2">
                <li>Minimum age: <strong>16 years old</strong></li>
                <li>Players under 18 must provide parental/guardian consent</li>
                <li>Must adhere to the Code of Conduct (No toxicity allowed)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Registration Process */}
        <section className="space-y-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#961c18]/20 to-gray-900/50 border border-[#961c18]/30 p-8 md:p-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Registration Process</h2>
            <ol className="space-y-4 counter-reset-list text-lg text-gray-200">
              <li className="flex gap-4 items-start">
                <span className="font-bold text-[#961c18]">01.</span>
                <span>Visit the official website: <span className="text-white font-bold">kve.co.ke</span></span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="font-bold text-[#961c18]">02.</span>
                <span>Click on the tournament registration link</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="font-bold text-[#961c18]">03.</span>
                <span>Complete the form with accurate information</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="font-bold text-[#961c18]">04.</span>
                <span>Upload required documents (ID/Portal Screenshot)</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="font-bold text-[#961c18]">05.</span>
                <span>Submit and await confirmation email</span>
              </li>
            </ol>
            
            <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row gap-8">
              <div>
                <h4 className="font-bold text-white mb-2">Registration Fees</h4>
                <p className="text-gray-400">Typically <span className="text-green-400 font-bold">FREE</span> for university tournaments. Confirm specific fees on the tournament page.</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Important Deadlines</h4>
                <p className="text-gray-400">Spots are limited. Register early!</p>
              </div>
            </div>
            
            <div className="mt-8">
               <Button onClick={() => router.push('/register')} className="bg-[#961c18] hover:bg-red-700 text-white font-bold py-3 px-8 rounded text-lg">
                 Register Now
               </Button>
            </div>
          </div>
        </section>

        {/* Popular Games */}
        <section className="space-y-8">
          <div className="border-l-4 border-[#961c18] pl-6">
            <h2 className="text-3xl font-bold text-white mb-2">Tournament Games</h2>
            <p className="text-[#961c18] font-semibold tracking-wider uppercase">What we play</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { cat: 'Sports', ex: 'EA FC, Efootball Mobile ' },
               { cat: 'Fighting', ex: 'Tekken 8, Mortal Kombat' },
               { cat: 'Battle Royale', ex: 'PUBG Mobile' },
               { cat: 'Multiplayer', ex: 'COD Mobile' }
             ].map((item, i) => (
                <div key={i} className="bg-gray-800/40 p-4 rounded border border-gray-700 text-center hover:border-[#961c18] transition-colors">
                  <h4 className="font-bold text-white mb-1">{item.cat}</h4>
                  <p className="text-sm text-gray-400">{item.ex}</p>
                </div>
             ))}
          </div>
        </section>

        {/* Rules & Regulations */}
        <section className="space-y-8">
          <div className="border-l-4 border-[#961c18] pl-6">
            <h2 className="text-3xl font-bold text-white mb-2">Rules & Regulations</h2>
            <p className="text-[#961c18] font-semibold tracking-wider uppercase">Fair Play Policy</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-2">General Rules</h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex gap-3"><span className="text-red-500">🚫</span> <span><strong>No Cheating:</strong> Hacks, exploits, and unauthorized software are strictly prohibited.</span></li>
                 <li className="flex gap-3"><span className="text-red-500">🚫</span> <span><strong>No Stream Sniping:</strong> Watching opponent streams is forbidden.</span></li>
                 <li className="flex gap-3"><span className="text-red-500">🚫</span> <span><strong>No Account Sharing:</strong> Each player must use their own registered account.</span></li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-2">Disciplinary Actions</h3>
              <div className="space-y-3">
                 <div className="flex justify-between items-center bg-yellow-900/20 p-3 rounded border border-yellow-900/50">
                    <span className="font-bold text-yellow-500">First Offense</span>
                    <span>Formal Warning</span>
                 </div>
                 <div className="flex justify-between items-center bg-orange-900/20 p-3 rounded border border-orange-900/50">
                    <span className="font-bold text-orange-500">Second Offense</span>
                    <span>Suspension from Tournament</span>
                 </div>
                 <div className="flex justify-between items-center bg-red-900/20 p-3 rounded border border-red-900/50">
                    <span className="font-bold text-red-500">Extreme Offense</span>
                    <span>Expulsion + Legal Action</span>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Checklist */}
        <section className="bg-gray-900 rounded-xl p-8 border border-gray-800">
           <h2 className="text-2xl font-bold text-white mb-6 text-center">Tournament Day Checklist</h2>
           <div className="grid md:grid-cols-2 gap-8">
             <div>
                <h4 className="font-bold text-[#961c18] mb-4 uppercase text-sm tracking-wider">Online Tournaments</h4>
                <ul className="space-y-3 text-gray-300 text-sm">
                   <li className="flex items-center gap-2">✅ Check in 30 minutes before match</li>
                   <li className="flex items-center gap-2">✅ Join designated Discord channel</li>
                   <li className="flex items-center gap-2">✅ Have Tournament ID ready</li>
                   <li className="flex items-center gap-2">✅ Close background apps (reduce lag)</li>
                </ul>
             </div>
             <div>
                <h4 className="font-bold text-[#961c18] mb-4 uppercase text-sm tracking-wider">LAN Tournaments</h4>
                 <ul className="space-y-3 text-gray-300 text-sm">
                   <li className="flex items-center gap-2">✅ Arrive 1 hour early</li>
                   <li className="flex items-center gap-2">✅ Bring Physical Student ID</li>
                   <li className="flex items-center gap-2">✅ Bring your peripherals (mouse/keyboard)</li>
                   <li className="flex items-center gap-2">✅ Dress appropriately for photos/media</li>
                </ul>
             </div>
           </div>
        </section>



      </div>
      <FooterSection />
    </div>
  );
};

export default ParticipationGuidePage;
