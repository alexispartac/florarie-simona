'use client';
import { useState, useEffect } from 'react'
import { SidebarDemo } from '../components/SideBar';
import { OrderProps } from '../../api/types';
import axios from 'axios';

const URL_ORDERS = 'http://localhost:3000/api/orders';

export const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    // Dacă dateString nu conține timp, va fi 00:00:00
    return date.toLocaleString('ro-RO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
};

const OrderRow = ({ order, onFinalize }: { order: OrderProps, onFinalize: (id: string) => void }) => {
    return (
        <div key={order.id} className="border rounded p-4 bg-gray-50 dark:bg-neutral-800">
            <div className="flex flex-row justify-between">
                <div>
                    <b>{order.orderNumber}</b> - {order.clientName}
                    <div className="text-xs text-gray-500">{order.clientEmail} | {order.clientPhone}</div>
                    <div className="text-xs text-gray-500">{order.clientAddress}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className="font-semibold">{order.status}</span>
                    <div className="text-xs">Total: {order.totalPrice} RON</div>
                    <div className="text-xs">Plasată: {formatDateTime(order.orderDate)}</div>
                    {order.status === 'Delivered' && (
                        <div className="text-xs">Livrata: {order.deliveryDate}</div>
                    )}
                    {/* <div className="text-xs">Livrare: {formatDateTime(order.deliveryDate)}</div> */}
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
    return (
        <div className="flex flex-col gap-2">
            {orders.map(order => (
                <OrderRow key={order.id} order={order} onFinalize={onFinalize} />
            ))}
        </div>
    );
};

// const demoOrder = {
//     id: '1',
//     orderNumber: 'ORD123456',
//     clientName: 'Ion Popescu',
//     clientEmail: 'ion.popescu@example.com',
//     clientPhone: '000000000000',
//     clientAddress: 'Strada Principala, Nr. 123',
//     orderDate: '2024-03-15T10:30:00',
//     status: 'Pending',
//     totalPrice: 100,
//     products: [
//         {
//             id: '1',
//             title: 'Florarie',
//             title_category: 'Florarie',
//             price_category: 50,
//             quantity: 2,
//         },
//         {
//             id: '2',
//             title: 'Florarie',
//             title_category: 'Florarie',
//             price_category: 50,
//             quantity: 1,
//         },
//     ],
// } as OrderProps;


const Page = () => {
    const [orders, setOrders] = useState<OrderProps[]>([]);
    const [showFinalized, setShowFinalized] = useState(false);

    function fetchOrders() {
        try {
            axios.get(URL_ORDERS).then((response) => {
                setOrders(response.data);
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    // Considerăm status "Delivered" ca finalizat, restul ca nefinalizat
    const finalizedOrders = orders.filter(order => order.status === 'Delivered');
    const unfinalizedOrders = orders.filter(order => order.status !== 'Delivered');

    const handleFinalizeOrder = async (id: string) => {
        // Actualizează comanda în baza de date
        await axios.put(URL_ORDERS, { id: id, status: 'Delivered' }).then(() => {
            setOrders(prev =>
                prev.map(order =>
                    order.id === id
                        ? {
                            ...order,
                            status: 'Delivered',
                            deliveryDate: formatDateTime(new Date().toISOString()),
                        }
                        : order
                )
            );
        }).catch(error => {
            console.error('Error finalizing order:', error);
        });
    };

    return (
        <SidebarDemo>
            <div className="flex flex-1">
                <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="flex gap-2">
                        <div
                            className={`h-20 w-full text-center py-7 rounded-lg cursor-pointer ${!showFinalized ? 'bg-blue-200 dark:bg-blue-900' : 'bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700'}`}
                            onClick={() => setShowFinalized(false)}
                        >
                            <h1>COMENZI NEFINALIZATE</h1>
                        </div>
                        <div
                            className={`h-20 w-full text-center py-7 rounded-lg cursor-pointer ${showFinalized ? 'bg-blue-200 dark:bg-blue-900' : 'bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700'}`}
                            onClick={() => setShowFinalized(true)}
                        >
                            <h1>COMENZI FINALIZATE</h1>
                        </div>
                    </div>
                    <ListOfOrders
                        orders={showFinalized ? finalizedOrders : unfinalizedOrders}
                        onFinalize={handleFinalizeOrder}
                    />
                </div>
            </div>
        </SidebarDemo>
    );
};

export default Page;