'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { IoConstruct } from 'react-icons/io5';
import { useShop } from '@/context/ShopContext';

export default function CheckoutSuccessPage() {
  const { clearCart, cart } = useShop();

  useEffect(() => {
    clearCart();
    localStorage.removeItem('shippingData');
    localStorage.removeItem('shop_cart');
    // Here you can send the session ID to your server to confirm the payment
    // and update the order status in your database if needed

  }, [clearCart]);

  console.log('Cart after success:', cart);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <IoConstruct className="h-6 w-6 text-green-600" aria-hidden="true" />
                </div>
                <h2 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
                  Thank you for your order!
                </h2>
                <p className="mt-4 text-gray-500">
                  Your order has been placed and is being processed. You will receive an email confirmation with your order details shortly.
                </p>
                <div className="mt-10">
                  <Link
                    href="/"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
              
              <div className="mt-12 border-t border-gray-200 pt-8">
                <h3 className="text-lg font-medium text-gray-900">What&apos;s next?</h3>
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900">Order Status</h4>
                    <p className="mt-2 text-sm text-gray-500">
                      Check your order status and track your delivery here.
                    </p>
                    <div className="mt-4">
                      <Link href="/orders" className="text-sm font-medium text-primary hover:text-primary/80">
                        View order status <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900">Need help?</h4>
                    <p className="mt-2 text-sm text-gray-500">
                      Have questions about your order? Contact our customer service.
                    </p>
                    <div className="mt-4">
                      <Link href="/contact" className="text-sm font-medium text-primary hover:text-primary/80">
                        Contact us <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
