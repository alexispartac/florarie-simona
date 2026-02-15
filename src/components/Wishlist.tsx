'use client';

import { useEffect, useRef } from 'react';
import { FiX, FiHeart } from 'react-icons/fi';
import { useShop } from '@/context/ShopContext';
import Link from 'next/link';
import Image from 'next/image';
import Button from './ui/Button';
import { useLanguage } from '@/context/LanguageContext';

type WishlistProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Wishlist({ isOpen, onClose }: WishlistProps) {
  const { wishlist, removeFromWishlist } = useShop();
  const wishlistRef = useRef<HTMLDivElement>(null);
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
      // delete this line of code if the cart will have hidden background when i want to open it
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-[var(--primary)]/50 backdrop-blur-sm h-screen" />
      <div 
        ref={wishlistRef}
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-[var(--card)] shadow-lg h-screen
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-screen">
          <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">{t('wishlist.title')}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[var(--accent)] transition-colors cursor-pointer"
              aria-label="Close wishlist"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {wishlist.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <FiHeart className="w-12 h-12 text-[var(--muted-foreground)] mb-4" />
                <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">{t('wishlist.empty')}</h3>
                <p className="text-[var(--muted-foreground)] mb-6">{t('wishlist.description')}</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md hover:bg-[var(--hover-primary)] transition-colors cursor-pointer"
                >
                  {t('button.continueShopping')}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlist.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4 p-3 border-b border-[var(--border)]">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.images?.[0] || '/placeholder-product.jpg'}
                        alt={item.name || 'Product'}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <Link 
                        href={`/shop/${item.productId}?slug=${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="font-medium text-[var(--foreground)] hover:underline line-clamp-1"
                        onClick={onClose}
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-[var(--muted-foreground)]">{(item.price / 100).toFixed(2)} RON</p>
                    </div>
                    <Button
                      onClick={() => {
                        removeFromWishlist(item.productId);
                      }}
                      variant='primary'
                      aria-label="Remove from wishlist"
                    >
                      {t('button.remove')}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
