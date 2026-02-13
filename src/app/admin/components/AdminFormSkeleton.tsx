import React from 'react';
import Skeleton from 'react-loading-skeleton';

interface AdminFormSkeletonProps {
  title?: string;
  fields?: number;
  withImageUpload?: boolean;
  withRichText?: boolean;
}

export const AdminFormSkeleton: React.FC<AdminFormSkeletonProps> = ({
  title = 'Loading...',
  fields = 8,
  withImageUpload = true,
  withRichText = true,
}) => {
  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Skeleton width={200} height={32} className="mb-2" />
          <Skeleton width={300} height={16} />
        </div>

        {/* Form Card */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 shadow-sm">
          <div className="space-y-6">
            {/* Image Upload Section */}
            {withImageUpload && (
              <div>
                <Skeleton width={120} height={20} className="mb-3" />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} height={150} className="rounded-lg" />
                  ))}
                </div>
                <Skeleton width={150} height={40} className="rounded-lg" />
              </div>
            )}

            {/* Divider */}
            {withImageUpload && <div className="border-t border-[var(--border)]" />}

            {/* Form Fields */}
            <div className="space-y-5">
              {Array.from({ length: fields }).map((_, i) => (
                <div key={i}>
                  <Skeleton width={100} height={16} className="mb-2" />
                  {withRichText && i === Math.floor(fields / 2) ? (
                    // Rich Text Editor Skeleton
                    <div className="space-y-2">
                      <Skeleton height={40} className="rounded-t-lg" />
                      <Skeleton height={200} className="rounded-b-lg" />
                    </div>
                  ) : (
                    // Regular Input Skeleton
                    <Skeleton height={40} className="rounded-lg" />
                  )}
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-[var(--border)]" />

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <Skeleton width={100} height={40} className="rounded-lg" />
              <div className="flex gap-3">
                <Skeleton width={100} height={40} className="rounded-lg" />
                <Skeleton width={120} height={40} className="rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
