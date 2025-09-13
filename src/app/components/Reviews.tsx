'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, Loader } from '@mantine/core';
import { motion } from 'framer-motion';
import { IconUser } from '@tabler/icons-react';

interface Review {
    id: string;
    name: string;
    email: string;
    product: string;
    avatar: string;
    message: string;
    createdAt: string;
}

const URL_REVIEW = '/api/review';
const Reviews: React.FC<{ product: string }> = ({ product }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [visibleReviews, setVisibleReviews] = useState(3);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const response = await axios.get(URL_REVIEW);
                const data = response.data as Review[];
                setReviews(data);
            } catch (err) {
                console.log('Error fetching reviews:', err);
                setError('A apărut o eroare la încărcarea recenziilor.');
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [product]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="text-center">
                    <Loader size="lg" color="#b756a6" />
                    <p className="mt-4 text-gray-600">Se încarcă recenziile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
            >
                <div className="text-4xl mb-4">😞</div>
                <p className="text-red-600 font-medium">A apărut o eroare la încărcarea recenziilor</p>
            </motion.div>
        );
    }

    if (reviews.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
            >
                <div className="text-4xl mb-4">💭</div>
                <p className="text-gray-600 font-medium">Nu există recenzii încă</p>
            </motion.div>
        );
    }

    const loadMore = () => {
        setVisibleReviews((prev) => Math.min(prev + 5, reviews.length));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white max-w-4xl mx-auto mt-8"
        >
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Recenzii ({reviews.length})
                </h2>
                <p className="text-gray-600">
                    Ce spun clienții noștri
                </p>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.slice(0, visibleReviews).map((review, index) => (
                    <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300"
                    >
                        {/* Review Header */}
                        <div className="flex items-center gap-4 mb-4">
                            {/* Avatar */}
                            {review.avatar ? (
                                <Avatar
                                    src={review.avatar}
                                    size="md"
                                    radius="xl"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#b756a64f' }}>
                                    <IconUser className="text-gray-600" size={20} />
                                </div>
                            )}

                            {/* User Info */}
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-800">
                                        {review.name}
                                    </h3>
                                    <span className="text-sm text-gray-500">
                                        {new Date(review.createdAt).toLocaleDateString('ro-RO')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Review Message */}
                        <div className="pl-14">
                            <p className="text-gray-700 leading-relaxed">
                                {review.message}
                            </p>
                        </div>

                        {/* Rating */}
                        <div className="pl-14 mt-3">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-yellow-400">⭐</span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Load More Button */}
            {visibleReviews < reviews.length && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-center mt-8"
                >
                    <button
                        onClick={loadMore}
                        className="px-6 py-3 text-gray-700 font-medium rounded-xl border border-gray-300 hover:shadow-md transition-all duration-300"
                        style={{ backgroundColor: '#b756a64f' }}
                    >
                        Vezi mai multe ({reviews.length - visibleReviews})
                    </button>
                </motion.div>
            )}

            {/* Simple Stats */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <div className="flex justify-center items-center gap-8">
                    <div>
                        <div className="text-xl font-bold" style={{ color: '#b756a6' }}>
                            {reviews.length}
                        </div>
                        <div className="text-gray-600 text-sm">
                            Recenzii
                        </div>
                    </div>
                    <div>
                        <div className="text-xl font-bold" style={{ color: '#b756a6' }}>
                            5.0 ⭐
                        </div>
                        <div className="text-gray-600 text-sm">
                            Rating
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Reviews;