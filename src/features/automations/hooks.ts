import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useShop } from '../../lib/shopContext';
import { enhancedApiClient } from '../../lib/apiClient';
import type { 
  AutomationsResponse, 
  AutomationsUpdateRequest,
  AutomationConfig 
} from '../../sdk/type-augment';

// Get automations configuration
export function useAutomations() {
  const { shop } = useShop();
  
  return useQuery({
    queryKey: ['automations', shop] as const,
    queryFn: async () => {
      if (!shop) throw new Error('Shop not available');
      return enhancedApiClient.getAutomations({ shop });
    },
    enabled: !!shop,
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// Update automations configuration
export function useUpdateAutomations() {
  const { shop } = useShop();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: AutomationsUpdateRequest) => {
      if (!shop) throw new Error('Shop not available');
      return enhancedApiClient.updateAutomations({ shop, payload });
    },
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['automations', shop] });
      
      // Snapshot previous value
      const previousData = queryClient.getQueryData(['automations', shop]);
      
      // Optimistically update
      queryClient.setQueryData(['automations', shop], (old: any) => ({
        ...old,
        ...newData,
      }));
      
      return { previousData };
    },
    onError: (err, newData, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(['automations', shop], context.previousData);
      }
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['automations', shop] });
    },
  });
}

// Preview template for specific trigger
export function usePreviewTemplate(triggerKey: string, template: string, variables: Record<string, string> = {}) {
  const { shop } = useShop();
  
  return useQuery({
    queryKey: ['template-preview', triggerKey, template, variables] as const,
    queryFn: async () => {
      if (!shop) throw new Error('Shop not available');
      return enhancedApiClient.previewTemplate({ 
        shop, 
        data: { template, variables }
      });
    },
    enabled: !!shop && !!template.trim(),
    gcTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// Test send for specific trigger
export function useTestSend(triggerKey: string, phone: string, variables: Record<string, string> = {}) {
  const { shop } = useShop();
  
  return useMutation({
    mutationFn: async () => {
      if (!shop) throw new Error('Shop not available');
      return enhancedApiClient.validateTemplate({ 
        shop, 
        data: { template: '', trigger: triggerKey }
      });
    },
    retry: 1,
  });
}

// Helper hook for individual automation config
export function useAutomationConfig(triggerKey: keyof AutomationsResponse['automations']) {
  const { data: automations } = useAutomations();
  
  return automations?.automations?.[triggerKey] || null;
}

// Helper hook for toggling automation
export function useToggleAutomation(triggerKey: keyof AutomationsResponse['automations']) {
  const updateAutomations = useUpdateAutomations();
  const { data: automations } = useAutomations();
  
  return {
    toggle: async (enabled: boolean) => {
      if (!automations) return;
      
      const currentConfig = automations.automations[triggerKey];
      if (!currentConfig) return;
      
      const updatedConfig = {
        ...currentConfig,
        enabled,
      };
      
      await updateAutomations.mutateAsync({
        [triggerKey]: updatedConfig,
      });
    },
    isUpdating: updateAutomations.isPending,
  };
}
