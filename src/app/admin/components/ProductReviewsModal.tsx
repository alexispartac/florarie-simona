'use client';

import { useState, useEffect } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { Star, Trash2, CheckCircle, X } from 'lucide-react';
import { ProductReview } from '@/types/products';
import { useToast } from '@/context/ToastContext';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

interface ProductReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  onReviewsChange?: () => void;
}

export default function ProductReviewsModal({
  isOpen,
  onClose,
  productId,
  productName,
  onReviewsChange,
}: ProductReviewsModalProps) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ProductReview | null>(null);
  const { toast } = useToast();

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      const product = await response.json();
      console.log('Fetched product:', product); // Debug log
      console.log('Reviews:', product.reviews); // Debug log
      setReviews(product.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to load reviews',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && productId) {
      fetchReviews();
    }
  }, [isOpen, productId]);

  const handleVerifyReview = async (reviewId: string) => {
    try {
      // Get current product
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      const product = await response.json();

      // Update the review to verified
      const updatedReviews = product.reviews.map((review: ProductReview) =>
        review.id === reviewId ? { ...review, verifiedPurchase: true } : review
      );

      // Update product with modified reviews
      const updateResponse = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviews: updatedReviews }),
      });

      if (!updateResponse.ok) throw new Error('Failed to verify review');

      toast({
        title: 'Success',
        description: 'Review verified successfully',
      });

      fetchReviews();
      if (onReviewsChange) onReviewsChange();
    } catch (error) {
      console.error('Error verifying review:', error);
      toast({
        title: 'Error',
        description: 'Failed to verify review',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteReview = async () => {
    if (!selectedReview) return;

    try {
      // Get current product
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      const product = await response.json();

      // Remove the review
      const updatedReviews = product.reviews.filter(
        (review: ProductReview) => review.id !== selectedReview.id
      );

      // Recalculate rating
      let newRating = 0;
      if (updatedReviews.length > 0) {
        const totalRating = updatedReviews.reduce(
          (sum: number, review: ProductReview) => sum + review.rating,
          0
        );
        newRating = Math.round((totalRating / updatedReviews.length) * 10) / 10;
      }

      // Update product
      const updateResponse = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviews: updatedReviews,
          reviewCount: updatedReviews.length,
          rating: newRating,
        }),
      });

      if (!updateResponse.ok) throw new Error('Failed to delete review');

      toast({
        title: 'Success',
        description: 'Review deleted successfully',
      });

      setDeleteModalOpen(false);
      setSelectedReview(null);
      fetchReviews();
      if (onReviewsChange) onReviewsChange();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete review',
        variant: 'destructive',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-[var(--card)] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
            <div>
              <h2 className="text-2xl font-bold text-[var(--foreground)]">Reviews</h2>
              <p className="text-[var(--muted-foreground)] mt-1">{productName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[var(--secondary)] rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Spinner className="w-8 h-8" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12 text-[var(--muted-foreground)]">
                No reviews yet for this product
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border border-[var(--border)] rounded-lg p-4 bg-[var(--card)]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* User and Rating */}
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-[var(--foreground)]">
                            {review.userName}
                          </h3>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-[var(--muted-foreground)]'
                                }`}
                              />
                            ))}
                          </div>
                          {review.verifiedPurchase && (
                            <Badge variant="success" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>

                        {/* Review Title and Comment */}
                        <h4 className="font-medium text-[var(--foreground)] mb-1">
                          {review.title}
                        </h4>
                        <p className="text-[var(--muted-foreground)] text-sm mb-3">
                          {review.comment}
                        </p>

                        {/* Date */}
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {new Date(review.createdAt).toLocaleDateString('ro-RO', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        {!review.verifiedPurchase && (
                          <button
                            onClick={() => handleVerifyReview(review.id)}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors"
                            title="Verify review"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedReview(review);
                            setDeleteModalOpen(true);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                          title="Delete review"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end p-6 border-t border-[var(--border)]">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[var(--secondary)] text-[var(--foreground)] rounded-md hover:bg-[var(--accent)] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedReview(null);
        }}
        onConfirm={handleDeleteReview}
        title="Delete Review"
        message={`Are you sure you want to delete the review by ${selectedReview?.userName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  );
}
