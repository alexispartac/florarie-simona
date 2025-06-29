'use client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const URL_ORDERS = '/api/orders';

const fetchOrders = async () => {
    const response = await axios.get(URL_ORDERS);
    return response.data;
}

export const useOrders = () => {
    return useQuery({
        queryKey: ['orders'],
        queryFn: fetchOrders,
    });
};