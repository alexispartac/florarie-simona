'use client';
import React, { useState, useEffect, useRef } from 'react';
import { TextInput, Textarea, Loader } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useUser } from './context/ContextUser';

interface ReviewFormProps {
    productTitle: string;
    onSubmit: (values: { name: string; email: string; message: string; avatar: string }) => Promise<void>;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productTitle, onSubmit }) => {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle'); // Stare pentru succes sau eroare
    const [isVisible, setIsVisible] = useState(false); // Stare pentru vizibilitatea completă a secțiunii
    const reviewRef = useRef<HTMLDivElement>(null); // Referință pentru secțiunea de recenzie

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
        setStatus('idle'); // Resetăm starea înainte de trimitere

        try {
            await onSubmit(values);
            setStatus('success'); // Setăm starea la succes
            reviewForm.reset(); // Resetăm formularul după succes
        } catch (error) {
            console.log('Error submitting review:', error);
            setStatus('error'); // Setăm starea la eroare
        } finally {
            setLoading(false);
            setTimeout(() => setStatus('idle'), 3000); // Resetăm starea după 3 secunde
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const isCurrentlyVisible = entry.intersectionRatio === 1;
                    if (isCurrentlyVisible !== isVisible) {
                        setIsVisible(isCurrentlyVisible);
                    }
                });
            },
            { threshold: 0.5 }
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
        <div
            ref={reviewRef}
            className={`relative color-theme md:px-10 py-10 mx-8 md:mx-16 rounded-2xl shadow-sm my-10 transition-transform duration-300 ease-in-out ${isVisible ? 'scale-105' : 'scale-100'
                }`}
        >
            <div className="my-5">
                <p className="text-xl text-center my-3">RECENZIE</p>
                <p className="text-center">Scrie recenzia ta pentru ”{productTitle}”</p>
            </div>
            <form
                className="grid md:grid-cols-2 grid-cols-1 px-6 md:px-0"
                onSubmit={reviewForm.onSubmit((values) => handleSubmit(values))}
            >
                <div className="md:pr-40">
                    <TextInput
                        label="NUME"
                        required
                        placeholder="Nume"
                        autoFocus={false}
                        key={reviewForm.key('name')}
                        {...reviewForm.getInputProps('name')}
                    />
                    <TextInput
                        label="EMAIL"
                        required
                        placeholder="Email"
                        autoFocus={false}
                        type="email"
                        key={reviewForm.key('email')}
                        {...reviewForm.getInputProps('email')}
                    />
                </div>
                <div>
                    <Textarea
                        label="MESAJ"
                        required
                        placeholder="Mesaj..."
                        key={reviewForm.key('message')}
                        {...reviewForm.getInputProps('message')}
                    />
                    <br />
                    <button
                        type="submit"
                        className="mt-6 px-4 py-2 bg-[#b756a64f] text-white rounded-md shadow-md hover:bg-[#b756a56f] transition"
                        disabled={loading || !user.isAuthenticated}
                    >
                        {loading ? (
                            <Loader size="sm" color="white" />
                        ) : status === 'success' ? (
                            <IconCheck size={18} color="white" />
                        ) : status === 'error' ? (
                            <IconX size={18} color="white" />
                        ) : (
                            'TRIMITE RECENZIE'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;