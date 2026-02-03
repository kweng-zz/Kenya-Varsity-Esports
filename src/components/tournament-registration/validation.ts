import { Game } from '@/lib/gamesData';
import { PlayerInfo, TeamData, validatePlayerInfo, validateTeamData } from './schema';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  fieldErrors?: Record<string, string[]>;
}

export interface TeamValidationOptions {
  includeSubstitutes?: boolean;
  requireUniversity?: boolean;
  requireInGameId?: boolean;
  checkDuplicates?: boolean;
}

// Comprehensive team data validation
export const validateTeamDataComplete = (
  players: unknown[],
  substitutes: unknown[] = [],
  game: Game,
  options: TeamValidationOptions = {}
): ValidationResult => {
  const errors: string[] = [];
  const fieldErrors: Record<string, string[]> = {};

  const {
    includeSubstitutes = true,
    requireUniversity = game.rules.registrationRequirements?.requireUniversity ?? true,
    requireInGameId = false,
    checkDuplicates = true
  } = options;

  // Validate players array
  if (!Array.isArray(players)) {
    errors.push('Players must be provided as an array');
    return { isValid: false, errors, fieldErrors };
  }

  const requiredPlayerCount = Math.max(0, game.rules.minTeamSize - 1); // Exclude captain
  const maxPlayerCount = Math.max(0, game.rules.maxTeamSize - 1); // Exclude captain

  // Check minimum player requirement
  if (players.length < requiredPlayerCount) {
    errors.push(`At least ${requiredPlayerCount} additional players required (you provided ${players.length})`);
  }

  // Check maximum player limit
  if (players.length > maxPlayerCount) {
    errors.push(`Maximum ${maxPlayerCount} additional players allowed (you provided ${players.length})`);
  }

  // Validate each player
  players.forEach((player, index) => {
    const playerKey = `players[${index}]`;
    fieldErrors[playerKey] = [];

    if (!validatePlayerInfo(player)) {
      fieldErrors[playerKey].push('Invalid player information structure');
    } else {
      const typedPlayer = player as PlayerInfo;
      
      // Name validation
      if (!typedPlayer.name?.trim()) {
        fieldErrors[playerKey].push('Player name is required');
      } else if (typedPlayer.name.trim().length < 2) {
        fieldErrors[playerKey].push('Player name must be at least 2 characters');
      }

      // Student ID validation
      if (!typedPlayer.studentId?.trim()) {
        fieldErrors[playerKey].push('Student ID is required');
      } else if (!validateStudentIdFormat(typedPlayer.studentId)) {
        fieldErrors[playerKey].push('Invalid student ID format');
      }

      // University validation
      if (requireUniversity && !typedPlayer.university?.trim()) {
        fieldErrors[playerKey].push('University is required');
      }

      // In-game ID validation
      if (requireInGameId && !typedPlayer.inGameId?.trim()) {
        fieldErrors[playerKey].push('In-game ID is required');
      }
    }

    // Remove empty field errors
    if (fieldErrors[playerKey].length === 0) {
      delete fieldErrors[playerKey];
    }
  });

  // Validate substitutes if included
  if (includeSubstitutes) {
    const maxSubstitutes = game.rules.maxSubstitutes || 0;

    if (!Array.isArray(substitutes)) {
      errors.push('Substitutes must be provided as an array');
    } else if (substitutes.length > maxSubstitutes) {
      errors.push(`Maximum ${maxSubstitutes} substitutes allowed (you provided ${substitutes.length})`);
    } else {
      substitutes.forEach((substitute, index) => {
        const subKey = `substitutes[${index}]`;
        fieldErrors[subKey] = [];

        if (!validatePlayerInfo(substitute)) {
          fieldErrors[subKey].push('Invalid substitute information structure');
        } else {
          const typedSub = substitute as PlayerInfo;
          
          // Name validation (only if substitute has data)
          if (typedSub.name?.trim()) {
            if (typedSub.name.trim().length < 2) {
              fieldErrors[subKey].push('Substitute name must be at least 2 characters');
            }

            // Student ID validation (only if name is provided)
            if (!typedSub.studentId?.trim()) {
              fieldErrors[subKey].push('Student ID is required for substitutes with names');
            } else if (!validateStudentIdFormat(typedSub.studentId)) {
              fieldErrors[subKey].push('Invalid student ID format');
            }

            // University validation (only if required and name is provided)
            if (requireUniversity && !typedSub.university?.trim()) {
              fieldErrors[subKey].push('University is required for substitutes');
            }
          }
        }

        // Remove empty field errors
        if (fieldErrors[subKey].length === 0) {
          delete fieldErrors[subKey];
        }
      });
    }
  }

  // Check for duplicate student IDs
  if (checkDuplicates) {
    const allStudentIds: string[] = [];
    
    players.forEach((player, index) => {
      if (validatePlayerInfo(player) && (player as PlayerInfo).studentId?.trim()) {
        allStudentIds.push((player as PlayerInfo).studentId.trim());
      }
    });

    if (includeSubstitutes && Array.isArray(substitutes)) {
      substitutes.forEach((substitute) => {
        if (validatePlayerInfo(substitute) && (substitute as PlayerInfo).studentId?.trim()) {
          allStudentIds.push((substitute as PlayerInfo).studentId.trim());
        }
      });
    }

    const duplicates = checkDuplicateStudentIdsAdvanced(allStudentIds);
    if (duplicates.length > 0) {
      errors.push(`Duplicate student IDs found: ${duplicates.join(', ')}`);
    }
  }

  const isValid = errors.length === 0 && Object.keys(fieldErrors).length === 0;
  return { isValid, errors, fieldErrors };
};

