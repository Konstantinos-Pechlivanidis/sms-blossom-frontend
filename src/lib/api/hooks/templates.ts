import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiError } from '../client';
import { useShop } from '../../shopContext';

// @cursor:start(templates-hooks)
// Templates Query Keys
export const templatesKeys = {
  all: ['templates'] as const,
  lists: () => [...templatesKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...templatesKeys.lists(), filters] as const,
  details: () => [...templatesKeys.all, 'detail'] as const,
  detail: (id: string) => [...templatesKeys.details(), id] as const,
  variables: () => [...templatesKeys.all, 'variables'] as const,
  variable: (trigger: string) => [...templatesKeys.variables(), trigger] as const,
};

// List templates
export function useTemplates(filters: { trigger?: string } = {}) {
  const { shop } = useShop();
  
  return useQuery({
    queryKey: templatesKeys.list(filters),
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

// Create template
export function useCreateTemplate() {
  const queryClient = useQueryClient();
  const { shop } = useShop();
  
  return useMutation({
    mutationFn: async (data: any) => {
      // Mock implementation
      return { id: 'mock-template', ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templatesKeys.lists() });
    },
  });
}

// Preview template
export function usePreviewTemplate() {
  const { shop } = useShop();
  
  return useMutation({
    mutationFn: async (data: { body: string; variables?: any; locale?: string }) => {
      // Mock implementation
      return {
        text: data.body.replace(/\{\{.*?\}\}/g, 'Sample Value'),
        warnings: ['Template will create 1 SMS parts'],
        segments: { parts: 1, characters: data.body.length, encoding: 'GSM' }
      };
    },
  });
}

// Validate template
export function useValidateTemplate() {
  const { shop } = useShop();
  
  return useMutation({
    mutationFn: async (data: { body: string; trigger: string }) => {
      // Mock implementation
      return {
        ok: true,
        errors: [],
        warnings: ['Template will create 1 SMS parts']
      };
    },
  });
}

// Get template variables
export function useTemplateVariables(trigger: string) {
  const { shop } = useShop();
  
  return useQuery({
    queryKey: templatesKeys.variable(trigger),
    queryFn: async () => {
      // Mock implementation
      return {
        required: ['customer.first_name'],
        optional: ['customer.last_name', 'shop.name'],
        description: 'Template variables for ' + trigger
      };
    },
    enabled: !!shop && !!trigger,
  });
}
// @cursor:end(templates-hooks)