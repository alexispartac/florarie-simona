'use client';
import { useState, useEffect } from 'react';

interface CookieConsent {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export const useCookieConsent = () => {
  const [hasConsent, setHasConsent] = useState(false);
  const [consentData, setConsentData] = useState<CookieConsent>({
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('florarie-simona-cookie-consent');
      const analyticsEnabled = localStorage.getItem('cookies-analytics-enabled');
      
      if (consent === 'true') {
        setHasConsent(true);
        setConsentData({
          analytics: analyticsEnabled === 'true',
          marketing: analyticsEnabled === 'true',
          functional: true, // Functional cookies sunt întotdeauna permise după consimțământ
        });
      }
    }
  }, []);

  const giveConsent = (consent: Partial<CookieConsent> = {}) => {
    if (typeof window !== 'undefined') {
      const fullConsent = {
        analytics: consent.analytics ?? true,
        marketing: consent.marketing ?? true,
        functional: consent.functional ?? true,
      };

      localStorage.setItem('florarie-simona-cookie-consent', 'true');
      localStorage.setItem('cookies-analytics-enabled', String(fullConsent.analytics));
      
      setHasConsent(true);
      setConsentData(fullConsent);

      // Activează serviciile după consimțământ
      if (fullConsent.analytics) {
        enableAnalytics();
      }
      if (fullConsent.marketing) {
        enableMarketing();
      }
    }
  };

  const revokeConsent = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('florarie-simona-cookie-consent');
      localStorage.removeItem('cookies-analytics-enabled');
      
      setHasConsent(false);
      setConsentData({
        analytics: false,
        marketing: false,
        functional: false,
      });

      // Dezactivează serviciile
      disableAnalytics();
      disableMarketing();
    }
  };

  return {
    hasConsent,
    consentData,
    giveConsent,
    revokeConsent,
  };
};

// Helper functions pentru servicii externe
const enableAnalytics = () => {
  // Exemplu pentru Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('consent', 'update', {
      'analytics_storage': 'granted'
    });
  }
  console.log('Analytics enabled');
};

const disableAnalytics = () => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('consent', 'update', {
      'analytics_storage': 'denied'
    });
  }
  console.log('Analytics disabled');
};

const enableMarketing = () => {
  // Exemplu pentru Facebook Pixel, Google Ads, etc.
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('consent', 'update', {
      'ad_storage': 'granted'
    });
  }
  console.log('Marketing cookies enabled');
};

const disableMarketing = () => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('consent', 'update', {
      'ad_storage': 'denied'
    });
  }
  console.log('Marketing cookies disabled');
};
