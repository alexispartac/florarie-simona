import React from 'react';
import Skeleton from 'react-loading-skeleton';

interface SeasonalCollectionsSkeletonProps {
  count?: number;
}

export const SeasonalCollectionsSkeleton: React.FC<SeasonalCollectionsSkeletonProps> = ({
  count = 3,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Skeleton width={200} height={32} />
        <Skeleton width={150} height={40} className="rounded-lg" />
      </div>

      {/* Collection Cards */}
      <div className="grid gap-4">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Image Skeleton */}
              <div className="w-full md:w-48 h-48 flex-shrink-0">
                <Skeleton height={192} className="rounded-lg" />
              </div>

              {/* Content Skeleton */}
              <div className="flex-1 space-y-3">
                {/* Title and Status */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Skeleton width="60%" height={24} className="mb-1" />
                    <Skeleton width="80%" height={16} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton width={100} height={24} className="rounded-full" />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i}>
                      <Skeleton width={60} height={14} className="mb-1" />
                      <Skeleton width={80} height={16} />
                    </div>
                  ))}
                </div>

                {/* Link */}
                <div className="flex items-center gap-2">
                  <Skeleton width={40} height={14} />
                  <Skeleton width={200} height={20} className="rounded" />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-3 border-t border-[var(--border)]">
                  <Skeleton width={100} height={36} className="rounded-lg" />
                  <Skeleton width={120} height={36} className="rounded-lg" />
                  <Skeleton width={90} height={36} className="rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
