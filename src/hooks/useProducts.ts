// src/hooks/useProducts.ts
import { useQuery, useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { Product, ProductInCatalog, ProductReview } from '@/types/products';
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

type ProductsCatalogResponse = {
  products: ProductInCatalog[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
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

// Infinite scroll hook pentru catalog with filters
export const useProductsCatalogInfinite = (
  limit: number = 12,
  filters?: {
    categories?: string[];
    colors?: string[];
    occasions?: string[];
    sameDayDelivery?: boolean;
    sortBy?: string;
  }
) => {
  // Build query params from filters
  const buildQueryParams = (pageParam: number) => {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: pageParam.toString(),
    });
    
    if (filters?.categories && filters.categories.length > 0) {
      params.append('categories', filters.categories.join(','));
    }
    if (filters?.colors && filters.colors.length > 0) {
      params.append('colors', filters.colors.join(','));
    }
    if (filters?.occasions && filters.occasions.length > 0) {
      params.append('occasions', filters.occasions.join(','));
    }
    if (filters?.sameDayDelivery) {
      params.append('sameDayDelivery', 'true');
    }
    if (filters?.sortBy) {
      params.append('sortBy', filters.sortBy);
    }
    
    return params.toString();
  };

  return useInfiniteQuery<ProductsCatalogResponse>({
    queryKey: ['productsCatalog', 'infinite', filters],
    queryFn: async ({ pageParam = 0 }) => {
      const queryString = buildQueryParams(pageParam as number);
      const response = await axios.get(
        `${PRODUCTS_CATALOG_URL}?${queryString}`
      );
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasMore) {
        return lastPage.pagination.offset + lastPage.pagination.limit;
      }
      return undefined;
    },
    initialPageParam: 0,
  });
};

// Keep old hook for backward compatibility
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

// Hook to fetch all product categories
export const useProductCategories = () => {
  return useQuery<string[]>({
    queryKey: ['productCategories'],
    queryFn: async () => {
      const response = await axios.get('/api/products/categories');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

// Hook for searching products from the database
export const useProductSearch = (searchQuery: string) => {
  return useQuery({
    queryKey: ['products', 'search', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) {
        return { products: [] };
      }
      
      const response = await axios.get(
        `/api/products/search?q=${encodeURIComponent(searchQuery)}&limit=10`
      );
      
      return response.data;
    },
    enabled: searchQuery.trim().length > 0,
    staleTime: 30000, // 30 seconds
  });
};

export const useSubmitReview = () => {
  return useMutation<{ success: boolean; message: string }, Error, ProductReview>({
    mutationKey: ['submitReview'],
    mutationFn: async (review: ProductReview) => {
      const response = await axios.post('/api/products/product-review', review);
      return response.data;
    },
  });
};