import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enhancedApiClient } from '../../lib/apiClient';
import { useShop } from '../../lib/shopContext';
import type { 
  Discount,
  DiscountCreateRequest,
  DiscountUpdateRequest,
  DiscountConflictResponse,
  ApplyUrlResponse
} from '../../sdk/type-augment';

// Discount list hook
export function useDiscounts() {
  const { shop, isReady } = useShop();
  
  return useQuery({
    queryKey: ['discounts', shop] as const,
    queryFn: () => enhancedApiClient.getDiscounts({ shop }),
    enabled: isReady && !!shop,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Single discount hook
export function useDiscount(id: string) {
  const { shop, isReady } = useShop();
  
  return useQuery({
    queryKey: ['discount', id, shop] as const,
    queryFn: () => enhancedApiClient.getDiscount({ id, shop }),
    enabled: isReady && !!shop && !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Create discount hook
export function useCreateDiscount() {
  const { shop } = useShop();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: DiscountCreateRequest) => 
      enhancedApiClient.createDiscount({ shop, data }),
    onSuccess: () => {
      // Invalidate discounts list
      queryClient.invalidateQueries({ queryKey: ['discounts', shop] as const });
    },
  });
}

// Update discount hook
export function useUpdateDiscount() {
  const { shop } = useShop();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DiscountUpdateRequest }) => 
      enhancedApiClient.updateDiscount({ id, shop, data }),
    onSuccess: (_, { id }) => {
      // Invalidate specific discount and list
      queryClient.invalidateQueries({ queryKey: ['discount', id, shop] as const });
      queryClient.invalidateQueries({ queryKey: ['discounts', shop] as const });
    },
  });
}

// Delete discount hook
export function useDeleteDiscount() {
  const { shop } = useShop();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => 
      enhancedApiClient.deleteDiscount({ id, shop }),
    onSuccess: () => {
      // Invalidate discounts list
      queryClient.invalidateQueries({ queryKey: ['discounts', shop] as const });
    },
  });
}

// Check conflicts hook
export function useCheckConflicts() {
  const { shop } = useShop();
  
  return useMutation({
    mutationFn: (data: any) => 
      enhancedApiClient.checkDiscountConflicts({ shop, data }),
  });
}

// Get apply URL hook
export function useApplyUrl() {
  const { shop } = useShop();
  
  return useMutation({
    mutationFn: (id: string) => 
      enhancedApiClient.getDiscountApplyUrl({ id, shop }),
  });
}

// Discount status hook
export function useDiscountStatus(discount: Discount | undefined) {
  if (!discount) return 'draft';
  
  if (discount.status === 'active') return 'active';
  if (discount.status === 'inactive') return 'inactive';
  if (discount.status === 'expired') return 'expired';
  if (discount.status === 'scheduled') return 'scheduled';
  
  return 'draft';
}

// Discount validation hook
export function useDiscountValidation(discount: Partial<DiscountCreateRequest>) {
  const errors: Record<string, string> = {};
  
  if (!discount.code?.trim()) {
    errors.code = 'Discount code is required';
  }
  
  if (!discount.value || discount.value <= 0) {
    errors.value = 'Discount value must be greater than 0';
  }
  
  // Type assertion to access properties from our Zod schema
  const discountWithType = discount as any;
  
  if (discountWithType.type === 'percentage' && discount.value && discount.value > 100) {
    errors.value = 'Percentage discount cannot exceed 100%';
  }
  
  if (!discountWithType.minimumAmount || discountWithType.minimumAmount < 0) {
    errors.minimumAmount = 'Minimum amount must be 0 or greater';
  }
  
  if (discount.usageLimit && discount.usageLimit < 1) {
    errors.usageLimit = 'Usage limit must be 1 or greater';
  }
  
  if (discount.startsAt && discount.endsAt && new Date(discount.startsAt) >= new Date(discount.endsAt)) {
    errors.endsAt = 'End date must be after start date';
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}

// Discount analytics hook
export function useDiscountAnalytics(discount: Discount | undefined) {
  if (!discount) return null;
  
  const analytics = discount.analytics || {};
  const totalUses = analytics.totalUses || 0;
  const totalRevenue = analytics.totalRevenue || 0;
  const averageOrderValue = analytics.averageOrderValue || 0;
  const conversionRate = analytics.conversionRate || 0;
  
  return {
    totalUses,
    totalRevenue,
    averageOrderValue,
    conversionRate,
    efficiency: totalUses > 0 ? (totalRevenue / totalUses) : 0,
  };
}

// Discount conflicts hook
export function useDiscountConflicts(discount: Partial<DiscountCreateRequest>) {
  const checkConflicts = useCheckConflicts();
  
  const checkForConflicts = async () => {
    if (!discount.code) return null;
    
    // Type assertion to access properties from our Zod schema
    const discountWithType = discount as any;
    
    try {
      const result = await checkConflicts.mutateAsync({
        code: discount.code,
        value: discount.value,
        type: discountWithType.type,
        minimumAmount: discountWithType.minimumAmount,
        startsAt: discount.startsAt,
        endsAt: discount.endsAt,
      });
      
      return result;
    } catch (error) {
      console.error('Failed to check conflicts:', error);
      return null;
    }
  };
  
  return {
    checkForConflicts,
    conflicts: checkConflicts.data,
    isLoading: checkConflicts.isPending,
    error: checkConflicts.error,
  };
}
