import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { FooterSection } from '@/components/Footer';

export default function NotFound() {
  return (
    <main className="bg-black w-full min-h-screen">
      {/* Navigation */}
      <div className="w-full relative z-20">
        <Navigation />
      </div>

      {/* Not Found Content */}
      <section className="bg-black text-white py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl font-bold text-[#961c18] mb-4">404</h1>
          <h2 className="text-3xl font-bold mb-6">Article Not Found</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Sorry, we couldn&apos;t find the article you&apos;re looking for. It may have been moved, deleted, or the URL might be incorrect.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/blogs"
              className="inline-block px-8 py-3 bg-[#961c18] text-white rounded-lg hover:bg-[#7a1514] transition-colors font-semibold"
            >
              Browse All Articles
            </Link>
            
            <Link
              href="/"
              className="inline-block px-8 py-3 border border-gray-600 text-white rounded-lg hover:border-[#961c18] hover:text-[#961c18] transition-colors font-semibold"
            >
              Go Home
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterSection />
    </main>
  );
}