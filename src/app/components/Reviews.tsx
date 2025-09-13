'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, Group, Stack } from '@mantine/core';
import Link from 'next/link';

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
        return <p className='flex justify-center'>Se încarcă recenziile...</p>;
    }

    if (error) {
        <Link href={'/404'} />
    }

    if (reviews.length === 0) {
        return <p className='flex justify-center'>Nu există recenzii pentru acest produs.</p>;
    }

    const loadMore = () => {
        setVisibleReviews((prev) => Math.min(prev + 5, reviews.length));
    };

    return (
        <div className="reviews bg-gray-25 p-6 md:p-15 rounded-md">
            <h2 className="text-2xl font-sans text-gray-800 mb-6">Recenzii</h2>
            <ul className="space-y-6">
                {reviews.slice(0, visibleReviews).map((review) => (
                    <li key={review.id} className="p-6 bg-[#b756a64f] rounded-md">
                        <Group dir='row' w={"100%"}>
                            <Avatar w={"3%"} src={review.avatar} />
                            <Stack w={"80%"} gap={0}>
                                <Group justify='space-between' w={"100%"}>
                                    <p className="font-sans text-lg text-gray-900">{review.name}</p>
                                    <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                </Group>
                                <p className="font-sans text-sm text-gray-900">{review.email}</p>
                            </Stack>
                        </Group>
                        <p className="mt-4 text-gray-700">{review.message}</p>
                    </li>
                ))}
            </ul>
            {visibleReviews < reviews.length && (
                <button
                    onClick={loadMore}
                    className="mt-6 px-4 py-2 bg-[#b756a64f] text-white rounded-md shadow-md hover:bg-[#b756a56f] transition"
                >
                    Vezi mai multe recenzii
                </button>
            )}
        </div>
    );

};

export default Reviews;