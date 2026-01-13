import { Navigation } from "@/components/Navigation";
import { FooterSection } from "@/components/Footer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function RankingsPage() {
    return (
        <main className="bg-black min-h-screen">
          {/* Navigation at the top */}
          <div className="w-full relative z-20">
            <Navigation />
          </div>
          
          {/* New Event Page Content - Inline to bypass cache */}
          <section className="relative w-full min-h-[85vh] flex items-center bg-black overflow-hidden">
            <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-bg.jpg')", filter: "brightness(0.4)" }}>
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            </div>

            <div className="relative z-10 w-full pl-4 md:pl-8 pr-4 sm:pr-6 lg:pr-8 flex flex-col justify-center h-full pt-20">
              <div className="mb-6">
                <span className="bg-[#E73138] text-white text-xs font-bold px-3 py-1 uppercase tracking-wider italic transform -skew-x-12 inline-block">
                  Featured Tournament
                </span>
              </div>

              <h1 className="font-['Hind',Helvetica] text-white text-5xl md:text-7xl lg:text-8xl font-black italic uppercase leading-none tracking-tighter mb-6 max-w-4xl">
                <span className="block">Join Your</span>
                <span className="block text-[#E73138]">Institution&apos;s</span>
                <span className="block">Esports</span>
                <span className="block">Legacy</span>
              </h1>

              <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-10 font-light">
                Compete in the premier university esports league. Earn your spot among the legends and win from a pool of <span className="font-bold text-white">KSH 500,000+</span>.
              </p>

              <div className="flex gap-4 mb-10">
                <div className="border border-white/20 bg-black/40 backdrop-blur-sm p-3 w-16 h-16 md:w-20 md:h-20 flex flex-col items-center justify-center">
                  <span className="text-white text-2xl md:text-3xl font-bold leading-none mb-1">02</span>
                  <span className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wider">DAYS</span>
                </div>
                <div className="border border-white/20 bg-black/40 backdrop-blur-sm p-3 w-16 h-16 md:w-20 md:h-20 flex flex-col items-center justify-center">
                  <span className="text-white text-2xl md:text-3xl font-bold leading-none mb-1">14</span>
                  <span className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wider">HRS</span>
                </div>
                <div className="border border-white/20 bg-black/40 backdrop-blur-sm p-3 w-16 h-16 md:w-20 md:h-20 flex flex-col items-center justify-center">
                  <span className="text-white text-2xl md:text-3xl font-bold leading-none mb-1">45</span>
                  <span className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wider">MINS</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-black w-full py-16">
            <div className="w-full pl-4 md:pl-8 pr-4 sm:pr-6 lg:pr-8">
              <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-12 gap-6 border-b border-gray-800 pb-4">
                <h2 className="text-3xl md:text-5xl font-black italic uppercase text-white tracking-tighter">
                  Upcoming <span className="text-[#E73138]">Events</span>
                </h2>
              </div>
              
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Events list loading...</p>
                <p className="text-gray-500 text-sm mt-4">The new Events page structure is now active!</p>
              </div>
            </div>
          </section>
          
          {/* Footer section */}
          <FooterSection />
        </main>
    );
}