import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enhancedApiClient } from '../../lib/apiClient';
import { useShop } from '../../lib/shopContext';

// Segment types
export interface Segment {
  id: string;
  name: string;
  filterJson: any;
  createdAt?: string;
  updatedAt?: string;
  contactCount?: number;
}

export interface SegmentsResponse {
  segments: Segment[];
  total: number;
  page: number;
  per_page: number;
}

export interface SegmentCreateRequest {
  name: string;
  filterJson: any;
}

export interface SegmentUpdateRequest {
  name?: string;
  filterJson?: any;
}

// Hooks
export function useSegments() {
  const { shop, isReady } = useShop();
  
  return useQuery({
    queryKey: ['segments', shop] as const,
    queryFn: () => enhancedApiClient.getSegments({ shop }),
    enabled: isReady && !!shop,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useSegment(id: string) {
  const { shop, isReady } = useShop();
  
  return useQuery({
    queryKey: ['segment', id, shop] as const,
    queryFn: () => enhancedApiClient.getSegment({ id, shop }),
    enabled: isReady && !!shop && !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateSegment() {
  const { shop } = useShop();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: SegmentCreateRequest) => 
      enhancedApiClient.createSegment({ shop, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['segments', shop] as const });
    },
  });
}

export function useUpdateSegment() {
  const { shop } = useShop();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SegmentUpdateRequest }) => 
      enhancedApiClient.updateSegment({ id, shop, data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['segment', id, shop] as const });
      queryClient.invalidateQueries({ queryKey: ['segments', shop] as const });
    },
  });
}

export function useDeleteSegment() {
  const { shop } = useShop();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => 
      enhancedApiClient.deleteSegment({ id, shop }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['segments', shop] as const });
    },
  });
}

// Segment preview hook - temporarily disabled as method not available
// export function useSegmentPreview() {
//   const { shop } = useShop();
//   
//   return useMutation({
//     mutationFn: ({ id, limit = 20 }: { id: string; limit?: number }) => 
//       enhancedApiClient.getSegmentPreview({ id, shop, limit }),
//   });
// }

// Segment validation hook
export function useSegmentValidation(segment: Partial<SegmentCreateRequest>) {
  const errors: Record<string, string> = {};
  
  if (!segment.name?.trim()) {
    errors.name = 'Segment name is required';
  }
  
  if (!segment.filterJson || Object.keys(segment.filterJson).length === 0) {
    errors.filterJson = 'Segment filters are required';
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}

// Segment analytics hook
export function useSegmentAnalytics(segment: Segment | undefined) {
  if (!segment) return null;
  
  const analytics = (segment as any).analytics || {};
  const contactCount = analytics.contactCount || 0;
  const lastUpdated = analytics.lastUpdated || segment.updatedAt;
  const filterComplexity = analytics.filterComplexity || 'simple';
  
  return {
    contactCount,
    lastUpdated,
    filterComplexity,
    isActive: contactCount > 0,
  };
}
