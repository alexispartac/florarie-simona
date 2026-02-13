import React from 'react';
import Skeleton from 'react-loading-skeleton';

/**
 * Skeleton loader for Event Card
 * Matches event cards layout in events/page.tsx
 */
export const EventCardSkeleton: React.FC = () => {
  return (
    <div className="bg-[var(--card)] rounded-lg shadow-md overflow-hidden border border-[var(--border)]">
      {/* Event Image - h-64 */}
      <div className="relative h-64">
        <Skeleton height={256} />
      </div>
      
      {/* Event Content */}
      <div className="p-6">
        {/* Event Title - 2 lines */}
        <Skeleton count={2} className="mb-2" />
        
        {/* Date and Location */}
        <div className="flex flex-col gap-2 mb-3">
          <Skeleton width="60%" height={16} />
          <Skeleton width="50%" height={16} />
        </div>
        
        {/* Description - 3 lines */}
        <Skeleton count={3} className="mb-4" />
        
        {/* Stats Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
          <div className="flex gap-4">
            <Skeleton width={48} height={20} />
            <Skeleton width={32} height={20} />
          </div>
          <Skeleton width={80} height={20} />
        </div>
      </div>
    </div>
  );
};

export default EventCardSkeleton;
