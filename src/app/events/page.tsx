import { Navigation } from "@/components/Navigation";
import { FooterSection } from "@/components/Footer";
import EventsHero from "@/components/pages/events/EventsHero";
import EventsList from "@/components/pages/events/EventsList";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function EventsPage() {
    return (
        <main className="bg-black min-h-screen font-hind">
          <Navigation />
          
          {/* Featured Hero Section */}
          <EventsHero />

          {/* Events List Section */}
          <EventsList />
          
          <FooterSection />
        </main>
    );
}
