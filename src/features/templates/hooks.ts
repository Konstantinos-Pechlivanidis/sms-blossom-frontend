import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { enhancedApiClient } from '../../lib/apiClient';
import { useShop } from '../../lib/shopContext';
import type { 
  TemplatePreviewRequest,
  TemplatePreviewResponse,
  TemplateValidationRequest,
  TemplateValidationResponse,
  TemplateVariablesResponse,
  TemplateTriggersResponse
} from '../../sdk/type-helpers';

// Types are now imported from type-helpers

// Template preview hook
export function useTemplatePreview() {
  const { shop } = useShop();
  
  return useMutation({
    mutationFn: (data: TemplatePreviewRequest) => 
      enhancedApiClient.previewTemplate({ shop, data }),
  });
}

// Template validation hook
export function useTemplateValidation() {
  const { shop } = useShop();
  
  return useMutation({
    mutationFn: (data: TemplateValidationRequest) => 
      enhancedApiClient.validateTemplate({ shop, data }),
  });
}

// Template variables hook
export function useTemplateVariables(trigger: string) {
  const { shop, isReady } = useShop();
  
  return useQuery({
    queryKey: ['template-variables', trigger, shop] as const,
    queryFn: () => enhancedApiClient.getTemplateVariables({ trigger, shop }),
    enabled: isReady && !!shop && !!trigger,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Template triggers hook
export function useTemplateTriggers() {
  const { shop, isReady } = useShop();
  
  return useQuery({
    queryKey: ['template-triggers', shop] as const,
    queryFn: () => enhancedApiClient.getTemplateTriggers({ shop }),
    enabled: isReady && !!shop,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Template editor hook
export function useTemplateEditor() {
  const [template, setTemplate] = React.useState('');
  const [variables, setVariables] = React.useState<Record<string, string>>({});
  const [trigger, setTrigger] = React.useState('');
  
  const preview = useTemplatePreview();
  const validation = useTemplateValidation();
  const { data: availableVariables } = useTemplateVariables(trigger);
  const { data: availableTriggers } = useTemplateTriggers();
  
  const updateTemplate = (newTemplate: string) => {
    setTemplate(newTemplate);
  };
  
  const updateVariable = (key: string, value: string) => {
    setVariables(prev => ({ ...prev, [key]: value }));
  };
  
  const updateTrigger = (newTrigger: string) => {
    setTrigger(newTrigger);
    setVariables({}); // Reset variables when trigger changes
  };
  
  const previewTemplate = async () => {
    if (!template.trim()) return;
    
    try {
      await preview.mutateAsync({
        template: template,
        variables: variables,
      } as any);
    } catch (error) {
      console.error('Preview failed:', error);
    }
  };
  
  const validateTemplate = async () => {
    if (!template.trim()) return;
    
    try {
      await validation.mutateAsync({
        template: template,
        trigger: trigger,
      } as any);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };
  
  return {
    template,
    variables,
    trigger,
    updateTemplate,
    updateVariable,
    updateTrigger,
    previewTemplate,
    validateTemplate,
    preview: preview.data,
    validation: validation.data,
    isLoading: preview.isPending || validation.isPending,
    error: preview.error || validation.error,
    availableVariables: availableVariables?.variables || [],
    availableTriggers: availableTriggers?.triggers || [],
  };
}

// SMS segment calculation hook
export function useSMSSegments(template: string) {
  const [segments, setSegments] = React.useState({
    count: 0,
    characters: 0,
    cost: 0,
  });
  
  React.useEffect(() => {
    if (!template.trim()) {
      setSegments({ count: 0, characters: 0, cost: 0 });
      return;
    }
    
    const characters = template.length;
    let count = 1;
    
    // SMS segment calculation
    if (characters <= 160) {
      count = 1;
    } else if (characters <= 306) {
      count = 2;
    } else if (characters <= 459) {
      count = 3;
    } else {
      count = Math.ceil(characters / 153);
    }
    
    // Estimate cost (assuming $0.01 per segment)
    const cost = count * 0.01;
    
    setSegments({ count, characters, cost });
  }, [template]);
  
  return segments;
}

// Template validation hook with parameters
export function useTemplateValidationWithParams(template: string, trigger: string) {
  const [errors, setErrors] = React.useState<string[]>([]);
  const [warnings, setWarnings] = React.useState<string[]>([]);
  
  React.useEffect(() => {
    const newErrors: string[] = [];
    const newWarnings: string[] = [];
    
    if (!template.trim()) {
      return;
    }
    
    // Check for required variables
    const requiredVariables = ['{{customer.first_name}}', '{{customer.last_name}}'];
    requiredVariables.forEach(variable => {
      if (!template.includes(variable)) {
        newWarnings.push(`Consider including ${variable} for personalization`);
      }
    });
    
    // Check for Liquid syntax errors
    const liquidErrors = validateLiquidSyntax(template);
    newErrors.push(...liquidErrors);
    
    // Check for length warnings
    if (template.length > 160) {
      newWarnings.push('Message is longer than 160 characters and will be split into multiple SMS segments');
    }
    
    // Check for trigger-specific validation
    if (trigger === 'order_confirmation') {
      if (!template.includes('{{order.number}}')) {
        newWarnings.push('Consider including order number for order confirmation messages');
      }
    }
    
    setErrors(newErrors);
    setWarnings(newWarnings);
  }, [template, trigger]);
  
  return {
    errors,
    warnings,
    isValid: errors.length === 0,
  };
}

// Helper function to validate Liquid syntax
function validateLiquidSyntax(template: string): string[] {
  const errors: string[] = [];
  
  // Check for unclosed tags
  const openTags = (template.match(/\{\%/g) || []).length;
  const closeTags = (template.match(/\{\%\s*endfor\s*\%\}/g) || []).length;
  
  if (openTags !== closeTags) {
    errors.push('Unclosed Liquid tags detected');
  }
  
  // Check for invalid variable syntax
  const invalidVariables = template.match(/\{\{[^}]*[^a-zA-Z0-9._}][^}]*\}\}/g);
  if (invalidVariables) {
    errors.push('Invalid variable syntax detected');
  }
  
  return errors;
}
