'use client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ItemProps } from '../../types'


const URL_COMPOSED_PRODUCTS = '/api/products-composed';
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

const fetchNewestProducts = async () => {
    const response = await axios.get(URL_COMPOSED_PRODUCTS);
    const products = response.data;
    const newestProducts = products.filter((product: ItemProps) => product.newest === true);

    return newestProducts;
}

const fetchPromotionProducts = async () => {
    const response = await axios.get(URL_COMPOSED_PRODUCTS);
    const products = response.data;
    const promotionProducts = products.filter((product: ItemProps) => product.promotion === true);

    return promotionProducts;
}

export const useProductsGroupedByCategory = () => {
    return useQuery({
        queryKey: ['productsGroupedByCategory'],
        queryFn: fetchProductsGroupedByCategory,
    });
};

export const useNewestProducts = () => {
    return useQuery({
        queryKey: ['newestProducts'],
        queryFn: fetchNewestProducts,
    });
};

export const usePromotionProducts = () => {
    return useQuery({
        queryKey: ['promotionProducts'],
        queryFn: fetchPromotionProducts,
    });
};