'use client';

import { useState } from 'react';
import { useTheme, type Theme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

const ThemeSwitcher = () => {
  const { theme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-[var(--foreground)] hover:text-[var(--primary)] transition-colors relative group cursor-pointer"
        aria-label="Change theme"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.486M7 17h.01" 
          />
        </svg>
      </button>
        {/* {isHomepage && (
          <div className="absolute -z-10 left-1/2 top-12 transform -translate-x-1/2 whitespace-nowrap text-xs text-primary flex flex-col items-center bg-white rounded-lg shadow-lg p-2 opacity-70">
            <svg className="w-3 h-3 -mt-1 transform rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
            <span>{t('themeSwitcher.title')}</span>
          </div>
        )} */}
      
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-40 bg-[var(--card)] rounded-lg shadow-lg p-2 z-50 border border-[var(--border)]"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="flex items-center justify-between px-2 py-1 border-b border-[var(--border)] mb-2">
            <span className="text-xs font-medium text-[var(--muted-foreground)]">{t('themeSwitcher.colors')}</span>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id as Theme);
                  setIsOpen(false);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border-2 ${
                  theme === t.id 
                    ? 'ring-2 ring-offset-2 ring-[var(--primary)] transform scale-110 border-[var(--primary)]' 
                    : t.id === 'white'
                    ? 'hover:scale-105 hover:shadow-md border-[var(--foreground)]/30'
                    : 'hover:scale-105 hover:shadow-md border-[var(--border)]'
                }`}
                aria-label={`Set theme to ${t.name}`}
                title={t.name}
                style={{ backgroundColor: t.color }}
              >
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
