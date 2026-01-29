// app/orders/page.tsx
'use client';

import { useState } from 'react';
import { FiSearch, FiPackage, FiCalendar, FiCreditCard, FiTruck, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { OrderStatus, Order } from '@/types/orders';
import { Package } from 'lucide-react';
import axios from 'axios';


export default function OrderLookupPage() {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [message, setMessage] = useState('');
    

    const handleSubmit = async () => {
        setSearchError('');
        setOrder(null);
        setIsLoading(true);

        if (!trackingNumber.trim()) {
            setSearchError('Please enter an order tracking number');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get(`/api/orders/${trackingNumber}`);

            if (response.status === 404) {
                setMessage('Order not found. Please check your order tracking number and try again.');
                setIsLoading(false);
                return;
            }
            setOrder(response.data);
        } catch (error) {
            console.error('Error looking up order:', error);
            setSearchError('Order not found. Please check your order tracking number and try again.');
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status: OrderStatus) => {
        const statusClasses = {
            processing: 'bg-yellow-100 text-yellow-800',
            shipped: 'bg-blue-100 text-blue-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };

        const statusText = {
            processing: 'Processing',
            shipped: 'Shipped',
            delivered: 'Delivered',
            cancelled: 'Cancelled'
        };

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusClasses[status as keyof typeof statusClasses]}`}>
                {statusText[status as keyof typeof statusText]}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50/50 backdrop-blur-sm rounded-lg py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Track Your Order</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter your order tracking number to check the status of your order
                    </p>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
                    <div className="p-6">
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                    Order Tracking Number
                                </label>
                                <div className="flex rounded-md shadow-sm">
                                    <input
                                        type="text"
                                        name="trackingNumber"
                                        id="trackingNumber"
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        className="p-2 focus:ring-primary focus:border-primary flex-1 block w-full rounded-l-md sm:text-sm border-gray-300"
                                        placeholder="e.g. 37I8-E1Q4-PTYP"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        onClick={handleSubmit}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                                    >
                                        {isLoading ? 'Searching...' : (
                                            <>
                                                <FiSearch className="h-4 w-4 mr-2" />
                                                Track Order
                                            </>
                                        )}
                                    </button>
                                </div>
                                {searchError && <p className="mt-2 text-sm text-red-600">{searchError}</p>}
                            </div>
                        </form>
                    </div>
                </div>

                {order && !isLoading && (
                    <div className="bg-white shadow overflow-hidden rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900">Order #{order.orderId}</h2>
                                    <div className="mt-1 flex items-center text-sm text-gray-500">
                                        <FiCalendar className="shrink-0 mr-1.5 h-4 w-4" />
                                        Placed on {new Date(order.date).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="mt-3 sm:mt-0">
                                    {getStatusBadge(order.status)}
                                </div>
                            </div>
                        </div>

                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.itemId} className="flex items-start space-x-4 py-4 border-b border-gray-100 last:border-0">
                                        <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center">
                                            <Package className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            <p className="text-sm font-medium text-gray-900 mt-1">
                                                {(item.price * item.quantity / 100).toFixed(2)} RON
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Subtotal</span>
                                        <span className="text-sm font-medium">
                                            {((order.items.reduce((sum, item) => sum + (item.price * item.quantity / 100), 0))).toFixed(2)} RON
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Shipping</span>
                                        <span className="text-sm font-medium">{ (order.shippingCost / 100).toFixed(2)} RON</span>
                                    </div>
                                    <div className="flex justify-between pt-3 border-t border-gray-200">
                                        <span className="text-base font-medium">Total</span>
                                        <span className="text-base font-bold">{((order.total + order.shippingCost) / 100).toFixed(2)} RON</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">Shipping Address</h4>
                                        <div className="mt-2 text-sm text-gray-600 space-y-1">
                                            <p>{order.shipping.name}</p>
                                            <p>{order.shipping.address}</p>
                                            <p>{order.shipping.city}, {order.shipping.state} {order.shipping.postalCode}</p>
                                            <p>{order.shipping.country}</p>
                                            <p className="mt-2">{order.shipping.phone}</p>
                                            <p>{order.shipping.email}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">Shipping Method</h4>
                                        <div className="mt-2 flex items-center">
                                            <FiTruck className="h-5 w-5 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-600">Standard Shipping</span>
                                        </div>
                                        {order.status === 'out-for-delivery' && order.trackingNumber && (
                                            <div className="mt-4">
                                                <h4 className="text-sm font-medium text-gray-900">Tracking Information</h4>
                                                <div className="mt-1">
                                                    <p className="text-sm text-blue-600">{order.trackingNumber}</p>
                                                    <p className="text-xs text-gray-500 mt-1">Track your package on the carrier&apos;s website</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
                                <div className="flex items-start">
                                    <div className="shrink-0">
                                        <FiCreditCard className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-sm font-medium text-gray-900">
                                            {order.payment.method === 'credit-card' && 'Credit Card'}
                                            {order.payment.method === 'bank-transfer' && 'Bank Transfer'}
                                            {order.payment.method === 'cash-on-delivery' && 'Cash on Delivery'}
                                        </h4>
                                        <div className="mt-1">
                                            {order.payment.status === 'paid' ? (
                                                <span className="inline-flex items-center text-sm text-green-600">
                                                    <FiCheckCircle className="h-4 w-4 mr-1" />
                                                    Paid on {new Date(order.date).toLocaleDateString()}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center text-sm text-red-600">
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
                    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                                <p className="mt-4 text-sm text-gray-600">Loading order information...</p>
                            </div>
                        </div>
                    </div>
                )}

                {message && (
                    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto text-center">
                            <p className="text-sm text-gray-600">{message}</p>
                        </div>
                    </div>
                )}

                {searchError && (
                    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center">
                                <FiXCircle className="mx-auto h-12 w-12 text-red-400" />
                                <h2 className="mt-4 text-lg font-medium text-gray-900">Error</h2>
                                <p className="mt-2 text-sm text-gray-500">Failed to load order information. Please try again later.</p>
                            </div>
                        </div>
                    </div>
                )}

                {!order && !isLoading && !searchError && !message && (
                    <div className="bg-white shadow overflow-hidden rounded-lg">
                        <div className="px-4 py-5 sm:p-6 text-center">
                            <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No order selected</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Enter your order number above to view order details
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}