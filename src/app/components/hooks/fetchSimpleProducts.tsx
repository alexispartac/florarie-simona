'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const URL_COMPOSED_PRODUCTS = '/api/products';

const fetchSimpleProducts = async () => {
    const response = await axios.get(URL_COMPOSED_PRODUCTS);
    return response.data;
};

export const useSimpleProducts = () => {
    return useQuery({
        queryKey: ['simpleProducts'],
        queryFn: fetchSimpleProducts,
    });
};