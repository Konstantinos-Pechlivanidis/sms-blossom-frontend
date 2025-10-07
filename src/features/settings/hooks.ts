import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enhancedApiClient } from '../../lib/apiClient';
import { useShop } from '../../lib/shopContext';
import type { components } from '../../sdk/type-augment';

// Types
type Settings = components['schemas']['SettingsGetResponse'];
type SettingsUpdateRequest = components['schemas']['SettingsPutRequest'];

// Settings hook
export function useSettings() {
  const { shop, isReady } = useShop();
  
  return useQuery({
    queryKey: ['settings', shop] as const,
    queryFn: () => enhancedApiClient.getSettings({ shop }),
    enabled: isReady && !!shop,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Update settings hook
export function useUpdateSettings() {
  const { shop } = useShop();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: SettingsUpdateRequest) => 
      enhancedApiClient.updateSettings({ shop, data }),
    onSuccess: () => {
      // Invalidate settings
      queryClient.invalidateQueries({ queryKey: ['settings', shop] as const });
    },
  });
}

// Quiet hours hook
export function useQuietHours() {
  const { data: settings } = useSettings();
  
  const quietHours = settings?.settings?.quietHours || {
    start: 22,
    end: 8,
  };
  
  const isQuietTime = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    const start = quietHours.start;
    const end = quietHours.end;
    
    // Handle overnight quiet hours (e.g., 22:00 to 08:00)
    if (start > end) {
      return currentHour >= start || currentHour <= end;
    }
    
    // Handle same-day quiet hours (e.g., 12:00 to 14:00)
    return currentHour >= start && currentHour <= end;
  };
  
  return {
    quietHours,
    isQuietTime: isQuietTime(),
    updateQuietHours: (newQuietHours: typeof quietHours) => {
      // This would be handled by the update settings mutation
    },
  };
}

// Timezone hook
export function useTimezone() {
  const { data: settings } = useSettings();
  
  const timezone = settings?.settings?.timezone || 'UTC';
  const availableTimezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney',
  ];
  
  const getTimezoneOptions = () => {
    return availableTimezones.map(tz => ({
      label: tz,
      value: tz,
    }));
  };
  
  return {
    timezone,
    availableTimezones,
    getTimezoneOptions,
  };
}

// Feature flags hook
export function useFeatureFlags() {
  const { data: settings } = useSettings();
  
  const featureFlags = settings?.settings?.featureFlags || {
    dashboardCharts: true,
    realTimeMetrics: false,
    campaignTemplates: true,
    campaignScheduling: false,
    campaignAutomation: false,
    discountAutomation: false,
    discountConflicts: true,
    templateLiquid: true,
    templateVariables: true,
    templateValidation: true,
  };
  
  const updateFeatureFlag = (flag: string, value: boolean) => {
    // This would be handled by the update settings mutation
    const updatedFlags = { ...featureFlags, [flag]: value };
    return updatedFlags;
  };
  
  return {
    featureFlags,
    updateFeatureFlag,
  };
}

// Notification settings hook
export function useNotificationSettings() {
  const { data: settings } = useSettings();
  
  const notifications = settings?.settings?.notifications || {
    email: {
      enabled: true,
      campaignSent: true,
      campaignFailed: true,
      discountCreated: false,
      systemAlerts: true,
    },
    sms: {
      enabled: false,
      systemAlerts: false,
    },
    webhook: {
      enabled: false,
      url: '',
      events: [],
    },
  };
  
  return {
    notifications,
    updateNotifications: (newNotifications: typeof notifications) => {
      // This would be handled by the update settings mutation
    },
  };
}

// Settings validation hook
export function useSettingsValidation(settings: Partial<SettingsUpdateRequest>) {
  const errors: Record<string, string> = {};
  
  if (settings.quietHours) {
    const { start, end } = settings.quietHours;
    
    if (start && end) {
      const startTime = new Date(`2000-01-01T${start}`);
      const endTime = new Date(`2000-01-01T${end}`);
      
      if (startTime >= endTime) {
        errors.quietHours = 'End time must be after start time';
      }
    }
  }
  
  // Type assertion to access notifications property from our Zod schema
  const settingsWithNotifications = settings as any;
  
  if (settingsWithNotifications.notifications?.webhook?.enabled && !settingsWithNotifications.notifications.webhook.url) {
    errors.webhookUrl = 'Webhook URL is required when webhook notifications are enabled';
  }
  
  if (settingsWithNotifications.notifications?.webhook?.url) {
    try {
      new URL(settingsWithNotifications.notifications.webhook.url);
    } catch {
      errors.webhookUrl = 'Invalid webhook URL';
    }
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}

// Settings analytics hook
export function useSettingsAnalytics() {
  const { data: settings } = useSettings();
  
  if (!settings) return null;
  
  const analytics = {
    totalCampaigns: settings.settings?.analytics?.totalCampaigns || 0,
    totalDiscounts: settings.settings?.analytics?.totalDiscounts || 0,
    totalMessages: settings.settings?.analytics?.totalMessages || 0,
    totalRevenue: settings.settings?.analytics?.totalRevenue || 0,
    averageDeliveryRate: settings.settings?.analytics?.averageDeliveryRate || 0,
    averageOpenRate: settings.settings?.analytics?.averageOpenRate || 0,
    averageClickRate: settings.settings?.analytics?.averageClickRate || 0,
  };
  
  return analytics;
}
