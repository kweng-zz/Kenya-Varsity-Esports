import { FooterSection, Navigation } from "@/components";
import React from "react";
const termsData = {
    effectiveDate: "02/02/2025",
    lastUpdated: "25/04/2025",
    sections: [
        {
            title: "1. Eligibility",
            points: [
                "Must be 18 years or older, or have parental consent if under 18.",
                "Must be a student at a recognized university or college in Kenya.",
                "Must provide accurate identification documents (e.g., student ID, national ID, admission letter, students email)",
            ],
        },
        {
            title: "2. Account Registration",
            points: [
                "Users must register with the information they are asked for i.e full name, gamertag, Discord ID, verified email, university name, and the game(s) they play etc.",
                "Submission of a passport photo and valid identification is required for verification.",
                "Users are responsible for maintaining the confidentiality of their account credentials.",
            ],
        },
        {
            title: "3. Use of Platform",
            points: [
                "You agree not to:",
                "Use KUER for unlawful or fraudulent activities.",
                "Submit false or misleading information.",
                "Harass, threaten, or harm other users.",
                "Attempt to hack or disrupt the KUER website or services.",
            ],
        },
        {
            title: "4. Participation in Tournaments",
            points: [
                "All matches must follow the official KUER rules for each game title.",
                "Cheating, smurfing, or use of unauthorized software will result in disqualification and possible banning.",
                "Teams must register players who are already verified on the platform.",
                "Team captains are responsible for managing communication and registration for their teams.",
                "All participants who reach to finals and are needed physically are required to attend if a player cannot make it they should bring a sub that registered during the start of a tournament.",
            ],
        },
        {
            title: "5. Prizes and Payments",
            points: [
                "Rewards (e.g., in-game gems, merchandise, or trophies) will be distributed based on performance and compliance.",
                "For cash payment participants will be paid by 30 days after the completion of the tournament.",
                "KUER reserves the right to withhold or retract rewards in cases of rule violations.",
                "MVPs or top-ranked players may receive additional rewards or recognition.",
            ],
        },
        {
            title: "6. Intellectual Property",
            points: [
                "All KUER branding, logos, and content are the property of Kenya University Esports Rankings.",
                "You retain ownership of content you submit but grant KUER a license to use it for promotion, streaming, or reporting purposes.",
            ],
        },
        {
            title: "7. Privacy and Data Use",
            points: [
                "By using KUER, you consent to the collection and use of your data as outlined in our Privacy Policy.",
                "We do not sell user data to third parties.",
                "Data may be shared with service providers or legal authorities if required.",
            ],
        },
        {
            title: "8. Termination",
            points: [
                "KUER may suspend or terminate accounts that violate these Terms.",
                "Users may deactivate their accounts by contacting info@kuer.co.ke.",
            ],
        },
        {
            title: "9. Limitation of Liability",
            points: [
                "KUER is not liable for:",
                "Loss of data,",
                "Service interruptions,",
                "Issues caused by third-party platforms (e.g., Discord, game servers),",
                "In-game losses or penalties.",
            ],
        },
        {
            title: "10. Governing Law",
            points: [
                "These Terms are governed by the laws of the Republic of Kenya. Any disputes shall be resolved in the courts of Kenya.",
            ],
        },
        {
            title: "11. Changes to Terms",
            points: [
                "We may update these Terms occasionally. Changes will be posted on this page and notified via email or website banners.",
            ],
        },
        {
            title: "12. Contact Information",
            points: ["📧 info@kuer.co.ke"],
        },
    ],
};
export default function TermsPage() {
    return (<main className="bg-black min-h-screen">
      {/* Navigation */}
      <Navigation />
      
      {/* Terms Content - Full Width */}
      <div className="w-full bg-[#0c0e11] py-16 px-4">
        <div className="flex flex-col items-center mb-12">
          <h1 className="font-['Hind',Helvetica] font-bold text-[54px] text-center tracking-[2.16px] leading-[70.2px]">
            <span className="text-white tracking-[1.17px]">Terms and </span>
            <span className="text-[#961c18] tracking-[1.17px]">
              Conditions
            </span>
          </h1>
        </div>

        <div className="max-w-4xl mx-auto font-['Hind',Helvetica] text-white">
          <div className="mb-8">
            <p className="font-bold text-[26px]">
              Effective Date: {termsData.effectiveDate}
              <br />
              Last Updated: {termsData.lastUpdated}
            </p>
            <p className="font-bold text-[26px] mt-4">
              Welcome to Kenya University Esports Rankings (KUER)! These
              Terms and Conditions (&quot;Terms&quot;) govern your use of our website,
              services, and participation in esports tournaments hosted by
              KUER. By accessing or using any part of our platform, you
              agree to be bound by these Terms.
            </p>
          </div>

          {termsData.sections.map((section, index) => (<div key={`section-${index}`} className="mb-6">
              <h2 className="font-bold text-[26px]">{section.title}</h2>
              <ul className="mt-2 space-y-1">
                {section.points.map((point, pointIndex) => (<li key={`point-${index}-${pointIndex}`} className="text-[26px]">
                    {point}
                  </li>))}
              </ul>
            </div>))}
        </div>

        <div className="relative mt-16">
          <img className="w-full h-auto" alt="Mask Group" src="https://c.animaapp.com/mdsmmxxn0MTxE3/img/mask-group.png"/>
        </div>
      </div>

      {/* Footer */}
      <FooterSection />
    </main>);
}
