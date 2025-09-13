'use client';
import React, { useState } from 'react';
import { OrderProps } from "../api/types";
import { useForm } from '@mantine/form';
import { TextInput, Button, Textarea, Modal, Select, Divider, Text } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, clearCart } from '../cart/components/CartRedux';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useUser } from '../components/context/ContextUser';
import { CartItem } from '../types';
import { Footer } from '../components/Footer';
import { IconShoppingCart } from '@tabler/icons-react';
import { motion } from 'motion/react';


function SimpleMap() {
    return (
        <div>
            <div className="mb-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Locația Atelierului</h3>
                <div className="space-y-1 text-gray-600 mb-4">
                    <p><span className="font-medium">Adresa:</span> Str. Unirii 240, Tămșeni, Neamt</p>
                    <p><span className="font-medium">Program:</span> Luni–Sâmbătă, 09:00–20:00</p>
                </div>
            </div>

            <div className="w-full h-64 overflow-hidden border border-gray-300">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2711.5!2d26.954654617198305!3d47.00269059102309!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDAwJzA5LjciTiAyNsKwNTcnMTYuOCJF!5e0!3m2!1sen!2sro!4v1635789012345!5m2!1sen!2sro"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Locația Buchetul Simonei"
                />
            </div>

            <div className="text-center mt-4">
                <a
                    href="https://www.google.com/maps/search/?api=1&query=47.00269059102309,26.954654617198305"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200"
                >
                    Deschide în Google Maps
                </a>
            </div>
        </div>
    );
}

