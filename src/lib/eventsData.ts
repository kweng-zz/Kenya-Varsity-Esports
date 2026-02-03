export interface Event {
  id: string;
  title: string;
  gameSlug: string; // To link with gamesData if needed for base images
  image: string; // Specific event image
  date: string;
  time: string;
  prizePool: string;
  entryFee: string;
  status: 'OPEN' | 'LEAGUE' | 'PRO';
  tags: string[];
  registrationLink?: string;
  detailsLink?: string;
}

export const events: Event[] = [
  {
    id: '1',
    title: 'KVE SEASON 3: QUALIFIERS',
    gameSlug: 'generic', // Represents a general event or use specific game slug
    image: '/images/hero-bg.jpg', // Placeholder, needs replacement or use existing assets
    date: 'OCTOBER 24, 2023',
    time: '18:00',
    prizePool: 'KSH 150,000 PRIZE POOL',
    entryFee: 'FREE FOR STUDENTS',
    status: 'OPEN',
    tags: ['ALL TITLES', 'VALORANT', 'FC 24', 'CALL OF DUTY', 'MOBILE LEGENDS'],
    registrationLink: '#'
  },
  {
    id: '2',
    title: 'VALORANT UNIVERSITY CUP',
    gameSlug: 'valorant',
    image: '/images/Valorant.png',
    date: 'OCTOBER 28, 2023',
    time: '10:00',
    prizePool: 'KSH 75,000 PRIZE POOL',
    entryFee: 'KSH 500 / TEAM',
    status: 'LEAGUE',
    tags: ['VALORANT'],
    registrationLink: '#'
  },
  {
    id: '3',
    title: 'CALL OF DUTY MOBILE INVITATIONAL',
    gameSlug: 'call-of-duty-mobile',
    image: '/images/CODM-MP.png',
    date: 'NOVEMBER 05, 2023',
    time: '14:00',
    prizePool: 'KSH 200,000 PRIZE POOL',
    entryFee: 'INVITATION ONLY',
    status: 'PRO',
    tags: ['CALL OF DUTY'],
    detailsLink: '#'
  }
];

export const formatEventDate = (dateStr: string) => {
    // Helper to standardise date display if needed
    return dateStr;
};
