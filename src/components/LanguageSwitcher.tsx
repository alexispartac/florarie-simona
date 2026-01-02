'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

// Client-side only component to avoid hydration issues
function ClientOnlyLanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'ro' : 'en')}
      className="flex cursor-pointer items-center gap-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
      aria-label={language === 'en' ? 'Schimbă în Română' : 'Switch to English'}
    >
      <Globe className="w-5 h-5" />
      <span className="uppercase">{language}</span>
    </button>
  );
}

export default function LanguageSwitcher() {
  return <ClientOnlyLanguageSwitcher />;
}
