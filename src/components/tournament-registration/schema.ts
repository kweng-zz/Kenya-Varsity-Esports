import { z } from 'zod';
import { Game, GameRules } from '@/lib/gamesData';

// Base player information schema
export const PlayerInfoSchema = z.object({
  name: z.string().min(1, 'Player name is required'),
  studentId: z.string().min(1, 'Student ID is required'),
  university: z.string().min(1, 'University is required'),
  inGameId: z.string().optional(),
  additionalInfo: z.string().optional(),
});

export type PlayerInfo = z.infer<typeof PlayerInfoSchema>;

// Team data structure for players field
export const TeamDataSchema = z.object({
  players: z.array(PlayerInfoSchema),
  substitutes: z.array(PlayerInfoSchema),
});

export type TeamData = z.infer<typeof TeamDataSchema>;

// Game-specific additional fields schema
const createGameSpecificSchema = (game: Game) => {
  const fields: Record<string, z.ZodTypeAny> = {};
  
  if (game.rules.gameSpecificRules?.additionalFields) {
    for (const field of game.rules.gameSpecificRules.additionalFields) {
      switch (field.type) {
        case 'text':
          fields[field.name] = field.required 
            ? z.string().min(1, `${field.label} is required`)
            : z.string().optional();
          break;
        case 'select':
          if (field.required && field.options && field.options.length > 0) {
            fields[field.name] = z.enum(field.options as [string, ...string[]]);
          } else if (field.options && field.options.length > 0) {
            fields[field.name] = z.enum(field.options as [string, ...string[]]).optional();
          }
          break;
        case 'number':
          fields[field.name] = field.required 
            ? z.number().min(1, `${field.label} is required`)
            : z.number().optional();
          break;
      }
    }
  }
  
  return z.object(fields);
};

// Dynamic form schema based on game rules
export const createTournamentRegistrationSchema = (game: Game) => {
  const isIndividual = game.rules.tournamentType === 'individual';
  const isDuo = game.rules.tournamentType === 'duo';
  
  // Base schema fields
  const baseFields: z.ZodRawShape = {
    tournamentId: z.string().min(1, 'Tournament selection is required'),
    teamName: z.string().optional(),
    additionalInfo: z.string().optional(),
  };

  // Add game-specific fields
  const gameSpecificFields = createGameSpecificSchema(game);
  
  // For team-based tournaments, validate players
  let playersValidation: z.ZodTypeAny = z.undefined().optional();
  
  if (!isIndividual) {
    const requiredPlayerCount = game.rules.minTeamSize - 1; // Excluding captain
    const maxPlayerCount = game.rules.maxTeamSize - 1; // Excluding captain
    const maxSubstitutes = game.rules.maxSubstitutes || 0;
    
    playersValidation = z.object({
      players: z.array(PlayerInfoSchema)
        .min(requiredPlayerCount, `At least ${requiredPlayerCount} additional players required`)
        .max(maxPlayerCount, `Maximum ${maxPlayerCount} additional players allowed`),
      substitutes: z.array(PlayerInfoSchema)
        .max(maxSubstitutes, `Maximum ${maxSubstitutes} substitutes allowed`),
    }).refine(
      (data) => {
        // Check that all players have required fields
        const allPlayersValid = data.players.every(p => 
          p.name.trim() !== '' && p.studentId.trim() !== '' && p.university.trim() !== ''
        );
        const allSubstitutesValid = data.substitutes.every(s => 
          s.name.trim() !== '' && s.studentId.trim() !== '' && s.university.trim() !== ''
        );
        return allPlayersValid && allSubstitutesValid;
      },
      {
        message: 'All team members must have valid name, student ID, and university',
        path: ['players']
      }
    );
  }

  // Combine all fields
  const schemaFields: Record<string, z.ZodTypeAny> = {
    ...baseFields,
    ...(playersValidation && { teamData: playersValidation }),
  };
  
  // Add game-specific fields
  if (game.rules.gameSpecificRules?.additionalFields) {
    for (const field of game.rules.gameSpecificRules.additionalFields) {
      switch (field.type) {
        case 'text':
          schemaFields[field.name] = field.required 
            ? z.string().min(1, `${field.label} is required`)
            : z.string().optional();
          break;
        case 'select':
          if (field.required && field.options && field.options.length > 0) {
            schemaFields[field.name] = z.enum(field.options as [string, ...string[]]);
          } else if (field.options && field.options.length > 0) {
            schemaFields[field.name] = z.enum(field.options as [string, ...string[]]).optional();
          }
          break;
        case 'number':
          schemaFields[field.name] = field.required 
            ? z.number().min(1, `${field.label} is required`)
            : z.number().optional();
          break;
      }
    }
  }
  
  return z.object(schemaFields);
};

