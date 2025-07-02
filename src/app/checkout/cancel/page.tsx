'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@mantine/core';

const CancelPage = () => {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white text-white px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Plata a fost anulată</h1>
            <p className="text-lg md:text-xl text-black text-center mb-6">
                Ne pare rău că ai anulat comanda. Dacă ai nevoie de ajutor, nu ezita să ne contactezi.
            </p>
            <Button
                color="dark"
                size="lg"
                bg={'#b756a64f'}
                onClick={() => router.push('/cart')}
                className="mt-4 text-white px-6 py-3 rounded-md transition-all"
            >
                Înapoi la coșul de cumpărături
            </Button>
        </div>
    );
};

export default CancelPage;