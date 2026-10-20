// src/types/tournament.ts
export interface Tournament {
  id: string;
  slug: string;
  gameName: string;
  title?: string;
  description?: string;
  detailedDescription?: string;
  category?: string;
  featuredImageUrl?: string;
  bannerImageUrl?: string;
  status: 'draft' | 'published' | 'archived';
  tournamentStatus?: 'upcoming' | 'registration_open' | 'registration_closed' | 'ongoing' | 'completed';
  startDate?: string;
  endDate?: string;
  registrationStartDate?: string;
  registrationEndDate?: string;
  registrationDeadline?: string;
  format?: string;
  maxParticipants?: number;
  currentParticipants?: number;
  prizePool?: number;
  currency?: string;
  enableTickets?: boolean;
  rules?: string[];
  requirements?: string[];
  rulesTitle?: string;
  pdfUrls?: TournamentPdfUrl[];
  awards?: TournamentAward[];
  schedule?: TournamentSchedule[];
  sponsors?: TournamentSponsor[];
  createdAt: string;
  updatedAt: string;
}

export interface TournamentRulesContent {
  generalRules?: string;
  gameSpecificRules?: string;
  conductRules?: string;
  technicalRequirements?: string;
  penalties?: string;
  pdfDocuments?: TournamentRulesPDF[];
}

export interface TournamentRulesPDF {
  title: string;
  url: string;
  description?: string;
}

export interface TournamentPdfUrl {
  title: string;
  url: string;
}

export interface TournamentAward {
  id: string;
  position: number;
  title: string;
  description?: string;
  prize?: number;
  currency?: string;
  imageUrl?: string;
}

export interface TournamentSchedule {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  type: 'registration' | 'match' | 'final' | 'ceremony' | 'other';
  status: 'upcoming' | 'live' | 'completed';
}

export interface TournamentSponsor {
  id: string;
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  tier: 'title' | 'presenting' | 'official' | 'supporting';
}

export interface TournamentParticipant {
  id: string;
  tournamentId: string;
  userId: string;
  teamName?: string;
  playerName: string;
  email: string;
  university?: string;
  registrationDate: string;
  status: 'registered' | 'confirmed' | 'disqualified' | 'withdrawn';
}

export interface TournamentRegistration {
  tournamentId: string;
  playerName: string;
  email: string;
  university?: string;
  teamName?: string;
  additionalInfo?: string;
}