// Complete tournament registration form data
export const TournamentRegistrationFormSchema = z.object({
  tournamentId: z.string().min(1, 'Tournament selection is required'),
  teamName: z.string().optional(),
  additionalInfo: z.string().optional(),
  players: z.array(PlayerInfoSchema).optional(),
  substitutes: z.array(PlayerInfoSchema).optional(),
  gameSpecificFields: z.record(z.string(), z.unknown()).optional(),
});

export type TournamentRegistrationFormData = z.infer<typeof TournamentRegistrationFormSchema>;

// Backend payload schema (matches TournamentRegistrationData interface)
export const TournamentRegistrationPayloadSchema = z.object({
  tournamentId: z.string(),
  playerName: z.string(),
  email: z.string().email(),
  studentId: z.string(),
  university: z.string().optional(),
  teamName: z.string().optional(),
  players: z.string().optional(), // JSON string
  additionalInfo: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected']),
  registrationDate: z.string(),
  userId: z.string(),
});

export type TournamentRegistrationPayload = z.infer<typeof TournamentRegistrationPayloadSchema>;

// Validation utilities
export const validatePlayerInfo = (player: unknown): player is PlayerInfo => {
  return PlayerInfoSchema.safeParse(player).success;
};

export const validateTeamData = (teamData: unknown): teamData is TeamData => {
  return TeamDataSchema.safeParse(teamData).success;
};

export const validateTournamentPayload = (payload: unknown): payload is TournamentRegistrationPayload => {
  return TournamentRegistrationPayloadSchema.safeParse(payload).success;
};

// Create validator for specific game
export const createGameValidator = (game: Game) => {
  const schema = createTournamentRegistrationSchema(game);
  return {
    validate: (data: unknown) => schema.safeParse(data),
    schema,
  };
};

// Helper functions for form validation
export const getRequiredPlayerCount = (game: Game): number => {
  if (game.rules.tournamentType === 'individual') return 0;
  return Math.max(0, game.rules.minTeamSize - 1); // Exclude captain
};

export const getMaxPlayerCount = (game: Game): number => {
  if (game.rules.tournamentType === 'individual') return 0;
  return Math.max(0, game.rules.maxTeamSize - 1); // Exclude captain
};

export const getMaxSubstitutes = (game: Game): number => {
  return game.rules.maxSubstitutes || 0;
};

export const isGameIndividual = (game: Game): boolean => {
  return game.rules.tournamentType === 'individual';
};

export const getGameSpecificRequiredFields = (game: Game): string[] => {
  return game.rules.gameSpecificRules?.additionalFields
    ?.filter(field => field.required)
    .map(field => field.name) || [];
};

export const validateStudentIdFormat = (studentId: string): boolean => {
  // Basic student ID format validation - can be customized
  return /^[A-Za-z0-9]{8,20}$/.test(studentId.trim());
};

export const validateTeamName = (teamName: string, game: Game): boolean => {
  if (game.rules.tournamentType === 'individual') {
    return teamName.trim() === ''; // Should be empty for individual tournaments
  }
  return teamName.trim().length >= 2; // Minimum 2 characters for team names
};

export const checkDuplicatePlayerIds = (players: PlayerInfo[], substitutes: PlayerInfo[] = []): string[] => {
  const allStudentIds = [
    ...players.map(p => p.studentId.trim()),
    ...substitutes.map(s => s.studentId.trim())
  ].filter(id => id !== '');
  
  const duplicates: string[] = [];
  const seen = new Set<string>();
  
  for (const id of allStudentIds) {
    if (seen.has(id)) {
      duplicates.push(id);
    } else {
      seen.add(id);
    }
  }
  
  return [...new Set(duplicates)]; // Remove duplicate entries
};