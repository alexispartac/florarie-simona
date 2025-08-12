'use client';
import React, { useState } from 'react';
import { OrderProps } from "../api/types";
import { useForm } from '@mantine/form';
import { TextInput, Button, Textarea, Modal, Select } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, clearCart } from '../cart/components/CartRedux';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useUser } from '../components/context/ContextUser';
import { CartItem } from '../types';

const CheckoutPage = () => {
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const [modalOpened, setModalOpened] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'ramburs' | 'card'>('ramburs');
    const [currency, setCurrency] = useState<'RON' | 'EUR'>('RON');
    const [orderNumber, setOrderNumber] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useUser();

    // Funcție pentru calculul prețului în funcție de monedă
    const getConvertedPrice = (priceInRON: number) => {
        if (currency === 'EUR') {
            return Number((priceInRON / 5).toFixed(2)); // 1 EUR = 5 RON aproximativ
        }
        return priceInRON;
    };

    const getTotalPrice = () => {
        const totalRON = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        return getConvertedPrice(totalRON);
    };

    React.useEffect(() => {
        const localCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]') as CartItem[];
        if (localCartItems.length === 0) {
            setModalMessage('Coșul tău este gol. Te rugăm să adaugi produse înainte de a finaliza comanda.');
            setModalOpened(true);
            return;
        }

        if (!Array.isArray(localCartItems) || localCartItems.some((item : CartItem) => !item.id || !item.title || !item.price || !item.quantity)) {
            setModalMessage('Coșul tău conține produse invalide. Te rugăm să reîncarci pagina.');
            setModalOpened(true);
            return;
        }

        if (cartItems.length === 0) {
            setModalMessage('Coșul tău este gol. Te rugăm să adaugi produse înainte de a finaliza comanda.');
            setModalOpened(true);
            return;
        }

        async function fetchOrderNumber() {
            try {

                const response = await axios.get('/api/orders/number', { withCredentials: true });
                const orders: OrderProps[] = response.data;
                setOrderNumber(orders.length);
            } catch (error) {
                console.log('Error fetching order number:', error);
            }
        }
        fetchOrderNumber();
    }, [cartItems.length, router, setModalMessage, setModalOpened]);


    const checkoutForm = useForm<OrderProps>({
        initialValues: {
            id: uuidv4(),
            userId: user.userInfo.id || '',
            orderNumber: orderNumber || 0,
            clientName: user.userInfo.name + ' ' + user.userInfo.surname || '',
            clientEmail: user.userInfo.email || '',
            clientPhone: user.userInfo.phone || '',
            clientAddress: user.userInfo.address || '',
            orderDate: new Date().toISOString(),
            deliveryDate: '',
            info: '',
            status: 'Pending',
            totalPrice: getTotalPrice(),
            paymentMethod: paymentMethod,
            products: cartItems.map((item) => ({
                id: item.id,
                title: item.title,
                price: item.price,
                category: item.category,
                quantity: item.quantity,
                image: item.image,
            })),
        },
        validate: {
            clientName: (value) => (value.length < 2 ? 'Numele trebuie să conțină cel puțin 2 caractere' : null),
            clientPhone: (value) => (value.length < 10 ? 'Numărul de telefon trebuie să fie valid' : null),
            clientAddress: (value) => (value.length < 5 ? 'Adresa trebuie să conțină cel puțin 5 caractere' : null),
            paymentMethod: (value) => (value ? null : 'Selectează o metodă de plată'),
            info: (value) => ((value ?? '').length > 150 ? 'Notițele nu pot depăși 150 de caractere' : null),
        },
    });

    const handleEuPlatescPayment = async () => {
        try {
            await axios.post('/api/payment-card', {
                items: checkoutForm.values.products.map((product) => ({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    quantity: product.quantity,
                    category: product.category,
                })),
                customerInfo: {
                    name: checkoutForm.values.clientName,
                    email: checkoutForm.values.clientEmail,
                    phone: checkoutForm.values.clientPhone,
                    address: checkoutForm.values.clientAddress,
                },
                orderDetails: {
                    orderId: checkoutForm.values.id,
                    orderNumber: checkoutForm.values.orderNumber,
                    totalPrice: getTotalPrice(),
                    currency: currency,
                    paymentMethod: checkoutForm.values.paymentMethod,
                    deliveryDate: checkoutForm.values.deliveryDate,
                    info: checkoutForm.values.info,
                    orderDate: checkoutForm.values.orderDate,
                },
                urls: {
                    returnUrl: `${window.location.origin}/checkout/success`,
                    cancelUrl: `${window.location.origin}/checkout/cancel`,
                }
            }, 
            { withCredentials: true }
            ).then((response) => {
                const redirectUrl = response.data;
                document.body.innerHTML = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <title>Redirecționare către EuPlătesc</title>
                        <style>
                            body { 
                                font-family: Arial, sans-serif; 
                                text-align: center; 
                                padding: 50px;
                                background-color: #f5f5f5;
                            }
                            .container {
                                max-width: 500px;
                                margin: 0 auto;
                                background: white;
                                padding: 40px;
                                border-radius: 10px;
                                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                            }
                            .message {
                                color: #333;
                                font-size: 18px;
                                margin-bottom: 20px;
                            }
                            .sub-message {
                                color: #666;
                                font-size: 16px;
                                margin-bottom: 30px;
                            }
                            .continue-btn {
                                background-color: #b756a6;
                                color: white;
                                padding: 15px 30px;
                                border: none;
                                border-radius: 5px;
                                font-size: 16px;
                                cursor: pointer;
                                text-decoration: none;
                                display: inline-block;
                            }
                            .continue-btn:hover {
                                background-color: #a044a0;
                            }
                        </style>
                        <script>
                            setTimeout(function() {
                                window.location.href = "${redirectUrl}";
                            }, 2000);
                        </script>
                    </head>
                    <body>
                        <div class="container">
                            <div class="message">Te redirecționăm către EuPlătesc...</div>
                            <div class="sub-message">Dacă nu ești redirecționat automat, apasă butonul de mai jos:</div>
                            <a href="${redirectUrl}" class="continue-btn">Continuă către EuPlătesc</a>
                        </div>
                    </body>
                    </html>
                `;
            });
        } catch (error) {
            console.log('Eroare la inițializarea plății EuPlătesc:', error);
            setModalMessage('A apărut o eroare la procesarea plății.');
            setModalOpened(true);
        }
    };

    const handleSubmit = async (values: OrderProps) => {
        // verifica numarul de telefon
        setIsLoading(true);
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        if (!phoneRegex.test(values.clientPhone)) {
            setModalMessage('Numărul de telefon este invalid. Te rugăm să introduci un număr valid.');
            setModalOpened(true);
            return;
        }

        // verifica adresa
        if (values.clientAddress.length < 8) {
            setModalMessage('Adresa trebuie să conțină cel puțin 8 caractere.');
            setModalOpened(true);
            return;
        }

        // if it's a card payment, add the payment method to the values
        if (paymentMethod === 'card') {
            values.paymentMethod = paymentMethod;
        } else {
            values.paymentMethod = 'ramburs';
        }

        try {
            await axios.post('/api/orders', values);
            
        } catch (error) {
            console.log('Eroare la plasarea comenzii:', error);
            setModalMessage('A apărut o eroare la plasarea comenzii. Te rugăm să încerci din nou.');
            setModalOpened(true);
            return;
        }
        
        // Pentru plata cu cardul, trimite email-ul ÎNAINTE de redirecționare
        if (paymentMethod === 'card') {
            try {
                const statusEmail = await axios.post('/api/send-email', {
                    clientEmail: values.clientEmail,
                    clientName: values.clientName,
                    orderDetails: values.products,
                    totalPrice: getTotalPrice(),
                    currency: currency,
                });
                
                if (statusEmail.status !== 200) {
                    console.log('Eroare la trimiterea email-ului pentru plata cu cardul');
                }
            } catch (error) {
                console.log('Eroare la trimiterea email-ului înainte de plata cu cardul:', error);
            }
            
            await handleEuPlatescPayment();
            return; 
        }

        // Pentru ramburs, trimite email-ul normal
        try {
            const statusEmail = await axios.post('/api/send-email', {
                clientEmail: values.clientEmail,
                clientName: values.clientName,
                orderDetails: values.products,
                totalPrice: values.totalPrice,
            });
            
            if (statusEmail.status !== 200) {
                throw new Error('Failed to send email');
            } else {
                setModalMessage('Comanda ta a fost plasată cu succes! Mulțumim pentru achiziție.');
                setModalOpened(true);
                checkoutForm.reset();
            }
            setIsLoading(false);
            router.push('/checkout/success');
        } catch (error) {
            console.log('Eroare la trimiterea email-ului:', error);
            setModalMessage('Comanda a fost plasata. A apărut o eroare la trimiterea email-ului de confirmare. Te rugăm să verifici adresa de email introdusă apoi contacteaza-ne printr-un mesaj pe adresa oficiala de email pentru a primi confirmarea comenzii.');
            setModalOpened(true);
        } finally {
            // Pentru ramburs - curăță cart-ul și oprește loading-ul
            dispatch(clearCart());
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Button
                variant="outline"
                color={'#b756a64f'}
                onClick={() => router.back()}
            >
                Înapoi
            </Button>
            <h1 className="text-2xl font-bold my-4">Finalizare Comandă</h1>
            <form onSubmit={checkoutForm.onSubmit(handleSubmit)}>
                <TextInput
                    label="Nume"
                    placeholder="Introdu numele tău"
                    {...checkoutForm.getInputProps('clientName')}
                    autoFocus={false}
                    required
                />
                <TextInput
                    label="Email"
                    placeholder="Introdu email-ul tău"
                    required
                    disabled
                    {...checkoutForm.getInputProps('clientEmail')}
                    autoFocus={false}
                />
                <TextInput
                    label="Telefon"
                    placeholder="Introdu numărul de telefon"
                    required
                    {...checkoutForm.getInputProps('clientPhone')}
                    autoFocus={false}
                />
                <TextInput
                    label="Adresă"
                    placeholder="Introdu adresa de livrare"
                    required
                    {...checkoutForm.getInputProps('clientAddress')}
                    autoFocus={false}
                />
                <Textarea
                    label="Note"
                    placeholder="Adaugă note suplimentare pentru livrare (opțional)"
                    {...checkoutForm.getInputProps('info')}
                />
                <Select
                    label="Metoda de plată"
                    placeholder="Alege metoda de plată"
                    data={[
                        { value: 'ramburs', label: 'Ramburs' },
                        { value: 'card', label: 'Card' },
                    ]}
                    {...checkoutForm.getInputProps('paymentMethod')}
                    autoFocus={false}
                    onChange={(value) => {
                        if (value) {
                            checkoutForm.setFieldValue('paymentMethod', value as 'ramburs' | 'card');
                            setPaymentMethod(value as 'ramburs' | 'card');
                        }
                    }}
                    required
                />
                
                {paymentMethod === 'card' && (
                    <Select
                        label="Moneda"
                        placeholder="Alege moneda"
                        data={[
                            { value: 'RON', label: 'RON (Lei români)' },
                            { value: 'EUR', label: 'EUR (Euro)' },
                        ]}
                        value={currency}
                        onChange={(value) => {
                            if (value) {
                                setCurrency(value as 'RON' | 'EUR');
                                // Actualizează totalul în form
                                checkoutForm.setFieldValue('totalPrice', getTotalPrice());
                            }
                        }}
                        required
                    />
                )}
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">Produse Comandate</h2>
                    <ul className="border rounded p-4">
                        {checkoutForm.values.products.map((product, idx) => (
                            <li key={idx} className="flex justify-between mb-2">
                                <span>{product.title} - {product.category}  (x{product.quantity})</span>
                                <span>{getConvertedPrice(product.price * product.quantity)} {currency}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="text-right font-bold mt-4">
                        Total: {getTotalPrice()} {currency}
                    </p>
                </div>
                <div className="flex justify-between mt-6">
                    <Button type="submit" color={'#b756a64f'} loading={isLoading} fullWidth>
                        Trimite Comanda
                    </Button>
                </div>
            </form>

            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                centered
                withCloseButton={false}
                title="Notificare"
            >
                <p>{modalMessage}</p>
                <Button
                    color={'#b756a64f'}
                    onClick={() => (router.push('/'), setModalOpened(false))}
                    className="mt-4"
                >
                    Închide
                </Button>
            </Modal>
        </div>
    );
};

export default CheckoutPage;
