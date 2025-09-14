'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckoutService } from '../services/CheckoutService';
import { Button } from '@mantine/core';
import { motion } from 'motion/react';
import { IconX, IconArrowLeft } from '@tabler/icons-react';

const CancelPage = () => {
    const router = useRouter();

    useEffect(() => {
        // Curăță datele temporare când utilizatorul anulează plata
        CheckoutService.clearPendingOrderData();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center bg-white p-12 rounded-3xl shadow-xl max-w-md w-full mx-4"
            >
                {/* Cancel Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                    className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center"
                >
                    <IconX className="text-red-600" size={40} />
                </motion.div>

                {/* Cancel Message */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Plată anulată
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Plata ta a fost anulată. Nu s-a efectuat nicio tranzacție și coșul tău de cumpărături a fost păstrat.
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="space-y-3"
                >
                    <Button
                        onClick={() => router.push('/checkout')}
                        style={{ backgroundColor: '#b756a6' }}
                        fullWidth
                        size="lg"
                        leftSection={<IconArrowLeft size={20} />}
                    >
                        Înapoi la checkout
                    </Button>
                    <Button
                        onClick={() => router.push('/cart')}
                        variant="outline"
                        fullWidth
                        size="lg"
                    >
                        Vezi coșul de cumpărături
                    </Button>
                    <Button
                        onClick={() => router.push('/homepage')}
                        variant="light"
                        fullWidth
                        size="lg"
                    >
                        Înapoi la pagina principală
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default CancelPage;