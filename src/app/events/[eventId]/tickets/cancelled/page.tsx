"use client";

import React from 'react';
import { Navigation } from "@/components/Navigation";
import { FooterSection } from "@/components/Footer";
import { XCircle, ArrowLeft, Ticket, RotateCcw } from 'lucide-react';
import Link from "next/link";

export default function TicketCancelledPage() {
  return (
    <main className="bg-black min-h-screen font-hind">
      <Navigation />
      
      <section className="relative bg-[#080808] w-full py-16 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-28 bg-[#8c110d] opacity-50 transform rotate-12" />
          <div className="absolute bottom-20 right-10 w-2 h-28 bg-[#8c110d] opacity-40 transform -rotate-6" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-900/30 rounded-full flex items-center justify-center border-2 border-red-800">
              <XCircle className="w-12 h-12 text-red-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-4">
              Payment Cancelled
            </h1>
            <p className="text-gray-400 text-lg">
              Your ticket purchase was not completed. No charges have been made.
            </p>
          </div>

          <div className="border-2 border-gray-800 bg-black p-6 mb-8">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#8c110d]" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#8c110d]" />
            
            <h3 className="text-lg font-black uppercase text-white mb-4">What happened?</h3>
            <ul className="text-gray-300 text-sm space-y-2 text-left max-w-md mx-auto">
              <li className="flex items-center gap-2">• Payment was cancelled or timed out</li>
              <li className="flex items-center gap-2">• No money was deducted from your account</li>
              <li className="flex items-center gap-2">• Tickets have been released back to availability</li>
              <li className="flex items-center gap-2">• You can try purchasing again at any time</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/events">
              <button className="flex-1 py-4 bg-gradient-to-r from-[#8c110d] to-[#b91c17] text-white font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:from-[#b91c17] hover:to-[#8c110d]">
                <Ticket className="w-5 h-5" />
                Try Again
                <RotateCcw className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/events">
              <button className="flex-1 py-4 border-2 border-gray-700 hover:border-[#8c110d] text-gray-300 hover:text-white font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all">
                <ArrowLeft className="w-5 h-5" />
                Back to Events
              </button>
            </Link>
          </div>

          <p className="mt-8 text-gray-500 text-sm">
            Need help? Visit <a href="https://www.kve.co.ke" target="_blank" rel="noopener noreferrer" className="text-[#8c110d] hover:underline">www.kve.co.ke</a>
          </p>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}