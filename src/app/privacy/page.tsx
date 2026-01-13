import { FooterSection, Navigation } from "@/components";
import React from "react";
import { LogoLoop } from "@/components/LogoLoop";


const privacyData = {
  effectiveDate: "02/02/2025",
  lastUpdated: "25/04/2025",
  sections: [
    {
      title: "1. Legal Information",
      points: [
        "Company Name: Tunza Esports",
        "Address: P.O. Box 45085-00100, Nairobi, Kenya",
        "Registration Number: PVT-3QUDBV63",
        "Email: info@kuer.co.ke",
      ],
    },
    {
      title: "2. Privacy and Data Protection",
      points: [
        "2.1 Data Controller",
        "In compliance with the Kenya Data Protection Act, 2019, Tunza Esports is the data controller for personal data collected through this website.",
        "",
        "2.2 Purpose of Data Collection",
        "We collect personal data when:",
        "• You submit contact or registration forms",
        "• You participate in our competitions or services",
        "• You browse our site (via cookies)",
        "",
        "We use this data to:",
        "• Respond to your queries or requests",
        "• Manage participation in events and competitions",
        "• Send you marketing or service-related communications (only with your consent)",
        "• Analyze website usage (via cookies)",
        "• In instances such students verification process your students IDs and any other document needed during process will be deleted after verification.",
        "",
        "2.3 Legal Basis for Processing",
        "Your data is processed under the lawful bases of:",
        "• Consent – e.g., for marketing or cookies",
        "• Contract – e.g., when signing up for a service",
        "• Legal Obligation – e.g., to retain records",
        "• Legitimate Interests – e.g., internal analysis",
        "",
        "2.4 Data Sharing",
        "We do not sell your personal data. However, it may be shared with:",
        "• Trusted third-party service providers (e.g., for hosting or analytics)",
        "• Legal authorities, if required by law",
      ],
    },
    {
      title: "3. Cookie Policy",
      points: [
        "3.1 What Are Cookies?",
        "Cookies are small files stored on your device when you visit our website. They help us understand how visitors use our site and improve your experience.",
        "",
        "3.2 Types of Cookies We Use",
        "• Necessary Cookies: Enable essential site functionality",
        "• Analytics Cookies: Help us improve the website by understanding how visitors interact with it",
        "• Marketing Cookies: Used only if you accept, to deliver personalized ads",
        "",
        "3.3 Managing Cookies",
        "You can manage or disable cookies at any time via your browser settings. Our site may prompt you with a cookie consent banner when you first visit.",
      ],
    },
    {
      title: "4. Your Rights",
      points: [
        "Under the Kenya Data Protection Act, 2019, you have the right to:",
        "• Access the personal data we hold about you",
        "• Correct inaccurate or incomplete data",
        "• Request deletion of your data",
        "• Object to or restrict certain types of data processing",
        "• Withdraw consent at any time, where applicable",
        "",
        "To exercise any of these rights, please contact us at info@kuer.co.ke",
      ],
    },
    {
      title: "5. Changes to This Policy",
      points: [
        "We may update this Privacy Policy from time to time. Any changes will be posted on this page, along with a revised \"Last Updated\" date.",
      ],
    },
  ],
};

export default function PrivacyPage() {
  return (
    <main className="bg-black min-h-screen">
      {/* Navigation */}
      <Navigation />
      
      {/* Privacy Content - Full Width */}
      <div className="w-full bg-[#0c0e11] py-16 px-4">
        <div className="flex flex-col items-center mb-12">
          <h1 className="font-['Hind',Helvetica] font-bold text-[54px] text-center tracking-[2.16px] leading-[70.2px]">
            <span className="text-white tracking-[1.17px]">Privacy </span>
            <span className="text-[#961c18] tracking-[1.17px]">
              Policy
            </span>
          </h1>
        </div>

        <div className="max-w-4xl mx-auto font-['Hind',Helvetica] text-white">
          <div className="mb-8">
            <p className="font-bold text-[26px]">
              Effective Date: {privacyData.effectiveDate}
              <br />
              Last Updated: {privacyData.lastUpdated}
            </p>
            <p className="font-bold text-[26px] mt-4">
              Kenya Varsity Esports (KVE) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
            </p>
          </div>

          {privacyData.sections.map((section, index) => (
            <div key={`section-${index}`} className="mb-6">
              <h2 className="font-bold text-[26px]">{section.title}</h2>
              <ul className="mt-2 space-y-1">
                {section.points.map((point, pointIndex) => (
                  <li
                    key={`point-${index}-${pointIndex}`}
                    className="text-[26px]"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <LogoLoop />
        </div>
      </div>

      {/* Footer */}
      <FooterSection />
    </main>
  );
}