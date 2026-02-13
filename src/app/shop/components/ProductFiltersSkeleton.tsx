import React from 'react';
import Skeleton from 'react-loading-skeleton';

export const ProductFiltersSkeleton: React.FC = () => {
  return (
    <div className="mb-8">
      {/* Header Bar Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Toggle Filters Button Skeleton */}
          <Skeleton width={150} height={40} className="rounded-lg" />
        </div>
        
        <div className="flex items-center gap-3">
          {/* Sort Dropdown Skeleton */}
          <Skeleton width={180} height={40} className="rounded-lg" />
        </div>
      </div>

      {/* Desktop Filters Skeleton */}
      <div className="hidden md:block bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 mb-6">
        <div className="space-y-6">
          {/* Categories Skeleton */}
          <div>
            <Skeleton width={100} height={20} className="mb-3" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} width={100} height={36} className="rounded-lg" />
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--border)]"></div>

          {/* Colors Skeleton */}
          <div>
            <Skeleton width={80} height={20} className="mb-3" />
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} width={90} height={38} className="rounded-lg" />
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--border)]"></div>

          {/* Occasions Skeleton */}
          <div>
            <Skeleton width={90} height={20} className="mb-3" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 11 }).map((_, i) => (
                <Skeleton key={i} width={110} height={36} className="rounded-lg" />
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--border)]"></div>

          {/* Delivery Skeleton */}
          <div>
            <Skeleton width={70} height={20} className="mb-3" />
            <Skeleton width={160} height={36} className="rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};
