'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'black' | 'petrol' | 'bleumarin-decolorat' | 'gri-albăstrui' | 'turcoaz-stins';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper function to safely get theme from localStorage
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'black'; // Default for server-side
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  return savedTheme || 'black';
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  // Update the theme class on the html element when theme changes
  useEffect(() => {
    // Remove all theme classes
    const root = window.document.documentElement;
    root.classList.remove(
      'theme-black',
      'theme-petrol',
      'theme-bleumarin-decolorat',
      'theme-gri-albăstrui',
      'theme-turcoaz-stins'
    );
    
    // Add the current theme class
    root.classList.add(`theme-${theme}`);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
