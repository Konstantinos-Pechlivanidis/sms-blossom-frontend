import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiError } from '../client';
import { useShop } from '../../shopContext';

// @cursor:start(settings-hooks)
// Settings Query Keys
export const settingsKeys = {
  all: ['settings'] as const,
  shop: () => [...settingsKeys.all, 'shop'] as const,
};

// Get shop settings
export function useSettings() {
  const { shop } = useShop();
  
  return useQuery({
    queryKey: settingsKeys.shop(),
    queryFn: async () => {
      // Mock data for now
      return {
        shopId: shop,
        timezone: 'America/New_York',
        locale: 'en-US',
        automations: {
          abandoned_checkout: {
            enabled: true,
            delay_minutes: 60,
            template: 'Complete your order: {{ recovery_url }}'
          },
          welcome: {
            enabled: true,
            delay_minutes: 5,
            template: 'Welcome {{ customer.first_name }}!'
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    },
    enabled: !!shop,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Update shop settings
export function useUpdateSettings() {
  const queryClient = useQueryClient();
  const { shop } = useShop();
  
  return useMutation({
    mutationFn: async (data: any) => {
      // Mock implementation
      return { ...data, shopId: shop };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.shop() });
    },
  });
}
// @cursor:end(settings-hooks)