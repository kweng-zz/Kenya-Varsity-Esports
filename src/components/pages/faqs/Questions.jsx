'use client';
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
export const FAQSection = () => {
    const [openItems, setOpenItems] = useState([]);
    const toggleItem = (index) => {
        setOpenItems(prev => prev.includes(index)
            ? prev.filter(item => item !== index)
            : [...prev, index]);
    };
    const faqData = [
        {
            category: "General",
            questions: [
                {
                    question: "What is KUER?",
                    answer: "KUER (Kenya University Esports Rankings) is the premier esports platform for university students in Kenya. We organize tournaments, maintain rankings, and build a community for competitive gaming across Kenyan universities."
                },
                {
                    question: "Who can participate in KUER tournaments?",
                    answer: "KUER tournaments are open to all university and college students in Kenya. You must be currently enrolled and provide valid student identification during the verification process."
                },
                {
                    question: "Is KUER free to use?",
                    answer: "Yes, creating an account and participating in most KUER tournaments is completely free. Some premium tournaments may have entry fees, which will be clearly stated in the tournament details."
                }
            ]
        },
        {
            category: "Registration & Account",
            questions: [
                {
                    question: "How do I create an account?",
                    answer: "Visit our registration page and fill out the form with your personal details, university information, and gaming preferences. You will need to verify your student status with a valid student ID or admission letter."
                },
                {
                    question: "What documents do I need for verification?",
                    answer: "You will need a valid student ID, national ID, admission letter, or student email address. We also require a passport photo for profile verification. All documents are securely processed and deleted after verification."
                },
                {
                    question: "How long does verification take?",
                    answer: "Student verification typically takes 1-3 business days. You will receive an email notification once your account is verified and you can start participating in tournaments."
                },
                {
                    question: "Can I change my university information?",
                    answer: "Yes, you can update your university information by contacting our support team at info@kuer.co.ke with proper documentation of your transfer or change in institution."
                }
            ]
        },
        {
            category: "Tournaments",
            questions: [
                {
                    question: "What games do you support?",
                    answer: "We currently support popular esports titles including VALORANT, League of Legends, FIFA, Call of Duty, and more. Our game selection is regularly updated based on community interest and competitive viability."
                },
                {
                    question: "How do I register for a tournament?",
                    answer: "Once your account is verified, browse available tournaments on our platform, select the one you want to join, and click Register. For team tournaments, your team captain must register all verified team members."
                },
                {
                    question: "What happens if I cannot attend a tournament I registered for?",
                    answer: "Please notify us as soon as possible if you cannot attend. For team tournaments, you can bring a registered substitute. Repeated no-shows may affect your ability to register for future tournaments."
                },
                {
                    question: "Are tournaments online or offline?",
                    answer: "We host both online and offline tournaments. Online tournaments can be played from anywhere, while offline tournaments require physical attendance at specified venues, usually for finals and major events."
                }
            ]
        },
        {
            category: "Rankings & Rewards",
            questions: [
                {
                    question: "How are rankings calculated?",
                    answer: "Rankings are based on tournament performance, consistency, and competitive activity. Points are awarded based on placement, opponent strength, and tournament tier. Rankings are updated after each tournament."
                },
                {
                    question: "What rewards can I win?",
                    answer: "Rewards vary by tournament and may include in-game items, merchandise, trophies, cash prizes, and recognition. MVP players and top performers may receive additional rewards and sponsorship opportunities."
                },
                {
                    question: "When are rewards distributed?",
                    answer: "Physical rewards and cash prizes are typically distributed within 30 days after tournament completion. In-game rewards and digital prizes are usually awarded immediately after results are confirmed."
                },
                {
                    question: "Can I lose ranking points?",
                    answer: "Rankings can fluctuate based on recent performance and activity. Inactive players may see gradual ranking decay, while poor performance in tournaments may result in point loss."
                }
            ]
        },
        {
            category: "Technical Support",
            questions: [
                {
                    question: "I am having trouble logging in. What should I do?",
                    answer: "First, try resetting your password using the Forgot Password link. If that does not work, clear your browser cache or try a different browser. Contact support if the issue persists."
                },
                {
                    question: "How do I report a bug or technical issue?",
                    answer: "Use our support ticket system to report bugs or technical issues. Provide as much detail as possible, including screenshots, browser information, and steps to reproduce the problem."
                },
                {
                    question: "What should I do if I encounter cheating or unfair play?",
                    answer: "Report any suspected cheating immediately through our support system. Provide evidence such as screenshots, recordings, or match details. We take fair play seriously and investigate all reports thoroughly."
                }
            ]
        },
        {
            category: "Contact & Support",
            questions: [
                {
                    question: "How can I contact KUER support?",
                    answer: "You can reach us through our support ticket system, email us at info@kuer.co.ke, or join our Discord community for quick questions and community support."
                },
                {
                    question: "Do you have social media accounts?",
                    answer: "Yes! Follow us on Twitter, Instagram, YouTube, TikTok, and join our Discord server for the latest updates, tournament announcements, and community discussions."
                },
                {
                    question: "Can I suggest new features or games?",
                    answer: "Absolutely! We welcome community feedback and suggestions. Contact us through our support channels or participate in community discussions on our social media platforms."
                }
            ]
        }
    ];
    return (<section className="w-full py-16 bg-black">
      <div className="container mx-auto px-4 max-w-4xl">
        {faqData.map((category, categoryIndex) => (<div key={categoryIndex} className="mb-12">
            {/* Category Header */}
            <h2 className="font-['Hind',Helvetica] font-bold text-[32px] text-[#961c18] mb-6 border-b border-gray-700 pb-3">
              {category.category}
            </h2>
            
            {/* Questions in Category */}
            <div className="space-y-4">
              {category.questions.map((faq, questionIndex) => {
                const globalIndex = categoryIndex * 100 + questionIndex;
                const isOpen = openItems.includes(globalIndex);
                return (<Card key={questionIndex} className="bg-gray-900/50 border-gray-700 hover:border-[#961c18] transition-all duration-300">
                    <CardContent className="p-0">
                      {/* Question Header */}
                      <button onClick={() => toggleItem(globalIndex)} className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-800/30 transition-colors duration-300">
                        <h3 className="font-['Hind',Helvetica] font-bold text-white text-lg pr-4">
                          {faq.question}
                        </h3>
                        <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                          <svg className="w-5 h-5 text-[#961c18]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                          </svg>
                        </div>
                      </button>
                      
                      {/* Answer Content */}
                      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-6 pb-6 border-t border-gray-700">
                          <p className="font-['Hind',Helvetica] font-normal text-gray-300 text-base leading-relaxed pt-4">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>);
            })}
            </div>
          </div>))}
        
        {/* Contact Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gray-900/30 border-gray-700">
            <CardContent className="p-8">
              <h3 className="font-['Hind',Helvetica] font-bold text-white text-2xl mb-4">
                Still have questions?
              </h3>
              <p className="font-['Hind',Helvetica] font-normal text-gray-300 text-lg mb-6">
                Cannot find the answer you are looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/help/new-ticket" className="inline-flex items-center justify-center px-6 py-3 bg-[#961c18] hover:bg-[#D13431] text-white font-bold rounded transition-colors duration-300">
                  Create Support Ticket
                </a>
                <a href="mailto:info@kuer.co.ke" className="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-[#961c18] text-[#961c18] hover:bg-[#961c18] hover:text-white font-bold rounded transition-all duration-300">
                  Email Support
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>);
};
