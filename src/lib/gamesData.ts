export interface GameRules {
  tournamentType: 'individual' | 'duo' | 'team';
  minTeamSize: number;
  maxTeamSize: number;
  allowSubstitutes?: boolean;
  maxSubstitutes?: number;
  registrationRequirements?: {
    requireStudentId?: boolean;
    requireUniversity?: boolean;
    requirePhoneNumber?: boolean;
    minimumAge?: number;
  };
  gameSpecificRules?: {
    allowedPlatforms?: string[];
    skillLevelRequired?: 'beginner' | 'intermediate' | 'advanced' | 'any';
    additionalFields?: Array<{
      name: string;
      type: 'text' | 'select' | 'number';
      required: boolean;
      label: string;
      options?: string[];
    }>;
  };
}

export interface Game {
  name: string;
  image: string;
  description: string;
  category: string;
  platform: string;
  season: string;
  slug: string;
  featured?: boolean;
  comingSoon?: boolean;
  rules: GameRules;
  captainWhatsappLink?: string;
}

export const gamesData: Record<string, Game> = {
  "pubg-mobile": {
    name: "PUBG Mobile",
    slug: "pubg-mobile",
    image: "https://c.animaapp.com/md9thhqb0sYxAU/img/pubgm-2.png",
    description: "PlayerUnknown's Battlegrounds Mobile is a battle royale game where 100 players fight to be the last one standing on a shrinking map. Experience intense combat, strategic gameplay, and team coordination in this mobile adaptation of the popular PC game.",
    category: "Battle Royale",
    platform: "Mobile",
    season: "September 2025",
    featured: true,
    rules: {
      tournamentType: 'team',
      minTeamSize: 4,
      maxTeamSize: 4,
      allowSubstitutes: true,
      maxSubstitutes: 2,
      registrationRequirements: {
        requireStudentId: true,
        requireUniversity: true,
        requirePhoneNumber: true,
        minimumAge: 16
      },
      gameSpecificRules: {
        allowedPlatforms: ['Mobile'],
        skillLevelRequired: 'any',
        additionalFields: [
          {
            name: 'in_game_id',
            type: 'text',
            required: true,
            label: 'PUBG Mobile Player ID'
          },
          {
            name: 'preferred_server',
            type: 'select',
            required: true,
            label: 'Preferred Server',
            options: ['Asia', 'Europe', 'North America', 'South America']
          }
        ]
      }
    },
    captainWhatsappLink: "https://chat.whatsapp.com/pubg-mobile-captains"
  },
  "call-of-duty-mobile-br": {
    name: "Call of Duty Mobile BR",
    slug: "call-of-duty-mobile-br",
    image: "/images/CODM-BR.png",
    description: "Call of Duty Mobile Battle Royale brings the iconic franchise to mobile devices with intense multiplayer action. Fight across familiar maps with classic weapons and vehicles in this fast-paced battle royale experience.",
    category: "Battle Royale",
    platform: "Mobile",
    season: "September 2025",
    featured: true,
    rules: {
      tournamentType: 'team',
      minTeamSize: 4,
      maxTeamSize: 4,
      allowSubstitutes: true,
      maxSubstitutes: 2,
      registrationRequirements: {
        requireStudentId: true,
        requireUniversity: true,
        requirePhoneNumber: true,
        minimumAge: 16
      },
      gameSpecificRules: {
        allowedPlatforms: ['Mobile'],
        skillLevelRequired: 'any',
        additionalFields: [
          {
            name: 'in_game_id',
            type: 'text',
            required: true,
            label: 'COD Mobile Player ID'
          },
          {
            name: 'preferred_mode',
            type: 'select',
            required: true,
            label: 'Preferred Game Mode',
            options: ['Battle Royale', 'Multiplayer', 'Both']
          }
        ]
      }
    },
    captainWhatsappLink: "https://chat.whatsapp.com/codm-br-captains"
  },
  "efootball-mobile": {
    name: "eFootball Mobile",
    slug: "efootball-mobile",
    image: "/images/Efootball-Mobile.png",
    description: "eFootball Mobile is the mobile version of the popular football simulation game. Experience realistic football gameplay with authentic teams, players, and stadiums in competitive matches.",
    category: "Sports",
    platform: "Mobile",
    season: "September 2025",
    featured: true,
    rules: {
      tournamentType: 'individual',
      minTeamSize: 1,
      maxTeamSize: 1,
      allowSubstitutes: false,
      maxSubstitutes: 0,
      registrationRequirements: {
        requireStudentId: true,
        requireUniversity: true,
        requirePhoneNumber: true,
        minimumAge: 16
      },
      gameSpecificRules: {
        allowedPlatforms: ['Mobile'],
        skillLevelRequired: 'any',
        additionalFields: [
          {
            name: 'in_game_username',
            type: 'text',
            required: true,
            label: 'eFootball Username'
          },
          {
            name: 'player_id',
            type: 'text',
            required: true,
            label: 'Player ID'
          },
          {
            name: 'preferred_team',
            type: 'select',
            required: false,
            label: 'Preferred Team',
            options: ['Barcelona', 'Real Madrid', 'Manchester United', 'Liverpool', 'Bayern Munich', 'Juventus', 'PSG', 'Other']
          },
          {
            name: 'skill_level',
            type: 'select',
            required: true,
            label: 'Skill Level',
            options: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
          }
        ]
      }
    },
    captainWhatsappLink: "https://chat.whatsapp.com/efootball-mobile-captains"
  },
  "free-fire": {
    name: "Free Fire",
    slug: "free-fire",
    image: "https://c.animaapp.com/md9thhqb0sYxAU/img/free-fire.png",
    description: "Free Fire is a battle royale game designed for mobile devices with fast-paced 10-minute matches. Each game features 50 players landing on a remote island where they must fight to be the last one standing.",
    category: "Battle Royale",
    platform: "Mobile",
    season: "September 2025",
    rules: {
      tournamentType: 'team',
      minTeamSize: 4,
      maxTeamSize: 4,
      allowSubstitutes: true,
      maxSubstitutes: 2,
      registrationRequirements: {
        requireStudentId: true,
        requireUniversity: true,
        requirePhoneNumber: true,
        minimumAge: 16
      },
      gameSpecificRules: {
        allowedPlatforms: ['Mobile'],
        skillLevelRequired: 'any',
        additionalFields: []
      }
    },
    captainWhatsappLink: "https://chat.whatsapp.com/free-fire-captains"
  },
  "fortnite": {
    name: "Fortnite",
    slug: "fortnite",
    image: "https://c.animaapp.com/md9thhqb0sYxAU/img/fortnight.png",
    description: "Fortnite is a battle royale game with unique building mechanics and creative gameplay. Build structures, gather resources, and outlast opponents in this colorful and dynamic gaming experience.",
    category: "Battle Royale",
    platform: "Cross-platform",
    season: "September 2025",
    rules: {
      tournamentType: 'team',
      minTeamSize: 4,
      maxTeamSize: 4,
      allowSubstitutes: true,
      maxSubstitutes: 2,
      registrationRequirements: {
        requireStudentId: true,
        requireUniversity: true,
        requirePhoneNumber: true,
        minimumAge: 16
      },
      gameSpecificRules: {
        allowedPlatforms: ['PC', 'Console', 'Mobile'],
        skillLevelRequired: 'any',
        additionalFields: []
      }
    },
    captainWhatsappLink: "https://chat.whatsapp.com/fortnite-captains"
  },
  "bloodstrike": {
    name: "Bloodstrike",
    slug: "bloodstrike",
    image: "/images/Bloodstrike.png",
    description: "Bloodstrike is a competitive first-person shooter with tactical gameplay. Experience intense team-based combat with strategic elements and skill-based gunplay.",
    category: "FPS",
    platform: "Mobile",
    season: "September 2025",
    rules: {
      tournamentType: 'team',
      minTeamSize: 5,
      maxTeamSize: 5,
      allowSubstitutes: true,
      maxSubstitutes: 2,
      registrationRequirements: {
        requireStudentId: true,
        requireUniversity: true,
        requirePhoneNumber: true,
        minimumAge: 16
      },
      gameSpecificRules: {
        allowedPlatforms: ['Mobile'],
        skillLevelRequired: 'any',
        additionalFields: []
      }
    },
    captainWhatsappLink: "https://chat.whatsapp.com/bloodstrike-captains"
  },
  "chess": {
    name: "Chess",
    slug: "chess",
    image: "/images/Chess.png",
    description: "The classic strategy game of Chess, bringing intellectual competition to esports. Test your strategic thinking and tactical skills in this timeless game of minds.",
    category: "Strategy",
    platform: "Cross-platform",
    season: "September 2025",
    rules: {
      tournamentType: 'individual',
      minTeamSize: 1,
      maxTeamSize: 1,
      allowSubstitutes: false,
      maxSubstitutes: 0,
      registrationRequirements: {
        requireStudentId: true,
        requireUniversity: true,
        requirePhoneNumber: true,
        minimumAge: 16
      },
      gameSpecificRules: {
        allowedPlatforms: ['PC', 'Mobile', 'Web'],
        skillLevelRequired: 'any',
        additionalFields: []
      }
    },
    captainWhatsappLink: "https://chat.whatsapp.com/chess-captains"
  },
  "ea-fc-2v2": {
    name: "EA FC 2V2",
    slug: "ea-fc-2v2",
    image: "/images/EAFC--Open.png",
    description: "EA FC 2V2 brings competitive football gaming in a 2-versus-2 format. Experience fast-paced football action with smaller teams and intense gameplay.",
    category: "Sports",
    platform: "Console/PC",
    season: "September 2025",
    rules: {
      tournamentType: 'duo',
      minTeamSize: 2,
      maxTeamSize: 2,
      allowSubstitutes: true,
      maxSubstitutes: 1,
      registrationRequirements: {
        requireStudentId: true,
        requireUniversity: true,
        requirePhoneNumber: true,
        minimumAge: 16
      },
      gameSpecificRules: {
        allowedPlatforms: ['PlayStation', 'Xbox', 'PC'],
        skillLevelRequired: 'any',
        additionalFields: [
          {
            name: 'platform',
            type: 'select',
            required: true,
            label: 'Gaming Platform',
            options: ['PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 'Xbox One', 'PC (Steam)', 'PC (Epic Games)']
          },
          {
            name: 'ea_account',
            type: 'text',
            required: true,
            label: 'EA Account Username'
          },
          {
            name: 'skill_rating',
            type: 'select',
            required: false,
            label: 'Current Skill Rating',
            options: ['Division 10', 'Division 9', 'Division 8', 'Division 7', 'Division 6', 'Division 5', 'Division 4', 'Division 3', 'Division 2', 'Division 1', 'Elite']
          }
        ]
      }
    },
    captainWhatsappLink: "https://chat.whatsapp.com/ea-fc-2v2-captains"
  },
  "call-of-duty": {
    name: "Call of Duty",
    slug: "call-of-duty",
    image: "/images/CODM-MP.png",
    description: "Call of Duty tournament featuring various game modes and competitive play. Experience intense tactical combat in this premier FPS competition.",
    category: "FPS",
    platform: "Mobile",
    season: "September 2025",
    featured: true,
    rules: {
      tournamentType: 'team',
      minTeamSize: 4,
      maxTeamSize: 4,
      allowSubstitutes: true,
      maxSubstitutes: 2,
      registrationRequirements: {
        requireStudentId: true,
        requireUniversity: true,
        requirePhoneNumber: true,
        minimumAge: 16
      },
      gameSpecificRules: {
        allowedPlatforms: ['Mobile'],
        skillLevelRequired: 'any',
        additionalFields: []
      }
    },
    captainWhatsappLink: "https://chat.whatsapp.com/call-of-duty-captains"
  },
  "codm-multiplayer": {
    name: "CODM Multiplayer",
    slug: "codm-multiplayer",
    image: "/images/CODM-MP.png",
    description: "Call of Duty Mobile Multiplayer features classic competitive modes and maps. Engage in team-based combat across various game modes with iconic weapons and equipment.",
    category: "FPS",
    platform: "Mobile",
    season: "January 2026",
    rules: {
      tournamentType: 'team',
      minTeamSize: 5,
      maxTeamSize: 5,
      allowSubstitutes: true,
      maxSubstitutes: 2,
      registrationRequirements: {
        requireStudentId: true,
        requireUniversity: true,
        requirePhoneNumber: true,
        minimumAge: 16
      },
      gameSpecificRules: {
        allowedPlatforms: ['Mobile'],
        skillLevelRequired: 'any',
        additionalFields: []
      }
    },
    captainWhatsappLink: "https://chat.whatsapp.com/codm-multiplayer-captains"
  },
  "eafc-1v1-open": {
    name: "EAFC 1V1",
    slug: "eafc-1v1-open",
    image: "/images/EAFC-1-v1-Open.png",
    description: "EA FC 1V1 Open brings individual skill-based football competition. Test your abilities in one-on-one matches that showcase pure football gaming talent.",
    category: "Sports",
    platform: "Console/PC",
    season: "January 2026",
    rules: {
      tournamentType: 'individual',
      minTeamSize: 1,
      maxTeamSize: 1,
      allowSubstitutes: false,
      maxSubstitutes: 0,
      registrationRequirements: {
        requireStudentId: true,
        requireUniversity: true,
        requirePhoneNumber: true,
        minimumAge: 16
      },
      gameSpecificRules: {
        allowedPlatforms: ['PlayStation', 'Xbox', 'PC'],
        skillLevelRequired: 'any',
        additionalFields: [
          {
            name: 'platform',
            type: 'select',
            required: true,
            label: 'Gaming Platform',
            options: ['PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 'Xbox One', 'PC (Steam)', 'PC (Epic Games)']
          },
          {
            name: 'ea_account',
            type: 'text',
            required: true,
            label: 'EA Account Username'
          },
          {
            name: 'skill_rating',
            type: 'select',
            required: false,
            label: 'Current Skill Rating',
            options: ['Division 10', 'Division 9', 'Division 8', 'Division 7', 'Division 6', 'Division 5', 'Division 4', 'Division 3', 'Division 2', 'Division 1', 'Elite']
          }
        ]
      }
    },
    captainWhatsappLink: "https://chat.whatsapp.com/eafc-1v1-captains"
  },
  "eafc-women": {
    name: "EAFC Women",
    slug: "eafc-women",
    image: "/images/EAFC-Women.png",
    description: "EA FC Women's tournament celebrates female participation in esports. Compete in dedicated women's football gaming competitions with equal recognition and prizes.",
    category: "Sports",
    platform: "Console/PC",
    season: "January 2026",
    rules: {
      tournamentType: 'individual',
      minTeamSize: 1,
      maxTeamSize: 1,
      allowSubstitutes: false,
      maxSubstitutes: 0,
      registrationRequirements: {
        requireStudentId: true,
        requireUniversity: true,
        requirePhoneNumber: true,
        minimumAge: 16
      },
      gameSpecificRules: {
        allowedPlatforms: ['PlayStation', 'Xbox', 'PC'],
        skillLevelRequired: 'any',
        additionalFields: []
      }
    },
    captainWhatsappLink: "https://chat.whatsapp.com/eafc-women-captains"
  },
  "valorant": {
    name: "Valorant",
    slug: "valorant",
    image: "/images/Valorant.png",
    description: "Valorant is a tactical first-person shooter with unique agent abilities. Combine precise gunplay with strategic agent abilities in this competitive 5v5 tactical shooter.",
    category: "FPS",
    platform: "PC",
    season: "January 2026",
    rules: {
      tournamentType: 'team',
      minTeamSize: 5,
      maxTeamSize: 5,
      allowSubstitutes: true,
      maxSubstitutes: 2,
      registrationRequirements: {
        requireStudentId: true,
        requireUniversity: true,
        requirePhoneNumber: true,
        minimumAge: 16
      },
      gameSpecificRules: {
        allowedPlatforms: ['PC'],
        skillLevelRequired: 'any',
        additionalFields: []
      }
    },
    captainWhatsappLink: "https://chat.whatsapp.com/valorant-captains"
  },
  "rocket-league": {
    name: "Rocket League",
    slug: "rocket-league",
    image: "/images/Rocket-League.png",
    description: "Rocket League combines soccer with rocket-powered cars in this unique sports game. Master aerial maneuvers and team coordination in this fast-paced vehicular soccer experience.",
    category: "Sports",
    platform: "Cross-platform",
    season: "January 2026",
    rules: {
      tournamentType: 'team',
      minTeamSize: 3,
      maxTeamSize: 3,
      allowSubstitutes: true,
      maxSubstitutes: 1,
      registrationRequirements: {
        requireStudentId: true,
        requireUniversity: true,
        requirePhoneNumber: true,
        minimumAge: 16
      },
      gameSpecificRules: {
        allowedPlatforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'],
        skillLevelRequired: 'any',
        additionalFields: []
      }
    },
    captainWhatsappLink: "https://chat.whatsapp.com/rocket-league-captains"
  },
  "nba2k": {
    name: "NBA 2K",
    slug: "nba2k",
    image: "/images/NBA2k.png",
    description: "NBA 2K brings authentic basketball simulation to esports. Experience realistic basketball gameplay with official NBA teams, players, and arenas.",
    category: "Sports",
    platform: "Console/PC",
    season: "January 2026",
    rules: {
      tournamentType: 'team',
      minTeamSize: 5,
      maxTeamSize: 5,
      allowSubstitutes: true,
      maxSubstitutes: 2,
      registrationRequirements: {
        requireStudentId: true,
        requireUniversity: true,
        requirePhoneNumber: true,
        minimumAge: 16
      },
      gameSpecificRules: {
        allowedPlatforms: ['PC', 'PlayStation', 'Xbox'],
        skillLevelRequired: 'any',
        additionalFields: []
      }
    },
    captainWhatsappLink: "https://chat.whatsapp.com/nba2k-captains"
  },
  "fighting-games": {
    name: "Fighting Games",
    slug: "fighting-games",
    image: "/images/Fighting-Games-Open.png",
    description: "Fighting Games tournament features various fighting game titles. Showcase your skills in classic and modern fighting games with precise inputs and strategic combat.",
    category: "Fighting",
    platform: "Console/PC",
    season: "January 2026",
    rules: {
      tournamentType: 'individual',
      minTeamSize: 1,
      maxTeamSize: 1,
      allowSubstitutes: false,
      maxSubstitutes: 0,
      registrationRequirements: {
        requireStudentId: true,
        requireUniversity: true,
        requirePhoneNumber: true,
        minimumAge: 16
      },
      gameSpecificRules: {
        allowedPlatforms: ['PC', 'PlayStation', 'Xbox'],
        skillLevelRequired: 'any',
        additionalFields: []
      }
    },
    captainWhatsappLink: "https://chat.whatsapp.com/fighting-games-captains"
  },
  "fighting-games-women": {
    name: "Fighting Games Women",
    slug: "fighting-games-women",
    image: "/images/Fighting-Games-Women.png",
    description: "Fighting Games Women's tournament promotes female participation in the fighting game community. Compete in dedicated women's fighting game competitions.",
    category: "Fighting",
    platform: "Console/PC",
    season: "January 2026",
    rules: {
      tournamentType: 'individual',
      minTeamSize: 1,
      maxTeamSize: 1,
      allowSubstitutes: false,
      maxSubstitutes: 0,
      registrationRequirements: {
        requireStudentId: true,
        requireUniversity: true,
        requirePhoneNumber: true,
        minimumAge: 16
      },
      gameSpecificRules: {
        allowedPlatforms: ['PC', 'PlayStation', 'Xbox'],
        skillLevelRequired: 'any',
        additionalFields: []
      }
    },
    captainWhatsappLink: "https://chat.whatsapp.com/fighting-games-women-captains"
  },
  // Coming Soon Games
  "ea-wrc": {
    name: "EA WRC",
    slug: "ea-wrc",
    image: "/images/EA-WRC.png",
    description: "EA WRC brings rally racing to the esports scene. Experience authentic rally racing with realistic physics and challenging courses.",
    category: "Racing",
    platform: "Console/PC",
    season: "Future",
    comingSoon: true,
    rules: {
      tournamentType: 'individual',
      minTeamSize: 1,
      maxTeamSize: 1,
      allowSubstitutes: false,
      maxSubstitutes: 0,
      registrationRequirements: {
        requireStudentId: true,
        requireUniversity: true,
        requirePhoneNumber: true,
        minimumAge: 16
      },
      gameSpecificRules: {
        allowedPlatforms: ['PC', 'PlayStation', 'Xbox'],
        skillLevelRequired: 'any',
        additionalFields: []
      }
    },
    captainWhatsappLink: "https://chat.whatsapp.com/ea-wrc-captains"
  },
  "mobile-legends": {
    name: "Mobile Legends",
    slug: "mobile-legends",
    image: "/images/Mobile-Legends.png",
    description: "Mobile Legends: Bang Bang is a mobile MOBA game with fast-paced 5v5 battles. Choose from diverse heroes and engage in strategic team-based combat.",
    category: "MOBA",
    platform: "Mobile",
    season: "Future",
    comingSoon: true,
    rules: {
      tournamentType: 'team',
      minTeamSize: 5,
      maxTeamSize: 5,
      allowSubstitutes: true,
      maxSubstitutes: 2,
      registrationRequirements: {
        requireStudentId: true,
        requireUniversity: true,
        requirePhoneNumber: true,
        minimumAge: 16
      },
      gameSpecificRules: {
        allowedPlatforms: ['Mobile'],
        skillLevelRequired: 'any',
        additionalFields: []
      }
    },
    captainWhatsappLink: "https://chat.whatsapp.com/mobile-legends-captains"
  }
};

export const getAllGames = (): Game[] => {
  return Object.values(gamesData);
};

export const getGameBySlug = (slug: string): Game | undefined => {
  return gamesData[slug];
};

export const getFeaturedGames = (): Game[] => {
  return Object.values(gamesData).filter(game => game.featured);
};

export const getGamesByCategory = (category: string): Game[] => {
  return Object.values(gamesData).filter(game => game.category === category);
};

export const getGamesBySeason = (season: string): Game[] => {
  return Object.values(gamesData).filter(game => game.season === season);
};

export const getComingSoonGames = (): Game[] => {
  return Object.values(gamesData).filter(game => game.comingSoon);
};