const CheckoutPage = () => {
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const [modalOpened, setModalOpened] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'ramburs' | 'card'>('ramburs');
    const [currency, setCurrency] = useState<'RON' | 'EUR'>('RON');
    const [orderNumber, setOrderNumber] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [delivery, setDelivery] = useState<boolean>(false);
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
        const totalRON = cartItems.reduce((total, product) => total + product.price * product.quantity, 0);
        return getConvertedPrice(totalRON);
    };

    React.useEffect(() => {
        const localCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]') as CartItem[];
        if (localCartItems.length === 0) {
            setModalMessage('Coșul tău este gol. Te rugăm să adaugi produse înainte de a finaliza comanda.');
            setModalOpened(true);
            return;
        }

        if (!Array.isArray(localCartItems) || localCartItems.some((product: CartItem) => !product.id || !product.title || !product.price || !product.quantity)) {
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
            products: cartItems.map((product) => ({
                id: product.id,
                title: product.title,
                price: product.price,
                category: product.category,
                quantity: product.quantity,
                image: product.image,
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
        <>
            <div className="max-w-4xl mx-auto">
                <div className='grid px-4 grid-cols-2'>
                    <img src='logo.jpg' alt='Florarie Simona' className='w-24 mb-2' onClick={() => router.push('/homepage')} />
                    <Button
                        variant="outline"
                        color={'gray-950'}
                        className='justify-self-end mt-4'
                        onClick={() => router.push('/cart')}
                    >
                        <IconShoppingCart />
                    </Button>
                </div>

                <div className='border-y-1 border-gray-200 bg-gray-50 my-4'>
                    <div className='grid grid-cols-2 flex justify-between p-4 cursor-pointer' onClick={() => setExpanded(!expanded)}>
                        <p>Rezumat comanda {expanded ? '-down' : '-up'}</p>
                        <p className='justify-self-end'>{getTotalPrice()} { currency === 'EUR' ? 'EURO' : 'RON' }</p>
                    </div>
                </div>

                <div>
                    {expanded && (
                        <motion.div
                            className='border-y border-gray-200'
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className='p-4'>
                                <h1 className='font-bold py-2'>Detalii comanda:</h1>
                                <ul>
                                    {checkoutForm.values.products.map((product) => (
                                        <div
                                            key={product.id}
                                            className="bg-white rounded-md border border-gray-200 p-4"
                                        >
                                            <div className="flex gap-4">
                                                {/* Product Image */}
                                                <div
                                                    className="flex-shrink-0 cursor-pointer"
                                                    onClick={() => router.push(`/product/${product.id}`)}
                                                >
                                                    <img
                                                        src={product.image}
                                                        alt={product.title}
                                                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg"
                                                    />
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex-grow">
                                                    <div
                                                        className="cursor-pointer hover:text-pink-600 transition-colors duration-200"
                                                        onClick={() => router.push(`/product/${product.id}`)}
                                                    >
                                                        <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
                                                            {product.title}
                                                        </h3>
                                                        <p>
                                                            <span className="font-medium">Categorie:</span> {product.category}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </ul>
                                <Divider my="sm" />
                                <div className="flex flex-col md:flex-row justify-center mt-6">
                                    <div>
                                        <div className='w-full'>
                                            <Text className="text-lg md:text-xl grid grid-cols-2 mb-4 md:mb-0">
                                                <span>
                                                    Subtotal
                                                </span>
                                                <span className="text-right">
                                                    {getTotalPrice().toFixed(2)} { currency === 'EUR' ? 'EURO' : 'RON' }
                                                </span>
                                            </Text>
                                            <Text className="text-lg md:text-xl grid grid-cols-2 mb-4 md:mb-0">
                                                <span>
                                                    Transport
                                                </span>
                                                <span className="text-right text-gray-700">
                                                    Gratuit
                                                </span>
                                            </Text>
                                            <Text className="text-xl md:text-2xl grid grid-cols-2 md:mb-0">
                                                <span className='font-bold pt-4'>
                                                    Total comanda
                                                </span>
                                                <span className="text-right font-bold pt-4">
                                                    {getTotalPrice().toFixed(2)} { currency === 'EUR' ? 'EURO' : 'RON' }
                                                </span>
                                            </Text>
                                            <Text className="text-md md:text-lg text-gray-700  mb-4 md:mb-0">
                                                {(Number((getTotalPrice() * 0.19).toFixed(2))).toFixed(2)} { currency === 'EUR' ? 'EURO' : 'RON' } TVA inclus
                                            </Text>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className='my-4 px-4'>
                    <h1 className='text-lg font-bold pb-2'>Contact</h1>
                    <form className='flex flex-col' action="">
                        <input placeholder='E-mail' type='email' className='border border-gray-300 p-2 rounded-md' />
                        <span>
                            <input type='checkbox' className='mt-4 w-4 h-4' id='newsletter' color='black' />
                            <label htmlFor='newsletter' className='ml-2 text-[16px]'>Doresc sa primesc e-mailuri cu noutati si oferte</label>
                        </span>
                    </form>
                </div>

                <div className='my-4 px-4'>
                    <h1 className='text-lg font-bold pb-2'>Livrare</h1>
                    <div className="space-y-3">
                        <div onClick={() => setDelivery(false)} className={`${!delivery ? 'bg-gray-100' : ''} border border-gray-300 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors duration-200`}>
                            <div className="flex items-center gap-3">
                                {delivery ?
                                    <div className="w-5 h-5 border-2 border-gray-400 rounded-full"></div>
                                    : <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                }
                                <span className="text-gray-700">Ridicare de la atelier</span>
                            </div>
                            <div className="text-gray-600">
                                🏠
                            </div>
                        </div>

                        <div onClick={() => setDelivery(true)} className={`${delivery && 'bg-gray-100'} border border-gray-300 rounded-lg p-4 flex items-center justify-between`}>
                            <div className="flex items-center gap-3">
                                {!delivery ?
                                    <div className="w-5 h-5 border-2 border-gray-400 rounded-full"></div>
                                    : <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                }
                                <span className="font-medium text-gray-800">Expediere prin curier</span>
                            </div>
                            <div className="text-gray-600">
                                🚚
                            </div>
                        </div>
                    </div>
                </div>

                <div className='p-4'>
                    <form onSubmit={checkoutForm.onSubmit(handleSubmit)}>
                        {delivery && (
                            <>
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
                            </>
                        )}

                        {!delivery && (
                            <div className='p-4'>
                                <SimpleMap />
                            </div>
                        )}

                        {/* Payment Methods Section */}
                        <div className='my-4'>
                            <h1 className='text-lg font-bold pb-2'>Plată</h1>
                            <p className='text-sm text-gray-600 mb-4'>Toate tranzacțiile sunt securizate și criptate.</p>

                            <div className="space-y-3">
                                {/* Card Payment */}
                                <div
                                    onClick={() => {
                                        setPaymentMethod('card')
                                        checkoutForm.setFieldValue('paymentMethod', 'card');
                                    }
                                    }
                                    className={`${paymentMethod === 'card' ? 'bg-gray-100 border-black' : 'border-gray-300'} border rounded-lg p-4 `}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 ${paymentMethod === 'card' ? 'bg-black' : 'border-2 border-gray-400'} rounded-full flex items-center justify-center`}>
                                            {paymentMethod === 'card' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                        </div>
                                        <div>
                                            <span className="text-gray-800">Selectează pentru PLATA CU CARDUL</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <img src="/visa-logo.png" alt="VISA" className="h-6" />
                                        <img src="/mastercard-logo.png" alt="Mastercard" className="h-6" />
                                        <span className="text-sm text-gray-600">+2</span>
                                    </div>

                                    {paymentMethod === 'card' && (
                                        <div className="mt-4">
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
                                                        checkoutForm.setFieldValue('totalPrice', getTotalPrice());
                                                    }
                                                }}
                                                required
                                            />
                                        </div>
                                    )}
                                </div>


                                {/* Cash on Delivery - Selected */}
                                <div
                                    onClick={() => setPaymentMethod('ramburs')}
                                    className={`${paymentMethod === 'ramburs' ? 'bg-gray-100 border-black' : 'border-gray-300'} border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 ${paymentMethod === 'ramburs' ? 'bg-black' : 'border-2 border-gray-400'} rounded-full flex items-center justify-center`}>
                                            {paymentMethod === 'ramburs' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-800">Numerar la livrare</span>
                                        </div>
                                    </div>
                                    {paymentMethod === 'ramburs' && (
                                        <div className="ml-8">
                                            <p className="text-sm text-gray-600">
                                                Selectează această metodă pentru a plăti cash la livrare.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className='border-y border-gray-200' >
                            <div>
                                <h1 className='font-bold py-2 '>Rezumat comandă:</h1>
                                <ul>
                                    {checkoutForm.values.products.map((product) => (
                                        <div
                                            key={product.id}
                                            className="bg-white rounded-md border border-gray-200 p-4"
                                        >
                                            <div className="flex gap-4">
                                                {/* Product Image */}
                                                <div
                                                    className="flex-shrink-0 cursor-pointer"
                                                    onClick={() => router.push(`/product/${product.id}`)}
                                                >
                                                    <img
                                                        src={product.image}
                                                        alt={product.title}
                                                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg"
                                                    />
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex-grow">
                                                    <div
                                                        className="cursor-pointer hover:text-pink-600 transition-colors duration-200"
                                                        onClick={() => router.push(`/product/${product.id}`)}
                                                    >
                                                        <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
                                                            {product.title}
                                                        </h3>
                                                        <p>
                                                            <span className="font-medium">Categorie:</span> {product.category}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </ul>
                                <Divider my="sm" />
                                <div className="flex flex-col md:flex-row justify-center mt-6">
                                    <div>
                                        <div className='w-full'>
                                            <Text className="text-lg md:text-xl grid grid-cols-2 mb-4 md:mb-0">
                                                <span>
                                                    Subtotal
                                                </span>
                                                <span className="text-right">
                                                    {getTotalPrice().toFixed(2)} { currency === 'EUR' ? 'EURO' : 'RON' }
                                                </span>
                                            </Text>
                                            <Text className="text-lg md:text-xl grid grid-cols-2 mb-4 md:mb-0">
                                                <span>
                                                    Transport
                                                </span>
                                                <span className="text-right text-gray-700">
                                                    Gratuit
                                                </span>
                                            </Text>
                                            <Text className="text-xl md:text-2xl grid grid-cols-2 md:mb-0">
                                                <span className='font-bold pt-4'>
                                                    Total comanda
                                                </span>
                                                <span className="text-right font-bold pt-4">
                                                    {getTotalPrice().toFixed(2)} { currency === 'EUR' ? 'EURO' : 'RON' }
                                                </span>
                                            </Text>
                                            <Text className="text-md md:text-lg text-gray-700  mb-4 md:mb-0">
                                                {(Number((getTotalPrice() * 0.19).toFixed(2))).toFixed(2)} { currency === 'EUR' ? 'EURO' : 'RON' } TVA inclus
                                            </Text>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between mt-6">
                            <Button type="submit" color={'#b756a64f'} loading={isLoading} fullWidth>
                                Trimite Comanda
                            </Button>
                        </div>
                    </form>
                </div>

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
            <Footer />
        </>
    );
};

export default CheckoutPage;
