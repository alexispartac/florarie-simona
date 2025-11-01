'use client';
import { useState, useEffect } from 'react'
import { SidebarDemo } from '../components/SideBar';
import { OrderProps } from '../../api/types';
import React from 'react';
import axios from 'axios';

const URL_ORDERS = '/api/orders';
const URL_SEND_EMAIL_ORDER_DONE = '/api/send-email/order-done';
const URL_SEND_EMAIL_ORDER_PROCESSED = '/api/send-email/order-processed';
const URL_SEND_EMAIL_ORDER_CANCELLED = '/api/send-email/order-cancelled';

const OrderRow = ({ order, onChangeStatus }: { order: OrderProps, onChangeStatus: (id: string, status: 'Processing' | 'Delivered' | 'Cancelled') => void }) => {
    return (
        <div key={order.id} className="border rounded p-4 bg-gray-50 dark:bg-neutral-800">
            <div className="flex flex-row justify-between">
                <div>
                    <b> {order.clientName} </b>
                    <div className="text-xs text-gray-500">{order.clientEmail} | {order.clientPhone}</div>
                    <div className="text-xs text-gray-500">{order.clientAddress}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className="font-semibold">{order.status}</span>
                    <div className="text-xs">Total: {order.totalPrice} RON</div>
                    <div className="text-xs">Plasată: {order.orderDate}</div>
                    {order.status === 'Delivered' && (
                        <div className="text-xs">Livrata: {order.deliveryDate}</div>
                    )}

                    {order.status === 'Pending' && (
                        <div className="flex gap-2 mt-2">
                            <button
                                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                                onClick={() => onChangeStatus(order.id, 'Processing')}
                            >
                                Processing
                            </button>
                            <button
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                onClick={() => onChangeStatus(order.id, 'Cancelled')}
                            >
                                Canceled
                            </button>
                        </div>
                    )}

                    {order.status !== 'Delivered' && order.status !== 'Pending' && (
                        <button
                            className="mt-2 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                            onClick={() => onChangeStatus(order.id, 'Delivered')}
                        >
                            Marchează ca livrată
                        </button>
                    )}
                </div>
            </div>
            <div className="mt-2">
                <b>Produse:</b>
                <ul className="list-disc ml-6">
                    {order.products.map(p => (
                        <li key={p.id}>
                            {p.title} x {p.quantity} | {p.category} - {p.price} RON
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

const ListOfOrders = ({
    orders,
    onChangeStatus,
}: {
    orders: OrderProps[];
    onChangeStatus: (id: string, status: 'Processing' | 'Delivered' | 'Cancelled') => void;
}) => {
    const [numberTodayOrders, setNumberTodayOrders] = useState(0);

    React.useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const todayOrders = orders.filter(order => order.orderDate.startsWith(today));
        setNumberTodayOrders(todayOrders.length);
    }, [orders]);
    
    if (orders.length === 0) {
        return <div className="text-center text-gray-500">Nu există comenzi.</div>;
    }

    if (orders.length > 100) {
        return <div className="text-center text-red-500">Prea multe comenzi pentru a fi afișate.</div>;
    }

    const reverseOrders = [...orders].reverse();

    return (
        <div className="flex flex-col gap-2 overflow-y-auto">
            <div className="text-center text-gray-500 mb-4">
                {numberTodayOrders > 0 ? (
                    <span>Comenzi de astăzi: {numberTodayOrders}</span>
                ) : (
                    <span>Nu există comenzi de astăzi.</span>
                )}
            </div>
            {reverseOrders.map(order => (
                <OrderRow key={order.id} order={order} onChangeStatus={onChangeStatus} />
            ))}
        </div>
    );
};


const Page = () => {
    const [orders, setOrders] = useState<OrderProps[]>([]);
    // activeCategory: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled'
    const [activeCategory, setActiveCategory] = useState<'Pending' | 'Processing' | 'Delivered' | 'Cancelled'>('Pending');
    const [loading, setLoading] = useState(true);

    async function fetchOrders() {
        setLoading(true);
        try {
            const response = await axios.get(URL_ORDERS);
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log('Error fetching orders:', error);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    // Alocări pe categorii (păstrează statusurile exacte folosite în backend)
    const pendingOrders = orders.filter(order => order.status === 'Pending');
    const processingOrders = orders.filter(order => order.status === 'Processing');
    const deliveredOrders = orders.filter(order => order.status === 'Delivered');
    const cancelledOrders = orders.filter(order => order.status === 'Cancelled');

    const handleChangeStatus = async (id: string, status: 'Processing' | 'Delivered' | 'Cancelled') => {
        try {
            await axios.put(URL_ORDERS, { id, status });
            setOrders(prev =>
                prev.map(order =>
                    order.id === id
                        ? {
                            ...order,
                            status,
                            ...(status === 'Delivered' ? { deliveryDate: new Date().toISOString() } : {})
                        }
                        : order
                )
            );

            if (status === 'Delivered') {
                const finalizedOrder = orders.find(order => order.id === id);
                if (finalizedOrder) {
                    const updatedOrder = {
                        ...finalizedOrder,
                        status: 'Delivered',
                        deliveryDate: new Date().toISOString(),
                    };
                    axios.post(URL_SEND_EMAIL_ORDER_DONE, {
                        order: updatedOrder,
                    }).then(() => {
                        console.log('Order completion email sent successfully.');
                    }).catch(error => {
                        console.log('Error sending order completion email:', error);
                    });
                }
            }

            if (status === 'Processing') {
                const finalizedOrder = orders.find(order => order.id === id);
                if (finalizedOrder) {
                    const updatedOrder = {
                        ...finalizedOrder,
                        status: 'Processing',
                        deliveryDate: new Date().toISOString(),
                    };
                    axios.post(URL_SEND_EMAIL_ORDER_PROCESSED, {
                        order: updatedOrder,
                    }).then(() => {
                        console.log('Order processed email sent successfully.');
                    }).catch(error => {
                        console.log('Error sending order processed email:', error);
                    });
                }
            }

            if (status === 'Cancelled') {
                const finalizedOrder = orders.find(order => order.id === id);
                if (finalizedOrder) {
                    const updatedOrder = {
                        ...finalizedOrder,
                        status: 'Cancelled',
                        deliveryDate: new Date().toISOString(),
                    };
                    axios.post(URL_SEND_EMAIL_ORDER_CANCELLED, {
                        order: updatedOrder,
                    }).then(() => {
                        console.log('Order cancelled email sent successfully.');
                    }).catch(error => {
                        console.log('Error sending order cancelled email:', error);
                    });
                }
            }
        } catch (error) {
            console.log('Error changing order status:', error);
        }
    };

    const getDisplayedOrders = () => {
        switch (activeCategory) {
            case 'Pending':
                return pendingOrders;
            case 'Processing':
                return processingOrders;
            case 'Delivered':
                return deliveredOrders;
            case 'Cancelled':
                return cancelledOrders;
            default:
                return [];
        }
    };

    return (
        <SidebarDemo>
            <div className="flex flex-1 h-full">
                <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="flex gap-2">
                        {loading && (
                            <div className="flex items-center justify-center w-full h-20 bg-gray-100 dark:bg-neutral-800 rounded-lg">
                                <span className="text-gray-500">Încărcare comenzi...</span>
                            </div>
                        )}

                        {/* Category buttons */}
                        <div
                            className={`h-20 w-full text-center py-7 rounded-lg cursor-pointer ${activeCategory === 'Pending'
                                ? 'bg-blue-200 dark:bg-blue-900'
                                : 'bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700'
                                }`}
                            onClick={() => setActiveCategory('Pending')}
                        >
                            <h1>PENDING</h1>
                        </div>

                        <div
                            className={`h-20 w-full text-center py-7 rounded-lg cursor-pointer ${activeCategory === 'Processing'
                                ? 'bg-blue-200 dark:bg-blue-900'
                                : 'bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700'
                                }`}
                            onClick={() => setActiveCategory('Processing')}
                        >
                            <h1>PROCESSING</h1>
                        </div>

                        <div
                            className={`h-20 w-full text-center py-7 rounded-lg cursor-pointer ${activeCategory === 'Delivered'
                                ? 'bg-blue-200 dark:bg-blue-900'
                                : 'bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700'
                                }`}
                            onClick={() => setActiveCategory('Delivered')}
                        >
                            <h1>DELIVERED</h1>
                        </div>

                        <div
                            className={`h-20 w-full text-center py-7 rounded-lg cursor-pointer ${activeCategory === 'Cancelled'
                                ? 'bg-blue-200 dark:bg-blue-900'
                                : 'bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700'
                                }`}
                            onClick={() => setActiveCategory('Cancelled')}
                        >
                            <h1>CANCELLED</h1>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <ListOfOrders
                            orders={getDisplayedOrders()}
                            onChangeStatus={handleChangeStatus}
                        />
                    </div>
                </div>
            </div>
        </SidebarDemo>
    );
};

export default Page;