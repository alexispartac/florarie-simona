'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from '@/translations';
import { useLanguage } from '@/context/LanguageContext';
import Button from '@/components/ui/Button';
import Link from 'next/link';

function CheckoutCancelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const t = useTranslation(language);
  const [countdown, setCountdown] = useState(10);

  // Compute error message from URL params (memoized to avoid recalculation)
  const errorMessage = useMemo(() => {
    const error = searchParams.get('error');
    const message = searchParams.get('message');
    
    if (message) {
      return decodeURIComponent(message);
    } else if (error === 'payment_failed') {
      return t('checkout.cancel.paymentFailed') || 'Plata a eșuat. Vă rugăm să încercați din nou.';
    } else if (error === 'payment_cancelled') {
      return t('checkout.cancel.paymentCancelled') || 'Ați anulat plata.';
    } else {
      return t('checkout.cancel.defaultError') || 'A apărut o problemă cu plata.';
    }
  }, [searchParams, t]);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/checkout/payment');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleRetry = () => {
    router.push('/checkout/payment');
  };

  const handleBackToCart = () => {
    router.push('/checkout/cart');
  };

  const handleContactSupport = () => {
    router.push('/contact');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
          {t('checkout.cancel.title') || 'Plata nu a fost procesată'}
        </h1>

        {/* Error Message */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-red-600 mt-0.5 mr-3 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-red-800 text-sm">{errorMessage}</p>
          </div>
        </div>

        {/* Information Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            {t('checkout.cancel.whatHappened') || 'Ce s-a întâmplat?'}
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>{t('checkout.cancel.noCharge') || 'Nu ați fost taxat'}</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>{t('checkout.cancel.noOrder') || 'Comanda nu a fost plasată'}</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>{t('checkout.cancel.cartSaved') || 'Coșul dvs. este în siguranță'}</span>
            </li>
          </ul>
        </div>

        {/* Common Issues */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            {t('checkout.cancel.commonIssues') || 'Probleme comune:'}
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>{t('checkout.cancel.insufficientFunds') || 'Fonduri insuficiente pe card'}</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>{t('checkout.cancel.incorrectDetails') || 'Detalii de card incorecte'}</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>{t('checkout.cancel.cardNotActivated') || 'Cardul nu este activat pentru plăți online'}</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>{t('checkout.cancel.connectionIssue') || 'Probleme de conexiune'}</span>
            </li>
          </ul>
        </div>

        {/* Countdown Message */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600">
            {t('checkout.cancel.autoRedirect') || 'Veți fi redirecționat automat în'}{' '}
            <span className="font-semibold text-gray-900">{countdown}</span>{' '}
            {countdown === 1 ? 'secundă' : 'secunde'}...
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleRetry}
            variant="primary"
          >
            {t('checkout.cancel.tryAgain') || '🔄 Încearcă din nou plata'}
          </Button>

          <button
            onClick={handleBackToCart}
            className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 py-3 rounded-lg font-medium transition-colors"
          >
            {t('checkout.cancel.backToCart') || '🛒 Înapoi la coș'}
          </button>

          <button
            onClick={handleContactSupport}
            className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 py-3 rounded-lg font-medium transition-colors"
          >
            {t('checkout.cancel.contactSupport') || '💬 Contactează suportul'}
          </button>
        </div>

        {/* Alternative Payment Methods */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600 mb-4">
            {t('checkout.cancel.alternativePayment') || 'Sau alegeți o altă metodă de plată:'}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/checkout/payment"
              className="text-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
            >
              <div className="text-2xl mb-1">🏦</div>
              <div className="text-xs font-medium text-gray-700">
                {t('checkout.cancel.bankTransfer') || 'Transfer bancar'}
              </div>
            </Link>
            <Link
              href="/checkout/payment"
              className="text-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
            >
              <div className="text-2xl mb-1">💵</div>
              <div className="text-xs font-medium text-gray-700">
                {t('checkout.cancel.cashOnDelivery') || 'Numerar la livrare'}
              </div>
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            {t('checkout.cancel.needHelp') || 'Aveți nevoie de ajutor?'}{' '}
            <Link href="/contact" className="text-primary hover:underline">
              {t('checkout.cancel.contactUs') || 'Contactați-ne'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <CheckoutCancelContent />
    </Suspense>
  );
}
