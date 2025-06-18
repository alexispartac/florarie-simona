'use client';
import React, { useState } from 'react';
import { OrderProps } from "../api/types";
import { useForm } from '@mantine/form';
import { TextInput, Button, Textarea, Loader, Modal } from '@mantine/core';
import { useSelector } from 'react-redux';
import { RootState, clearCart } from '../cart/components/CartRedux';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const URL_ORDERS = '/api/orders';

const CheckoutPage = () => {
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const [loading, setLoading] = useState(false);
    const [modalOpened, setModalOpened] = useState(false); // Controlează afișarea modalului
    const [modalMessage, setModalMessage] = useState(''); // Mesajul afișat în modal
    const router = useRouter();

    const checkoutForm = useForm<OrderProps>({
        initialValues: {
            id: uuidv4(),
            orderNumber: 'neimplementat',
            clientName: '',
            clientEmail: '',
            clientPhone: '',
            clientAddress: '',
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

    const handleSubmit = async (values: OrderProps) => {
        setLoading(true);
        try {
            // Actualizează stocurile produselor
            const modifyStockResponse = await axios.put('/api/modify-stock', {
                items: values.products.map((product) => ({
                    id: product.id,
                    category: product.category,
                    quantity: product.quantity,
                })),
            });

            if (!modifyStockResponse.data.success) {
                console.log('Error updating stock:', modifyStockResponse.data.message);
                setModalMessage('Stocurile nu sunt suficiente pentru unele produse. Te rugăm să verifici coșul tău.');
                setModalOpened(true);
                setLoading(false);
                return;
            }

            // Trimite comanda către backend
            await axios.post(URL_ORDERS, values);
            console.log('Order placed successfully:', values);

            // Resetează formularul și curăță coșul
            router.push('/');
            checkoutForm.reset();
            localStorage.removeItem('cartItems');
            clearCart();
        } catch (error) {
            console.log('Error placing order:', error);
            setModalMessage('A apărut o eroare. Te rugăm să încerci din nou.');
            setModalOpened(true);
        } finally {
            setLoading(false);
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
                onClick={() => router.back()} // Navighează la pagina anterioară
            >
                Înapoi
            </Button>
            <h1 className="text-2xl font-bold mb-4">Finalizare Comandă</h1>
            <form onSubmit={checkoutForm.onSubmit(handleSubmit)}>
                <TextInput
                    label="Nume"
                    placeholder="Introdu numele tău"
                    required
                    {...checkoutForm.getInputProps('clientName')}
                    autoFocus={false}
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
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">Produse Comandate</h2>
                    <ul className="border rounded p-4">
                        {checkoutForm.values.products.map((product, idx) => (
                            <li key={idx} className="flex justify-between mb-2">
                                <span>{product.title} (x{product.quantity})</span>
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

            {/* Modal pentru afișarea mesajelor */}
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title="Notificare"
            >
                <p>{modalMessage}</p>
            </Modal>
        </div>
    );
};

export default CheckoutPage;
