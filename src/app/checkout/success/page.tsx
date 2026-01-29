'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { IoConstruct } from 'react-icons/io5';
import { useShop } from '@/context/ShopContext';
import { useLanguage } from '@/context/LanguageContext';

export default function CheckoutSuccessPage() {
  const { clearCart, cart } = useShop();
  const { t } = useLanguage();

  useEffect(() => {
    clearCart();
    localStorage.removeItem('shippingData');
    localStorage.removeItem('shop_cart');
    // Here you can send the session ID to your server to confirm the payment
    // and update the order status in your database if needed

  }, [clearCart]);

  console.log('Cart after success:', cart);
  return (
    <div className="min-h-screen bg-[var(--background)]">
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
              </div>
              
              <div className="mt-12 border-t border-[var(--border)] pt-8">
                <h3 className="text-lg font-medium text-[var(--foreground)]">{t('checkout.success.nextStep')}</h3>
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="bg-[var(--secondary)] p-4 rounded-lg border border-[var(--border)]">
                    <h4 className="font-medium text-[var(--foreground)]">Order Status</h4>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                      Check your order status and track your delivery here.
                    </p>
                    <div className="mt-4">
                      <Link href="/orders" className="text-sm font-medium text-[var(--primary)] hover:text-[var(--hover-primary)]">
                        View order status <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                  <div className="bg-[var(--secondary)] p-4 rounded-lg border border-[var(--border)]">
                    <h4 className="font-medium text-[var(--foreground)]">Need help?</h4>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                      Have questions about your order? Contact our customer service.
                    </p>
                    <div className="mt-4">
                      <Link href="/contact" className="text-sm font-medium text-[var(--primary)] hover:text-[var(--hover-primary)]">
                        Contact us <span aria-hidden="true">&rarr;</span>
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