// Advanced duplicate student ID checker
export const checkDuplicateStudentIdsAdvanced = (studentIds: string[]): string[] => {
  const seen = new Map<string, number>();
  const duplicates: string[] = [];

  studentIds.forEach((id, index) => {
    const trimmedId = id.trim().toUpperCase();
    if (seen.has(trimmedId)) {
      if (!duplicates.includes(trimmedId)) {
        duplicates.push(trimmedId);
      }
    } else {
      seen.set(trimmedId, index);
    }
  });

  return duplicates;
};

// Student ID format validator with configurable rules
export const validateStudentIdFormat = (
  studentId: string, 
  strict: boolean = false
): boolean => {
  const trimmed = studentId.trim();
  
  if (trimmed.length === 0) return false;
  
  if (strict) {
    // Strict validation: 6-20 characters, alphanumeric, uppercase
    return /^[A-Z0-9]{6,20}$/.test(trimmed.toUpperCase());
  } else {
    // Lenient validation: 4-30 characters, alphanumeric, basic symbols allowed
    return /^[A-Z0-9\-_]{4,30}$/i.test(trimmed);
  }
};

// Game-specific validation rules
export const getGameValidationRules = (game: Game) => {
  const rules = {
    isIndividual: game.rules.tournamentType === 'individual',
    isDuo: game.rules.tournamentType === 'duo',
    isTeam: game.rules.tournamentType === 'team',
    requiredPlayers: Math.max(0, game.rules.minTeamSize - 1),
    maxPlayers: Math.max(0, game.rules.maxTeamSize - 1),
    maxSubstitutes: game.rules.maxSubstitutes || 0,
    allowSubstitutes: game.rules.allowSubstitutes ?? true,
    requireStudentId: game.rules.registrationRequirements?.requireStudentId ?? true,
    requireUniversity: game.rules.registrationRequirements?.requireUniversity ?? true,
    requirePhone: game.rules.registrationRequirements?.requirePhoneNumber ?? false,
    minimumAge: game.rules.registrationRequirements?.minimumAge,
    gameSpecificFields: game.rules.gameSpecificRules?.additionalFields || [],
  };

  return rules;
};

