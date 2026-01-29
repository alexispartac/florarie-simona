'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'black' | 'white' | 'rose';

export type ThemeConfig = {
  id: Theme;
  name: string;
  color: string;
  image: string;
};

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  currentThemeConfig: ThemeConfig;
  themes: ThemeConfig[];
};

const themes: ThemeConfig[] = [
  { 
    id: 'white',
    name: 'White',
    color: 'var(--theme-white)',
    image: 'https://res.cloudinary.com/dm7ttgpta/image/upload/v1769631342/Logo_Simte_Poezia_Florilor_V2_Negru_d4urcr.png'
  },
  { 
    id: 'black',
    name: 'Black',
    color: 'var(--theme-black)',
    image: 'https://res.cloudinary.com/dm7ttgpta/image/upload/v1769631339/Logo_Simte_Poezia_Florilor_V2_Alb_ox2gin.png',
  },
  { 
    id: 'rose',
    name: 'Rose',
    color: 'var(--theme-rose)',
    image: 'https://res.cloudinary.com/dm7ttgpta/image/upload/v1769631344/Logo_Simte_Poezia_Florilor_V2_Roz_pjlsoa.png'
  }
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper function to safely get theme from localStorage
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'rose'; // Default for server-side
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  return savedTheme || 'rose';
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  // Get current theme configuration
  const currentThemeConfig = themes.find(t => t.id === theme) || themes[2];

  // Update the theme class on the html element when theme changes
  useEffect(() => {
    // Remove all theme classes
    const root = window.document.documentElement;
    root.classList.remove(
      'theme-black',
      'theme-white',
      'theme-rose'
    );
    
    // Add the current theme class
    root.classList.add(`theme-${theme}`);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, currentThemeConfig, themes }}>
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
