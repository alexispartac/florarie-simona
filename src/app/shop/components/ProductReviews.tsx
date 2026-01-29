import { Star } from 'lucide-react';
import { ProductReview } from '@/types/products';
import Image from 'next/image';
import { useState } from 'react';
import { ImageModal } from './ImageModal';

interface ProductReviewsProps {
  reviews: ProductReview[];
  averageRating?: number;
  reviewCount: number;
}

export function ProductReviews({ reviews, averageRating, reviewCount }: ProductReviewsProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [selectedReviewImages, setSelectedReviewImages] = useState<string[]>([]);

  const handleImageClick = (images: string[] = [], index: number) => {
    setSelectedReviewImages(images);
    setSelectedImageIndex(index);
  };

  if (reviewCount === 0) {
    return (
      <section className="mt-16">
        <h2 className="serif-font text-2xl font-bold mb-6 text-[var(--foreground)]">Customer Reviews</h2>
        <p className="text-[var(--muted-foreground)]">No reviews yet. Be the first to review this product!</p>
      </section>
    );
  }

  return (
    <section className="mt-16">
      <ImageModal
        isOpen={selectedImageIndex !== null}
        onClose={() => setSelectedImageIndex(null)}
        images={selectedReviewImages}
        initialIndex={selectedImageIndex ?? 0}
      />
      <div className="flex items-center justify-between mb-6">
        <h2 className="serif-font text-2xl font-bold text-[var(--foreground)]">Customer Reviews</h2>
        {averageRating !== undefined && (
          <div className="flex items-center">
            <div className="flex items-center mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-[var(--muted-foreground)]'
                  }`}
                />
              ))}
            </div>
            <span className="text-[var(--foreground)]">{averageRating.toFixed(1)} ({reviewCount} reviews)</span>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-[var(--border)] pb-6 last:border-0 last:pb-0">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-medium text-[var(--foreground)]">{review.userName}</h3>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-[var(--muted-foreground)]'
                      }`}
                    />
                  ))}
                </div>
              </div>
              {review.verifiedPurchase && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  Verified Purchase
                </span>
              )}
            </div>
            
            <h4 className="font-medium text-lg mb-1 text-[var(--foreground)]">{review.title}</h4>
            <p className="text-[var(--muted-foreground)] mb-3 serif-light">{review.comment}</p>
            
            {review.images && review.images.length > 0 && (
              <div className="flex space-x-2 mt-2">
                {review.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleImageClick(review.images, idx)}
                    className="w-16 h-16 border border-[var(--border)] rounded overflow-hidden hover:opacity-90 transition-opacity"
                    aria-label={`View image ${idx + 1} in full screen`}
                  >
                    <Image 
                      src={img} 
                      width={100}
                      height={100}
                      alt={`"${review.title}" review image ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            
            <p className="text-sm text-[var(--muted-foreground)] mt-2">
              Reviewed on {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
