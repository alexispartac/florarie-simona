'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { Spinner } from '@/components/ui/Spinner';
import { OrderStatus } from '@/types/orders';
import axios from 'axios';
import Button from '@/components/ui/Button';
import { v4 as uuidv4 } from 'uuid';
import { Order, ShippingInfo } from '@/types/orders';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/translations';
import Image from 'next/image';

type PaymentMethod = 'credit-card' | 'cash-on-delivery' | 'bank-transfer';

const infoTransferBank = {
  name: 'BUCHETUL SIMONEI SRL',
  bankName: 'Banca Transilvania',
  ibanRon: 'RO76 BTRL RONCRT 0CK0 3296 01',
  ibanEuro: 'RO23 BTRL EURCRT 0CK0 3296 01',
  swiftBic: 'BTRLRO22',
};

// euPlatesc Form Component
const EuPlatescForm = ({ onInitiate }: { onInitiate: () => void }) => {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProcessing(true);
    
    try {
      await onInitiate();
    } catch (error) {
      console.error('Payment initiation error:', error);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div className="border rounded-lg p-6 bg-[var(--secondary)] border-[var(--border)]">
        <div className="flex items-center justify-center mb-4">
          <svg className="h-12 w-12 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <p className="text-center text-[var(--foreground)] mb-2">
          {t('checkout.euplatescInfo') || 'You will be redirected to euPlatesc secure payment page'}
        </p>
        <p className="text-center text-sm text-[var(--muted-foreground)]">
          {t('checkout.euplatescSecure') || 'Your payment information is processed securely by euPlatesc'}
        </p>
      </div>

      <button
        type="submit"
        disabled={processing}
        className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] py-3 px-4 rounded-lg font-medium hover:bg-[var(--hover-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-[var(--primary-foreground)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t('checkout.redirecting') || 'Redirecting to payment...'}
          </span>
        ) : (
          t('checkout.proceedToPayment') || 'Proceed to Payment'
        )}
      </button>
    </form>
  );
};

