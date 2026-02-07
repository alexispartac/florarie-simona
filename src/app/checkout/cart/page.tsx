'use client';

import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { FiShoppingBag, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/translations';

export default function CartPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { 
    cart, 
    removeFromCart, 
    updateCartItemQuantity, 
    getCartTotal, 
    getCartItemCount,
  } = useShop();
  const itemCount = getCartItemCount();
  const subtotal = getCartTotal();
  const total = subtotal;

  const { language } = useLanguage();
  const t = useTranslation(language);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Show loading state during hydration
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <Spinner className="w-12 h-12" />
          <p className="text-[var(--muted-foreground)]">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-[var(--muted)] rounded-full flex items-center justify-center mb-4">
          <FiShoppingBag className="w-12 h-12 text-[var(--muted-foreground)]" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Your cart is empty</h2>
        <p className="text-[var(--muted-foreground)] mb-6">Looks like you haven&apos;t added anything to your cart yet.</p>
        <Link 
          href="/shop"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-[var(--primary-foreground)] bg-[var(--primary)] hover:bg-[var(--hover-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
        >
          {t('button.continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-[var(--foreground)] my-8"> {t('cart.title')} ({itemCount})</h1>
      
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-8">
          <div className="bg-[var(--card)] shadow overflow-hidden sm:rounded-lg border border-[var(--border)]">
            <ul className="divide-y divide-[var(--border)]">
              {cart.map((item, index) => (
                <li key={`${item.productId}-${index}`} className={`p-4 sm:p-6 ${item.isExtra ? 'bg-gradient-to-r from-purple-50/30 to-pink-50/30 dark:from-purple-950/10 dark:to-pink-950/10' : ''}`}>
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative shrink-0 w-full sm:w-32 h-32 bg-[var(--muted)] rounded-md overflow-hidden">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover object-center"
                        />
                      )}
                      {item.isExtra && (
                        <div className="absolute top-2 right-2 bg-[var(--primary)] text-[var(--primary-foreground)] text-xs px-2 py-1 rounded-full shadow-lg font-semibold">
                          Extra
                        </div>
                      )}
                    </div>

                    <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          {item.isExtra ? (
                            <h3 className="text-lg font-medium text-[var(--foreground)]">
                              {item.name}
                            </h3>
                          ) : (
                            <h3 className="text-lg font-medium text-[var(--foreground)]">
                              <Link href={`/shop/${item.productId}`} className="hover:text-[var(--primary)] hover:underline">
                                {item.name}
                              </Link>
                            </h3>
                          )}
                          {item.isExtra && item.category && (
                            <p className="text-sm text-[var(--muted-foreground)] capitalize mt-1 inline-flex items-center gap-1">
                              <span className="inline-block w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                              {item.category}
                            </p>
                          )}
                        </div>
                        <p className="ml-4 text-lg font-medium text-[var(--foreground)]">
                          {(item.price / 100).toFixed(2)} RON
                        </p>
                      </div>

                      <div className="mt-2 text-sm text-[var(--muted-foreground)]">
                        {item.customMessage && (
                          <p className="mt-1">Mesaj: <span className="italic">{item.customMessage}</span></p>
                        )}
                        {item.deliveryDate && (
                          <p className="mt-1">Livrare: {new Date(item.deliveryDate).toLocaleDateString('ro-RO')}</p>
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center border border-[var(--border)] rounded-md">
                              <button
                                type="button"
                                onClick={() => {
                                  updateCartItemQuantity(item, item.quantity - 1);
                                }}
                                className={`p-2 focus:outline-none ${item.quantity <= 1 ? 'text-[var(--muted-foreground)] cursor-not-allowed' : 'text-[var(--foreground)] hover:text-[var(--primary)] cursor-pointer'}`}
                                disabled={item.quantity <= 1}
                              >
                                <FiMinus className="h-4 w-4" />
                              </button>
                              <span className="px-4 text-[var(--foreground)]">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => {
                                    updateCartItemQuantity(item, item.quantity + 1);
                                }}
                                disabled={item.stock !== undefined && item.quantity >= item.stock}
                                className={`p-2 focus:outline-none ${
                                  item.stock !== undefined && item.quantity >= item.stock
                                    ? 'text-[var(--muted-foreground)] cursor-not-allowed'
                                    : 'text-[var(--foreground)] hover:text-[var(--primary)] cursor-pointer'
                                }`}
                              >
                                <FiPlus className="h-4 w-4" />
                              </button>
                            </div>
                            {item.stock !== undefined && (
                              <span className="text-xs text-[var(--muted-foreground)]">
                                Max: {item.stock}
                              </span>
                            )}
                          </div>
                          {item.stock !== undefined && item.quantity >= item.stock && (
                            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                              ⚠️ Cantitate maximă
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            removeFromCart(item);
                          }}
                          className="text-[var(--destructive)] hover:text-[var(--destructive)]/80 text-sm font-medium flex items-center cursor-pointer"
                        >
                          <FiTrash2 className="mr-1 h-4 w-4" />
                          {t('cart.checkout.remove')}
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-10 lg:mt-0 lg:col-span-4">
          <div className="bg-[var(--card)] shadow overflow-hidden sm:rounded-lg p-6 border border-[var(--border)]">
            <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">{t('cart.checkout.orderSummary')}</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted-foreground)]">{t('cart.checkout.subtotal')}</span>
                <span className="font-medium text-[var(--foreground)]">{(subtotal / 100).toFixed(2)} RON</span>
              </div>
              
              <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
                <span className="text-[var(--muted-foreground)]">{t('cart.checkout.shipping')}</span>
                <span className="font-medium text-[var(--foreground)]">?</span>
              </div>
              
              <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
                <span className="text-lg font-medium text-[var(--foreground)]">{t('cart.checkout.total')}</span>
                <span className="text-lg font-bold text-[var(--foreground)]">{(total / 100).toFixed(2)} RON</span>
              </div>
              
              <div className="pt-4">
                <Button
                  onClick={() => router.push('/checkout/shipping')}
                >
                  {t('cart.checkout.proceedToPayment')}
                </Button>
              </div>
              
              <div className="text-center mt-4">
                <Link 
                  href="/shop" 
                  className="text-sm font-medium text-[var(--primary)] hover:text-[var(--hover-primary)] hover:underline cursor-pointer"
                >
                  {t('button.continueShopping')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
