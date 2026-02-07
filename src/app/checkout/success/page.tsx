'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { IoConstruct } from 'react-icons/io5';
import { useShop } from '@/context/ShopContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/translations';

export default function CheckoutSuccessPage() {
  const { clearCart } = useShop();
  const { language } = useLanguage();
  const t = useTranslation(language);

  useEffect(() => {
    const clearData = () => {
      clearCart();
      localStorage.removeItem('shippingData');
      localStorage.removeItem('billingData');
      // Force clear the cart storage as a backup
      localStorage.setItem('shop_cart', JSON.stringify([]));
    };

    clearData();
    // Here you can send the session ID to your server to confirm the payment
    // and update the order status in your database if needed

  }, [clearCart]);

  return (
    <div className="min-h-screen bg-[var(--card)]">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[var(--card)] shadow overflow-hidden sm:rounded-lg border border-[var(--border)]">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[var(--primary)]/10">
                  <IoConstruct className="h-6 w-6 text-[var(--primary)]" aria-hidden="true" />
                </div>
                <h2 className="mt-3 text-2xl font-bold text-[var(--foreground)] sm:text-3xl">
                  {t('checkout.success.title')}
                </h2>
                <p className="mt-4 text-[var(--muted-foreground)]">
                  {t('checkout.success.text')}
                </p>
                <div className="mt-10">
                  <Link
                    href="/"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[var(--primary-foreground)] bg-[var(--primary)] hover:bg-[var(--hover-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
                  >
                    {t('checkout.success.continueShopping')}
                  </Link>
                </div>

                <div className="mt-10 bg-[var(--secondary)] p-4 rounded-lg border border-[var(--border)]">
                    <h4 className="font-medium text-[var(--foreground)]">Daca ai plasat o comanda prin transfer bancar, te rugam sa ne contactezi pentru a confirma plata.</h4>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                      Trimete-ne dovada de plata printr-un mesaj pe WhatsApp.
                    </p>
                    <div className="mt-4">
                      <Link href="https://wa.me/40769141250" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[var(--primary)] hover:text-[var(--hover-primary)]">
                        Trimite-ne dovada de plata <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </div>
                  </div>
              </div>
              
              <div className="mt-12 border-t border-[var(--border)] pt-8">
                <h3 className="text-lg font-medium text-[var(--foreground)]">{t('checkout.success.nextStep')}</h3>
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="bg-[var(--secondary)] p-4 rounded-lg border border-[var(--border)]">
                    <h4 className="font-medium text-[var(--foreground)]">Statusul comenzii</h4>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                      Vezi statusul comenzii si urmărește livrarea aici.
                    </p>
                    <div className="mt-4">
                      <Link href="/orders" className="text-sm font-medium text-[var(--primary)] hover:text-[var(--hover-primary)]">
                        Vezi statusul comenzii <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                  <div className="bg-[var(--secondary)] p-4 rounded-lg border border-[var(--border)]">
                    <h4 className="font-medium text-[var(--foreground)]">Ai nevoie de ajutor?</h4>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                      Ai întrebări despre comanda ta? Contactează-ne pe email.
                    </p>
                    <div className="mt-4">
                      <Link href="/contact" className="text-sm font-medium text-[var(--primary)] hover:text-[var(--hover-primary)]">
                        Contactează-ne <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
