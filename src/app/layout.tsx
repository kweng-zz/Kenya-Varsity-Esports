import type { Metadata } from "next";
import { Geist, Geist_Mono, Hind } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext"; // <-- import AuthProvider
import { BlogStateProvider } from "@/contexts/BlogStateContext";
import { HydrationFix } from "@/components/HydrationFix";
import { TawkToWidget } from "@/components/TawkToWidget";
import { WebVitals } from "@/components/WebVitals";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const hind = Hind({
  variable: "--font-hind",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "KVE - Kenya Varsity Esports | Premier University Gaming Platform",
    template: "%s | KVE"
  },
  description: "The premier esports platform for university students in Kenya. Compete in tournaments for PUBG Mobile, Call of Duty, Free Fire, and more. Join the vibrant varsity gaming community.",
  keywords: ["esports", "gaming", "Kenya", "university", "varsity", "tournaments", "PUBG Mobile", "CODM", "Free Fire", "gaming community"],
  authors: [{ name: "KVE Team" }],
  creator: "Kenya Varsity Esports",
  publisher: "Kenya Varsity Esports",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://kve.co.ke",
    siteName: "KVE - Kenya Varsity Esports",
    title: "KVE - Kenya Varsity Esports",
    description: "Compete, rank up, and connect with the varsity gaming community in Kenya.",
    images: [
      {
        url: "/images/Join-Your-Uni.webp",
        width: 1200,
        height: 630,
        alt: "KVE - Kenya Varsity Esports",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KVE - Kenya Varsity Esports",
    description: "The premier esports platform for university students in Kenya.",
    images: ["/images/Join-Your-Uni.webp"],
    creator: "@kve_esports",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} ${hind.variable} antialiased`}
        suppressHydrationWarning
      >
        <WebVitals />
        <AuthProvider> {/* <-- Wrap the app */}
          <BlogStateProvider>
            <HydrationFix>
              <div suppressHydrationWarning>
                {children}
              </div>
            </HydrationFix>
            <TawkToWidget />
          </BlogStateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
