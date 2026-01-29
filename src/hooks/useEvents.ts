import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Event, EventsResponse } from '@/types/events';

interface UseEventsParams {
  page?: number;
  limit?: number;
  search?: string;
  eventType?: 'upcoming' | 'past';
  featured?: boolean;
  published?: boolean;
}

// Fetch all events
export function useEvents(params: UseEventsParams = {}) {
  const { page = 1, limit = 10, search = '', eventType, featured, published } = params;

  return useQuery<EventsResponse>({
    queryKey: ['events', page, limit, search, eventType, featured, published],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(eventType && { eventType }),
        ...(featured !== undefined && { featured: featured.toString() }),
        ...(published !== undefined && { published: published.toString() }),
      });

      const response = await axios.get(`/api/events?${queryParams}`);
      return response.data;
    },
  });
}

// Fetch single event by ID
export function useEvent(eventId: string) {
  return useQuery<Event>({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const response = await axios.get(`/api/events/${eventId}`);
      return response.data;
    },
    enabled: !!eventId,
  });
}

// Create event
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Event>) => {
      const response = await axios.post('/api/events', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

// Update event
export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, data }: { eventId: string; data: Partial<Event> }) => {
      const response = await axios.put(`/api/events/${eventId}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['event', variables.eventId] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

// Delete event
export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const response = await axios.delete(`/api/events/${eventId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

// Like/Unlike event
export function useLikeEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, userId }: { eventId: string; userId: string }) => {
      const response = await axios.post(`/api/events/${eventId}/like`, { userId });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['event', variables.eventId] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

// Share event
export function useShareEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const response = await axios.post(`/api/events/${eventId}/share`);
      return response.data;
    },
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}
