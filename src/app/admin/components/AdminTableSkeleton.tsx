import React from 'react';
import Skeleton from 'react-loading-skeleton';

interface AdminTableSkeletonProps {
  rows?: number;
  withImage?: boolean;
  withSearch?: boolean;
  withAddButton?: boolean;
  columns?: number;
}

export const AdminTableSkeleton: React.FC<AdminTableSkeletonProps> = ({
  rows = 10,
  withImage = true,
  withSearch = true,
  withAddButton = true,
  columns = 5,
}) => {
  return (
    <div className="p-6">
      {/* Header with Search and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <Skeleton width={150} height={28} />
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {withSearch && (
            <Skeleton width={256} height={40} className="rounded-lg" />
          )}
          {withAddButton && (
            <Skeleton width={140} height={40} className="rounded-lg" />
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid gap-4 p-4 border-b border-[var(--border)] bg-[var(--secondary)]" style={{ gridTemplateColumns: withImage ? '80px 1fr repeat(' + (columns - 2) + ', 1fr) 120px' : 'repeat(' + columns + ', 1fr) 120px' }}>
          {withImage && <Skeleton width={40} height={16} />}
          {Array.from({ length: columns - (withImage ? 1 : 0) }).map((_, i) => (
            <Skeleton key={i} width="60%" height={16} />
          ))}
          <Skeleton width={60} height={16} />
        </div>

        {/* Table Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-4 p-4 border-b border-[var(--border)] items-center"
            style={{ gridTemplateColumns: withImage ? '80px 1fr repeat(' + (columns - 2) + ', 1fr) 120px' : 'repeat(' + columns + ', 1fr) 120px' }}
          >
            {withImage && (
              <Skeleton width={64} height={64} className="rounded" />
            )}
            {Array.from({ length: columns - (withImage ? 1 : 0) }).map((_, colIndex) => (
              <div key={colIndex}>
                <Skeleton width={colIndex === 0 ? "90%" : "70%"} height={16} />
              </div>
            ))}
            <div className="flex gap-2">
              <Skeleton width={32} height={32} className="rounded" />
              <Skeleton width={32} height={32} className="rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Skeleton width={150} height={20} />
        <div className="flex items-center gap-2">
          <Skeleton width={80} height={36} className="rounded-lg" />
          <Skeleton width={40} height={36} className="rounded-lg" />
          <Skeleton width={40} height={36} className="rounded-lg" />
          <Skeleton width={40} height={36} className="rounded-lg" />
          <Skeleton width={80} height={36} className="rounded-lg" />
        </div>
      </div>
    </div>
  );
};
