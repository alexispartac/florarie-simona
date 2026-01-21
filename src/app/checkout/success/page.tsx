'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckoutService } from '../services/CheckoutService';
import { Button, Loader } from '@mantine/core';
import { motion } from 'motion/react';
import { IconCheck, IconMail, IconShoppingBag } from '@tabler/icons-react';

const SuccessPage = () => {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [orderNumber, setOrderNumber] = useState<number | null>(null);

    useEffect(() => {
        const processCardPaymentSuccess = async () => {
            try {
                // Verifică dacă suntem pe client (window este definit)
                if (typeof window === 'undefined') {
                    return;
                }

                // Așteaptă puțin pentru ca pagina să se încarce complet
                await new Promise(resolve => setTimeout(resolve, 300));

                // Verifică dacă există date de comandă în așteptare în sessionStorage
                const pendingOrderData = CheckoutService.getPendingOrderData();
                
                if (!pendingOrderData) {
                    // Nu există date în așteptare - probabil plată ramburs sau eroare
                    // Sau utilizatorul a venit direct la success fără să plătească
                    setIsProcessing(false);
                    return;
                }

                // Extrage parametrii de la EuPlătesc din URL
                const urlParams = new URLSearchParams(window.location.search);
                const invoiceId = urlParams.get('invoice_id');
                const action = urlParams.get('action'); // 0 = success
                const epId = urlParams.get('ep_id');
                
                console.log('Payment callback params:', { invoiceId, action, epId });

                // Verifică dacă avem parametrii EuPlătesc (callback implicit)
                if (!invoiceId && !action) {
                    // Nu avem parametrii - poate fi acces direct sau redirect vechi
                    // Așteptăm puțin pentru ca webhook-ul să proceseze comanda
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }

                // Verifică în baza de date dacă comanda a fost procesată de webhook
                const orderExists = await CheckoutService.checkOrderExists(pendingOrderData.id);
                
                if (orderExists) {
                    // Comanda a fost procesată cu succes de webhook
                    console.log('✅ Order found in database - payment confirmed');
                    setOrderNumber(pendingOrderData.orderNumber);
                    CheckoutService.clearPendingOrderData();
                } else {
                    // Comanda nu există încă - poate webhook-ul nu a fost apelat
                    // sau plata a eșuat
                    
                    if (action === '0') {
                        // Parametrii indică succes dar comanda nu e în DB
                        // Așteptăm mai mult pentru webhook
                        console.log('⏳ Waiting for webhook to process order...');
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        
                        const orderExistsRetry = await CheckoutService.checkOrderExists(pendingOrderData.id);
                        
                        if (orderExistsRetry) {
                            setOrderNumber(pendingOrderData.orderNumber);
                            CheckoutService.clearPendingOrderData();
                        } else {
                            // Webhook-ul nu a fost apelat
                            console.log('❌ Webhook not received - order not created');
                            setError('Comanda nu a putut fi confirmată. Te rugăm să contactezi suportul cu numărul comenzii #' + pendingOrderData.orderNumber);
                        }
                    } else {
                        // Plata a eșuat sau a fost anulată
                        CheckoutService.clearPendingOrderData();
                        setError('Plata cu cardul a eșuat sau a fost anulată. Te rugăm să încerci din nou.');
                    }
                }
                
            } catch (error) {
                console.error('Eroare la procesarea comenzii după plată:', error);
                setError('A apărut o eroare la finalizarea comenzii. Te rugăm să contactezi suportul.');
            } finally {
                setIsProcessing(false);
            }
        };

        processCardPaymentSuccess();
    }, []);

    if (isProcessing) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center bg-white p-12 rounded-3xl shadow-xl max-w-md w-full mx-4"
                >
                    <div className="mb-6">
                        <Loader size="xl" color="#b756a6" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Finalizăm comanda ta...
                    </h2>
                    <p className="text-gray-600">
                        Te rugăm să aștepți în timp ce procesăm plata și confirmăm comanda.
                    </p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center bg-white p-12 rounded-3xl shadow-xl max-w-md w-full mx-4"
                >
                    <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-4xl">❌</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Oops! A apărut o problemă
                    </h2>
                    <p className="text-gray-600 mb-8">
                        {error}
                    </p>
                    <div className="space-y-3">
                        <Button
                            onClick={() => router.push('/checkout')}
                            style={{ backgroundColor: '#b756a6' }}
                            fullWidth
                            size="lg"
                        >
                            Încearcă din nou
                        </Button>
                        <Button
                            onClick={() => router.push('/homepage')}
                            variant="outline"
                            fullWidth
                            size="lg"
                        >
                            Înapoi la pagina principală
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center bg-white p-12 rounded-3xl shadow-xl max-w-md w-full mx-4"
            >
                {/* Success Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                    className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
                >
                    <IconCheck className="text-green-600" size={40} />
                </motion.div>

                {/* Success Message */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        🎉 Comanda finalizată!
                    </h2>
                    <p className="text-gray-600 mb-2">
                        Mulțumim pentru comanda ta! 
                    </p>
                    {orderNumber && (
                        <p className="text-gray-600 mb-6">
                            <span className="font-medium">Numărul comenzii:</span> #{orderNumber}
                        </p>
                    )}
                </motion.div>

                {/* Info Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="space-y-4 mb-8"
                >
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                        <IconMail className="text-blue-600" size={24} />
                        <div className="text-left">
                            <p className="font-medium text-gray-800">Email de confirmare</p>
                            <p className="text-sm text-gray-600">Vei primi detaliile comenzii pe email</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                        <IconShoppingBag className="text-green-600" size={24} />
                        <div className="text-left">
                            <p className="font-medium text-gray-800">Procesare comandă</p>
                            <p className="text-sm text-gray-600">Comanda ta este în procesare</p>
                        </div>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="space-y-3"
                >
                    <Button
                        onClick={() => router.push('/homepage')}
                        style={{ backgroundColor: '#b756a6' }}
                        fullWidth
                        size="lg"
                    >
                        Înapoi la pagina principală
                    </Button>
                    <Button
                        onClick={() => router.push('/homepage')}
                        variant="outline"
                        fullWidth
                        size="lg"
                    >
                        Continuă cumpărăturile
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default SuccessPage;