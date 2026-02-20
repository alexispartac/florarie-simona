'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { Home, Search, ShoppingBag, ArrowLeft, Flower2 } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  const { language } = useLanguage();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      <div className="max-w-2xl w-full text-center py-20">
        {/* Decorative flowers */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <Flower2 className="h-12 w-12 text-[var(--primary)] animate-bounce" style={{ animationDelay: '0s' }} />
          <Flower2 className="h-16 w-16 text-[var(--primary)] animate-bounce" style={{ animationDelay: '0.1s' }} />
          <Flower2 className="h-12 w-12 text-[var(--primary)] animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>

        {/* 404 Title */}
        <h1 className="text-9xl font-bold text-[var(--primary)] mb-4">404</h1>
        
        {/* Main message */}
        <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
          {language === 'ro' ? 'Pagina nu a fost găsită' : 'Page Not Found'}
        </h2>
        
        <p className="text-lg text-[var(--muted-foreground)] mb-8 max-w-md mx-auto">
          {language === 'ro' 
            ? 'Ne pare rău, dar pagina pe care o căutați nu există sau a fost mutată.'
            : 'Sorry, the page you are looking for does not exist or has been moved.'}
        </p>

        {/* Countdown */}
        <div className="mb-8 p-4 bg-[var(--card)] border border-[var(--border)] rounded-lg inline-block">
          <p className="text-sm text-[var(--muted-foreground)]">
            {language === 'ro' 
              ? `Veți fi redirectat automat către pagina principală în ${countdown} secunde...`
              : `You will be automatically redirected to the home page in ${countdown} seconds...`}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button onClick={() => router.push('/')}>
            <Home className="h-5 w-5 mr-2" />
            {language === 'ro' ? 'Înapoi la pagina principală' : 'Back to Home'}
          </Button>
          
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            {language === 'ro' ? 'Înapoi' : 'Go Back'}
          </Button>
        </div>

        {/* Quick links */}
        <div className="border-t border-[var(--border)] pt-8">
          <p className="text-sm font-medium text-[var(--foreground)] mb-4">
            {language === 'ro' ? 'Link-uri utile:' : 'Useful links:'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/shop" 
              className="flex items-center justify-center p-3 border border-[var(--border)] rounded-lg text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              {language === 'ro' ? 'Produse' : 'Products'}
            </Link>
            
            <Link 
              href="/collections" 
              className="flex items-center justify-center p-3 border border-[var(--border)] rounded-lg text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors"
            >
              <Search className="h-5 w-5 mr-2" />
              {language === 'ro' ? 'Colecții' : 'Collections'}
            </Link>
            
            <Link 
              href="/contact" 
              className="flex items-center justify-center p-3 border border-[var(--border)] rounded-lg text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {language === 'ro' ? 'Contact' : 'Contact'}
            </Link>
          </div>
        </div>

        {/* Decorative bottom message */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[var(--muted-foreground)] italic">
            {language === 'ro' 
              ? '🌸 Buchetul Simonei - Frumusețe în fiecare petală 🌸'
              : '🌸 Buchetul Simonei - Beauty in every petal 🌸'}
          </p>
        </div>
      </div>
    </div>
  );
}
