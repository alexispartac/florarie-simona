import React from 'react';
import Skeleton from 'react-loading-skeleton';

/**
 * Skeleton loader for Related Products section
 * Simplified version for related products grid
 */
export const RelatedProductsSkeleton: React.FC = () => {
  return (
    <section className="mt-16">
      {/* Section Title */}
      <Skeleton width={250} height={32} className="mb-6" />
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div 
            key={i}
            className="block overflow-hidden rounded-lg bg-[var(--card)] border border-[var(--border)]"
          >
            {/* Image - h-64 */}
            <Skeleton height={256} />
            
            {/* Product Info */}
            <div className="p-4">
              {/* Product Name */}
              <Skeleton height={20} className="mb-2" />
              
              {/* Price */}
              <Skeleton width="40%" height={16} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProductsSkeleton;