function PaymentPageContent() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentReferenceConfirmed, setPaymentReferenceConfirmed] = useState(false);
  const [paymentReferenceCashOnDelivery, setPaymentReferenceCashOnDelivery] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { getCartTotal, getPriceShipping, cart } = useShop();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const t = useTranslation(language);
  const formRef = useRef<HTMLFormElement>(null);

  // Derive isCartReady from cart state
  const isCartReady = cart.length > 0 && getCartTotal() > 0;

  // Handle redirect for empty cart
  useEffect(() => {
    if (cart.length === 0) {
      router.push('/checkout/cart');
    }
  }, [cart.length, router]);

  // Check for payment errors from URL params
  useEffect(() => {
    const error = searchParams.get('error');
    const message = searchParams.get('message');
    
    if (error) {
      switch (error) {
        case 'payment_failed':
          setPaymentError(message || 'Payment failed. Please try again.');
          break;
        case 'invalid':
          setPaymentError('Invalid payment response. Please try again.');
          break;
        case 'configuration':
          setPaymentError('Payment gateway configuration error. Please contact support.');
          break;
        default:
          setPaymentError('An error occurred. Please try again.');
      }
    }
  }, [searchParams]);

  // Create order and get tracking number
  const createOrder = async (paymentMethod: PaymentMethod): Promise<string> => {
    const shippingData = JSON.parse(localStorage.getItem('shippingData') || '{}');
    const billingData = JSON.parse(localStorage.getItem('billingData') || '{}');
    
    if (!shippingData || Object.keys(shippingData).length === 0) {
      throw new Error('Shipping information not found');
    }

    if (!billingData || Object.keys(billingData).length === 0) {
      throw new Error('Billing information not found');
    }

    const shippingInfo: ShippingInfo = {
      name: (shippingData.firstName || '') + ' ' + (shippingData.lastName || ''),
      address: shippingData.address || '',
      city: shippingData.city || '',
      state: shippingData.state || '',
      postalCode: shippingData.postalCode || '',
      country: shippingData.country || '',
      phone: shippingData.phone || '',
      email: shippingData.email || '',
      deliveryInstructions: shippingData.additionalInfo || '',
    };

    const billingInfo = {
      name: (billingData.firstName || '') + ' ' + (billingData.lastName || ''),
      address: billingData.address || '',
      city: billingData.city || '',
      state: billingData.state || '',
      postalCode: billingData.postalCode || '',
      country: billingData.country || '',
      phone: billingData.phone || '',
      email: billingData.email || '',
      company: billingData.company || '',
      taxId: billingData.taxId || '',
    };

    const items = cart.map(item => ({
      itemId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      customMessage: item.customMessage,
    }));

    const orderData: Order = {
      orderId: uuidv4(),
      date: '',
      status: 'processing' as OrderStatus,
      total: getCartTotal(),
      shippingCost: getPriceShipping(),
      items: items,
      shipping: shippingInfo,
      billing: billingInfo,
      payment: {
        method: paymentMethod,
        status: 'pending'
      },
      trackingNumber: '',
    };

    const responseOrder = await axios.post('/api/orders', orderData);
    const order = responseOrder.data.data;
    
    // Send order confirmation email
    await axios.post('/api/send-email/placed-order', order);
    
    return order.trackingNumber;
  };

  // Handle euPlatesc payment initiation
  const handleEuPlatescPayment = async () => {
    if (!isCartReady || isProcessing) return;
    
    setIsProcessing(true);
    setPaymentError(null);

    try {
      // First, create the order to get tracking number
      const trackingNumber = await createOrder('credit-card');

      // Get shipping data
      const shippingData = JSON.parse(localStorage.getItem('shippingData') || '{}');

      // Initialize payment with euPlatesc
      const response = await axios.post('/api/euplatesc/init-payment', {
        // amount: getCartTotal() + getPriceShipping(), // Amount in cents
        amount: 100,
        curr: 'RON',
        invoice_id: trackingNumber,
        order_desc: `Order ${trackingNumber} - Buchetul Simonei`,
        customerInfo: {
          firstName: shippingData.firstName || '',
          lastName: shippingData.lastName || '',
          email: shippingData.email || '',
          phone: shippingData.phone || '',
          address: shippingData.address || '',
          city: shippingData.city || '',
          state: shippingData.state || '',
          zip: shippingData.postalCode || '',
          country: shippingData.country || 'RO',
        },
      });

      const { paymentParams, paymentUrl } = response.data;

      // Create a form and submit it to redirect to euPlatesc
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = paymentUrl;

      // Add all payment parameters as hidden inputs
      Object.keys(paymentParams).forEach((key) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = paymentParams[key] || '';
        form.appendChild(input);
      });

      // Add return URL (where user will be redirected after payment)
      const returnUrlInput = document.createElement('input');
      returnUrlInput.type = 'hidden';
      returnUrlInput.name = 'ExtraData[successurl]';
      returnUrlInput.value = `${window.location.origin}/api/euplatesc/callback`;
      form.appendChild(returnUrlInput);

      const failUrlInput = document.createElement('input');
      failUrlInput.type = 'hidden';
      failUrlInput.name = 'ExtraData[failedurl]';
      failUrlInput.value = `${window.location.origin}/api/euplatesc/callback`;
      form.appendChild(failUrlInput);

      // Add form to document and submit
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('Payment initiation error:', error);
      setPaymentError('Failed to initialize payment. Please try again.');
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async () => {
    if (!isCartReady || isProcessing) return;
    setIsProcessing(true);
    
    try {
      await createOrder(paymentMethod);
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
    setPaymentError(null);
  };

  const handlePaymentReferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentReferenceConfirmed(e.target.checked);
  };

  if (!isCartReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <Spinner className="w-12 h-12" />
          <p className="text-[var(--muted-foreground)]">Loading your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        {/* Payment Form */}
        <div className="lg:col-span-8">
          <div className="bg-[var(--card)] shadow overflow-hidden sm:rounded-lg p-6 mb-8 border border-[var(--border)]">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">{t('checkout.payment')}</h2>

            {paymentError && (
              <div className="mb-6 bg-[var(--destructive)]/10 border border-[var(--destructive)]/30 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-[var(--destructive)] mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-[var(--destructive)]">{paymentError}</p>
                </div>
              </div>
            )}

            <div className="mb-8">
              <p className="text-sm text-[var(--muted-foreground)] mb-4">{t('checkout.allTransactionsSecure')}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => handlePaymentMethodChange('credit-card')}
                  className={`p-4 border rounded-lg text-center cursor-pointer transition-colors ${paymentMethod === 'credit-card'
                    ? 'border-[var(--primary)] bg-[var(--primary)]/10 ring-2 ring-[var(--primary)]/20'
                    : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                    }`}
                >
                  <div className="flex flex-col items-center">
                    <svg className="h-8 w-8 mb-2 text-[var(--foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="text-sm font-medium text-[var(--foreground)]">Card de credit</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handlePaymentMethodChange('cash-on-delivery')}
                  className={`p-4 border rounded-lg text-center cursor-pointer transition-colors ${paymentMethod === 'cash-on-delivery'
                    ? 'border-[var(--primary)] bg-[var(--primary)]/10 ring-2 ring-[var(--primary)]/20'
                    : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                    }`}
                >
                  <div className="flex flex-col items-center">
                    <svg className="h-8 w-8 mb-2 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="text-sm font-medium text-[var(--foreground)]">Plata la livrare</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handlePaymentMethodChange('bank-transfer')}
                  className={`p-4 border rounded-lg text-center 
                    cursor-pointer transition-colors ${paymentMethod === 'bank-transfer'
                      ? 'border-[var(--primary)] bg-[var(--primary)]/10 ring-2 ring-[var(--primary)]/20'
                      : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                    }`}
                >
                  <div className="flex flex-col items-center">
                    <svg className="h-8 w-8 mb-2 text-[var(--foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                    </svg>
                    <span className="text-sm font-medium text-[var(--foreground)]">Transfer bancar</span>
                  </div>
                </button>
              </div>

              {paymentMethod === 'cash-on-delivery' && (
                <div className="text-center py-8">
                  <p className="mb-6 text-[var(--muted-foreground)]">{t('checkout.cashOnDelivery')}</p>

                  {localStorage.getItem('shippingData') && (() => {
                    const shippingData = JSON.parse(localStorage.getItem('shippingData') || '{}');
                    const billingData = JSON.parse(localStorage.getItem('billingData') || '{}');
                    return (
                      <>
                        <div className="bg-[var(--secondary)] border border-[var(--border)] rounded-lg p-6 mt-8">
                          <h3 className="text-lg font-medium text-[var(--foreground)] mb-4">📦 {t('checkout.yourDeliveryInformation')}</h3>
                          <div className="mt-4 space-y-2 text-left">
                            <p className="text-sm text-[var(--muted-foreground)]">{t('checkout.name')}: {shippingData.firstName} {shippingData.lastName}</p>
                            <p className="text-sm text-[var(--muted-foreground)]">{t('checkout.address')}: {shippingData.address}{shippingData.apartment ? `, ${shippingData.apartment}` : ''}, {shippingData.city}, {shippingData.state}, {shippingData.country}{shippingData.postalCode ? ` ${shippingData.postalCode}` : ''}</p>
                            <p className="text-sm text-[var(--muted-foreground)]">{t('checkout.phone')}: {shippingData.phone}</p>
                            <p className="text-sm text-[var(--muted-foreground)]">{t('checkout.email')}: {shippingData.email || ''}</p>
                            {shippingData.additionalInfo && (
                              <p className="text-sm text-[var(--muted-foreground)] pt-2 border-t border-[var(--border)]">
                                <strong>Informații suplimentare:</strong> {shippingData.additionalInfo}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="bg-[var(--secondary)] border border-[var(--border)] rounded-lg p-6 mt-4">
                          <h3 className="text-lg font-medium text-[var(--foreground)] mb-4">💳 Billing Information</h3>
                          <div className="mt-4 space-y-2 text-left">
                            <p className="text-sm text-[var(--muted-foreground)]">{t('checkout.name')}: {billingData.firstName} {billingData.lastName}</p>
                            {billingData.company && (
                              <p className="text-sm text-[var(--muted-foreground)]">Company: {billingData.company}</p>
                            )}
                            {billingData.taxId && (
                              <p className="text-sm text-[var(--muted-foreground)]">Tax ID: {billingData.taxId}</p>
                            )}
                            <p className="text-sm text-[var(--muted-foreground)]">{t('checkout.address')}: {billingData.address}{billingData.apartment ? `, ${billingData.apartment}` : ''}, {billingData.city}, {billingData.state}, {billingData.country}{billingData.postalCode ? ` ${billingData.postalCode}` : ''}</p>
                            <p className="text-sm text-[var(--muted-foreground)]">{t('checkout.phone')}: {billingData.phone}</p>
                            <p className="text-sm text-[var(--muted-foreground)]">{t('checkout.email')}: {billingData.email || ''}</p>
                          </div>
                        </div>
                      </>
                    );
                  })()}

                  <p className="text-sm text-[var(--muted-foreground)] my-2">
                    {t('checkout.deliveryInfo')}
                  </p>

                  <div className="my-6 flex items-center">
                    <input
                      type="checkbox"
                      id="payment-reference"
                      checked={paymentReferenceCashOnDelivery}
                      onChange={(e) => setPaymentReferenceCashOnDelivery(e.target.checked)}
                      className="mt-1 mr-2 h-4 w-4 text-[var(--primary)] border-[var(--border)] rounded focus:ring-[var(--primary)]"
                    />
                    <label htmlFor="payment-reference" className="text-sm text-[var(--foreground)]">
                      {t('checkout.paymentReferenceText')}
                    </label>
                  </div>

                  {!paymentReferenceCashOnDelivery && (
                    <div className="mb-4">
                      <p className="text-sm text-[var(--destructive)]">{t('checkout.paymentReferenceText')}</p>
                    </div>
                  )}

                  <Button
                    type="button"
                    onClick={handlePaymentSuccess}
                    disabled={!paymentReferenceCashOnDelivery || !isCartReady || isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                        {t('checkout.processCashOnDelivery')}
                      </>
                    )}
                  </Button>
                </div>
              )}

              {paymentMethod === 'bank-transfer' && (
                <div className="space-y-6">
                  <div className="bg-[var(--secondary)] p-4 rounded-lg border border-[var(--border)]">
                    <h3 className="font-medium text-[var(--foreground)] mb-2">{t('checkout.bankTransferDetails')}</h3>
                    <Image src="https://res.cloudinary.com/dm7ttgpta/image/upload/v1770461503/bt_mjntrl.png" alt="Bank Transfer" width={100} height={100} className="mb-4" />
                    <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
                      <p><span className="font-medium">{t('checkout.accountName')}:</span> {infoTransferBank.name} </p>
                      <p><span className="font-medium">{t('checkout.bankName')}:</span> {infoTransferBank.bankName} </p>
                      <div className="flex items-center">
                        <div className="flex items-center"> RON : {infoTransferBank.ibanRon} </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center"> EURO : {infoTransferBank.ibanEuro} </div>
                      </div>
                      <p><span className="font-medium">{t('checkout.swiftBic')}:</span> {infoTransferBank.swiftBic} </p>
                    </div>
                    <p className="mt-4 text-sm text-[var(--muted-foreground)] font-bold">
                      {t('checkout.paymentReferenceBankTransfer')}
                    </p>
                    <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                      {t('checkout.paymentReferenceTextBankTransfer')}
                    </p>
                  </div>

                  {localStorage.getItem('shippingData') && (() => {
                    const shippingData = JSON.parse(localStorage.getItem('shippingData') || '{}');
                    const billingData = JSON.parse(localStorage.getItem('billingData') || '{}');
                    return (
                      <>
                        <div className="bg-[var(--secondary)] border border-[var(--border)] rounded-lg p-6">
                          <h3 className="text-lg font-medium text-[var(--foreground)] mb-4">📦 {t('checkout.yourDeliveryInformation')}</h3>
                          <div className="mt-4 space-y-2 text-left">
                            <p className="text-sm text-[var(--muted-foreground)]">{t('checkout.name')}: {shippingData.firstName} {shippingData.lastName}</p>
                            <p className="text-sm text-[var(--muted-foreground)]">{t('checkout.address')}: {shippingData.address}{shippingData.apartment ? `, ${shippingData.apartment}` : ''}, {shippingData.city}, {shippingData.state}, {shippingData.country}{shippingData.postalCode ? ` ${shippingData.postalCode}` : ''}</p>
                            <p className="text-sm text-[var(--muted-foreground)]">{t('checkout.phone')}: {shippingData.phone}</p>
                            <p className="text-sm text-[var(--muted-foreground)]">{t('checkout.email')}: {shippingData.email || ''}</p>
                            {shippingData.additionalInfo && (
                              <p className="text-sm text-[var(--muted-foreground)] pt-2 border-t border-[var(--border)]">
                                <strong>Informații suplimentare:</strong> {shippingData.additionalInfo}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="bg-[var(--secondary)] border border-[var(--border)] rounded-lg p-6">
                          <h3 className="text-lg font-medium text-[var(--foreground)] mb-4">💳 Billing Information</h3>
                          <div className="mt-4 space-y-2 text-left">
                            <p className="text-sm text-[var(--muted-foreground)]">{t('checkout.name')}: {billingData.firstName} {billingData.lastName}</p>
                            {billingData.company && (
                              <p className="text-sm text-[var(--muted-foreground)]">Company: {billingData.company}</p>
                            )}
                            {billingData.taxId && (
                              <p className="text-sm text-[var(--muted-foreground)]">Tax ID: {billingData.taxId}</p>
                            )}
                            <p className="text-sm text-[var(--muted-foreground)]">{t('checkout.address')}: {billingData.address}{billingData.apartment ? `, ${billingData.apartment}` : ''}, {billingData.city}, {billingData.state}, {billingData.country}{billingData.postalCode ? ` ${billingData.postalCode}` : ''}</p>
                            <p className="text-sm text-[var(--muted-foreground)]">{t('checkout.phone')}: {billingData.phone}</p>
                            <p className="text-sm text-[var(--muted-foreground)]">{t('checkout.email')}: {billingData.email || ''}</p>
                          </div>
                        </div>
                      </>
                    );
                  })()}

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="payment-reference"
                      className="mr-2 h-4 w-4 text-[var(--primary)] border-[var(--border)] rounded focus:ring-[var(--primary)]"
                      checked={paymentReferenceConfirmed}
                      onChange={handlePaymentReferenceChange}
                    />
                    <label htmlFor="payment-reference" className="text-sm text-[var(--foreground)]">
                      {t('checkout.paymentReferenceTextBankTransfer')}
                    </label>
                  </div>
                  {!paymentReferenceConfirmed && (
                    <p className="text-sm text-[var(--destructive)] my-2">
                      {t('checkout.paymentReferenceTextBankTransfer')}
                    </p>
                  )}

                  <Button
                    type="button"
                    onClick={handlePaymentSuccess}
                    disabled={!paymentReferenceConfirmed || !isCartReady || isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
              <div className="border-t border-[var(--border)] pt-6 mt-8">
                {localStorage.getItem('shippingData') && (() => {
                  const shippingData = JSON.parse(localStorage.getItem('shippingData') || '{}');
                  const billingData = JSON.parse(localStorage.getItem('billingData') || '{}');
                  return (
                    <>
                      <div className="bg-[var(--secondary)] border border-[var(--border)] rounded-lg p-6 mb-4">
                        <h3 className="text-lg font-medium text-[var(--foreground)] mb-4">📦 {t('checkout.yourDeliveryInformation')}</h3>
                        <div className="mt-4 space-y-2 text-left">
                          <p className="text-sm text-[var(--muted-foreground)]">{t('checkout.name')}: {shippingData.firstName} {shippingData.lastName}</p>
                          <p className="text-sm text-[var(--muted-foreground)]">{t('checkout.address')}: {shippingData.address}{shippingData.apartment ? `, ${shippingData.apartment}` : ''}, {shippingData.city}, {shippingData.state}, {shippingData.country}{shippingData.postalCode ? ` ${shippingData.postalCode}` : ''}</p>
                          <p className="text-sm text-[var(--muted-foreground)]">{t('checkout.phone')}: {shippingData.phone}</p>
                          <p className="text-sm text-[var(--muted-foreground)]">{t('checkout.email')}: {shippingData.email || ''}</p>
                          {shippingData.additionalInfo && (
                            <p className="text-sm text-[var(--muted-foreground)] pt-2 border-t border-[var(--border)]">
                              <strong>Informații suplimentare:</strong> {shippingData.additionalInfo}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="bg-[var(--secondary)] border border-[var(--border)] rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-medium text-[var(--foreground)] mb-4">💳 Billing Information</h3>
                        <div className="mt-4 space-y-2 text-left">
                          <p className="text-sm text-[var(--muted-foreground)]">{t('checkout.name')}: {billingData.firstName} {billingData.lastName}</p>
                          {billingData.company && (
                            <p className="text-sm text-[var(--muted-foreground)]">Company: {billingData.company}</p>
                          )}
                          {billingData.taxId && (
                            <p className="text-sm text-[var(--muted-foreground)]">Tax ID: {billingData.taxId}</p>
                          )}
                          <p className="text-sm text-[var(--muted-foreground)]">{t('checkout.address')}: {billingData.address}{billingData.apartment ? `, ${billingData.apartment}` : ''}, {billingData.city}, {billingData.state}, {billingData.country}{billingData.postalCode ? ` ${billingData.postalCode}` : ''}</p>
                          <p className="text-sm text-[var(--muted-foreground)]">{t('checkout.phone')}: {billingData.phone}</p>
                          <p className="text-sm text-[var(--muted-foreground)]">{t('checkout.email')}: {billingData.email || ''}</p>
                        </div>
                      </div>
                    </>
                  );
                })()}

                <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">{t('checkout.securePayment')}</h3>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center">
                    <svg className="h-6 w-6 text-[var(--muted-foreground)]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 6c1.4 0 2.8 1.1 2.8 4.2 0 1.5-1.2 2.1-2.8 2.1s-2.8-.6-2.8-2.1C9.2 8.1 10.6 7 12 7zm0 1.3c-.8 0-1.4.5-1.4 2.9 0 2.3.6 2.8 1.4 2.8s1.4-.5 1.4-2.8c0-2.4-.6-2.9-1.4-2.9z" />
                    </svg>
                    <span className="ml-2 text-sm text-[var(--muted-foreground)]">256-bit SSL Security</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-6 w-6 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="ml-2 text-sm text-[var(--muted-foreground)]">PCI Compliant - euPlatesc</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 mt-10 lg:mt-0 gap-4 flex flex-col">
          <div className="bg-[var(--card)] shadow overflow-hidden sm:rounded-lg p-6 border border-[var(--border)]">
              <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">{t('checkout.paymentInfo')}</h2>
              <p className="text-sm text-[var(--muted-foreground)]">{t('checkout.paymentInfoText')}</p>
          </div>
          <div className="bg-[var(--card)] shadow overflow-hidden sm:rounded-lg p-6 border border-[var(--border)]">
            <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">{t('checkout.orderSummary')}</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">{t('checkout.subtotal')}</span>
                <span className="font-medium text-[var(--foreground)]" aria-label="Order subtotal">{(getCartTotal() / 100).toFixed(2)} RON</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">{t('checkout.shipping')}</span>
                <span className="font-medium text-[var(--foreground)]">{(getPriceShipping() / 100).toFixed(2)} RON</span>
              </div>
              <div className="flex justify-between border-t border-[var(--border)] pt-4">
                <span className="text-lg font-bold text-[var(--foreground)]">{t('checkout.total')}</span>
                <span className="text-lg font-bold text-[var(--foreground)]">{((getCartTotal() + getPriceShipping()) / 100).toFixed(2)} RON</span>
              </div>
              {paymentMethod === 'credit-card' && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-[var(--foreground)] mb-4">{t('checkout.creditCardDetails')}</h3>
                  <EuPlatescForm onInitiate={handleEuPlatescPayment} />
                </div>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-[var(--foreground)] mb-2">{t('checkout.needHelp')}</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                {t('checkout.contactUs')}{' '}
                <a href="mailto:simonabuzau2@gmail.com" className="text-[var(--primary)] hover:underline">
                  simonabuzau2@gmail.com
                </a>
              </p>
            </div>
          </div>
          <div className="text-center">
            <Link
              href="/checkout/shipping"
              className="text-sm font-medium text-[var(--primary)] hover:text-[var(--hover-primary)] flex items-center justify-center"
            >
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('checkout.returnToShipping')}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Hidden form for euPlatesc redirect */}
      <form ref={formRef} method="POST" style={{ display: 'none' }} />
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <Spinner className="w-12 h-12" />
          <p className="text-[var(--muted-foreground)]">Loading payment page...</p>
        </div>
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}
