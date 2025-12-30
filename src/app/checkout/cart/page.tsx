'use client';

import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { FiShoppingBag, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import type { CartItem } from '@/types/products';

export default function CartPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { 
    cart, 
    removeFromCart, 
    updateCartItemQuantity, 
    getCartTotal, 
    getCartItemCount,
    getPriceShipping
  } = useShop();
  const itemCount = getCartItemCount();
  const subtotal = getCartTotal();
  const shipping = getPriceShipping();
  const total = subtotal + shipping;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Show loading state during hydration
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <Spinner className="w-12 h-12" />
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <FiShoppingBag className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven&apos;t added anything to your cart yet.</p>
        <Link 
          href="/shop"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 my-8">Your Cart ({itemCount})</h1>
      
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {cart.map((item) => (
                <li key={`${item.productId}-${item.variant.variantId}-${item.variant.color}`} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row">
                    <div className="flex-shrink-0 w-full sm:w-32 h-32 bg-gray-100 rounded-md overflow-hidden">
                      {item.variant.images?.[0] && (
                        <Image
                          src={item.variant.images[0]}
                          alt={item.name}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover object-center"
                        />
                      )}
                    </div>

                    <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          <Link href={`/shop/${item.productId}`} className="hover:text-primary hover:underline">
                            {item.name}
                          </Link>
                        </h3>
                        <p className="ml-4 text-lg font-medium text-gray-900">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>

                      <div className="mt-2 text-sm text-gray-600">
                        <p>Color: <span className="capitalize">{item.variant.color}</span></p>
                        <p className="mt-1">Size: {item.variant.size}</p>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            type="button"
                            onClick={() => {
                              const cartItem = {
                                productId: item.productId,
                                variant: item.variant,
                                quantity: item.quantity + 1
                              } as Omit<CartItem, 'addedAt'>;
                              updateCartItemQuantity(cartItem, item.quantity - 1);
                            }}
                            className="p-2 text-gray-600 hover:text-gray-700 focus:outline-none cursor-pointer"
                            disabled={item.quantity <= 1}
                          >
                            <FiMinus className="h-4 w-4" />
                          </button>
                          <span className="px-4 text-gray-900">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const cartItem = {
                                productId: item.productId,
                                variant: item.variant,
                                quantity: item.quantity + 1
                              } as Omit<CartItem, 'addedAt'>;
                              updateCartItemQuantity(cartItem, item.quantity + 1);
                            }}
                            className="p-2 text-gray-600 hover:text-gray-700 focus:outline-none cursor-pointer"
                          >
                            <FiPlus className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const itemToRemove = {
                              productId: item.productId,
                              variant: item.variant,
                              quantity: item.quantity
                            };
                            removeFromCart(itemToRemove);
                          }}
                          className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center cursor-pointer"
                        >
                          <FiTrash2 className="mr-1 h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-10 lg:mt-0 lg:col-span-4">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">${shipping.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <span className="text-lg font-medium">Total</span>
                <span className="text-lg font-bold">${total.toFixed(2)}</span>
              </div>
              
              <div className="pt-4">
                <Button
                  onClick={() => router.push('/checkout/shipping')}
                  className="w-full flex cursor-pointer justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Proceed to Shipping
                </Button>
              </div>
              
              <div className="text-center mt-4">
                <Link 
                  href="/shop" 
                  className="text-sm font-medium text-primary hover:text-primary/80 hover:underline cursor-pointer"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
