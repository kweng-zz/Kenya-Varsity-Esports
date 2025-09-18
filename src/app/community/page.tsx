import React from 'react';
import Link from 'next/link'; // Import the Link component
import { Navigation } from '@/components/Navigation';
import { FooterSection } from '@/components/Footer';
import { UniversitySelector } from '@/components/UniversitySelector';
import { Button } from '@/components/ui/button';
import { universities } from '@/lib/universitiesData';



// Generic contact email for support
const SUPPORT_EMAIL = "support@kuer.co.ke";

// Generic background image for the hero section
const HERO_BACKGROUND_IMAGE = "/images/hero-community.jpg"; // Replace with a suitable generic image

// Renamed the component to reflect its purpose
export default function CommunityPage() {
  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      <Navigation />
      
     {/* Hero Section */}
      <section className="relative w-full h-[400px] mt-0">
      <div
      className="absolute inset-0"
      style={{
      backgroundImage: `url(${HERO_BACKGROUND_IMAGE})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      }}
      ></div>
      <div className="absolute inset-0 bg-black opacity-60"></div> {/* Black overlay for text readability */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
      <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wider">Join Your Community</h1>
      <p className="mt-4 text-lg text-gray-300 max-w-2xl">Find your university's esports group and connect with fellow players.</p>
      </div>
      </section>

      {/* Main Content Section */}
      <section id="community-selector" className="relative w-full bg-black py-16">
        {/* Background Image Elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        {/* Left side - normal image */}
        <div 
            className="absolute top-0 left-0 w-1/2 h-full bg-cover bg-no-repeat bg-center"
            style={{ backgroundImage: "url('/images/Mask Group.png')" }}
        ></div>
        {/* Right side - inverted image */}
        <div 
            className="absolute top-0 right-0 w-1/2 h-full bg-cover bg-no-repeat bg-center transform -scale-x-100"
            style={{ backgroundImage: "url('/images/Mask Group.png')" }}
        ></div>
      </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8">
          <div className="text-white font-sans">
            <h2 className="text-2xl md:text-3xl font-bold uppercase mb-8 text-center">Find Your University WhatsApp Group</h2>
            <p className="text-lg text-center mb-12 text-gray-300">
              Select your university from the list below to join the official WhatsApp group. Stay updated on tournaments, find teammates, and be part of the conversation.
            </p>
            
            {/* University Selector Container */}
            <div 
              className="relative bg-black/60 border border-gray-600 p-8 md:p-12"
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
                  // Using the generic support email as the fallback contact
                  supportContact={SUPPORT_EMAIL}
                  contactType={'email'}
                />
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <h3 className="text-xl font-bold uppercase"><span className='text-red-800'>MISSING </span>YOUR INSTITUTION?</h3>
            </div>
          </div>
        </div>
        
        {/* Spacer to maintain proper layout height */}
        <div className="relative my-10 w-full h-[400px] flex items-center justify-center">
          {/* Polygon-shaped button with white border */}
          <div className="relative">
            {/* White border outline */}
            <div 
              className="absolute bg-white"
              style={{
                width: '140.34px',
                height: '568px',
                transform: 'rotate(90deg)',
                clipPath: 'polygon(0% 8%, 50% 0%, 100% 8%, 100% 92%, 50% 100%, 0% 92%)',
                top: '-2px',
                left: '-2px'
              }}
            ></div>
            
            {/* Inner button content wrapped in a Link */}
            <Link href="/contact" passHref>
              <Button 
                className="relative bg-black border-none rounded-none p-0 z-10 focus:outline-none focus:ring-0 overflow-visible"
                style={{
                  width: '136.34px',
                  height: '564px',
                  opacity: 1,
                  transform: 'rotate(90deg)',
                  clipPath: 'polygon(0% 8%, 50% 0%, 100% 8%, 100% 92%, 50% 100%, 0% 92%)'
                }}
              >
                {/* Text container with isolated hover effects */}
                <div className="relative z-50 flex items-center justify-center h-full w-full overflow-visible">
                  <span className="text-red-900 text-[36px] md:text-[42px] lg:text-[48px] font-['Hind',Helvetica] font-bold tracking-[2px] [text-shadow:0px_2px_4px_#000000] whitespace-nowrap transition-all duration-300 hover:scale-110 hover:text-white hover:[text-shadow:0px_0px_8px_rgba(150,28,24,0.8)] cursor-pointer origin-center"
                    style={{ transform: 'rotate(-90deg)' }}
                  >
                    CONTACT US!
                  </span>
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <FooterSection />
    </div>
  );
}
