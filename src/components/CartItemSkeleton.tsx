import React from 'react';
import Skeleton from 'react-loading-skeleton';

interface CartItemSkeletonProps {
  /**
   * Number of skeleton items to display
   * @default 3
   */
  count?: number;
}

/**
 * Skeleton loader for Cart Items
 * Matches cart item layout in Cart.tsx
 */
export const CartItemSkeleton: React.FC<CartItemSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index}
          className="flex items-start gap-4 p-3 border-b border-[var(--border)]"
        >
          {/* Product Image */}
          <Skeleton width={80} height={80} className="shrink-0" />
          
          {/* Product Info */}
          <div className="flex-1">
            {/* Product Name */}
            <Skeleton width="75%" height={20} className="mb-2" />
            
            {/* Price and Details */}
            <Skeleton width="40%" height={16} className="mb-1" />
            <Skeleton width="50%" height={14} />
            
            {/* Quantity Selector and Remove Button */}
            <div className="flex items-center justify-between mt-2">
              <Skeleton width={96} height={32} />
              <Skeleton width={60} height={16} />
            </div>
          </div>
          
          {/* Item Total Price */}
          <Skeleton width={80} height={20} />
        </div>
      ))}
    </div>
  );
};

export default CartItemSkeleton;
