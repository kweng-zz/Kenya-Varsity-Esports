import { Navigation } from "@/components/Navigation";
import { FooterSection } from "@/components/Footer";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-black min-h-screen flex flex-col">
      <div className="w-full relative z-20">
        <Navigation />
      </div>

      <section className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="text-center max-w-lg">
          <p className="font-['Hind',Helvetica] font-black italic text-[#E73138] text-7xl sm:text-9xl tracking-tighter leading-none">
            404
          </p>
          <h1 className="font-['Hind',Helvetica] font-bold text-white text-2xl sm:text-3xl uppercase mt-6">
            Page Not Found
          </h1>
          <p className="text-gray-400 mt-4 text-base sm:text-lg">
            The page you are looking for doesn&apos;t exist or may have been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link
              href="/"
              className="bg-[#961c18] hover:bg-[#7a1714] text-white font-bold uppercase tracking-wider px-6 py-3 transition-colors duration-200"
            >
              Back to Home
            </Link>
            <Link
              href="/events"
              className="border-2 border-gray-700 hover:border-[#961c18] text-gray-300 hover:text-white font-bold uppercase tracking-wider px-6 py-3 transition-colors duration-200"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
