'use client';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Group, Text, Divider, Loader, Modal, Stack } from '@mantine/core';
import { RootState, removeItem, setCart, updateQuantity } from './components/CartRedux';
import { useRouter } from 'next/navigation';
import { IconArrowLeft } from '@tabler/icons-react';
import { useUser } from '../components/ContextUser';
import axios from 'axios';

const URL_CHECK_COMPOSITION = '/api/check-composition';

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false); // Loader pentru verificarea stocului
  const [modalOpened, setModalOpened] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        const items = JSON.parse(savedCart);
        dispatch(setCart(items));
      }
      setLoading(false);
    }
  }, [dispatch]);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeItem(id));
  };

  const handleFinalizeOrder = async () => {
    setIsChecking(true); 
    try {
        const response = await axios.post(URL_CHECK_COMPOSITION, cartItems, {
            validateStatus: (status) => status >= 200 && status < 500, 
        });

        if (response.status === 200) {
            router.push('/checkout');
            setModalOpened(false);
        } else if (response.status === 403) {
            setModalMessage('Ne pare rău, stocurile nu mai sunt suficiente pentru unele produse. Te rugăm să verifici coșul tău.');
            setModalOpened(true);
        }
        setIsChecking(false);
    } catch (error) {
        console.log('Eroare la verificarea stocului:', error);
        setModalMessage('A apărut o eroare la verificarea stocului. Te rugăm să încerci din nou.');
        setIsChecking(false);
        setModalOpened(true);
    }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size="lg" color="blue" />
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8">
      <div className="mx-auto max-w-7xl my-10">
        <div className="flex items-center mb-6">
          <IconArrowLeft
            className="cursor-pointer text-gray-600 hover:text-gray-800"
            size={24}
            onClick={() => router.back()}
          />
          <h1 className="text-2xl md:text-3xl font-bold text-center flex-grow pr-[2rem]">
            Coșul tău
          </h1>
        </div>
        <Divider my="sm" />
        {cartItems.length > 0 ? (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-center justify-between border-b pb-4"
                >
                <Group 
                  className="flex items-center mb-2 md:px-10"
                  onClick={() => router.push(`/product/${item.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <Text className="text-sm md:text-base">{item.title}</Text>
                  <Text className="text-sm md:text-base">{item.category}</Text>
                  <Text className="text-sm md:text-base">{item.price} RON</Text>
                </Group>
                <Group className="flex items-center my-2">
                  <Button
                    variant="outline"
                    size="xs"
                    color='#b756a6'
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity - 1)
                    }
                  >
                    -
                  </Button>
                  <Text className="text-sm md:text-base">{item.quantity}</Text>
                  <Button
                    variant="outline"
                    size="xs"
                    color='#b756a6'
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </Button>
                </Group>
                <Text className="text-sm md:text-base">
                  {item.price * item.quantity} RON
                </Text>
                <Button
                  color="red"
                  variant="outline"
                  size="xs"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Șterge
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <Text className="text-center text-gray-500">
            Coșul tău este gol.
          </Text>
        )}
        <Divider my="sm" />
        <div className="flex flex-col md:flex-row justify-center items-center mt-6">
          {cartItems.length > 0 ? (
            <Stack align='center' m={'auto'} >
              <Text className="text-lg md:text-xl font-bold mb-4 md:mb-0">  
                Total: {totalPrice} RON
              </Text>
              {!user.isAuthenticated && (
                <Text c="red" className="mb-4 md:mb-0 md:ml-4 text-center">
                  Pentru a finaliza comanda, te rugăm să te autentifici.
                </Text>
              )}
              <Button
                color={'#b756a64f'}
                size="lg"
                className="w-full md:w-auto"
                onClick={handleFinalizeOrder}
                disabled={!user.isAuthenticated || isChecking}
              >
                {isChecking ? <Loader color="white" size="sm" /> : 'Finalizează comanda'}
              </Button>
            </Stack>
          ) : (
            <Button
              color="blue"
              size="lg"
              className="w-full md:w-auto"
              bg={'#b756a64f'}
              onClick={() => router.push('/')}
            >
              Înapoi la pagina principală
            </Button>
          )}
        </div>
      </div>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Verificare cantitate insuficientă"
        centered
      >
        <p>{modalMessage}</p>
      </Modal>
    </div>
  );
};

export default Cart;