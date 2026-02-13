// app/orders/page.tsx
'use client';

import { useState } from 'react';
import { FiSearch, FiPackage, FiCalendar, FiCreditCard, FiTruck, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { OrderStatus, Order } from '@/types/orders';
import { Package } from 'lucide-react';
import axios from 'axios';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/translations';


export default function OrderLookupPage() {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [message, setMessage] = useState('');
    const { language } = useLanguage();
    const t = useTranslation(language);
    

    const handleSubmit = async () => {
        setSearchError('');
        setOrder(null);
        setIsLoading(true);

        if (!trackingNumber.trim()) {
            setSearchError(t('orders.enterTracking'));
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get(`/api/orders/${trackingNumber}`);

            if (response.status === 404) {
                setMessage(t('orders.notFoundText'));
                setIsLoading(false);
                return;
            }
            setOrder(response.data);
        } catch (error) {
            console.error('Error looking up order:', error);
            setSearchError(t('orders.notFoundText'));
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status: OrderStatus) => {
        const statusClasses = {
            processing: 'bg-[var(--accent)]/10 text-[var(--accent-foreground)]',
            shipped: 'bg-[var(--primary)]/10 text-[var(--primary)]',
            delivered: 'bg-[var(--primary)]/20 text-[var(--primary)]',
            cancelled: 'bg-[var(--destructive)]/10 text-[var(--destructive)]'
        };

        const statusText = {
            processing: t('orders.processing'),
            shipped: t('orders.shipped'),
            delivered: t('orders.delivered'),
            cancelled: t('orders.cancelled')
        };

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusClasses[status as keyof typeof statusClasses]}`}>
                {statusText[status as keyof typeof statusText]}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-[var(--card)]/50 backdrop-blur-sm rounded-lg py-12 px-4 sm:px-6 lg:px-8 border border-[var(--border)]">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[var(--foreground)]">{t('orders.title')}</h1>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                        {t('orders.subtitle')}
                    </p>
                </div>

                <div className="bg-[var(--card)] shadow rounded-lg overflow-hidden mb-8 border border-[var(--border)]">
                    <div className="p-6">
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="trackingNumber" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                                    {t('orders.trackingNumber')}
                                </label>
                                <div className="flex rounded-md shadow-sm">
                                    <input
                                        type="text"
                                        name="trackingNumber"
                                        id="trackingNumber"
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        className="p-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] flex-1 block w-full rounded-l-md sm:text-sm border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
                                        placeholder="e.g. 37I8-E1Q4-PTYP"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        onClick={handleSubmit}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-[var(--primary-foreground)] bg-[var(--primary)] hover:bg-[var(--hover-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] disabled:opacity-50"
                                    >
                                        {isLoading ? 'Searching...' : (
                                            <>
                                                <FiSearch className="h-4 w-4 mr-2" />
                                                {t('orders.trackOrder')}
                                            </>
                                        )}
                                    </button>
                                </div>
                                {searchError && <p className="mt-2 text-sm text-[var(--destructive)]">{searchError}</p>}
                            </div>
                        </form>
                    </div>
                </div>

                {order && !isLoading && (
                    <div className="bg-[var(--card)] shadow overflow-hidden rounded-lg border border-[var(--border)]">
                        <div className="px-4 py-5 sm:px-6 border-b border-[var(--border)]">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                <div>
                                    <h2 className="text-lg font-medium text-[var(--foreground)]">Order #{order.orderId}</h2>
                                    <div className="mt-1 flex items-center text-sm text-[var(--muted-foreground)]">
                                        <FiCalendar className="shrink-0 mr-1.5 h-4 w-4" />
                                        {t('orders.placedOn')} {new Date(order.date).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="mt-3 sm:mt-0">
                                    {getStatusBadge(order.status)}
                                </div>
                            </div>
                        </div>

                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg font-medium text-[var(--foreground)] mb-4">{t('orders.items')}</h3>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.itemId} className="flex items-start space-x-4 py-4 border-b border-[var(--border)] last:border-0">
                                        <div className="w-20 h-20 bg-[var(--muted)] rounded-md flex items-center justify-center">
                                            <Package className="h-6 w-6 text-[var(--muted-foreground)]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-[var(--foreground)]">{item.name}</h4>
                                            <p className="text-sm text-[var(--muted-foreground)]">Qty: {item.quantity}</p>
                                            <p className="text-sm font-medium text-[var(--foreground)] mt-1">
                                                {(item.price * item.quantity / 100).toFixed(2)} RON
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 border-t border-[var(--border)] pt-6">
                                <h3 className="text-lg font-medium text-[var(--foreground)] mb-4">{t('checkout.orderSummary')}</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-[var(--muted-foreground)]">{t('checkout.subtotal')}</span>
                                        <span className="text-sm font-medium text-[var(--foreground)]">
                                            {((order.items.reduce((sum, item) => sum + (item.price * item.quantity / 100), 0))).toFixed(2)} RON
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-[var(--muted-foreground)]">{t('checkout.shipping')}</span>
                                        <span className="text-sm font-medium text-[var(--foreground)]">{ (order.shippingCost / 100).toFixed(2)} RON</span>
                                    </div>
                                    {order.discount && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-[var(--primary)]">{t('discount.discount')} ({order.discount.code})</span>
                                            <span className="text-sm font-medium text-[var(--primary)]">-{(order.discount.amount / 100).toFixed(2)} RON</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between pt-3 border-t border-[var(--border)]">
                                        <span className="text-base font-medium text-[var(--foreground)]">{t('checkout.total')}</span>
                                        <span className="text-base font-bold text-[var(--foreground)]">{((order.total + order.shippingCost) / 100).toFixed(2)} RON</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 border-t border-[var(--border)] pt-6">
                                <h3 className="text-lg font-medium text-[var(--foreground)] mb-4">{t('checkout.shipping')} Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm font-medium text-[var(--foreground)]">{t('checkout.shipping')} Address</h4>
                                        <div className="mt-2 text-sm text-[var(--muted-foreground)] space-y-1">
                                            <p>{order.shipping.name}</p>
                                            <p>{order.shipping.address}</p>
                                            <p>{order.shipping.city}, {order.shipping.state} {order.shipping.postalCode}</p>
                                            <p>{order.shipping.country}</p>
                                            <p className="mt-2">{order.shipping.phone}</p>
                                            <p>{order.shipping.email}</p>
                                            {order.shipping.deliveryInstructions && (
                                                <div className="mt-3 pt-3 border-t border-[var(--border)]">
                                                    <p className="font-medium text-[var(--foreground)]">Informații suplimentare:</p>
                                                    <p className="mt-1">{order.shipping.deliveryInstructions}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-[var(--foreground)]">{t('checkout.shipping')} Method</h4>
                                        <div className="mt-2 flex items-center">
                                            <FiTruck className="h-5 w-5 text-[var(--muted-foreground)] mr-2" />
                                            <span className="text-sm text-[var(--muted-foreground)]">Standard {t('checkout.shipping')}</span>
                                        </div>
                                        {order.status === 'out-for-delivery' && order.trackingNumber && (
                                            <div className="mt-4">
                                                <h4 className="text-sm font-medium text-[var(--foreground)]">Tracking Information</h4>
                                                <div className="mt-1">
                                                    <p className="text-sm text-[var(--primary)]">{order.trackingNumber}</p>
                                                    <p className="text-xs text-[var(--muted-foreground)] mt-1">Track your package on the carrier&apos;s website</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 border-t border-[var(--border)] pt-6">
                                <h3 className="text-lg font-medium text-[var(--foreground)] mb-4">{t('orders.paymentInfo')}</h3>
                                <div className="flex items-start">
                                    <div className="shrink-0">
                                        <FiCreditCard className="h-6 w-6 text-[var(--muted-foreground)]" />
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-sm font-medium text-[var(--foreground)]">
                                            {order.payment.method === 'credit-card' && 'Credit Card'}
                                            {order.payment.method === 'bank-transfer' && 'Bank Transfer'}
                                            {order.payment.method === 'cash-on-delivery' && 'Cash on Delivery'}
                                        </h4>
                                        <div className="mt-1">
                                            {order.payment.status === 'paid' ? (
                                                <span className="inline-flex items-center text-sm text-[var(--primary)]">
                                                    <FiCheckCircle className="h-4 w-4 mr-1" />
                                                    Paid on {new Date(order.date).toLocaleDateString()}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center text-sm text-[var(--destructive)]">
                                                    <FiXCircle className="h-4 w-4 mr-1" />
                                                    {order.payment.status.charAt(0).toUpperCase() + order.payment.status.slice(1)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {isLoading && !order && (
                    <div className="min-h-screen bg-[var(--card)]/50 py-12 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)] mx-auto"></div>
                                <p className="mt-4 text-sm text-[var(--muted-foreground)]">Loading order information...</p>
                            </div>
                        </div>
                    </div>
                )}

                {message && (
                    <div className="min-h-screen bg-[var(--card)]/50 py-12 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto text-center">
                            <p className="text-sm text-[var(--muted-foreground)]">{message}</p>
                        </div>
                    </div>
                )}

                {searchError && (
                    <div className="min-h-screen bg-[var(--card)]/50 py-12 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center">
                                <FiXCircle className="mx-auto h-12 w-12 text-[var(--destructive)]" />
                                <h2 className="mt-4 text-lg font-medium text-[var(--foreground)]">Error</h2>
                                <p className="mt-2 text-sm text-[var(--muted-foreground)]">Failed to load order information. Please try again later.</p>
                            </div>
                        </div>
                    </div>
                )}

                {!order && !isLoading && !searchError && !message && (
                    <div className="bg-[var(--card)] shadow overflow-hidden rounded-lg border border-[var(--border)]">
                        <div className="px-4 py-5 sm:p-6 text-center">
                            <FiPackage className="mx-auto h-12 w-12 text-[var(--muted-foreground)]" />
                            <h3 className="mt-2 text-lg font-medium text-[var(--foreground)]">No order selected</h3>
                            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                                Enter your order number above to view order details
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}