// Theme configuration for the KUER esports platform
export const theme = {
  colors: {
    primary: '#8c110d',
    primaryHover: '#b91c17',
    primaryLight: '#961c18',
    primaryLightHover: '#7a1514',
    secondary: '#D13431',
    accent: '#8c110d',
    
    // Status colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    // Background colors
    background: {
      primary: '#000000',
      secondary: '#1a1a1a',
      tertiary: '#2a2a2a',
    },
    
    // Text colors
    text: {
      primary: '#ffffff',
      secondary: '#d1d5db',
      muted: '#9ca3af',
      accent: '#8c110d',
    },
    
    // Border colors
    border: {
      primary: '#8c110d',
      secondary: '#374151',
      muted: '#4b5563',
    }
  },
  
  // Event type colors for calendar
  eventColors: {
    registration: 'bg-blue-600',
    match: 'bg-green-600',
    tournament: 'bg-[#8c110d]',
    deadline: 'bg-red-600',
    announcement: 'bg-purple-600',
    event: 'bg-gray-600',
  },
  
  // Important event styling
  important: {
    color: '#8c110d',
    bgColor: 'bg-[#8c110d]',
    textColor: 'text-[#8c110d]',
    borderColor: 'border-[#8c110d]',
    ringColor: 'ring-[#8c110d]',
  }
} as const;

// Helper functions for theme usage
export const getEventTypeColor = (type: string): string => {
  return theme.eventColors[type as keyof typeof theme.eventColors] || theme.eventColors.event;
};

export const getImportantStyles = () => ({
  color: theme.important.color,
  textColor: theme.important.textColor,
  bgColor: theme.important.bgColor,
  borderColor: theme.important.borderColor,
  ringColor: theme.important.ringColor,
});

// CSS custom properties for dynamic theming
export const getCSSVariables = () => ({
  '--color-primary': theme.colors.primary,
  '--color-primary-hover': theme.colors.primaryHover,
  '--color-primary-light': theme.colors.primaryLight,
  '--color-primary-light-hover': theme.colors.primaryLightHover,
  '--color-secondary': theme.colors.secondary,
  '--color-accent': theme.colors.accent,
});