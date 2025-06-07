'use client';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Group, Text, Divider, Loader } from '@mantine/core';
import { RootState, removeItem, setCart, updateQuantity } from './components/CartRedux';
import { useRouter } from 'next/navigation';
import { IconArrowLeft } from '@tabler/icons-react';
import { useUser } from '../components/ContextUser';

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(true); 

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size="lg" color="blue" />
      </div>
    );
  }

  const handleCheckout = () => {
    router.push('/checkout');
  };

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
                <Group className="flex items-center mb-2">
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
            <>
              <Text className="text-lg md:text-xl font-bold mb-4 md:mb-0">
                Total: {totalPrice} RON
              </Text>
              { !user.isAuthenticated && <Text c='red' className="mb-4 md:mb-0 md:ml-4 text-center">
                Pentru a finaliza comanda, te rugăm să te autentifici.
              </Text>}
              <Button 
                color={'#b756a64f'} 
                size="lg" 
                className="w-full md:w-auto"
                onClick={() => handleCheckout()}
                disabled={!user.isAuthenticated}
                >
                Finalizează comanda
              </Button>
            </>
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
    </div>
  );
};

export default Cart;