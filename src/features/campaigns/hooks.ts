import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enhancedApiClient } from '../../lib/apiClient';
import { useShop } from '../../lib/shopContext';
import type { 
  Campaign,
  CampaignCreateRequest,
  CampaignUpdateRequest,
  CampaignEstimateResponse,
  CampaignTestSendRequest,
  CampaignTestSendResponse,
  CampaignSendResponse
} from '../../sdk/type-augment';

// Campaign list hook
export function useCampaigns() {
  const { shop, isReady } = useShop();
  
  return useQuery({
    queryKey: ['campaigns', shop] as const,
    queryFn: () => enhancedApiClient.getCampaigns({ shop }),
    enabled: isReady && !!shop,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Single campaign hook
export function useCampaign(id: string) {
  const { shop, isReady } = useShop();
  
  return useQuery({
    queryKey: ['campaign', id, shop] as const,
    queryFn: () => enhancedApiClient.getCampaign({ id, shop }),
    enabled: isReady && !!shop && !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Create campaign hook
export function useCreateCampaign() {
  const { shop } = useShop();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CampaignCreateRequest) => 
      enhancedApiClient.createCampaign({ shop, data }),
    onSuccess: () => {
      // Invalidate campaigns list
      queryClient.invalidateQueries({ queryKey: ['campaigns', shop] as const });
    },
  });
}

// Update campaign hook
export function useUpdateCampaign() {
  const { shop } = useShop();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CampaignUpdateRequest }) => 
      enhancedApiClient.updateCampaign({ id, shop, data }),
    onSuccess: (_, { id }) => {
      // Invalidate specific campaign and list
      queryClient.invalidateQueries({ queryKey: ['campaign', id, shop] as const });
      queryClient.invalidateQueries({ queryKey: ['campaigns', shop] as const });
    },
  });
}

// Delete campaign hook
export function useDeleteCampaign() {
  const { shop } = useShop();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => 
      enhancedApiClient.deleteCampaign({ id, shop }),
    onSuccess: () => {
      // Invalidate campaigns list
      queryClient.invalidateQueries({ queryKey: ['campaigns', shop] as const });
    },
  });
}

// Estimate campaign hook
export function useEstimateCampaign() {
  const { shop } = useShop();
  
  return useMutation({
    mutationFn: (id: string) => 
      enhancedApiClient.estimateCampaign({ id, shop }),
  });
}

// Test send campaign hook
export function useTestSendCampaign() {
  const { shop } = useShop();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CampaignTestSendRequest }) => 
      enhancedApiClient.testSendCampaign({ id, shop, data }),
  });
}

// Send campaign hook
export function useSendCampaign() {
  const { shop } = useShop();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => 
      enhancedApiClient.sendCampaign({ id, shop }),
    onSuccess: (_, id) => {
      // Invalidate specific campaign and list
      queryClient.invalidateQueries({ queryKey: ['campaign', id, shop] as const });
      queryClient.invalidateQueries({ queryKey: ['campaigns', shop] as const });
    },
  });
}

// Campaign status hook
export function useCampaignStatus(campaign: Campaign | undefined) {
  if (!campaign) return 'draft';
  
  if (campaign.sentAt) return 'sent';
  if (campaign.scheduledAt && new Date(campaign.scheduledAt) > new Date()) return 'scheduled';
  if (campaign.estimatedAt) return 'estimated';
  
  return 'draft';
}

// Campaign progress hook
export function useCampaignProgress(campaign: Campaign | undefined) {
  const status = useCampaignStatus(campaign);
  
  const steps = [
    { key: 'draft', label: 'Draft', completed: true },
    { key: 'estimated', label: 'Estimated', completed: status !== 'draft' },
    { key: 'scheduled', label: 'Scheduled', completed: status === 'scheduled' || status === 'sent' },
    { key: 'sent', label: 'Sent', completed: status === 'sent' },
  ];
  
  const currentStep = steps.findIndex(step => step.key === status);
  
  return {
    steps,
    currentStep,
    status,
    progress: ((currentStep + 1) / steps.length) * 100,
  };
}

// Campaign validation hook
export function useCampaignValidation(campaign: Partial<CampaignCreateRequest>) {
  const errors: Record<string, string> = {};
  
  if (!campaign.name?.trim()) {
    errors.name = 'Campaign name is required';
  }
  
  // Type assertion to access template property from our Zod schema
  const campaignWithTemplate = campaign as any;
  
  if (!campaignWithTemplate.template?.trim()) {
    errors.template = 'Message template is required';
  }
  
  if (!campaign.segmentId) {
    errors.segmentId = 'Target segment is required';
  }
  
  if (campaignWithTemplate.template && campaignWithTemplate.template.length > 160) {
    errors.template = 'Message template is too long (max 160 characters)';
  }
  
  if (campaign.scheduledAt && new Date(campaign.scheduledAt) < new Date()) {
    errors.scheduledAt = 'Scheduled time must be in the future';
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}

// Campaign analytics hook
export function useCampaignAnalytics(campaign: Campaign | undefined) {
  if (!campaign) return null;
  
  const analytics = campaign.analytics || {};
  const totalSent = analytics.sent || 0;
  const delivered = analytics.delivered || 0;
  const failed = analytics.failed || 0;
  const opened = analytics.opened || 0;
  const clicked = analytics.clicked || 0;
  
  const deliveryRate = totalSent > 0 ? (delivered / totalSent) * 100 : 0;
  const openRate = delivered > 0 ? (opened / delivered) * 100 : 0;
  const clickRate = delivered > 0 ? (clicked / delivered) * 100 : 0;
  
  return {
    totalSent,
    delivered,
    failed,
    opened,
    clicked,
    deliveryRate,
    openRate,
    clickRate,
  };
}
