'use client';

import { useState, useRef, useEffect } from 'react';
import { Star } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProductReview } from '@/types/products';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/context/ToastContext';


interface AddReviewProps {
  productId: string;
  onReviewSubmit: (review: ProductReview) => Promise<{ status: number } | undefined>;
}

export function AddReview({ productId, onReviewSubmit }: AddReviewProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [title, setTitle] = useState('');
    const [userName, setUserName] = useState('');
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const { toast } = useToast();

    const toastRef = useRef(toast);

    useEffect(() => {
        toastRef.current = toast;
    }, [toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toastRef.current?.({
                title: 'Rating Required',
                description: 'Please select a rating before submitting your review.',
            });
            return;
        }

        setIsSubmitting(true);
        setShowSuccess(false);
        
        try {
            const response = await onReviewSubmit({
                id: uuidv4(),
                productId,
                userId: 'anonymous',
                userName,
                rating,
                title,
                comment,
                verifiedPurchase: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });

            if (response && response.status === 200) {
                // Reset form after successful submission
                setRating(0);
                setTitle('');
                setComment('');
                setUserName('');
                setShowSuccess(true);
                
                setTimeout(() => {
                    toastRef.current?.({
                        title: 'Review Submitted',
                        description: 'Thank you for your review!',
                    });
                }, 100);
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    setShowSuccess(false);
                }, 5000);
            } else {
                throw new Error('Failed to submit review');
            }
        } catch (error) {
            console.error('Failed to submit review:', error);
            
            setTimeout(() => {
                toastRef.current?.({
                    title: 'Review Submission Failed',
                    description: 'There was an error submitting your review. Please try again.',
                });
            }, 100);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-8 border-t border-[var(--border)] pt-8">
            <h3 className="serif-font text-lg font-medium text-[var(--foreground)] mb-4">Write a Review</h3>
            
            {showSuccess && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="font-semibold">Review submitted successfully!</p>
                        <p className="text-sm mt-1">Thank you for sharing your experience with us.</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                        Your Rating <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="p-1 focus:outline-none"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                aria-label={`Rate ${star} out of 5`}
                            >
                                <Star
                                    className={`h-6 w-6 ${(hoverRating || rating) >= star
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-[var(--muted-foreground)]'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="userName" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                        Your Name</label>
                    <Input
                        type="text"
                        id="userName"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full px-3 py-2 border border-[var(--border)] rounded-md shadow-sm focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-[var(--card)] text-[var(--foreground)]"
                        placeholder="Enter your name"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                        Review Title
                    </label>
                    <Input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-[var(--border)] rounded-md shadow-sm focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-[var(--card)] text-[var(--foreground)]"
                        placeholder="Great product!"
                        required
                        maxLength={100}
                    />
                </div>

                <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                        Your Review <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="comment"
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full px-3 py-2 border border-[var(--border)] rounded-md shadow-sm focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-[var(--card)] text-[var(--foreground)]"
                        placeholder="Share your experience with this product..."
                        required
                    />
                </div>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={isSubmitting || rating === 0}
                        variant="primary"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
