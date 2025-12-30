'use client';

import { useEffect, useRef } from 'react';
import { FiX, FiHeart } from 'react-icons/fi';
import { useShop } from '@/context/ShopContext';
import Link from 'next/link';
import Image from 'next/image';
import Button from './ui/Button';

type WishlistProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Wishlist({ isOpen, onClose }: WishlistProps) {
  const { wishlist, removeFromWishlist } = useShop();
  const wishlistRef = useRef<HTMLDivElement>(null);

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
      <div className="absolute inset-0 bg-primary/50 backdrop-blur-sm h-screen" />
      <div 
        ref={wishlistRef}
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-lg h-screen
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-screen">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Your Wishlist</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close wishlist"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {wishlist.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <FiHeart className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-500 mb-6">Save items you love by clicking the heart icon</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlist.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4 p-3 border-b border-gray-100">
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
                        href={`/shop/${item.productId}`}
                        className="font-medium hover:underline line-clamp-1"
                        onClick={onClose}
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                    </div>
                    <Button
                      onClick={() => {
                        removeFromWishlist(item.productId);
                      }}
                      variant='primary'
                      className="p-2 cursor-pointer"
                      aria-label="Remove from wishlist"
                    >
                      Remove
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
