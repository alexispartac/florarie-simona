'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@mantine/core';

const SuccessPage = () => {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white text-white px-4">
            <h1 className="text-center text-3xl font-bold text-green-600 mb-4">Plata a fost efectuată cu succes!</h1>
            <p className="text-center text-lg text-gray-700 mb-6">
                Mulțumim pentru comanda ta! Vei primi un email cu detaliile comenzii în scurt timp.
            </p>
            <Button
                color="green"
                size="lg"
                onClick={() => router.push('/')}
                className="mt-4"
            >
                Înapoi la pagina principală
            </Button>
        </div>
    );
};

export default SuccessPage;