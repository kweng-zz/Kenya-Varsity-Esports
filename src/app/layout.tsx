import type { Metadata } from "next";
import { Geist, Geist_Mono, Hind } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext"; // <-- import AuthProvider
import { HydrationFix } from "@/components/HydrationFix";

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
  title: "KUER - Kenya University Esports Rankings",
  description: "The premier esports platform for university students in Kenya, offering tournaments, rankings, and a vibrant gaming community.",
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
        <AuthProvider> {/* <-- Wrap the app */}
          <HydrationFix />
          <div suppressHydrationWarning>
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
