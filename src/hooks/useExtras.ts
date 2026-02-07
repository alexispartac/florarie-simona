// src/hooks/useExtras.ts
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { Extra, ExtraInCatalog } from '@/types/extras';
import axios from 'axios';

const API_URL = '/api/extras';
const EXTRAS_CATALOG_URL = '/api/extras/extras-catalog';

type UseExtrasOptions = {
  page?: number;
  limit?: number;
  search?: string;
};

type ExtrasResponse = {
  data: Extra[];
  pagination: {
    total: number;
    limit: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
  };
};

type ExtrasCatalogResponse = {
  extras: ExtraInCatalog[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
};

// Get all extras (basic)
export const useExtras = () => {
  return useQuery<Extra[]>({
    queryKey: ['extras'],
    queryFn: async () => {
      const response = await axios.get(API_URL);
      return response.data;
    },
  });
};

// Get single extra by ID
export const useExtra = (id: string) => {
  return useQuery<Extra>({
    queryKey: ['extra', id],
    queryFn: async () => {
      if (!id) throw new Error('Extra ID is required');
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Infinite scroll hook for catalog with filters
export const useExtrasCatalogInfinite = (
  limit: number = 12,
  filters?: {
    categories?: string[];
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
    if (filters?.sortBy) {
      params.append('sortBy', filters.sortBy);
    }
    
    return params.toString();
  };

  return useInfiniteQuery<ExtrasCatalogResponse>({
    queryKey: ['extrasCatalog', 'infinite', filters],
    queryFn: async ({ pageParam = 0 }) => {
      const queryString = buildQueryParams(pageParam as number);
      const response = await axios.get(
        `${EXTRAS_CATALOG_URL}?${queryString}`
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
export const useExtrasCatalog = () => {
  return useQuery<Extra[]>({
    queryKey: ['extrasCatalog'],
    queryFn: async () => {
      const response = await axios.get(EXTRAS_CATALOG_URL);
      return response.data;
    },
  });
};

// Admin hook with pagination and search
export const useExtrasAdmin = (options: UseExtrasOptions = {}) => {
  const { page = 1, limit = 10, search = '' } = options;

  return useQuery<ExtrasResponse, Error>({
    queryKey: ['extras', { page, limit, search }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const response = await axios.get(`/api/extras/extras-admin?${params.toString()}`);
      return response.data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook to fetch all extra categories
export const useExtraCategories = () => {
  return useQuery<string[]>({
    queryKey: ['extraCategories'],
    queryFn: async () => {
      const response = await axios.get('/api/extras/categories');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

// Hook to get random extras for cart suggestions
export const useRandomExtras = (limit: number = 10) => {
  return useQuery<ExtraInCatalog[], Error>({
    queryKey: ['extras', 'random', limit],
    queryFn: async () => {
      const response = await axios.get(`${EXTRAS_CATALOG_URL}?limit=${limit}&sortBy=random`);
      return response.data.extras || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

