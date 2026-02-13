import React from 'react';
import Skeleton from 'react-loading-skeleton';

/**
 * Skeleton loader for Product Detail Page
 * Complete layout matching [id]/page.tsx
 */
export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-24 bg-[var(--primary-background)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Product Images */}
        <div>
          {/* Main Image */}
          <div className="mb-4 rounded-lg overflow-hidden">
            <Skeleton height={600} />
          </div>
          
          {/* Thumbnail Grid */}
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} height={96} />
            ))}
          </div>
        </div>
        
        {/* Right Column - Product Info */}
        <div className="md:pl-8">
          {/* Product Title */}
          <Skeleton height={36} className="mb-2" />
          
          {/* Price */}
          <Skeleton width={120} height={32} className="mb-4" />
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} circle width={20} height={20} />
              ))}
            </div>
            <Skeleton width={80} height={16} />
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <Skeleton count={3} />
          </div>
          
          {/* Flower Details Box */}
          <div className="mb-6 p-4 bg-[var(--secondary)] rounded-lg border border-[var(--border)]">
            <div className="space-y-3">
              <div>
                <Skeleton width={100} height={20} className="mb-2" />
                <div className="flex gap-2">
                  <Skeleton width={80} height={28} />
                  <Skeleton width={80} height={28} />
                  <Skeleton width={80} height={28} />
                </div>
              </div>
              <div>
                <Skeleton width={120} height={20} className="mb-2" />
                <div className="flex gap-2">
                  <Skeleton width={90} height={28} />
                  <Skeleton width={90} height={28} />
                </div>
              </div>
              <Skeleton width={150} height={16} />
              <Skeleton width={180} height={16} />
            </div>
          </div>
          
          {/* Quantity Selector */}
          <div className="mb-6">
            <Skeleton width={100} height={20} className="mb-2" />
            <Skeleton width={120} height={40} />
          </div>
          
          {/* Stock Availability */}
          <div className="mb-6">
            <Skeleton height={80} />
          </div>
          
          {/* Wishlist Button */}
          <Skeleton height={48} className="mb-3" />
          
          {/* Add to Cart Button */}
          <Skeleton height={56} />
        </div>
      </div>
      
      {/* Product Tabs Section */}
      <div className="mt-16">
        {/* Tabs Header */}
        <div className="flex gap-2 mb-8">
          <Skeleton width={120} height={40} />
          <Skeleton width={120} height={40} />
          <Skeleton width={120} height={40} />
        </div>
        
        {/* Tab Content */}
        <div className="space-y-4">
          <Skeleton width={200} height={24} className="mb-4" />
          <Skeleton count={4} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Skeleton height={128} />
            <Skeleton height={128} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
