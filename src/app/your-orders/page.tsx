'use client';
import { useEffect, useState } from "react";
import { useUser } from "../components/context/ContextUser";
import { Order } from "../types";
import axios from "axios";
import { Loader } from "@mantine/core";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import { Footer } from "../components/Footer";

const URL_ORDERS = '/api/users/orders';



const UserOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [ cookies, ] = useCookies(['login']);
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (cookies.login && user.isAuthenticated === false) {
            router.push('/homepage');
        }

        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await axios.get( URL_ORDERS, {
                    headers: {
                        Authorization: `Bearer ${cookies.login}`
                    }
                });
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    return (
        <div>
            <div className="relative container mx-auto pt-24 px-4">
                <h1 className="text-2xl font-bold text-center mb-6">Comenzile tale</h1>
                <p className="text-center text-gray-500 mb-4">
                    Aici poți vizualiza toate comenzile tale anterioare.
                </p>
                {/* Placeholder for orders content */}
                {loading ? (
                    <div className="flex justify-center items-center h-screen">
                        <Loader size="lg" color="blue" />
                    </div>
                ) : orders.length > 0 ? (
                    <ul className="space-y-4">
                        {orders.map((order) => (
                            <li key={order.id} className="border p-4 rounded-lg">
                                <h2 className="font-bold">Comanda #{order.id}</h2>
                                <p>Client: {order.clientName}</p>
                                <p>Email: {order.clientEmail}</p>
                                <p>Telefon: {order.clientPhone}</p>
                                <p>Adresă: {order.clientAddress}</p>
                                <p>Metodă de plată: {order.paymentMethod}</p>
                                <p>Produse:</p>
                                <ul className="list-disc pl-5">
                                    {order.products.map((product, index) => (
                                        <li key={index}>
                                            {product.title} - Cantitate: {product.quantity} - Preț: {product.price} RON
                                        </li>
                                    ))}
                                </ul>
                                <p>Total: {order.totalPrice} RON</p>
                                <p>Data comenzii: {new Date(order.orderDate).toLocaleDateString()}</p>
                                <p>Status: {order.status}</p>
                                <p>Data livrarii: {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'N/A'}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex justify-center items-center h-screen">
                        <p className="text-gray-500">Nu ai plasat încă nicio comandă.</p>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default UserOrders;