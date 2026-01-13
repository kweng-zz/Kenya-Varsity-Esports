/**
 * Centralized Season Configuration
 * Update this file when a new season starts
 * All ranking components will automatically reflect the changes
 */

export const CURRENT_SEASON = {
  number: 3,
  name: 'SEASON 3',
  currentSemester: 'january',
  upcomingSemester: 'september',
} as const;

export const SEASON_SEMESTERS = {
  september: {
    name: 'September',
    // Full formatted title with HTML-like structure for display
    titleParts: {
      part1: 'KUER',
      part2: 'SEASON 3',
      part3: 'OVERALL RANKINGS PER GAME CATEGORY',
    },
    description: 'Current game category rankings for the September semester',
  },
  january: {
    name: 'January',
    titleParts: {
      part1: 'KUER',
      part2: 'SEASON 3',
      part3: 'OVERALL RANKINGS PER GAME CATEGORY',
    },
    description: 'Current game category rankings for the January semester',
  },
} as const;

export const SEASON_REGIONAL = {
  titleParts: {
    part1: 'KUER',
    part2: 'SEASON 3',
    part3: 'OVERALL REGIONAL RANKINGS',
  },
} as const;

export const SEASON_GENERAL = {
  titleParts: {
    part1: 'KUER',
    part2: 'SEASON 3',
    part3: 'OVERALL RANKINGS',
  },
} as const;

/**
 * How to update for a new season:
 * 1. Change CURRENT_SEASON.number to the new season number
 * 2. Change CURRENT_SEASON.name to the new season name (e.g., 'SEASON 4')
 * 3. Update all titleParts.part2 values to the new season name
 * 4. All components will automatically update
 */
