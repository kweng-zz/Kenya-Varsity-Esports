export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO date string
  time?: string;
  type: 'registration' | 'match' | 'tournament' | 'deadline' | 'announcement' | 'event';
  status?: 'upcoming' | 'live' | 'completed';
  gameSlug?: string;
  tournamentId?: string;
  location?: string;
  registrationDeadline?: string;
  maxParticipants?: number;
  currentParticipants?: number;
  prizePool?: string;
  teams?: string[];
  isImportant?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CalendarData {
  events: CalendarEvent[];
  totalEvents: number;
  upcomingEvents: number;
  liveEvents: number;
  completedEvents: number;
}