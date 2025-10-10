import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiError } from '../client';
import { useShop } from '../../shopContext';

// @cursor:start(segments-hooks)
// Segments Query Keys
export const segmentsKeys = {
  all: ['segments'] as const,
  lists: () => [...segmentsKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...segmentsKeys.lists(), filters] as const,
  details: () => [...segmentsKeys.all, 'detail'] as const,
  detail: (id: string) => [...segmentsKeys.details(), id] as const,
};

// List segments
export function useSegments(filters: { page?: number; limit?: number } = {}) {
  const { shop } = useShop();
  
  return useQuery({
    queryKey: segmentsKeys.list(filters),
    queryFn: async () => {
      // Mock data for now
      return {
        data: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 }
      };
    },
    enabled: !!shop,
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Create segment
export function useCreateSegment() {
  const queryClient = useQueryClient();
  const { shop } = useShop();
  
  return useMutation({
    mutationFn: async (data: any) => {
      // Mock implementation
      return { id: 'mock-segment', ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: segmentsKeys.lists() });
    },
  });
}

// Preview segment
export function usePreviewSegment() {
  const { shop } = useShop();
  
  return useMutation({
    mutationFn: async (data: { filterJson: any }) => {
      // Mock implementation
      return { estimatedCount: 150, filter: data.filterJson, warnings: [] };
    },
  });
}
// @cursor:end(segments-hooks)