// Validate complete tournament registration form
export const validateCompleteRegistration = (
  formData: {
    tournamentId?: string;
    teamName?: string;
    players?: unknown[];
    substitutes?: unknown[];
    additionalInfo?: string;
    gameSpecificFields?: Record<string, unknown>;
  },
  game: Game,
  captainInfo?: {
    studentId: string;
    name: string;
    university: string;
  }
): ValidationResult => {
  const errors: string[] = [];
  const fieldErrors: Record<string, string[]> = {};

  // Tournament ID validation
  if (!formData.tournamentId?.trim()) {
    errors.push('Tournament selection is required');
  }

  // Team name validation
  const validationRules = getGameValidationRules(game);
  if (!validationRules.isIndividual && formData.teamName?.trim()) {
    if (formData.teamName.trim().length < 2) {
      fieldErrors.teamName = ['Team name must be at least 2 characters'];
    }
  }

  // Team data validation
  if (!validationRules.isIndividual) {
    const teamValidation = validateTeamDataComplete(
      formData.players || [],
      formData.substitutes || [],
      game,
      {
        requireUniversity: validationRules.requireUniversity,
        checkDuplicates: true
      }
    );

    errors.push(...teamValidation.errors);
    Object.assign(fieldErrors, teamValidation.fieldErrors);
  }

  // Game-specific fields validation
  if (validationRules.gameSpecificFields.length > 0) {
    validationRules.gameSpecificFields.forEach(field => {
      const value = formData.gameSpecificFields?.[field.name];
      const fieldKey = `gameSpecificFields.${field.name}`;

      if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
        if (!fieldErrors[fieldKey]) fieldErrors[fieldKey] = [];
        fieldErrors[fieldKey].push(`${field.label} is required`);
      }

      // Additional type-specific validation
      if (value && field.type === 'select' && field.options) {
        if (!field.options.includes(value as string)) {
          if (!fieldErrors[fieldKey]) fieldErrors[fieldKey] = [];
          fieldErrors[fieldKey].push(`Invalid option for ${field.label}`);
        }
      }
    });
  }

  // Check if captain is included in team (for team tournaments)
  if (captainInfo && !validationRules.isIndividual && formData.players) {
    const captainInTeam = (formData.players as any[]).some(
      (player: any) => validatePlayerInfo(player) && 
        player.studentId === captainInfo.studentId
    );

    if (captainInTeam) {
      errors.push('Team captain should not be listed as an additional player');
    }
  }

  const isValid = errors.length === 0 && Object.keys(fieldErrors).length === 0;
  return { isValid, errors, fieldErrors };
};

// Prepare team data for backend submission
export const prepareTeamDataPayload = (
  players: PlayerInfo[],
  substitutes: PlayerInfo[] = []
): string => {
  const teamData: TeamData = {
    players: players.filter(player => 
      player.name.trim() !== '' && 
      player.studentId.trim() !== '' && 
      player.university.trim() !== ''
    ),
    substitutes: substitutes.filter(sub => 
      sub.name.trim() !== '' && 
      sub.studentId.trim() !== '' && 
      sub.university.trim() !== ''
    )
  };

  return JSON.stringify(teamData);
};

// Format validation errors for display
export const formatValidationErrors = (validation: ValidationResult): string[] => {
  const allErrors: string[] = [...validation.errors];

  // Add field-specific errors
  if (validation.fieldErrors) {
    Object.entries(validation.fieldErrors).forEach(([field, errors]) => {
      errors.forEach(error => {
        // Convert field paths to readable names
        const readableField = field
          .replace(/players\[(\d+)\]/g, 'Player $1')
          .replace(/substitutes\[(\d+)\]/g, 'Substitute $1')
          .replace(/gameSpecificFields\./g, '');
        
        allErrors.push(`${readableField}: ${error}`);
      });
    });
  }

  return allErrors;
};

// Check registration conflicts with existing data
export const checkRegistrationConflicts = (
  captainStudentId: string,
  teamPlayers: PlayerInfo[],
  teamSubstitutes: PlayerInfo[] = [],
  existingRegistrations: Array<{
    studentId: string;
    players?: string; // JSON string
  }>
): string[] => {
  const conflicts: string[] = [];
  const allTeamStudentIds = [
    captainStudentId.trim(),
    ...teamPlayers.map(p => p.studentId.trim()).filter(id => id),
    ...teamSubstitutes.map(s => s.studentId.trim()).filter(id => id)
  ];

  const registeredStudentIds = new Set<string>();

  existingRegistrations.forEach(reg => {
    // Add captain's student ID
    if (reg.studentId) {
      registeredStudentIds.add(reg.studentId.trim());
    }

    // Parse and add team members' student IDs
    if (reg.players) {
      try {
        const teamData = JSON.parse(reg.players);
        
        // Add main players
        if (teamData.players && Array.isArray(teamData.players)) {
          teamData.players.forEach((player: any) => {
            if (player.studentId) {
              registeredStudentIds.add(player.studentId.trim());
            }
          });
        }
        
        // Add substitutes
        if (teamData.substitutes && Array.isArray(teamData.substitutes)) {
          teamData.substitutes.forEach((sub: any) => {
            if (sub.studentId) {
              registeredStudentIds.add(sub.studentId.trim());
            }
          });
        }
      } catch (error) {
        // Ignore parsing errors
      }
    }
  });

  // Find conflicts
  allTeamStudentIds.forEach(studentId => {
    if (registeredStudentIds.has(studentId)) {
      conflicts.push(studentId);
    }
  });

  return conflicts;
};