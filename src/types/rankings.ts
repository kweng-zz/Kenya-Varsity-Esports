/**
 * Game rankings types — shared between the public /rankings page,
 * the tournament-page previews and the admin Rankings Management UI.
 *
 * Data is stored in the Appwrite `game_category_rankings` collection.
 * One document = one player's standing in one game category.
 */

export interface RankingRow {
  id: string;
  rank: number;
  playerName: string;
  university: string;
  /** Tournament/game slug, e.g. "efootball-mobile" */
  categoryId: string;
  /** Game display name, e.g. "eFootball Mobile" */
  gameName: string;
  /** Score used for ordering — the single source of truth for a player's points */
  points: number;
  wins: number;
  losses: number;
  image?: string;
}

export interface RankingsGame {
  id: string;
  name: string;
  /** Short label for tabs/filters, e.g. "CODM Multiplayer" */
  shortName: string;
}

export interface RankingsData {
  games: RankingsGame[];
  rankings: RankingRow[];
}

/** Derive a compact game label for tabs and chips */
export function shortGameLabel(name: string): string {
  return name
    .replace(/^Call of Duty Mobile\s*/i, 'CODM ')
    .replace(/\s*Mobile$/i, '')
    .trim();
}
