import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Collection } from '@/types/collections';

interface UseCollectionsParams {
  page?: number;
  limit?: number;
  search?: string;
  featured?: boolean;
}

interface CollectionsResponse {
  data: Collection[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Fetch all collections
export function useCollections(params: UseCollectionsParams = {}) {
  const { page = 1, limit = 10, search = '', featured } = params;

  return useQuery<CollectionsResponse>({
    queryKey: ['collections', page, limit, search, featured],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(featured !== undefined && { featured: featured.toString() }),
      });

      const response = await axios.get(`/api/collections?${queryParams}`);
      return response.data;
    },
  });
}

// Fetch single collection by ID
export function useCollection(collectionId: string) {
  return useQuery<Collection>({
    queryKey: ['collection', collectionId],
    queryFn: async () => {
      const response = await axios.get(`/api/collections/${collectionId}`);
      return response.data;
    },
    enabled: !!collectionId,
  });
}

// Create collection
export function useCreateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Collection>) => {
      const response = await axios.post('/api/collections', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch collections
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
}

// Update collection
export function useUpdateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ collectionId, data }: { collectionId: string; data: Partial<Collection> }) => {
      const response = await axios.put(`/api/collections/${collectionId}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate specific collection and list
      queryClient.invalidateQueries({ queryKey: ['collection', variables.collectionId] });
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
}

// Delete collection
export function useDeleteCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (collectionId: string) => {
      const response = await axios.delete(`/api/collections/${collectionId}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate collections list
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
}
