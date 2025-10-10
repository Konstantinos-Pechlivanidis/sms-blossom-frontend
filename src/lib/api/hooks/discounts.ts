import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiError } from '../client';
import { useShop } from '../../shopContext';

// @cursor:start(discounts-hooks)
// Discounts Query Keys
export const discountsKeys = {
  all: ['discounts'] as const,
  lists: () => [...discountsKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...discountsKeys.lists(), filters] as const,
  details: () => [...discountsKeys.all, 'detail'] as const,
  detail: (id: string) => [...discountsKeys.details(), id] as const,
  pools: () => [...discountsKeys.all, 'pool'] as const,
  pool: (id: string) => [...discountsKeys.pools(), id] as const,
};

// List discounts
export function useDiscounts(filters: { page?: number; limit?: number; status?: string } = {}) {
  const { shop } = useShop();
  
  return useQuery({
    queryKey: discountsKeys.list(filters),
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

// Get single discount
export function useDiscount(id: string) {
  const { shop } = useShop();
  
  return useQuery({
    queryKey: discountsKeys.detail(id),
    queryFn: async () => {
      // Mock data for now
      return null;
    },
    enabled: !!shop && !!id,
  });
}

// Create discount
export function useCreateDiscount() {
  const queryClient = useQueryClient();
  const { shop } = useShop();
  
  return useMutation({
    mutationFn: async (data: any) => {
      // Mock implementation
      return { id: 'mock-discount', ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: discountsKeys.lists() });
    },
  });
}

// Update discount
export function useUpdateDiscount() {
  const queryClient = useQueryClient();
  const { shop } = useShop();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      // Mock implementation
      return { id, ...data };
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: discountsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: discountsKeys.lists() });
    },
  });
}

// Delete discount
export function useDeleteDiscount() {
  const queryClient = useQueryClient();
  const { shop } = useShop();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // Mock implementation
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: discountsKeys.lists() });
    },
  });
}

// Sync discounts from Shopify
export function useSyncDiscountsFromShopify() {
  const queryClient = useQueryClient();
  const { shop } = useShop();
  
  return useMutation({
    mutationFn: async (query?: string) => {
      // Mock implementation
      return { imported: 5, skipped: 2, errors: [] };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: discountsKeys.lists() });
    },
  });
}

// Check discount conflicts
export function useCheckDiscountConflicts() {
  const { shop } = useShop();
  
  return useMutation({
    mutationFn: async (data: { code: string; excludeId?: string }) => {
      // Mock implementation
      return { hasConflicts: false, conflicts: [], suggestions: [] };
    },
  });
}

// Pool management hooks
export function useImportDiscountCodes() {
  const queryClient = useQueryClient();
  const { shop } = useShop();
  
  return useMutation({
    mutationFn: async ({ id, codes }: { id: string; codes: string[] }) => {
      // Mock implementation
      return { imported: codes.length, skipped: 0 };
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: discountsKeys.pool(id) });
    },
  });
}

export function useGenerateDiscountCodes() {
  const queryClient = useQueryClient();
  const { shop } = useShop();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { quantity: number; prefix?: string; pattern?: string } }) => {
      // Mock implementation
      return { generated: data.quantity, shopifyGids: [] };
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: discountsKeys.pool(id) });
    },
  });
}

export function useGetPoolStatus(id: string) {
  const { shop } = useShop();
  
  return useQuery({
    queryKey: discountsKeys.pool(id),
    queryFn: async () => {
      // Mock data for now
      return { total: 1000, reserved: 150, available: 800, used: 50 };
    },
    enabled: !!shop && !!id,
  });
}

export function useReserveDiscountCodes() {
  const queryClient = useQueryClient();
  const { shop } = useShop();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { campaignId: string; count: number } }) => {
      // Mock implementation
      return { reservationId: 'res_123', reserved: data.count, expiresAt: new Date().toISOString() };
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: discountsKeys.pool(id) });
    },
  });
}

export function useDeleteReservation() {
  const queryClient = useQueryClient();
  const { shop } = useShop();
  
  return useMutation({
    mutationFn: async ({ id, reservationId }: { id: string; reservationId: string }) => {
      // Mock implementation
      return { cancelled: true, released: 50 };
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: discountsKeys.pool(id) });
    },
  });
}
// @cursor:end(discounts-hooks)