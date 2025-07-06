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
import { useUser } from '../components/ContextUser';

const CheckoutPage = () => {
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const [loading, setLoading] = useState(false);
    const [modalOpened, setModalOpened] = useState(false); 
    const [modalMessage, setModalMessage] = useState(''); 
    const [paymentMethod, setPaymentMethod] = useState<'ramburs' | 'card'>('ramburs'); 
    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useUser();

    const checkoutForm = useForm<OrderProps>({
        initialValues: {
            id: uuidv4(),
            orderNumber: 'neimplementat',
            clientName: user.userInfo.name + ' ' + user.userInfo.surname || '',
            clientEmail: user.userInfo.email || '',
            clientPhone: user.userInfo.phone || '',
            clientAddress: user.userInfo.address || '',
            orderDate: new Date().toISOString(),
            deliveryDate: '',
            info: '',
            status: 'Pending',
            totalPrice: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
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
            clientEmail: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email invalid'),
            clientPhone: (value) => (value.length < 10 ? 'Numărul de telefon trebuie să fie valid' : null),
            clientAddress: (value) => (value.length < 5 ? 'Adresa trebuie să conțină cel puțin 5 caractere' : null),
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
            });
            
            const formHtml = response.data;

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = formHtml;

            document.body.appendChild(tempDiv);
            tempDiv.querySelector('form')?.submit();
        } catch (error) {
            console.error('Eroare la inițializarea plății EuPlătesc:', error);
            setModalMessage('A apărut o eroare la procesarea plății.');
            setModalOpened(true);
        }
    };

    const handleSubmit = async (values: OrderProps) => {
        setLoading(true);

        if (paymentMethod === 'card') {
            await handleEuPlatescPayment();
            setLoading(false);
            return;
        }

        try {
            await axios.post('/api/orders', values);
            setModalMessage('Comanda ta a fost plasată cu succes! Mulțumim pentru achiziție.');
            setModalOpened(true);
            checkoutForm.reset();
        } catch (error) {
            console.error('Error placing order:', error);
            setModalMessage('A apărut o eroare necunoscută. Te rugăm să încerci din nou.');
            setModalOpened(true);
        } finally {
            dispatch(clearCart());
            setLoading(false);
            setTimeout(() => (setModalOpened(false), router.push('/')), 5000);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader color="blue" size="lg" />
            </div>
        );
    }

    if (cartItems.length === 0) {
        router.back(); 
        return null; 
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
