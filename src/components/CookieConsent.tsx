'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/translations';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const { language } = useLanguage();
  const t = useTranslation(language);

  useEffect(() => {
    // Check if user has already accepted cookies
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show consent banner after a short delay
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowConsent(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] animate-fade-in"
        onClick={declineCookies}
      />

      {/* Cookie Consent Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6 animate-slide-up">
        <div className="max-w-4xl mx-auto bg-[var(--card)] rounded-lg shadow-2xl border border-[var(--border)] overflow-hidden">
          <div className="relative p-6 sm:p-8">
            {/* Close button */}
            <button
              onClick={declineCookies}
              className="absolute top-4 right-4 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Content */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Icon */}
              <div className="shrink-0">
                <div className="bg-[var(--primary)]/10 p-3 rounded-full">
                  <svg 
                    className="h-8 w-8 text-[var(--primary)]" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" 
                    />
                  </svg>
                </div>
              </div>

              {/* Text */}
              <div className="flex-1 space-y-3">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  {t('cookie.title')}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {t('cookie.description')}
                </p>
                
                {/* Links */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <Link 
                    href="/politica-cookies" 
                    className="text-[var(--primary)] hover:underline font-medium"
                  >
                    {t('cookie.cookiePolicy')}
                  </Link>
                  <Link 
                    href="/gdpr" 
                    className="text-[var(--primary)] hover:underline font-medium"
                  >
                    {t('cookie.privacyPolicy')}
                  </Link>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex sm:flex-col mt-4 gap-3 w-full sm:w-auto shrink-0">
                <button
                  onClick={acceptCookies}
                  className="flex-1 cursor-pointer sm:flex-none px-6 py-2.5 bg-[var(--primary)] hover:bg-[var(--hover-primary)] text-[var(--primary-foreground)] rounded-md font-medium transition-colors shadow-sm hover:shadow-md"
                >
                  {t('cookie.accept')}
                </button>
                <button
                  onClick={declineCookies}
                  className="flex-1 cursor-pointer sm:flex-none px-6 py-2.5 bg-[var(--secondary)] hover:bg-[var(--accent)] text-[var(--foreground)] rounded-md font-medium transition-colors border border-[var(--border)]"
                >
                  {t('cookie.decline')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </>
  );
}
