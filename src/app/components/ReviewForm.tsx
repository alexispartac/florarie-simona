'use client';
import React, { useState, useEffect, useRef } from 'react';
import { TextInput, Textarea, Loader } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck, IconX, IconStar } from '@tabler/icons-react';
import { useUser } from './context/ContextUser';
import { motion } from 'framer-motion';

interface ReviewFormProps {
    productTitle: string;
    onSubmit: (values: { name: string; email: string; message: string; avatar: string }) => Promise<void>;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [isVisible, setIsVisible] = useState(false);
    const reviewRef = useRef<HTMLDivElement>(null);

    const reviewForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            avatar: user.userInfo.avatar,
            name: '',
            email: '',
            message: '',
        },
        transformValues: (values) => ({
            avatar: `${values.avatar}`,
            name: `${values.name}`,
            email: `${values.email}`,
            message: `${values.message}`,
        }),
    });

    const handleSubmit = async (values: { name: string; email: string; message: string; avatar: string }) => {
        setLoading(true);
        setStatus('idle');

        try {
            await onSubmit(values);
            setStatus('success');
            reviewForm.reset();
        } catch (error) {
            console.log('Error submitting review:', error);
            setStatus('error');
        } finally {
            setLoading(false);
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const isCurrentlyVisible = entry.intersectionRatio > 0.3;
                    if (isCurrentlyVisible !== isVisible) {
                        setIsVisible(isCurrentlyVisible);
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (reviewRef.current) {
            observer.observe(reviewRef.current);
        }

        return () => {
            if (reviewRef.current) {
                observer.unobserve(reviewRef.current);
            }
        };
    }, [isVisible]);

    return (
        <motion.div
            ref={reviewRef}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-12 max-w-4xl mx-auto my-16"
        >
            {/* Header Section */}
            <div className="text-center mb-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="inline-block p-3 bg-yellow-100 rounded-full mb-4"
                >
                    <IconStar className="text-3xl text-yellow-600" size={24} />
                </motion.div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    Lasă o recenzie
                </h3>
                <p className="text-gray-600">
                    Împărtășește experiența ta cu Buchetul Simonei
                </p>
            </div>

            {/* Success/Error Messages */}
            {status === 'success' && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3"
                >
                    <IconCheck className="text-green-600" size={20} />
                    <span className="text-green-700 font-medium">Recenzia ta a fost trimisă cu succes! Mulțumim!</span>
                </motion.div>
            )}

            {status === 'error' && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3"
                >
                    <IconX className="text-red-600" size={20} />
                    <span className="text-red-700 font-medium">A apărut o eroare. Te rugăm să încerci din nou.</span>
                </motion.div>
            )}

            {/* Authentication Warning */}
            {!user.isAuthenticated && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3"
                >
                    <div className="text-blue-600">ℹ️</div>
                    <span className="text-blue-700 font-medium">
                        Trebuie să fii autentificat pentru a lăsa o recenzie.
                    </span>
                </motion.div>
            )}

            {/* Form */}
            <form
                onSubmit={reviewForm.onSubmit((values) => handleSubmit(values))}
                className="space-y-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nume Input */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <TextInput
                            label="Nume"
                            placeholder="Introduceți numele dvs."
                            required
                            autoFocus={false}
                            size="md"
                            radius="lg"
                            styles={{
                                input: {
                                    border: '1px solid #e5e7eb',
                                    '&:focus': {
                                        borderColor: '#ec4899',
                                        boxShadow: '0 0 0 1px #ec4899',
                                    },
                                },
                                label: {
                                    fontWeight: 600,
                                    color: '#374151',
                                    marginBottom: '8px',
                                },
                            }}
                            key={reviewForm.key('name')}
                            {...reviewForm.getInputProps('name')}
                        />
                    </motion.div>

                    {/* Email Input */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <TextInput
                            label="Email"
                            placeholder="exemplu@email.com"
                            required
                            autoFocus={false}
                            type="email"
                            size="md"
                            radius="lg"
                            styles={{
                                input: {
                                    border: '1px solid #e5e7eb',
                                    '&:focus': {
                                        borderColor: '#ec4899',
                                        boxShadow: '0 0 0 1px #ec4899',
                                    },
                                },
                                label: {
                                    fontWeight: 600,
                                    color: '#374151',
                                    marginBottom: '8px',
                                },
                            }}
                            key={reviewForm.key('email')}
                            {...reviewForm.getInputProps('email')}
                        />
                    </motion.div>
                </div>

                {/* Message Textarea */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <Textarea
                        label="Mesajul dvs."
                        placeholder="Spuneți-ne despre experiența dvs. cu florile noastre..."
                        required
                        minRows={4}
                        size="md"
                        radius="lg"
                        styles={{
                            input: {
                                border: '1px solid #e5e7eb',
                                '&:focus': {
                                    borderColor: '#ec4899',
                                    boxShadow: '0 0 0 1px #ec4899',
                                },
                            },
                            label: {
                                fontWeight: 600,
                                color: '#374151',
                                marginBottom: '8px',
                            },
                        }}
                        key={reviewForm.key('message')}
                        {...reviewForm.getInputProps('message')}
                    />
                </motion.div>

                {/* Submit Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="flex justify-center pt-4"
                >
                    <button
                        type="submit"
                        disabled={loading || !user.isAuthenticated}
                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#b756a64f] text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? (
                            <>
                                <Loader size="sm" color="white" />
                                <span>Se trimite...</span>
                            </>
                        ) : status === 'success' ? (
                            <>
                                <IconCheck size={20} />
                                <span>Trimis cu succes!</span>
                            </>
                        ) : status === 'error' ? (
                            <>
                                <IconX size={20} />
                                <span>Eroare! Încearcă din nou</span>
                            </>
                        ) : (
                            <>
                                <span>Trimite recenzia</span>
                                <span className="text-lg group-hover:rotate-12 transition-transform duration-300">✨</span>
                            </>
                        )}
                    </button>
                </motion.div>
            </form>

            {/* Footer info */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="mt-8 pt-6 border-t border-gray-100 text-center"
            >
                <p className="text-sm text-gray-500">
                    Recenzia dvs. ne ajută să îmbunătățim serviciile și să oferim experiențe și mai frumoase. 🌸
                </p>
            </motion.div>
        </motion.div>
    );
};

export default ReviewForm;