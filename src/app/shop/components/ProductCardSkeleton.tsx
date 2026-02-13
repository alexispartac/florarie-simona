import React from 'react';
import Skeleton from 'react-loading-skeleton';

/**
 * Skeleton loader for ProductCard component
 * Uses react-loading-skeleton library with theme integration
 */
export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-[var(--card)] rounded-lg overflow-hidden shadow-sm border border-[var(--border)]">
      {/* Image - aspect-square */}
      <Skeleton height={300} />
      
      <div className="p-4">
        {/* Title - 2 lines */}
        <Skeleton count={2} className="mb-2" />
        
        {/* Category */}
        <Skeleton width="60%" className="mb-2" />
        
        {/* Color dots */}
        <div className="flex gap-1 mb-2">
          <Skeleton circle width={16} height={16} />
          <Skeleton circle width={16} height={16} />
          <Skeleton circle width={16} height={16} />
          <Skeleton width={24} height={12} />
        </div>
        
        {/* Price and rating */}
        <div className="flex justify-between mt-3">
          <Skeleton width={80} height={24} />
          <Skeleton width={60} height={20} />
        </div>
        
        {/* Stock indicator */}
        <Skeleton width="70%" height={20} className="mt-3" />
        
        {/* View Details Button */}
        <Skeleton height={40} className="mt-3" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
