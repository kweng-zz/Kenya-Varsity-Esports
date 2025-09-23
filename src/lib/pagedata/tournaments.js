// Default data structure
const defaultData = {
    seasons: [
        {
            id: 'september-2025',
            name: 'september',
            title: 'KUER SEASON 3 SEPTEMBER SEMESTER 2025',
            subtitle: 'September Season',
            description: 'The gaming titles being featured in the September Semester Period for 2025',
            image: '/images/September-Season.png',
            isActive: true,
            startDate: '2025-09-01',
            endDate: '2025-12-31'
        },
        {
            id: 'january-2026',
            name: 'january',
            title: 'KUER SEASON 3 JANUARY SEMESTER 2026',
            subtitle: 'January Season',
            description: 'The gaming titles being featured in the January Semester Period for 2026',
            image: '/images/January-Season.png',
            isActive: false,
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
            id: 'codm-br-sep',
            name: 'Call of Duty Mobile BR',
            slug: 'call-of-duty-mobile-br',
            image: '/images/CODM-BR.png',
            route: '/games/call-of-duty-mobile-br',
            isActive: true,
            season: 'september',
            category: 'main',
            order: 2
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
        // September Season - Added Games
        {
            id: 'free-fire-sep',
            name: 'Free Fire',
            slug: 'free-fire',
            image: 'https://c.animaapp.com/md9thhqb0sYxAU/img/free-fire.png',
            route: '/games/free-fire',
            isActive: true,
            season: 'september',
            category: 'added',
            order: 1
        },
        {
            id: 'bloodstrike-sep',
            name: 'Bloodstrike',
            slug: 'bloodstrike',
            image: '/images/Bloodstrike.png',
            route: '/games/bloodstrike',
            isActive: true,
            season: 'september',
            category: 'added',
            order: 2
        },
        {
            id: 'chess-sep',
            name: 'Chess',
            slug: 'chess',
            image: '/images/Chess.png',
            route: '/games/chess',
            isActive: true,
            season: 'september',
            category: 'added',
            order: 3
        },
        {
            id: 'ea-fc-2v2-sep',
            name: 'EA-FC 2V2',
            slug: 'ea-fc-2v2',
            image: '/images/EAFC--Open.png',
            route: '/games/ea-fc-2v2',
            isActive: true,
            season: 'september',
            category: 'added',
            order: 4
        },
        // January Season - Main Games
        {
            id: 'codm-mp-jan',
            name: 'CODM-Multiplayer',
            slug: 'codm-multiplayer',
            image: '/images/CODM-MP.png',
            route: '/games/codm-multiplayer',
            isActive: false,
            season: 'january',
            category: 'main',
            order: 1
        },
        {
            id: 'eafc-1v1-jan',
            name: 'EAFC-1V1',
            slug: 'EAFC-1-v1-Open',
            image: '/images/EAFC-1-v1-Open.png',
            route: '/games/EAFC-1-v1-Open',
            isActive: false,
            season: 'january',
            category: 'main',
            order: 2
        },
        {
            id: 'eafc-women-jan',
            name: 'EAFC-WOMEN',
            slug: 'EAFC-Women',
            image: '/images/EAFC-Women.png',
            route: '/games/EAFC-Women',
            isActive: false,
            season: 'january',
            category: 'main',
            order: 3
        },
        // January Season - Added Games
        {
            id: 'fights-jan',
            name: 'Fights',
            slug: 'fights',
            image: '/images/Fighting-Games-Open.png',
            route: '/games/fights',
            isActive: false,
            season: 'january',
            category: 'added',
            order: 1
        },
        {
            id: 'fights-women-jan',
            name: 'Fights-Women',
            slug: 'fightgames-women',
            image: '/images/Fighting-Games-Women.png',
            route: '/games/fightgames-women',
            isActive: false,
            season: 'january',
            category: 'added',
            order: 2
        },
        {
            id: 'valorant-jan',
            name: 'Valorant',
            slug: 'valorant',
            image: '/images/Valorant.png',
            route: '/games/valorant',
            isActive: false,
            season: 'january',
            category: 'added',
            order: 3
        },
        {
            id: 'rocket-league-jan',
            name: 'Rocket League',
            slug: 'rocketleague',
            image: '/images/Rocket-League.png',
            route: '/games/rocketleague',
            isActive: false,
            season: 'january',
            category: 'added',
            order: 4
        },
        {
            id: 'nba2k-jan',
            name: 'NBA2K',
            slug: 'nba2k',
            image: '/images/NBA2k.png',
            route: '/games/nba2k',
            isActive: false,
            season: 'january',
            category: 'added',
            order: 5
        }
    ],
    lastUpdated: new Date().toISOString()
};
// Data management functions
export const getTournamentsPageData = () => {
    if (typeof window === 'undefined') {
        return defaultData;
    }
    try {
        const savedData = localStorage.getItem('tournamentsPageData');
        if (savedData) {
            return JSON.parse(savedData);
        }
    }
    catch (error) {
        console.error('Error loading tournaments page data:', error);
    }
    return defaultData;
};
export const saveTournamentsPageData = (data) => {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        const updatedData = { ...data, lastUpdated: new Date().toISOString() };
        localStorage.setItem('tournamentsPageData', JSON.stringify(updatedData));
    }
    catch (error) {
        console.error('Error saving tournaments page data:', error);
    }
};
export const getActiveSeasons = () => {
    const data = getTournamentsPageData();
    return data.seasons.filter(season => season.isActive);
};
export const getSeasonGames = (seasonName, category) => {
    const data = getTournamentsPageData();
    let games = data.games.filter(game => game.season === seasonName);
    if (category) {
        games = games.filter(game => game.category === category);
    }
    return games.sort((a, b) => a.order - b.order);
};
export const getActiveSeasonGames = (seasonName, category) => {
    const data = getTournamentsPageData();
    let games = data.games.filter(game => game.season === seasonName && game.isActive);
    if (category) {
        games = games.filter(game => game.category === category);
    }
    return games.sort((a, b) => a.order - b.order);
};
export const getAllActiveGames = () => {
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
export const getGameBySlug = (slug) => {
    const data = getTournamentsPageData();
    return data.games.find(game => game.slug === slug);
};
export const updateGameStatus = (gameId, isActive) => {
    const data = getTournamentsPageData();
    const updatedGames = data.games.map(game => game.id === gameId ? { ...game, isActive } : game);
    saveTournamentsPageData({ ...data, games: updatedGames });
};
export const updateSeasonStatus = (seasonId, isActive) => {
    const data = getTournamentsPageData();
    const updatedSeasons = data.seasons.map(season => season.id === seasonId ? { ...season, isActive } : season);
    saveTournamentsPageData({ ...data, seasons: updatedSeasons });
};
// Utility functions for CMS
export const exportTournamentsData = () => {
    const data = getTournamentsPageData();
    return JSON.stringify(data, null, 2);
};
export const importTournamentsData = (jsonData) => {
    try {
        const data = JSON.parse(jsonData);
        saveTournamentsPageData(data);
        return true;
    }
    catch (error) {
        console.error('Error importing tournaments data:', error);
        return false;
    }
};
export const resetToDefaultData = () => {
    saveTournamentsPageData(defaultData);
};
