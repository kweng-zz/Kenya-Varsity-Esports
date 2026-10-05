import { readdirSync, readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import matter from 'gray-matter';

const GAMES_DIR = resolve(process.cwd(), 'content/games');

export interface Game {
  id: string;
  name: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  isActive: boolean;
  order: number;
  mode: string;
}

function readGamesData(): { games: Game[] } {
  const filePath = join(GAMES_DIR, 'active-games.md');
  
  if (!existsSync(filePath)) {
    return {
      games: [
        {
          id: "efootball-mobile",
          name: "eFootball Mobile",
          slug: "efootball-mobile",
          title: "EFOOTBALL MOBILE RANKINGS",
          description: "Current standings for eFootball Mobile tournament",
          image: "/images/efootball-mobile.webp",
          isActive: true,
          order: 1,
          mode: "mobile"
        },
        {
          id: "codm-mp",
          name: "CODM MP",
          slug: "codm-mp",
          title: "CODM MP RANKINGS",
          description: "Current standings for Call of Duty Mobile Multiplayer tournament",
          image: "/images/codm-mp.webp",
          isActive: true,
          order: 2,
          mode: "multiplayer"
        },
        {
          id: "codm-1v1",
          name: "CODM 1v1",
          slug: "codm-1v1",
          title: "CODM 1V1 RANKINGS",
          description: "Current standings for Call of Duty Mobile 1v1 tournament",
          image: "/images/codm-1v1.webp",
          isActive: true,
          order: 3,
          mode: "1v1"
        },
        {
          id: "pubg",
          name: "PUBG",
          slug: "pubg",
          title: "PUBG RANKINGS",
          description: "Current standings for PUBG tournament",
          image: "/images/pubg.webp",
          isActive: true,
          order: 4,
          mode: "battle-royale"
        }
      ],
    };
  }

  const fileContent = readFileSync(filePath, 'utf-8');
  const { data } = matter(fileContent);

  return {
    games: data.games || [],
  };
}

export function getActiveGames(): Game[] {
  return readGamesData().games
    .filter(g => g.isActive)
    .sort((a, b) => a.order - b.order);
}

export function getGameById(id: string): Game | undefined {
  return getActiveGames().find(g => g.id === id);
}

export function getGameBySlug(slug: string): Game | undefined {
  return getActiveGames().find(g => g.slug === slug);
}