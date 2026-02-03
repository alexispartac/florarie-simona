'use client';

import { useEffect, useRef } from 'react';
import { FiX, FiShoppingBag, FiPlus, FiMinus } from 'react-icons/fi';
import { useShop } from '@/context/ShopContext';
import Link from 'next/link';
import Image from 'next/image';
import Button from './ui/Button';
import { useLanguage } from '@/context/LanguageContext';

type CartProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Cart({ isOpen, onClose }: CartProps) {
  const { cart, removeFromCart, updateCartItemQuantity, getCartTotal, getPriceShipping } = useShop();
  const cartRef = useRef<HTMLDivElement>(null);

  const { t } = useLanguage();

  // Close when clicking outside
  useEffect(() => {

    // Close on escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Calculate total price
  const subtotal = getCartTotal();
  const shipping = getPriceShipping();
  const total = subtotal + shipping;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-[var(--primary)]/50 backdrop-blur-sm h-screen" />
      <div 
        ref={cartRef}
        className="fixed inset-y-0 right-0 w-full max-w-md bg-[var(--card)] shadow-lg h-screen"
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        <div className="flex flex-col h-screen">
          <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">{t('cart.title')}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[var(--accent)] transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <FiShoppingBag className="w-12 h-12 text-[var(--muted-foreground)] mb-4" />
                <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">{t('cart.empty')}</h3>
                <p className="text-[var(--muted-foreground)] mb-6">{t('cart.description')}</p>
                <Button
                  onClick={onClose}
                  variant="primary"
                >
                  {t('button.continueShopping')}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item, index) => (
                  <div key={`${item.productId}-${index}`} className="flex items-start gap-4 p-3 border-b border-[var(--border)]">
                    <div className="relative w-20 h-20 shrink-0">
                      {item.image ? (
                      <Image
                          src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                      ) : (
                        <div className="w-full h-full bg-[var(--muted)] rounded flex items-center justify-center">
                          🌸
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Link 
                        href={`/shop/${item.productId}`}
                        className="font-medium text-[var(--foreground)] hover:underline line-clamp-1 cursor-pointer"
                        onClick={onClose}
                      >
                        {item.name}
                      </Link>
                      <div className="text-sm text-[var(--muted-foreground)] space-y-0.5">
                        <p>{(item.price / 100).toFixed(2)} RON</p>
                        {item.customMessage && (
                          <p className="italic text-xs truncate">💌 {item.customMessage}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <div className="flex items-center">
                            <button
                              onClick={() => {
                                updateCartItemQuantity(item, item.quantity - 1);
                              }}
                              className="px-2 py-1 text-[var(--muted-foreground)] hover:bg-[var(--accent)] transition-colors cursor-pointer"
                              disabled={item.quantity <= 1}
                            >
                              <FiMinus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm text-[var(--foreground)]">{item.quantity}</span>
                            <button
                              onClick={() => {
                                updateCartItemQuantity(item, item.quantity + 1);
                              }}
                              disabled={item.stock !== undefined && item.quantity >= item.stock}
                              className={`px-2 py-1 transition-colors ${
                                item.stock !== undefined && item.quantity >= item.stock
                                  ? 'text-[var(--muted-foreground)] cursor-not-allowed opacity-50'
                                  : 'text-[var(--muted-foreground)] hover:bg-[var(--accent)] cursor-pointer'
                              }`}
                            >
                              <FiPlus className="w-3 h-3" />
                            </button>
                          </div>
                          {item.stock !== undefined && item.quantity >= item.stock && (
                            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                              Max: {item.stock}
                            </p>
                          )}
                        </div>
                      <button
                          onClick={() => {
                            removeFromCart(item);
                          }}
                          className="text-xs text-[var(--destructive)] hover:text-[var(--destructive)]/80 cursor-pointer hover:underline"
                        >
                          {t('cart.removeItem')}
                        </button>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-[var(--foreground)]">
                      {((item.price * item.quantity) / 100).toFixed(2)} RON
                    </div>
                  </div>
                ))}

                {/* Order Summary */}
                <div className="border-t border-[var(--border)] pt-4 mt-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--muted-foreground)]">Subtotal</span>
                      <span className="text-[var(--foreground)]">{(subtotal / 100).toFixed(2)} RON</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--muted-foreground)]">Shipping</span>
                      <span className="text-[var(--foreground)]">{shipping > 0 ? `${(shipping / 100).toFixed(2)} RON` : 'Free'}</span>
                    </div>
                    <div className="flex justify-between font-medium text-base pt-2 border-t border-[var(--border)] mt-2">
                      <span className="text-[var(--foreground)]">Total</span>
                      <span className="text-[var(--foreground)]">{(total / 100).toFixed(2)} RON</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-4 border-t border-[var(--border)]">
              <Link
                href="/checkout/cart"
                className="block w-full text-center py-3 px-4 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md hover:bg-[var(--hover-primary)] transition-colors"
                onClick={onClose}
              >
                {t('button.checkout')} {((total / 100).toFixed(2))} RON
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
