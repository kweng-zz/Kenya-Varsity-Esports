// Team Captains List
// This file contains the authorized team captains who can register for tournaments
// Student IDs should match exactly with the student_id in user profiles (case-insensitive)

export const AUTHORIZED_TEAM_CAPTAINS = [
  // Add team captain student IDs here - they should match the student_id from user registration
  // Example entries:
  "STU001",
  "STU002", 
  "STU003",
  "STU004",
  "STU005",
  "STU006",
  "STU007",
  "STU008",
  "STU009",
  "STU010",
  
  // University of Nairobi Captains
  "UON2024001",
  "UON2024002",
  "UON2024003",
  "UON2024004",
  
  // Kenyatta University Captains
  "KU2024001",
  "KU2024002",
  "KU2024003",
  "KU2024004",
  
  // Strathmore University Captains
  "SU2024001",
  "SU2024002",
  "SU2024003",
  "SU2024004",
  
  // USIU Captains
  "USIU2024001",
  "USIU2024002",
  "USIU2024003",
  "USIU2024004",
  
  // Add more student IDs as needed...
  // Remember: Student IDs must match exactly with user registration (case-insensitive)
];

// Game-specific captains (optional - for future use)
export const GAME_SPECIFIC_CAPTAINS = {
  "VALORANT": [
    "John Doe",
    "Kevin Mwangi",
    "Daniel Kiprotich",
  ],
  "FIFA": [
    "Jane Smith",
    "Grace Wanjiku",
    "Faith Akinyi",
  ],
  "Mobile Legends": [
    "Michael Johnson",
    "Peter Kamau",
    "Brian Mutua",
  ],
  // Add more games as needed
};

// Utility functions
export const isAuthorizedTeamCaptain = (studentId: string): boolean => {
  if (!studentId) return false;
  
  // Case-insensitive comparison
  const normalizedStudentId = studentId.trim().toLowerCase();
  
  // Check file-based captains
  const isInFile = AUTHORIZED_TEAM_CAPTAINS.some(
    captain => captain.toLowerCase() === normalizedStudentId
  );
  
  // Check localStorage captains (for admin-added captains)
  let isInLocalStorage = false;
  if (typeof window !== 'undefined') {
    try {
      const savedCaptains = localStorage.getItem('teamCaptains');
      if (savedCaptains) {
        const captains = JSON.parse(savedCaptains);
        isInLocalStorage = captains.some((captain: any) => 
          captain.studentId && captain.studentId.toLowerCase() === normalizedStudentId
        );
      }
    } catch (error) {
      console.error('Error reading team captains from localStorage:', error);
    }
  }
  
  return isInFile || isInLocalStorage;
};

// Legacy function for backward compatibility (deprecated)
export const isAuthorizedTeamCaptainByName = (fullname: string): boolean => {
  console.warn('isAuthorizedTeamCaptainByName is deprecated. Use isAuthorizedTeamCaptain with studentId instead.');
  return false; // Always return false to force migration to student ID
};

export const isGameSpecificCaptain = (fullname: string, game: string): boolean => {
  if (!fullname || !game) return false;
  
  const gameCapt = GAME_SPECIFIC_CAPTAINS[game as keyof typeof GAME_SPECIFIC_CAPTAINS];
  if (!gameCapt) return false;
  
  const normalizedName = fullname.trim().toLowerCase();
  return gameCapt.some(captain => captain.toLowerCase() === normalizedName);
};

// Admin function to get all captains info
export const getAllCaptainsInfo = () => {
  return {
    totalCaptains: AUTHORIZED_TEAM_CAPTAINS.length,
    captainsList: AUTHORIZED_TEAM_CAPTAINS,
    gameSpecificCaptains: GAME_SPECIFIC_CAPTAINS,
  };
};