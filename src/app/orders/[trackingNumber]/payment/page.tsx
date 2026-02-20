'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Order } from '@/types/orders';
import { FiCreditCard, FiCheckCircle, FiXCircle, FiClock, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import Link from 'next/link';

export default function PaymentStatusPage() {
  const params = useParams();
  const trackingNumber = params.trackingNumber as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);
  
  const fetchOrder = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await axios.get(`/api/orders/${trackingNumber}`);
      setOrder(response.data);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Order not found. Please check your tracking number.');
    } finally {
      setIsLoading(false);
    }
  }, [trackingNumber]);
  useEffect(() => {
    if (trackingNumber) {
      fetchOrder();
    }
  }, [trackingNumber, fetchOrder]);


  const handleRetryPayment = async () => {
    if (!order) return;
    
    setIsRetrying(true);
    try {
      // Initialize new payment
      const response = await axios.post('/api/euplatesc/init-payment', {
        amount: order.total + order.shippingCost - (order.discount?.amount || 0),
        curr: 'RON',
        invoice_id: order.trackingNumber,
        order_desc: `Order ${order.trackingNumber} - Buchetul Simonei (Retry)`,
        customerInfo: {
          firstName: order.shipping.name.split(' ')[0],
          lastName: order.shipping.name.split(' ').slice(1).join(' '),
          email: order.shipping.email,
          phone: order.shipping.phone,
          address: order.shipping.address,
          city: order.shipping.city,
          state: order.shipping.state,
          zip: order.shipping.postalCode,
          country: order.shipping.country || 'RO',
        },
      });

      const { paymentParams, paymentUrl } = response.data;

      // Create a form and submit it to redirect to euPlatesc
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = paymentUrl;

      Object.keys(paymentParams).forEach((key) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = paymentParams[key] || '';
        form.appendChild(input);
      });

      // Add return URLs
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

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error('Error retrying payment:', err);
      alert('Failed to initialize payment. Please try again or contact support.');
      setIsRetrying(false);
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <FiCheckCircle className="w-16 h-16 text-green-500" />;
      case 'failed':
        return <FiXCircle className="w-16 h-16 text-red-500" />;
      case 'pending':
        return <FiClock className="w-16 h-16 text-yellow-500" />;
      case 'refunded':
        return <FiRefreshCw className="w-16 h-16 text-blue-500" />;
      default:
        return <FiAlertCircle className="w-16 h-16 text-gray-500" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-50 border-green-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      case 'refunded':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
    }).format(price / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--card)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto"></div>
          <p className="mt-4 text-[var(--muted-foreground)]">Loading payment status...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[var(--card)] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <FiXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Order Not Found</h2>
          <p className="text-[var(--muted-foreground)] mb-6">{error}</p>
          <Link
            href="/orders"
            className="inline-block px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--hover-primary)] transition-colors"
          >
            Search Another Order
          </Link>
        </div>
      </div>
    );
  }

  const paymentStatus = order.payment.status;
  const canRetry = paymentStatus === 'failed' || paymentStatus === 'pending';

  return (
    <div className="min-h-screen bg-[var(--card)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Payment Status</h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Order #{order.orderId}
          </p>
        </div>

        {/* Payment Status Card */}
        <div className={`bg-white rounded-lg shadow-lg border-2 p-8 mb-6 ${getPaymentStatusColor(paymentStatus)}`}>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {getPaymentStatusIcon(paymentStatus)}
            </div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
              {paymentStatus === 'paid' && 'Payment Successful'}
              {paymentStatus === 'failed' && 'Payment Failed'}
              {paymentStatus === 'pending' && 'Payment Pending'}
              {paymentStatus === 'refunded' && 'Payment Refunded'}
            </h2>
            <p className="text-[var(--muted-foreground)] mb-6">
              {paymentStatus === 'paid' && 'Your payment has been processed successfully.'}
              {paymentStatus === 'failed' && 'Your payment could not be processed. Please try again.'}
              {paymentStatus === 'pending' && 'Your payment is being processed. This may take a few moments.'}
              {paymentStatus === 'refunded' && 'Your payment has been refunded to your account.'}
            </p>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-[var(--card)] rounded-lg shadow border border-[var(--border)] p-6 mb-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center">
            <FiCreditCard className="mr-2" />
            Payment Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Payment Method:</span>
              <span className="font-medium text-[var(--foreground)]">
                {order.payment.method === 'credit-card' ? 'Credit Card (euPlatesc)' : 
                 order.payment.method === 'bank-transfer' ? 'Bank Transfer' : 'Cash on Delivery'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Status:</span>
              <span className={`font-medium ${
                paymentStatus === 'paid' ? 'text-green-600' :
                paymentStatus === 'failed' ? 'text-red-600' :
                paymentStatus === 'pending' ? 'text-yellow-600' :
                'text-blue-600'
              }`}>
                {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
              </span>
            </div>
            {order.payment.transactionId && (
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Transaction ID:</span>
                <span className="font-mono text-sm text-[var(--foreground)]">{order.payment.transactionId}</span>
              </div>
            )}
            {order.payment.euplatescData && (
              <>
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">Payment Date:</span>
                  <span className="text-[var(--foreground)]">
                    {formatDate(order.payment.euplatescData.timestamp)}
                  </span>
                </div>
                {order.payment.euplatescData.message && (
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">Message:</span>
                    <span className="text-[var(--foreground)]">{order.payment.euplatescData.message}</span>
                  </div>
                )}
              </>
            )}
            <div className="border-t border-[var(--border)] pt-3 mt-3">
              <div className="flex justify-between text-lg">
                <span className="font-semibold text-[var(--foreground)]">Total Amount:</span>
                <span className="font-bold text-[var(--foreground)]">
                  {formatPrice(order.total + order.shippingCost - (order.discount?.amount || 0))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-[var(--card)] rounded-lg shadow border border-[var(--border)] p-6 mb-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Tracking Number:</span>
              <span className="font-medium text-[var(--foreground)]">{order.trackingNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Order Date:</span>
              <span className="text-[var(--foreground)]">{formatDate(order.date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Order Status:</span>
              <span className="font-medium text-[var(--foreground)]">
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          {canRetry && order.payment.method === 'credit-card' && (
            <button
              onClick={handleRetryPayment}
              disabled={isRetrying}
              className="flex-1 bg-[var(--primary)] text-[var(--primary-foreground)] px-6 py-3 rounded-lg font-medium hover:bg-[var(--hover-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isRetrying ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FiRefreshCw className="mr-2" />
                  Retry Payment
                </>
              )}
            </button>
          )}
          <Link
            href={`/orders`}
            className="flex-1 bg-[var(--secondary)] text-[var(--foreground)] px-6 py-3 rounded-lg font-medium hover:bg-[var(--secondary)]/80 transition-colors text-center"
          >
            View Order Details
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-[var(--secondary)] rounded-lg p-6 border border-[var(--border)]">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">Need Help?</h3>
          <p className="text-[var(--muted-foreground)] mb-4">
            If you have questions about your payment or need assistance, please contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:simonabuzau2@gmail.com"
              className="text-[var(--primary)] hover:underline"
            >
              simonabuzau2@gmail.com
            </a>
            <a
              href="tel:0769141250"
              className="text-[var(--primary)] hover:underline"
            >
              0769 141 250
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
