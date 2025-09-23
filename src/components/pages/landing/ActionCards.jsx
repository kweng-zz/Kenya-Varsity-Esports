"use client";
import Image from "next/image";
import Link from "next/link";
const ActionCard = ({ imageSrc, alt, href, className = "" }) => (<Link href={href} className={`block transition-transform hover:scale-105 ${className}`}>
    <Image src={imageSrc} alt={alt} width={400} height={200} className="w-full h-auto object-contain" priority/>
  </Link>);
export const ActionCards = () => {
    return (<div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 justify-center items-center px-4 sm:px-0">
      <ActionCard imageSrc="/images/Join our tournaments.png" alt="Join our Tournaments" href="/tournaments" className="w-full sm:w-auto max-w-xs sm:max-w-sm md:max-w-md"/>
      <ActionCard imageSrc="/images/Join-the-Discord.png" alt="Join the Discord" href="https://discord.com/invite/yGHCzZax5S" className="w-full sm:w-auto max-w-xs sm:max-w-sm md:max-w-md"/>
    </div>);
};
