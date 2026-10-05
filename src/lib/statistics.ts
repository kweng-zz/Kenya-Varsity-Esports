import { readdirSync, readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import matter from 'gray-matter';

const STATISTICS_DIR = resolve(process.cwd(), 'content/statistics');

export interface StatItem {
  id: string;
  number: string;
  label: string;
}

export interface StatisticsData {
  seasonTitle: string;
  image: string;
  seasonNumber: number;
  stats: StatItem[];
}

function readStatisticsData(): StatisticsData {
  const filePath = join(STATISTICS_DIR, 'season-stats.md');
  
  if (!existsSync(filePath)) {
    // Return default data if file doesn't exist
    return {
      seasonTitle: 'STATISTICS OF SEASON 3',
      image: '/images/Join our tournaments.png',
      seasonNumber: 3,
      stats: [
        { id: '1', number: '50+', label: 'Universities\nParticipating' },
        { id: '2', number: '1000+', label: 'Active\nPlayers' },
        { id: '3', number: '25+', label: 'Tournaments\nCompleted' },
        { id: '4', number: '100K+', label: 'Prize Pool\nDistributed' },
        { id: '5', number: '15+', label: 'Game\nTitles' },
      ],
    };
  }

  const fileContent = readFileSync(filePath, 'utf-8');
  const { data } = matter(fileContent);

  return {
    seasonTitle: data.seasonTitle || 'STATISTICS OF SEASON 3',
    image: data.image || '/images/Join our tournaments.png',
    seasonNumber: data.seasonNumber || 3,
    stats: data.stats || [
      { id: '1', number: '50+', label: 'Universities\nParticipating' },
      { id: '2', number: '1000+', label: 'Active\nPlayers' },
      { id: '3', number: '25+', label: 'Tournaments\nCompleted' },
      { id: '4', number: '100K+', label: 'Prize Pool\nDistributed' },
      { id: '5', number: '15+', label: 'Game\nTitles' },
    ],
  };
}

export function getStatistics(): StatisticsData {
  return readStatisticsData();
}