import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiError } from '../client';
import { useShop } from '../../shopContext';

// @cursor:start(campaigns-hooks)
// Campaigns Query Keys
export const campaignsKeys = {
  all: ['campaigns'] as const,
  lists: () => [...campaignsKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...campaignsKeys.lists(), filters] as const,
  details: () => [...campaignsKeys.all, 'detail'] as const,
  detail: (id: string) => [...campaignsKeys.details(), id] as const,
  estimates: () => [...campaignsKeys.all, 'estimate'] as const,
  estimate: (id: string) => [...campaignsKeys.estimates(), id] as const,
};

// List campaigns
export function useCampaigns(filters: { page?: number; limit?: number; status?: string } = {}) {
  const { shop } = useShop();
  
  return useQuery({
    queryKey: campaignsKeys.list(filters),
    queryFn: async () => {
      // Mock data for now - replace with actual API call
      return {
        data: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 }
      };
    },
    enabled: !!shop,
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Get single campaign
export function useCampaign(id: string) {
  const { shop } = useShop();
  
  return useQuery({
    queryKey: campaignsKeys.detail(id),
    queryFn: async () => {
      // Mock data for now
      return null;
    },
    enabled: !!shop && !!id,
  });
}

// Create campaign
export function useCreateCampaign() {
  const queryClient = useQueryClient();
  const { shop } = useShop();
  
  return useMutation({
    mutationFn: async (data: any) => {
      // Mock implementation
      return { id: 'mock-campaign', ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignsKeys.lists() });
    },
  });
}

// Update campaign
export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  const { shop } = useShop();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      // Mock implementation
      return { id, ...data };
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: campaignsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: campaignsKeys.lists() });
    },
  });
}

// Delete campaign
export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  const { shop } = useShop();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // Mock implementation
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignsKeys.lists() });
    },
  });
}

// Estimate campaign
export function useEstimateCampaign() {
  const { shop } = useShop();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // Mock implementation
      return {
        estimatedRecipients: 100,
        estimatedCost: 5.00,
        segmentsUsed: 1,
        warnings: []
      };
    },
  });
}

// Test send campaign
export function useTestSendCampaign() {
  const { shop } = useShop();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { phone: string; variables?: any } }) => {
      // Mock implementation
      return { success: true, messageId: 'mock-msg-123' };
    },
  });
}

// Send campaign
export function useSendCampaign() {
  const queryClient = useQueryClient();
  const { shop } = useShop();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // Mock implementation
      return { success: true, campaignId: id, estimatedRecipients: 100 };
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: campaignsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: campaignsKeys.lists() });
    },
  });
}

// Prepare campaign
export function usePrepareCampaign() {
  const queryClient = useQueryClient();
  const { shop } = useShop();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // Mock implementation
      return { prepared: true, codesAssigned: 100, shortlinksBuilt: 100 };
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: campaignsKeys.detail(id) });
    },
  });
}
// @cursor:end(campaigns-hooks)