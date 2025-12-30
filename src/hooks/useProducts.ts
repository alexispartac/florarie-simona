// src/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { Product } from '@/types/products';
import axios from 'axios';

const API_URL = '/api/products';
const PRODUCTS_CATALOG_URL = '/api/products/products-catalog';

type UseProductsOptions = {
  page?: number;
  limit?: number;
  search?: string;
};

type ProductsResponse = {
  data: Product[];
  pagination: {
    total: number;
    limit: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
  };
};

export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await axios.get(API_URL);
      return response.data;
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error('Product ID is required');
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useProductsCatalog = () => {
  return useQuery<Product[]>({
    queryKey: ['productsCatalog'],
    queryFn: async () => {
      const response = await axios.get(PRODUCTS_CATALOG_URL);
      return response.data;
    },
  });
};

export const useProductsAdmin = (options: UseProductsOptions = {}) => {
  const { page = 1, limit = 10, search = '' } = options;

  return useQuery<ProductsResponse, Error>({
    queryKey: ['products', { page, limit, search }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const response = await axios.get(`/api/products/products-admin?${params.toString()}`);
      return response.data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};