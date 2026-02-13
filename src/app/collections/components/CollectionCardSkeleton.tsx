import React from 'react';
import Skeleton from 'react-loading-skeleton';

/**
 * Skeleton loader for Collection Card
 * Matches collection cards layout in collections/page.tsx
 */
export const CollectionCardSkeleton: React.FC = () => {
  return (
    <div className="bg-[var(--card)] rounded-lg overflow-hidden shadow-md border border-[var(--border)]">
      {/* Image Section - h-64 */}
      <div className="relative h-64">
        <Skeleton height={256} />
      </div>
      
      {/* Content Section */}
      <div className="p-6">
        {/* Collection Title */}
        <Skeleton height={28} width="75%" className="mb-2" />
        
        {/* Description - 3 lines */}
        <Skeleton count={3} className="mb-4" />
        
        {/* View Collection Link */}
        <Skeleton width={130} height={20} />
      </div>
    </div>
  );
};

export default CollectionCardSkeleton;
