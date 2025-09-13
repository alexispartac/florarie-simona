'use client';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Text, Divider, Loader, Modal, Stack } from '@mantine/core';
import { RootState, removeItem, setCart, updateQuantity } from './components/CartRedux';
import { useRouter } from 'next/navigation';
import { IconArrowLeft } from '@tabler/icons-react';
import { useUser } from '../components/context/ContextUser';
import axios from 'axios';
import PopUp from '../components/PopUp';
import { Footer } from '../components/Footer';

const URL_CHECK_COMPOSITION = '/api/check-composition';

const Content = () => {
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
      <div className="mx-auto max-w-7xl my-18">
        <div className="flex items-center mb-6">
          <IconArrowLeft
            className="cursor-pointer text-gray-600 hover:text-gray-800"
            size={24}
            onClick={() => router.back()}
          />
          <h1 className="text-2xl md:text-3xl font-bold text-center flex-grow pr-[2rem]">
            Coșul de cumpărături
          </h1>
        </div>
        <Divider my="sm" />
        {cartItems.length > 0 ? (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-md border border-gray-200 p-4"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div 
                    className="flex-shrink-0 cursor-pointer"
                    onClick={() => router.push(`/product/${item.id}`)}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <div 
                      className="cursor-pointer hover:text-pink-600 transition-colors duration-200"
                      onClick={() => router.push(`/product/${item.id}`)}
                    >
                      <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p>
                        <span className="font-medium">Categorie:</span> {item.category}
                      </p>
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 rounded">
                        <button
                          className="px-3 py-1 text-gray-600 hover:bg-gray-50 border-r"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="px-4 py-1 bg-gray-50 text-center min-w-[3rem]">
                          {item.quantity}
                        </span>
                        <button
                          className="px-3 py-1 text-gray-600 hover:bg-gray-50 border-l"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-lg md:text-xl font-semibold text-gray-900">
                          {(item.price * item.quantity).toFixed(2)} RON
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-sm text-gray-500">
                            {item.price} RON × {item.quantity}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Remove Button */}
                    <div className="flex justify-end mt-3">
                      <button
                        className="text-red-600 text-sm hover:text-red-700 underline"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Șterge
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Text className="text-center text-gray-500">
            Coșul tău este gol.
          </Text>
        )}
        <Divider my="sm" />
        <div className="flex flex-col md:flex-row justify-center mt-6">
          {cartItems.length > 0 ? (
            <div>
              <div className='w-full'>
                <Text className="text-lg md:text-xl grid grid-cols-2 mb-4 md:mb-0">
                  <span>
                    Subtotal
                  </span>
                  <span className="text-right">
                    {totalPrice.toFixed(2)} RON
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
                    {totalPrice.toFixed(2)} RON
                  </span>
                </Text>
                <Text className="text-md md:text-lg text-gray-700  mb-4 md:mb-0">
                  {(Number((totalPrice * 0.19).toFixed(2))).toFixed(2)} RON TVA inclus
                </Text>
                {!user.isAuthenticated && (
                  <Text c="red" className="mb-4 md:mb-0 md:ml-4 text-center">
                    Pentru a finaliza comanda, te rugăm să te autentifici.
                  </Text>
                )}
              </div>
              <Stack w={'full'} m={'auto'} >
                <Button
                  color={'#b756a64f'}
                  size="lg"
                  mt={'20px'}
                  className="w-full md:w-auto"
                  onClick={handleFinalizeOrder}
                  disabled={!user.isAuthenticated || isChecking}
                >
                  {isChecking ? <Loader color="white" size="sm" /> : 'Finalizează comanda'}
                </Button>
              </Stack>
            </div>
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

const Cart = () => {
  return (
        <div>
            <PopUp />
            <Content />
            <Footer />
        </div>
    )
}


export default Cart;