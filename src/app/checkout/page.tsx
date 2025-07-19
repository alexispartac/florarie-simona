'use client';
import React, { useState } from 'react';
import { OrderProps } from "../api/types";
import { useForm } from '@mantine/form';
import { TextInput, Button, Textarea, Loader, Modal, Select } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, clearCart } from '../cart/components/CartRedux';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useUser } from '../components/context/ContextUser';

const CheckoutPage = () => {
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const [loading, setLoading] = useState(false);
    const [modalOpened, setModalOpened] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'ramburs' | 'card'>('ramburs');
    const [orderNumber, setOrderNumber] = useState<number | null>(null);
    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useUser();

    React.useEffect(() => {
        if (!user.userInfo) {
            router.push('/cart');
            return;
        }

        if (cartItems.length === 0) {
            setModalMessage('Coșul tău este gol. Te rugăm să adaugi produse înainte de a finaliza comanda.');
            console.log(cartItems.length)
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
    }, []);


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
            totalPrice: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
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
        },
    });

    const handleEuPlatescPayment = async () => {
        try {
            const response = await axios.post('/api/payment-card', {
                items: checkoutForm.values.products.map((product) => ({
                    title: product.title,
                    price: product.price,
                    quantity: product.quantity,
                })),
                totalPrice: checkoutForm.values.totalPrice,
            }, 
            { withCredentials: true }
            );

            const formHtml = response.data;

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = formHtml;

            document.body.appendChild(tempDiv);
            tempDiv.querySelector('form')?.submit();
        } catch (error) {
            console.log('Eroare la inițializarea plății EuPlătesc:', error);
            setModalMessage('A apărut o eroare la procesarea plății.');
            setModalOpened(true);
        }
    };

    const handleSubmit = async (values: OrderProps) => {
        setLoading(true);

        // verifica numarul de telefon
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        if (!phoneRegex.test(values.clientPhone)) {
            setModalMessage('Numărul de telefon este invalid. Te rugăm să introduci un număr valid.');
            setModalOpened(true);
            setLoading(false);
            return;
        }

        // verifica adresa
        if (values.clientAddress.length < 8) {
            setModalMessage('Adresa trebuie să conțină cel puțin 8 caractere.');
            setModalOpened(true);
            setLoading(false);
            return;
        }

        try {
            await axios.post('/api/orders', values);
            
        } catch (error) {
            console.log('Eroare la plasarea comenzii:', error);
            setModalMessage('A apărut o eroare la plasarea comenzii. Te rugăm să încerci din nou.');
            setModalOpened(true);
        }
        
        if (paymentMethod === 'card') {
            await handleEuPlatescPayment();
        }

        try {

            const statusEmail = await axios.post('/api/send-email', {
                clientEmail: values.clientEmail,
                clientName: values.clientName,
                orderDetails: values.products,
                totalPrice: values.totalPrice,
            });
            
            if (statusEmail.status !== 200) {
                throw new Error('Failed to send email');
            }else{
                setModalMessage('Comanda ta a fost plasată cu succes! Mulțumim pentru achiziție.');
                setModalOpened(true);
                checkoutForm.reset();
            }

        } catch (error) {
            console.log('Eroare la trimiterea email-ului:', error);
            setModalMessage('Comanda a fost plasata. A apărut o eroare la trimiterea email-ului de confirmare. Te rugăm să verifici adresa de email introdusă apoi contacteaza-ne printr-un mesaj pe adresa oficiala de email pentru a primi confirmarea comenzii.');
            setModalOpened(true);
        } finally {
            setLoading(false);
            dispatch(clearCart());
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader color="blue" size="lg" />
            </div>
        );
    }

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
                    value={paymentMethod}
                    {...checkoutForm.getInputProps('paymentMethod')}
                    autoFocus={false}
                    onChange={(value) => setPaymentMethod(value as 'ramburs' | 'card')}
                    required
                />
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">Produse Comandate</h2>
                    <ul className="border rounded p-4">
                        {checkoutForm.values.products.map((product, idx) => (
                            <li key={idx} className="flex justify-between mb-2">
                                <span>{product.title} - {product.category}  (x{product.quantity})</span>
                                <span>{product.price * product.quantity} RON</span>
                            </li>
                        ))}
                    </ul>
                    <p className="text-right font-bold mt-4">
                        Total: {checkoutForm.values.totalPrice} RON
                    </p>
                </div>
                <div className="flex justify-between mt-6">
                    <Button type="submit" color={'#b756a64f'} fullWidth>
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
