// Types for tournaments page data management
export interface GameInfo {
  id: string;
  name: string;
  slug: string;
  image: string;
  route: string;
  isActive: boolean;
  season: 'september' | 'january';
  category: 'main' | 'added';
  order: number;
}

export interface SeasonInfo {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export interface TournamentsPageData {
  seasons: SeasonInfo[];
  games: GameInfo[];
  lastUpdated: string;
}

// Default data structure
const defaultData: TournamentsPageData = {
  seasons: [
    {
      id: 'september-2025',
      name: 'september',
      title: 'KVE GAME TITLES',
      subtitle: 'September Season',
      description: 'The gaming titles being featured in the September Semester Period',
      image: '/images/September-Season.png',
      isActive: false,
      startDate: '2025-09-01',
      endDate: '2025-12-31'
    },
    {
      id: 'january-2026',
      name: 'january',
      title: 'KVE GAME TITLES',
      subtitle: 'January Season',
      description: 'The gaming titles being featured in the January Semester Period',
      image: '/images/January-Season.png',
      isActive: true,
      startDate: '2026-01-01',
      endDate: '2026-05-31'
    }
  ],
  games: [
    // September Season - Main Games
    {
      id: 'pubg-mobile-sep',
      name: 'PUBG Mobile',
      slug: 'pubg-mobile',
      image: 'https://c.animaapp.com/md9thhqb0sYxAU/img/pubgm-2.png',
      route: '/games/pubg-mobile',
      isActive: true,
      season: 'september',
      category: 'main',
      order: 1
    },
    
    {
      id: 'efootball-sep',
      name: 'eFootball Mobile',
      slug: 'efootball-mobile',
      image: '/images/Efootball-Mobile.png',
      route: '/games/efootball-mobile',
      isActive: true,
      season: 'september',
      category: 'main',
      order: 3
    },
    
    // January Season - Main Games
    {
      id: 'codm-mp-jan',
      name: 'CODM-Multiplayer',
      slug: 'codm-multiplayer',
      image: '/images/CODM-MP.png',
      route: '/games/codm-multiplayer',
      isActive: true,
      season: 'january',
      category: 'main',
      order: 1
    },
    {
      id: 'eafc-1v1-jan',
      name: 'EAFC-1V1',
      slug: 'eafc-1v1-open',
      image: '/images/EAFC-1-v1-Open.png',
      route: '/games/eafc-1v1-open',
      isActive: true,
      season: 'january',
      category: 'main',
      order: 2
    },
    
    // January Season - Added Games
    {
      id: 'fights-jan',
      name: 'Fights',
      slug: 'fighting-games',
      image: '/images/Fighting-Games-Open.png',
      route: '/games/fighting-games',
      isActive: true,
      season: 'january',
      category: 'added',
      order: 1
    },
    
    
    
  ],
  lastUpdated: new Date().toISOString()
};

// Data management functions
export const getTournamentsPageData = (): TournamentsPageData => {
  if (typeof window === 'undefined') {
    return defaultData;
  }
  
  try {
    const savedData = localStorage.getItem('tournamentsPageData');
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error('Error loading tournaments page data:', error);
  }
  
  return defaultData;
};

export const saveTournamentsPageData = (data: TournamentsPageData): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    const updatedData = { ...data, lastUpdated: new Date().toISOString() };
    localStorage.setItem('tournamentsPageData', JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error saving tournaments page data:', error);
  }
};

export const getActiveSeasons = (): SeasonInfo[] => {
  const data = getTournamentsPageData();
  return data.seasons.filter(season => season.isActive);
};

export const getSeasonGames = (seasonName: 'september' | 'january', category?: 'main' | 'added'): GameInfo[] => {
  const data = getTournamentsPageData();
  let games = data.games.filter(game => game.season === seasonName);
  
  if (category) {
    games = games.filter(game => game.category === category);
  }
  
  return games.sort((a, b) => a.order - b.order);
};

export const getActiveSeasonGames = (seasonName: 'september' | 'january', category?: 'main' | 'added'): GameInfo[] => {
  const data = getTournamentsPageData();
  let games = data.games.filter(game => game.season === seasonName && game.isActive);
  
  if (category) {
    games = games.filter(game => game.category === category);
  }
  
  return games.sort((a, b) => a.order - b.order);
};

export const getAllActiveGames = (): GameInfo[] => {
  const data = getTournamentsPageData();
  return data.games.filter(game => game.isActive).sort((a, b) => {
    // Sort by season first, then by category, then by order
    if (a.season !== b.season) {
      return a.season === 'september' ? -1 : 1;
    }
    if (a.category !== b.category) {
      return a.category === 'main' ? -1 : 1;
    }
    return a.order - b.order;
  });
};

export const getGameBySlug = (slug: string): GameInfo | undefined => {
  const data = getTournamentsPageData();
  return data.games.find(game => game.slug === slug);
};

export const updateGameStatus = (gameId: string, isActive: boolean): void => {
  const data = getTournamentsPageData();
  const updatedGames = data.games.map(game => 
    game.id === gameId ? { ...game, isActive } : game
  );
  saveTournamentsPageData({ ...data, games: updatedGames });
};

export const updateSeasonStatus = (seasonId: string, isActive: boolean): void => {
  const data = getTournamentsPageData();
  const updatedSeasons = data.seasons.map(season => 
    season.id === seasonId ? { ...season, isActive } : season
  );
  saveTournamentsPageData({ ...data, seasons: updatedSeasons });
};

// Utility functions for CMS
export const exportTournamentsData = (): string => {
  const data = getTournamentsPageData();
  return JSON.stringify(data, null, 2);
};

export const importTournamentsData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData) as TournamentsPageData;
    saveTournamentsPageData(data);
    return true;
  } catch (error) {
    console.error('Error importing tournaments data:', error);
    return false;
  }
};

export const resetToDefaultData = (): void => {
  saveTournamentsPageData(defaultData);
};