'use client';
import React, { useState, useEffect } from 'react';
import { OrderPropsAdmin, OrderProductProps } from '@/app/types/order';
import { ProductImageProps } from "@/app/types/products";
import { useForm } from '@mantine/form';
import { TextInput, Button, Textarea, Modal, Select, Divider, Text } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, clearCart } from '../cart/components/CartRedux';
import { useRouter } from 'next/navigation';
import { useUser } from '../components/context/ContextUser';
import { CartItem } from '@/app/types/cart';
import { Footer } from '../components/Footer';
import { IconShoppingCart } from '@tabler/icons-react';
import { motion } from 'motion/react';
import { CheckoutService } from './services/CheckoutService';
import axios from 'axios';

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

const ItemCartCheckout = ({ product, currency, getConvertedPrice }: { product: OrderProductProps, currency: 'RON' | 'EUR', getConvertedPrice: (priceInRON: number) => number }) => {
    const [imageSrc, setImageSrc] = useState<ProductImageProps>();
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await axios.get(`/api/images/list?folder=${product.id}&limit=1`);
                if (response.data && response.data.images && response.data.images.length > 0) {
                    setImageSrc(response.data.images[0]);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching product image:', error);
            }
        };

        fetchImage();
    }, [product.id]);
   
    return (
        <div>
            {loading ? (
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 animate-pulse rounded-lg" />
            ) : (
                <div
                    key={product.id}
                    className="bg-white rounded-md border border-gray-200 p-4"
                >
                    <div className="flex gap-4">
                        <div
                            className="flex-shrink-0 cursor-pointer"
                            onClick={() => router.push(`/product/${product.id}`)}
                        >
                            <img
                                src={imageSrc?.url}
                                alt={product.title || 'Product image'}
                                className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg"
                            />
                        </div>
                        <div className="flex-grow">
                            <div
                                className="cursor-pointer hover:text-pink-600 transition-colors duration-200"
                                onClick={() => router.push(`/product/${product.id}`)}
                            >
                                <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
                                    {product.title}
                                </h3>
                                <p>
                                    <span className="font-medium">Categorie:</span> {product.title_category}
                                </p>
                                <p>
                                    <span className="font-medium">Cantitate:</span> {product.quantity}
                                </p>
                                <p>
                                    <span className="font-medium">Preț:</span> {getConvertedPrice(product.price * product.quantity)} {currency}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

}

const CheckoutPage = () => {
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const [paymentMethod, setPaymentMethod] = useState<'ramburs' | 'card'>('ramburs');
    const [currency, setCurrency] = useState<'RON' | 'EUR'>('RON');
    const [modalMessage, setModalMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [modalOpened, setModalOpened] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [delivery, setDelivery] = useState<boolean>(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useUser();
    
    React.useEffect(() => {
        // Verifică coșul din Redux și localStorage
        const localCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]') as CartItem[];
        CheckoutService.clearPendingOrderData();

        // Dacă ambele surse sunt goale, redirecționează către cart
        if (cartItems.length === 0 && localCartItems.length === 0) {
            router.push('/cart');
            return;
        }

        // Dacă localStorage are produse dar Redux nu, poate fi o problemă de sincronizare
        if (cartItems.length === 0 && localCartItems.length > 0) {
            router.push('/cart');
            return;
        }

        // Verifică dacă produsele sunt valide
        if (!Array.isArray(localCartItems) || localCartItems.some((product: CartItem) => !product.id || !product.title || !product.price || !product.quantity)) {
            router.push('/cart');
            return;
        }

        // Verifică din nou coșul Redux după validări
        if (cartItems.length === 0) {
            router.push('/cart');
            return;
        }
    }, [cartItems.length, router]);

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

    const checkoutForm = useForm<OrderPropsAdmin>({
        initialValues: {
            id: 'secret',
            userId: user.userInfo.id || '',
            orderNumber: 0,
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
            products: cartItems.map((product: CartItem) => ({
                id: product.id,
                title: product.title,
                price: product.price,
                quantity: product.quantity,
                title_category: product.category,
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

    const handleSubmit = async (values: OrderPropsAdmin) => {
        setIsLoading(true);
        
        try {
            // Verifică din nou coșul înainte de procesare
            if (cartItems.length === 0) {
                router.push('/cart');
                return;
            }

            // Validare folosind CheckoutService
            const validation = CheckoutService.validateOrder(values);
            if (!validation.isValid) {
                setModalMessage(validation.message);
                setModalOpened(true);
                setIsLoading(false);
                return;
            }

            // Setare metodă de plată
            values.paymentMethod = paymentMethod;

            // Procesare comanda prin CheckoutService
            const result = await CheckoutService.processOrder({
                orderData: values,
                paymentMethod,
                currency,
                totalPrice: getTotalPrice(),
                onSuccess: (message: string) => {
                    setModalMessage(message);
                    setModalOpened(true);
                    checkoutForm.reset();
                    dispatch(clearCart());
                    setTimeout(() => {
                        router.push('/checkout/success');
                    }, 50);
                },
                onError: (error: string) => {
                    setModalMessage(error);
                    setModalOpened(true);
                },
                onCardPaymentRedirect: (redirectUrl: string) => {
                    // Pentru plata cu cardul - redirect automat
                    CheckoutService.redirectToPayment(redirectUrl);
                }
            });

            if (!result.success) {
                setModalMessage(result.message);
                setModalOpened(true);
            }

        } catch (error) {
            console.error('Eroare în procesarea comenzii:', error);
            setModalMessage('A apărut o eroare neașteptată. Te rugăm să încerci din nou.');
            setModalOpened(true);
        } finally {
            setIsLoading(false);
        }
    };

    // Dacă coșul este gol, nu renderiza nimic (useEffect va face redirect)
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">🛒</div>
                    <p className="text-gray-600">Se verifică coșul de cumpărături...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className='grid px-4 grid-cols-2'>
                    <img src='logo.jpg' alt='Florarie Simona' className='w-24 mb-2 cursor-pointer' onClick={() => router.push('/homepage')} />
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
                        <p>Rezumat comanda {expanded ? '▼' : '▲'}</p>
                        <p className='justify-self-end'>{getTotalPrice()} {currency === 'EUR' ? 'EURO' : 'RON'}</p>
                    </div>
                </div>

                {expanded && (
                    <motion.div
                        className='border-y border-gray-200'
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className='p-4'>
                            <h1 className='font-bold py-2'>Detalii comanda:</h1>
                            <ul className="space-y-4">
                                {checkoutForm.values.products.map((product) => (
                                    <ItemCartCheckout key={product.id} product={product} getConvertedPrice={getConvertedPrice} currency={currency} />
                                ))}
                            </ul>
                            <Divider my="sm" />
                            <div className="mt-6">
                                <Text className="text-lg md:text-xl grid grid-cols-2 mb-2">
                                    <span>Subtotal</span>
                                    <span className="text-right">{getTotalPrice().toFixed(2)} {currency === 'EUR' ? 'EURO' : 'RON'}</span>
                                </Text>
                                <Text className="text-lg md:text-xl grid grid-cols-2 mb-2">
                                    <span>Transport</span>
                                    <span className="text-right text-gray-700">Gratuit</span>
                                </Text>
                                <Text className="text-xl md:text-2xl grid grid-cols-2 font-bold border-t pt-2">
                                    <span>Total comanda</span>
                                    <span className="text-right">{getTotalPrice().toFixed(2)} {currency === 'EUR' ? 'EURO' : 'RON'}</span>
                                </Text>
                                <Text className="text-md text-gray-700 text-right mt-1">
                                    {(getTotalPrice() * 0.21).toFixed(2)} {currency === 'EUR' ? 'EURO' : 'RON'} TVA inclus
                                </Text>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className='my-4 px-4'>
                    <h1 className='text-lg font-bold pb-2'>Contact</h1>
                    <div className='flex flex-col space-y-3'>
                        <input 
                            placeholder='E-mail' 
                            type='email' 
                            className='border border-gray-300 p-2 rounded-md focus:border-pink-500 focus:outline-none' 
                            defaultValue={user.userInfo.email}
                        />
                        <label className='flex items-center gap-2'>
                            <input type='checkbox' className='w-4 h-4 text-pink-500' />
                            <span className='text-sm'>Doresc să primesc e-mailuri cu noutăți și oferte</span>
                        </label>
                    </div>
                </div>

                <div className='my-4 px-4'>
                    <h1 className='text-lg font-bold pb-2'>Livrare</h1>
                    <div className="space-y-3">
                        <div 
                            onClick={() => setDelivery(false)} 
                            className={`${!delivery ? 'bg-pink-50 border-pink-300' : 'bg-white border-gray-300'} border rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors duration-200`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 ${!delivery ? 'bg-pink-500' : 'border-2 border-gray-400'} rounded-full flex items-center justify-center`}>
                                    {!delivery && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                </div>
                                <span className="text-gray-700">Ridicare de la atelier</span>
                            </div>
                            <div className="text-gray-600">🏠</div>
                        </div>

                        <div 
                            onClick={() => setDelivery(true)} 
                            className={`${delivery ? 'bg-pink-50 border-pink-300' : 'bg-white border-gray-300'} border rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors duration-200`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 ${delivery ? 'bg-pink-500' : 'border-2 border-gray-400'} rounded-full flex items-center justify-center`}>
                                    {delivery && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                </div>
                                <span className="font-medium text-gray-800">Expediere prin curier</span>
                            </div>
                            <div className="text-gray-600">🚚</div>
                        </div>
                    </div>
                </div>

                <div className='p-4'>
                    <form onSubmit={checkoutForm.onSubmit(handleSubmit)}>
                        {(
                            <div className="space-y-4">
                                <TextInput
                                    label="Nume complet"
                                    placeholder="Introdu numele tău complet"
                                    {...checkoutForm.getInputProps('clientName')}
                                    required
                                />
                                <TextInput
                                    label="Email"
                                    placeholder="Introdu email-ul tău"
                                    required
                                    disabled
                                    {...checkoutForm.getInputProps('clientEmail')}
                                />
                                <TextInput
                                    label="Telefon"
                                    placeholder="Introdu numărul de telefon"
                                    required
                                    {...checkoutForm.getInputProps('clientPhone')}
                                />
                                <TextInput
                                    label="Adresă completă"
                                    placeholder="Introdu adresa de livrare completă (strada, numărul, orașul, codul poștal)"
                                    required
                                    {...checkoutForm.getInputProps('clientAddress')}
                                />
                                <Textarea
                                    label="Note pentru livrare"
                                    placeholder="Adaugă note suplimentare pentru livrare (ex: etaj, interfon, instrucțiuni speciale)"
                                    {...checkoutForm.getInputProps('info')}
                                    maxLength={150}
                                />
                            </div>
                        )}

                        {!delivery && (
                            <div className='p-4 bg-gray-50 rounded-lg'>
                                <SimpleMap />
                            </div>
                        )}

                        {/* Payment Methods Section */}
                        <div className='my-6'>
                            <h1 className='text-lg font-bold pb-2'>Metodă de plată</h1>
                            <p className='text-sm text-gray-600 mb-4'>Toate tranzacțiile sunt securizate și criptate.</p>

                            <div className="space-y-3">
                                {/* Card Payment */}
                                <div
                                    onClick={() => {
                                        setPaymentMethod('card');
                                        checkoutForm.setFieldValue('paymentMethod', 'card');
                                    }}
                                    className={`${paymentMethod === 'card' ? 'bg-pink-50 border-pink-300' : 'bg-white border-gray-300'} border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200`}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`w-5 h-5 ${paymentMethod === 'card' ? 'bg-pink-500' : 'border-2 border-gray-400'} rounded-full flex items-center justify-center`}>
                                            {paymentMethod === 'card' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-800">Plată cu cardul online</span>
                                            <p className="text-sm text-gray-600">Securizat prin EuPlătesc</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-8">
                                        <img src="/visa-logo.png" alt="VISA" className="h-6" />
                                        <img src="/mastercard-logo.png" alt="Mastercard" className="h-6" />
                                        <span className="text-sm text-gray-600">și alte carduri</span>
                                    </div>

                                    {paymentMethod === 'card' && (
                                        <div className="mt-4 ml-8">
                                            <Select
                                                label="Alege moneda"
                                                placeholder="Selectează moneda pentru plată"
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

                                {/* Cash on Delivery */}
                                <div
                                    onClick={() => {
                                        setPaymentMethod('ramburs');
                                        checkoutForm.setFieldValue('paymentMethod', 'ramburs');
                                    }}
                                    className={`${paymentMethod === 'ramburs' ? 'bg-pink-50 border-pink-300' : 'bg-white border-gray-300'} border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 ${paymentMethod === 'ramburs' ? 'bg-pink-500' : 'border-2 border-gray-400'} rounded-full flex items-center justify-center`}>
                                            {paymentMethod === 'ramburs' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-800">Numerar la livrare</span>
                                            <p className="text-sm text-gray-600">Plătești cash când primești comanda</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Final Order Summary */}
                        <div className='border border-gray-200 rounded-lg p-4 bg-gray-50 my-6'>
                            <h2 className='font-bold text-lg mb-4'>Rezumatul final al comenzii</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal produse:</span>
                                    <span>{getTotalPrice().toFixed(2)} {currency === 'EUR' ? 'EUR' : 'RON'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Transport:</span>
                                    <span className="text-green-600">Gratuit</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t pt-2">
                                    <span>Total de plată:</span>
                                    <span>{getTotalPrice().toFixed(2)} {currency === 'EUR' ? 'EUR' : 'RON'}</span>
                                </div>
                                <div className="text-sm text-gray-600 text-right">
                                    (din care TVA: {(getTotalPrice() * 0.19).toFixed(2)} {currency === 'EUR' ? 'EUR' : 'RON'})
                                </div>
                            </div>
                        </div>
                        <label className='flex items-center gap-2 mb-4'>
                            <input 
                                required
                                type='checkbox' 
                                className='w-4 h-4 text-pink-500' 
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                            />
                            <span className='text-sm'>Am citit și sunt de acord cu <a href="/terms&conditions" target="_blank" className="text-pink-600 underline">Termenii și condițiile</a></span>
                        </label>
                        <div className="mt-6">
                            <Button 
                                type="submit" 
                                size="lg"
                                style={{ backgroundColor: '#b756a6' }}
                                loading={isLoading} 
                                fullWidth
                                className="text-white font-semibold py-3"
                            >
                                {isLoading ? 'Se procesează...' : `Finalizează comanda (${getTotalPrice().toFixed(2)} ${currency === 'EUR' ? 'EUR' : 'RON'})`}
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
                    <p className="mb-4">{modalMessage}</p>
                    <Button
                        style={{ backgroundColor: '#b756a6' }}
                        onClick={() => {
                            setModalOpened(false);
                            if (modalMessage.includes('succes')) {
                                router.push('/homepage');
                            }
                        }}
                        fullWidth
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
