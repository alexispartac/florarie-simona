'use client';
import { useEffect, useState } from 'react'
import { SidebarDemo } from '../components/SideBar';
import React from 'react';
import axios from 'axios';
import { OrderPropsAdmin } from '@/app/types/order';
import { Loader, Modal, Button } from '@mantine/core';
import { useOrders } from '@/app/components/hooks/fetchOrders';
import { useDisclosure } from '@mantine/hooks';

const URL_ORDERS = '/api/orders';
const URL_SEND_EMAIL_ORDER_DONE = '/api/send-email/order-done';
const URL_SEND_EMAIL_ORDER_PROCESSED = '/api/send-email/order-processed';
const URL_SEND_EMAIL_ORDER_CANCELLED = '/api/send-email/order-cancelled';
const URL_DOWNLOAD_INVOICE = 'https://florarie-simona-data-processing-demo.onrender.com';

const OrderRow = ({ order, onChangeStatus, opened, open }: { order: OrderPropsAdmin, onChangeStatus: (id: string, status: 'Processing' | 'Delivered' | 'Cancelled') => void, opened: boolean, open: () => void }) => {
    const handleDownloadInvoice = (orderId: string) => async () => {
        console.log('Descarcare factura pentru comanda:', orderId);
        try {
            const res = await axios.get(`${URL_DOWNLOAD_INVOICE}/orders/${orderId}/invoice.pdf`, {
                responseType: 'blob',
            });
            const blob = new Blob([res.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice_${orderId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Eroare la descărcarea facturii:', error);
        }
    };

    const handleAction = ({orderId, action }: { orderId: string, action: 'Processing' | 'Delivered' | 'Cancelled' }) => {
        open();
        onChangeStatus(orderId, action)
    };

    return (
        <div key={order.id} className="border rounded p-4 bg-gray-50 dark:bg-neutral-800">
            {order.status !== 'Pending' && order.status !== 'Cancelled' && (
                <button disabled={opened} onClick={handleDownloadInvoice(order.id)} className="text-blue-500 underline text-sm mb-2">Descarcă factura</button>
            )}
            <div className="flex flex-row justify-between">
                <div>
                    <b> #{order.orderNumber} | {order.clientName} </b>
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
                                disabled={opened}
                                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                                onClick={() => handleAction({orderId: order.id, action: 'Processing'})}
                            >
                                Processing
                            </button>
                            <button
                                disabled={opened}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                onClick={() => handleAction({orderId: order.id, action: 'Cancelled'})}
                            >
                                Canceled
                            </button>
                        </div>
                    )}

                    {order.status !== 'Delivered' && order.status !== 'Pending' && order.status !== 'Cancelled' && (
                        <button
                            disabled={opened}
                            className="mt-2 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                            onClick={() => handleAction({orderId: order.id, action: 'Delivered'})}
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
                            {p.title} x {p.quantity} | {p.title_category} - {p.price} RON
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

const ListOfOrders = ({
    orders,
    selectedStatus,
    refetch
}: {
    orders: OrderPropsAdmin[];
    selectedStatus: string;
    refetch: () => void;
}) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [opened, { open, close }] = useDisclosure(false);

    if (orders.length === 0) {
        return <div className="w-full h-full flex items-center justify-center text-center text-gray-500">Nu există comenzi.</div>;
    }

    const handleChangeStatus = async (id: string, status: 'Processing' | 'Delivered' | 'Cancelled') => {
        try {
            setLoading(true);
            await axios.put(URL_ORDERS, { id, status });;

            if (status === 'Delivered') {
                const finalizedOrder = orders.find((order: OrderPropsAdmin) => order.id === id);
                if (finalizedOrder) {
                    const updatedOrder = {
                        ...finalizedOrder,
                        status: 'Delivered',
                        deliveryDate: new Date().toISOString(),
                    };
                    axios.post(URL_SEND_EMAIL_ORDER_DONE, {
                        order: updatedOrder,
                    }).then(() => {
                        setMessage('Email-ul comenzii a fost trimis cu succes.');
                        console.log('Order completion email sent successfully.');
                    }).catch(error => {
                        setMessage('Eroare la trimiterea email-ului comenzii');
                        console.log('Error sending order completion email:', error);
                    });
                }
            }

            if (status === 'Processing') {
                const finalizedOrder = orders.find((order: OrderPropsAdmin) => order.id === id);
                if (finalizedOrder) {
                    const updatedOrder = {
                        ...finalizedOrder,
                        status: 'Processing',
                        deliveryDate: new Date().toISOString(),
                    };
                    axios.post(URL_SEND_EMAIL_ORDER_PROCESSED, {
                        order: updatedOrder,
                    }).then(() => {
                        setMessage('Email-ul comenzii a fost trimis cu succes.');
                        console.log('Order processed email sent successfully.');
                    }).catch(error => {
                        setMessage('Eroare la trimiterea email-ului comenzii');
                        console.log('Error sending order processed email:', error);
                    });
                }
            }

            if (status === 'Cancelled') {
                const finalizedOrder = orders.find((order: OrderPropsAdmin) => order.id === id);
                if (finalizedOrder) {
                    const updatedOrder = {
                        ...finalizedOrder,
                        status: 'Cancelled',
                        deliveryDate: new Date().toISOString(),
                    };
                    axios.post(URL_SEND_EMAIL_ORDER_CANCELLED, {
                        order: updatedOrder,
                    }).then(() => {
                        setMessage('Email-ul comenzii a fost trimis cu succes.');
                    }).catch(error => {
                        setMessage('Eroare la trimiterea email-ului comenzii');
                        console.log('Error sending order cancelled email:', error);
                    });
                }
            }
        } catch (error) {
            setMessage('Eroare la schimbarea statusului comenzii');
            setLoading(false);
            console.log('Error changing order status:', error);
        } finally {
            refetch();
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(order => selectedStatus === 'all' ? true : order.status === selectedStatus);

    const reverseOrders = [...filteredOrders].sort((a, b) => b.orderNumber - a.orderNumber);

    console.log(reverseOrders);
    return (
        <div className="flex w-full h-[calc(100vh-300px)] flex-col gap-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {reverseOrders.map(order => (
                <OrderRow key={order.id} order={order} open={open} opened={opened} onChangeStatus={handleChangeStatus} />
            ))}
            <Modal
                opened={opened}
                onClose={close}
                title="Schimbare status comanda"
                fullScreen={false}
                centered

            >
                {!loading ? (
                    <div className='w-full flex flex-col gap-4 items-center justify-center h-[400px]'>
                        {message}
                        <Button onClick={close}>Inchide</Button>
                    </div> ) : (
                    <div className='w-full flex items-center justify-center h-[400px]'>
                        <Loader />
                    </div>
                )}
            </Modal>
        </div>
    );
};

const Announcement = ({ pendingOrders, processingOrders }: { pendingOrders: OrderPropsAdmin[], processingOrders: OrderPropsAdmin[] }) => {
    return (
        <div className="flex w-full text-center text-blue-500 mb-4 justify-center bg-blue-100 border-blue-500 border p-2 rounded">
            {pendingOrders.length > 0 || processingOrders.length > 0 ? (
                <p>Există comenzi în așteptare sau în procesare.</p>
            ) : (
                <p>Nu există comenzi în așteptare sau în procesare.</p>
            )}
        </div>
    );
};

const SplitOrders = ({ orders }: { orders: OrderPropsAdmin[] }) => {
    if (orders.length === 0) {
        return {
            pendingOrders: [],
            processingOrders: [],
            deliveredOrders: [],
            cancelledOrders: [],
        };
    }

    const pendingOrders = orders.filter(order => order.status === 'Pending');
    const processingOrders = orders.filter(order => order.status === 'Processing');
    const deliveredOrders = orders.filter(order => order.status === 'Delivered');
    const cancelledOrders = orders.filter(order => order.status === 'Cancelled');

    return {
        pendingOrders,
        processingOrders,
        deliveredOrders,
        cancelledOrders,
    };
};

const StatusSelect = ({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) => {
    const options = [
        { value: 'all', label: 'Toate comenzile' },
        {
            value: 'Pending',
            label: `În așteptare`
        },
        {
            value: 'Processing',
            label: `În procesare`
        },
        {
            value: 'Delivered',
            label: `Livrate`
        },
        {
            value: 'Cancelled',
            label: `Anulate`
        },
    ];

    return (
        <div className="mb-4 w-full md:w-64">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

const SearchInput = ({
    value,
    onChange
}: {
    value: string;
    onChange: (value: string) => void;
}) => {
    return (
        <div className="mb-4 w-full">
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Caută comenzi dupa numele clientului"
                    className="w-full p-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

const ContainerOrders = ({ orders, refetch }: { orders: OrderPropsAdmin[], refetch: () => void }) => {
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [ordersByStatus, setOrdersByStatus] = useState({
        pendingOrders: [] as OrderPropsAdmin[],
        processingOrders: [] as OrderPropsAdmin[],
        deliveredOrders: [] as OrderPropsAdmin[],
        cancelledOrders: [] as OrderPropsAdmin[],
    });

    useEffect(() => {
        if (orders) {
            const result = SplitOrders({ orders: orders as OrderPropsAdmin[] });
            setOrdersByStatus(result);
        }
    }, [orders]);

    const getFilteredOrders = () => {
        let filtered = [];

        // First filter by status
        switch (selectedStatus) {
            case 'Pending': filtered = ordersByStatus.pendingOrders; break;
            case 'Processing': filtered = ordersByStatus.processingOrders; break;
            case 'Delivered': filtered = ordersByStatus.deliveredOrders; break;
            case 'Cancelled': filtered = ordersByStatus.cancelledOrders; break;
            default: filtered = orders; // 'all' option
        }

        // Then filter by search query if it exists
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((order: OrderPropsAdmin) =>
                order.clientName?.toLowerCase().includes(query)
            );
        }

        return filtered;
    };

    return (
        <div className="flex flex-col gap-4">
            <Announcement
                pendingOrders={ordersByStatus.pendingOrders}
                processingOrders={ordersByStatus.processingOrders}
            />
            <StatusSelect
                value={selectedStatus}
                onChange={setSelectedStatus}
            />
            <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
            />
            <ListOfOrders
                orders={getFilteredOrders()}
                selectedStatus={selectedStatus}
                refetch={refetch}
            />
        </div>
    );
};

const Page = () => {
    const { data: orders = [], isLoading, isError, refetch } = useOrders();

    useEffect(() => {
        setInterval(() => {
            refetch();
        }, 60000 * 10);
    }, [refetch]);

    return (
        <SidebarDemo>
            <div className="flex h-screen w-full flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
                <div className="flex flex-col w-full h-[calc(100vh-100px)]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 dark:bg-neutral-800 rounded-lg">
                            <Loader />
                            <span className="text-gray-500">Încărcare comenzi...</span>
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 dark:bg-neutral-800 rounded-lg">
                            <span className="text-gray-500">A apărut o eroare la încărcarea comenzilor.</span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <ContainerOrders orders={orders} refetch={refetch} />
                        </div>
                    )}
                </div>
            </div>
        </SidebarDemo>
    );
};

export default Page;