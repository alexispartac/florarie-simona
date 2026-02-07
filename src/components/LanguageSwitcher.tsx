'use client';

import { useLanguage } from '@/context/LanguageContext';

// Client-side only component to avoid hydration issues
function ClientOnlyLanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'ro' : 'en')}
      className="flex cursor-pointer items-center gap-2 py-2 text-sm font-medium rounded-md hover:bg-[var(--accent)] text-[var(--foreground)]"
      aria-label={language === 'en' ? 'Schimbă în Română' : 'Switch to English'}
    >
      <span className="uppercase">{language}</span>
    </button>
  );
}

export default function LanguageSwitcher() {
  return <ClientOnlyLanguageSwitcher />;
}
