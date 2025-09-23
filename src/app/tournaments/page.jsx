import ProtectedRoute from "@/components/auth/ProotectedRoute";
import { FooterSection } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { CategoriesSection } from "@/components/pages/tournaments/Categories";
import { ComingSoonSection } from "@/components/pages/tournaments/ComingSoon";
import HeroSection from "@/components/pages/tournaments/Herosection";
import { TeamRosterSection } from "@/components/pages/tournaments/Roaster";
import Link from "next/link";
// Custom fallback component for tournaments page
const TournamentsAuthFallback = () => (<div className="min-h-screen bg-black flex items-center justify-center">
    <div className="max-w-lg w-full mx-4">
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Join KUER Tournaments</h2>
          <p className="text-gray-300 text-lg mb-4">
            Access exclusive university esports tournaments and compete with students from across Kenya.
          </p>
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="text-[#961c18] font-semibold mb-2">🏆 What You'll Get Access To:</h3>
            <ul className="text-gray-400 text-sm space-y-1 text-left">
              <li>• Competitive esports tournaments</li>
              <li>• University team registration</li>
              <li>• Live tournament brackets</li>
              <li>• Prize pools and rewards</li>
              <li>• Community leaderboards</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <Link href="/register" className="w-full bg-[#961c18] hover:bg-[#7a1514] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 block">
            Create Account & Join Tournaments
          </Link>

          <Link href="/login" className="w-full bg-transparent border-2 border-[#961c18] text-[#961c18] hover:bg-[#961c18] hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 block">
            Already Have an Account? Sign In
          </Link>

          <Link href="/" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm block">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  </div>);
export default function TournamentsPage() {
    return (<ProtectedRoute fallback={<TournamentsAuthFallback />}>
      <main className="bg-black w-full min-h-screen">
        {/* Navigation at the top - full width across entire page */}
        <div className="w-full relative z-20">
          <Navigation />
        </div>

        <HeroSection />

        <CategoriesSection />

        {/* Team Roster section - full width */}
        <TeamRosterSection />

        <ComingSoonSection />

        {/* Footer section - full width */}
        <FooterSection />
      </main>
    </ProtectedRoute>);
}
