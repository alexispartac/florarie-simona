'use client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ItemProps } from '../../types'


const URL_COMPOSED_PRODUCTS = 'http://localhost:3000/api/products-composed';
const fetchProductsGroupedByCategory = async () => {
    const response = await axios.get(URL_COMPOSED_PRODUCTS);
    const products = response.data;

    const groupedProducts = products.reduce((acc: Record<string, unknown[]>, product: ItemProps) => {
        const category = product.category || 'Fără categorie';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(product);
        return acc;
    }, {});

    return groupedProducts;
};

export const useProductsGroupedByCategory = () => {
    return useQuery({
        queryKey: ['productsGroupedByCategory'],
        queryFn: fetchProductsGroupedByCategory,
    });
};