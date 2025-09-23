import { FooterSection } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { CompetitionSection } from "@/components/pages/about/CompetitionSection";
import { HeroSection } from "@/components/pages/about/HeroSection";
import { StatisticsSection } from "@/components/pages/about/StatisticsSection";
export default function AboutPage() {
    return (<main className="bg-black w-full min-h-screen" data-model-id="1:2582">
      {/* Navigation at the top - full width across entire page */}
      <div className="w-full relative z-20">
        <Navigation />
      </div>

      {/* Hero section - full width */}
      <HeroSection />

      {/* Competition section - full width */}
      <CompetitionSection />

      {/* Statistics section - full width */}
      <StatisticsSection />

      {/* Footer section - full width */}
      <FooterSection />
    </main>);
}
