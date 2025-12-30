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
  onReviewSubmit: (review: ProductReview) => Promise<Response | undefined>;
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
        if (rating === 0) return;

        setIsSubmitting(true);
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
                setTimeout(() => {
                    toastRef.current?.({
                        title: 'Review Submitted',
                        description: 'Thank you for your review!',
                    });
                }, 100);
            }
            // Reset form after successful submission
            setRating(0);
            setTitle('');
            setComment('');
            setUserName('');
            setShowSuccess(true);
        } catch (error) {
            console.error('Failed to submit review:', error);
            setShowSuccess(false);            
            setTimeout(() => {
                toastRef.current?.({
                    title: 'Review Submission Failed',
                    description: 'There was an error submitting your review. Please try again.',
                });
            }, 100);
        }
    };

    return (
        <div className="mt-8 border-t border-gray-200 pt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Write a Review</h3>
            {isSubmitting && <div className="mt-4 px-3 py-2 bg-green-100 text-green-800 my-2 rounded">Submitting your review...</div>}
            {showSuccess && <div className="mt-4 px-3 py-2 bg-green-100 text-green-800 my-2 rounded">Review submitted successfully!</div>}
            {!isSubmitting && rating === 0 && title === '' && comment === '' && <div className="mt-4 px-3 py-2 bg-yellow-100 text-yellow-800 my-2 rounded">Please fill out the form to submit your review. Your feedback helps us improve our products and serve you better! Thank you for sharing your experience with us.</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                            : 'text-gray-300'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name</label>
                    <Input
                        type="text"
                        id="userName"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                        placeholder="Enter your name"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Review Title
                    </label>
                    <Input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                        placeholder="Great product!"
                        required
                        maxLength={100}
                    />
                </div>

                <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Review <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="comment"
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                        placeholder="Share your experience with this product..."
                        required
                    />
                </div>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={isSubmitting || rating === 0}
                        className="px-4 py-2 cursor-pointer"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
