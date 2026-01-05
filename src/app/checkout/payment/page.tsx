'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { useShop } from '@/context/ShopContext';
import { Spinner } from '@/components/ui/Spinner';
import axios from 'axios';

import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import Button from '@/components/ui/Button';
import { v4 as uuidv4 } from 'uuid';
import { Order, ShippingInfo } from '@/types/orders';
import { useLanguage } from '@/context/LanguageContext';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type PaymentMethod = 'credit-card' | 'cash-on-delivery' | 'bank-transfer';

// Stripe Form Component
const StripeForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { t } = useLanguage();
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const { getCartTotal, getPriceShipping } = useShop();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(getCartTotal() + getPriceShipping()), // Convert to cents
          currency: 'usd',
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm the payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        onSuccess();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Payment error:', err);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div className="border rounded-lg p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? 'Processing...' : t('checkout.payNow')}
      </button>
    </form>
  );
};

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit-card');
  const [stripeReady, setStripeReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentReferenceConfirmed, setPaymentReferenceConfirmed] = useState(false);
  const [paymentReferenceCashOnDelivery, setPaymentReferenceCashOnDelivery] = useState(false);
  const { getCartTotal, getPriceShipping, cart } = useShop();
  const router = useRouter();
  const { t } = useLanguage();

  // Derive isCartReady from cart state
  const isCartReady = cart.length > 0 && getCartTotal() > 0;

  // Handle redirect for empty cart
  useEffect(() => {
    if (cart.length === 0) {
      router.push('/checkout/cart');
    }
  }, [cart.length, router]);

  // Load Stripe
  useEffect(() => {
    const loadStripe = async () => {
      try {
        await stripePromise;
        setStripeReady(true);
      } catch (err) {
        console.error('Failed to load Stripe', err);
      }
    };
    loadStripe();
  }, []);

  const handlePaymentSuccess = async () => {
    if (!isCartReady || isProcessing) return;
    setIsProcessing(true);
    
    try {

    const shippingData = JSON.parse(localStorage.getItem('shippingData') || '{}');
    if (!shippingData || Object.keys(shippingData).length === 0) {
      console.error('Shipping information not found');
      alert('Please contact support');
      return;
    }

    const shippingInfo: ShippingInfo = {
      name: (shippingData.firstName || '') + ' ' + (shippingData.lastName || ''),
      address: shippingData.address || '',
      city: shippingData.city || '',
      state: shippingData.state || '',
      postalCode: shippingData.postalCode || '',
      country: shippingData.country || '',
      phone: shippingData.phone || '',
      email: shippingData.email || ''
    };

    const items = cart.map(item => ({
        itemId: item.variant.variantId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.variant.size,
        color: item.variant.color
    }));

    const orderData: Order = {
      orderId: uuidv4(),
      date: '',
      status: 'processing',
      total: getCartTotal(),
      shippingCost: getPriceShipping(),
      items: items,
      shipping: shippingInfo,
      payment: {
        method: paymentMethod as PaymentMethod,
        status: 'pending'
      },
      trackingNumber: '',
    };

    const responseOrder = await axios.post('/api/orders', orderData);
    console.log('Order response:', responseOrder.data.data);
    const responseEmail = await axios.post('/api/send-email/placed-order', responseOrder.data.data);
    if (responseOrder.status !== 201 || responseEmail.status !== 200) {
      throw new Error('Order creation or email sending failed');
    }
    
      router.push('/checkout/success');
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('An error occurred while processing your payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  const handlePaymentReferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentReferenceConfirmed(e.target.checked);
  };

  if (!isCartReady || !stripeReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <Spinner className="w-12 h-12" />
          <p className="text-gray-600">Loading your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        {/* Payment Form */}
        <div className="lg:col-span-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('checkout.payment')}</h2>

            <div className="mb-8">
              <p className="text-sm text-gray-500 mb-4">{t('checkout.allTransactionsSecure')}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => handlePaymentMethodChange('credit-card')}
                  className={`p-4 border rounded-lg text-center cursor-pointer transition-colors ${paymentMethod === 'credit-card'
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                    : 'border-gray-300 hover:border-primary/50'
                    }`}
                >
                  <div className="flex flex-col items-center">
                    <svg className="h-8 w-8 mb-2 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="text-sm font-medium">Credit Card</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handlePaymentMethodChange('cash-on-delivery')}
                  className={`p-4 border rounded-lg text-center cursor-pointer transition-colors ${paymentMethod === 'cash-on-delivery'
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                    : 'border-gray-300 hover:border-primary/50'
                    }`}
                >
                  <div className="flex flex-col items-center">
                    <svg className="h-8 w-8 mb-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="text-sm font-medium">Cash On Delivery</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handlePaymentMethodChange('bank-transfer')}
                  className={`p-4 border rounded-lg text-center 
                    cursor-pointer transition-colors ${paymentMethod === 'bank-transfer'
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                      : 'border-gray-300 hover:boer-primary/50'
                    }`}
                >
                  <div className="flex flex-col items-center">
                    <svg className="h-8 w-8 mb-2 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                    </svg>
                    <span className="text-sm font-medium">Bank Transfer</span>
                  </div>
                </button>
              </div>

              {paymentMethod === 'cash-on-delivery' && (
                <div className="text-center py-8">
                  <p className="mb-6 text-gray-600">{t('checkout.cashOnDelivery')}</p>

                  {localStorage.getItem('shippingData') && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
                      <h3 className="text-lg font-medium mb-4">{t('checkout.yourDeliveryInformation')}</h3>
                      <div className="mt-4 space-y-2">
                        <p className="text-sm text-gray-600">{t('checkout.name')}: {JSON.parse(localStorage.getItem('shippingData') || '{}').firstName} {JSON.parse(localStorage.getItem('shippingData') || '{}').lastName}</p>
                        <p className="text-sm text-gray-600">{t('checkout.address')}: {' '}
                          {JSON.parse(localStorage.getItem('shippingData') || '{}').address}, {' '}
                          {JSON.parse(localStorage.getItem('shippingData') || '{}').city}, {' '}
                          {JSON.parse(localStorage.getItem('shippingData') || '{}').state},  {' '}
                          {JSON.parse(localStorage.getItem('shippingData') || '{}').country} {' '}
                        </p>
                        <p className="text-sm text-gray-600">{t('checkout.postalCode')}: {JSON.parse(localStorage.getItem('shippingData') || '{}').postalCode}</p>
                        <p className="text-sm text-gray-600">{t('checkout.phone')}: {JSON.parse(localStorage.getItem('shippingData') || '{}').phone}</p>
                        <p className="text-sm text-gray-600">{t('checkout.email')}: {JSON.parse(localStorage.getItem('shippingData') || '{}').email || ''}</p>
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-gray-500 my-2">
                    {t('checkout.deliveryInfo')}
                  </p>

                  <div className="my-6 flex items-center">
                    <input
                      type="checkbox"
                      id="payment-reference"
                      checked={paymentReferenceCashOnDelivery}
                      onChange={(e) => setPaymentReferenceCashOnDelivery(e.target.checked)}
                      className="mt-1 mr-2 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="payment-reference" className="text-sm text-gray-700">
                      {t('checkout.paymentReferenceText')}
                    </label>
                  </div>

                  {!paymentReferenceCashOnDelivery && (
                    <div className="mb-4">
                      <p className="text-sm text-red-500">{t('checkout.paymentReferenceText')}</p>
                    </div>
                  )}

                  <Button
                    type="button"
                    className={`inline-flex items-center ${(!paymentReferenceCashOnDelivery || !isCartReady || isProcessing) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                    onClick={handlePaymentSuccess}
                    disabled={!paymentReferenceCashOnDelivery || !isCartReady || isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Process Cash on Delivery
                      </>
                    )}
                  </Button>
                </div>
              )}

              {paymentMethod === 'bank-transfer' && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">{t('checkout.bankTransferDetails')}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium">{t('checkout.accountName')}:</span> Vintage Custom Clothes SRL</p>
                      <p><span className="font-medium">{t('checkout.bankName')}:</span> Example Bank</p>
                      <p><span className="font-medium">{t('checkout.iban')}:</span> RO49 AAAA 1B31 0075 9384 0000</p>
                      <p><span className="font-medium">{t('checkout.swiftBic')}:</span> EXAMPLEBANK</p>
                    </div>
                    <p className="mt-4 text-sm text-gray-500 font-bold">
                      {t('checkout.paymentReference')}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                      {t('checkout.paymentReferenceText')}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="payment-reference"
                      className="mr-2"
                      checked={paymentReferenceConfirmed}
                      onChange={handlePaymentReferenceChange}
                    />
                    <label htmlFor="payment-reference" className="text-sm text-gray-600">
                      {t('checkout.paymentReferenceText')}
                    </label>
                  </div>
                  {!paymentReferenceConfirmed && (
                    <p className="text-sm text-red-600 my-2">
                      {t('checkout.paymentReferenceText')}
                    </p>
                  )}

                  <Button
                    type="button"
                    className={`inline-flex items-center ${(paymentReferenceConfirmed && isCartReady && !isProcessing) ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'} px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                    onClick={handlePaymentSuccess}
                    disabled={!paymentReferenceConfirmed || !isCartReady || isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {t('checkout.processBankTransfer')}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {paymentMethod === 'credit-card' && (
              <div className="border-t border-gray-200 pt-6 mt-8">
                <h3 className="text-sm font-medium text-gray-900 mb-4">{t('checkout.securePayment')}</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <svg className="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 6c1.4 0 2.8 1.1 2.8 4.2 0 1.5-1.2 2.1-2.8 2.1s-2.8-.6-2.8-2.1C9.2 8.1 10.6 7 12 7zm0 1.3c-.8 0-1.4.5-1.4 2.9 0 2.3.6 2.8 1.4 2.8s1.4-.5 1.4-2.8c0-2.4-.6-2.9-1.4-2.9z" />
                    </svg>
                    <span className="ml-2 text-sm text-gray-600">256-bit SSL Security</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="ml-2 text-sm text-gray-600">PCI Compliant</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 mt-10 lg:mt-0 gap-4 flex flex-col">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">{t('checkout.paymentInfo')}</h2>
              <p className="text-sm text-gray-600">{t('checkout.paymentInfoText')}</p>
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{t('checkout.orderSummary')}</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('checkout.subtotal')}</span>
                <span className="font-medium" aria-label="Order subtotal">${(getCartTotal() / 100).toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('checkout.shipping')}</span>
                <span className="font-medium">${(getPriceShipping() / 100).toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-4">
                <span className="text-lg font-bold">{t('checkout.total')}</span>
                <span className="text-lg font-bold">${((getCartTotal() + getPriceShipping()) / 100).toFixed(2)} USD</span>
              </div>
              {paymentMethod === 'credit-card' && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{t('checkout.creditCardDetails')}</h3>
                  {stripeReady ? (
                    <Elements stripe={stripePromise}>
                      <StripeForm onSuccess={handlePaymentSuccess} />
                    </Elements>
                  ) : (
                    <div className="h-40 flex items-center justify-center">
                      <div className="animate-pulse text-gray-500">Loading payment form...</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">{t('checkout.needHelp')}</h3>
              <p className="text-sm text-gray-600">
                {t('checkout.contactUs')}{' '}
                <a href="mailto:support@vintageclothes.com" className="text-primary hover:underline">
                  support@vintageclothes.com
                </a>
              </p>
            </div>
          </div>
          <div className="t ext-center">
            <Link
              href="/checkout/shipping"
              className="text-sm font-medium text-primary hover:text-primary/80 flex items-center justify-center"
            >
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('checkout.returnToShipping')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
