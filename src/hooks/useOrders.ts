// src/hooks/useOrders.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { Order, OrderStatus } from '@/types/orders';
import axios from 'axios';

type OrdersResponse = {
  data: Order[];
  pagination: {
    total: number;
    limit: number;
    page: number;
    hasMore: boolean;
  };
};

export const useOrders = (limit: number, status: OrderStatus | 'all') => {
  return useQuery<OrdersResponse, Error>({
    queryKey: ['orders', limit, status],
    queryFn: async () => {
      const response = await axios.get(`/api/orders?limit=${limit}&status=${status}`);
      return response.data;
    },
    enabled: limit > 0 && status !== undefined,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};