// src/lib/tournamentNavigation.ts
export interface TournamentNavItem {
  name: string;
  href: string;
}

export const tournamentNavItems: TournamentNavItem[] = [
  {
    name: 'Information',
    href: '/games/[slug]/information'
  },
  {
    name: 'Participants',
    href: '/games/[slug]/participants'
  },
  {
    name: 'Calendar',
    href: '/games/[slug]/calendar'
  },
  {
    name: 'Community',
    href: '/games/[slug]/community'
  }
];