'use client';
import { useState, useEffect } from 'react'
import { SidebarDemo } from '../components/SideBar';
import { OrderProps } from '../../api/types';
import React from 'react';
import axios from 'axios';

const URL_ORDERS = '/api/orders';

const OrderRow = ({ order, onFinalize }: { order: OrderProps, onFinalize: (id: string) => void }) => {
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
                    {order.status !== 'Delivered' && (
                        <button
                            className="mt-2 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                            onClick={() => onFinalize(order.id)}
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
    onFinalize,
}: {
    orders: OrderProps[];
    onFinalize: (id: string) => void;
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
                <OrderRow key={order.id} order={order} onFinalize={onFinalize} />
            ))}
        </div>
    );
};


const Page = () => {
    const [orders, setOrders] = useState<OrderProps[]>([]);
    const [showFinalized, setShowFinalized] = useState(false);
    const [loading, setLoading] = useState(true);

    async function fetchOrders() {
        setLoading(true);
        try {
            await axios.get(URL_ORDERS).then((response) => {
                setOrders(response.data);
            });
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log('Error fetching orders:', error);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    const finalizedOrders = orders.filter(order => order.status === 'Delivered');
    const unfinalizedOrders = orders.filter(order => order.status !== 'Delivered');

    const handleFinalizeOrder = async (id: string) => {
        await axios.put(URL_ORDERS, { id: id, status: 'Delivered' }).then(() => {
            setOrders(prev =>
                prev.map(order =>
                    order.id === id
                        ? {
                            ...order,
                            status: 'Delivered',
                            deliveryDate: new Date().toISOString(),
                        }
                        : order
                )
            );
        }).catch(error => {
            console.log('Error finalizing order:', error);
        });
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
                        <div
                            className={`h-20 w-full text-center py-7 rounded-lg cursor-pointer ${!showFinalized
                                ? 'bg-blue-200 dark:bg-blue-900'
                                : 'bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700'
                                }`}
                            onClick={() => setShowFinalized(false)}
                        >
                            <h1>COMENZI NEFINALIZATE</h1>
                        </div>
                        <div
                            className={`h-20 w-full text-center py-7 rounded-lg cursor-pointer ${showFinalized
                                ? 'bg-blue-200 dark:bg-blue-900'
                                : 'bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700'
                                }`}
                            onClick={() => setShowFinalized(true)}
                        >
                            <h1>COMENZI FINALIZATE</h1>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <ListOfOrders
                            orders={showFinalized ? finalizedOrders : unfinalizedOrders}
                            onFinalize={handleFinalizeOrder}
                        />
                    </div>
                </div>
            </div>
        </SidebarDemo>
    );
};

export default Page;