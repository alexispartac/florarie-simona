'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const URL_COMPOSED_CATEGORIES = '/api/products-composed-categories';

const fetchComposedCategories = async () => {
    const response = await axios.get(URL_COMPOSED_CATEGORIES);
    return response.data;
};

export const useComposedCategories = () => {
    return useQuery({
        queryKey: ['composedCategories'],
        queryFn: fetchComposedCategories,
    });
};
