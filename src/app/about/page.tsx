import { FooterSection } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";

import { HeroSection } from "@/components/pages/about/HeroSection";

import { UniversityJoinSection } from "@/components/pages/about/UniversityJoinSection";




export default function AboutPage() {
  return (
    <main
      className="bg-black w-full min-h-screen"
      data-model-id="1:2582"
    >
      {/* Navigation at the top - full width across entire page */}
      <div className="w-full relative z-20">
        <Navigation />
      </div>

      {/* Hero section - full width */}
      <HeroSection />

      {/* University Join section - full width */}
      <UniversityJoinSection />

      

      
      {/* Footer section - full width */}
      <FooterSection />
    </main>
  );
}