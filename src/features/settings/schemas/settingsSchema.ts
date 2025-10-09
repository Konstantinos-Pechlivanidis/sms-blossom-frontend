import { z } from 'zod';

export const settingsSchema = z.object({
  timezone: z.string().min(1, 'Timezone is required'),
  quietHours: z.object({
    start: z.number().min(0).max(23, 'Start hour must be between 0-23'),
    end: z.number().min(0).max(23, 'End hour must be between 0-23'),
  }),
  cap: z.object({
    windowHours: z.number().min(1, 'Window hours must be at least 1'),
    maxPerWindow: z.number().min(1, 'Max per window must be at least 1'),
  }),
  abandoned: z.object({
    delayMinutes: z.number().min(1, 'Delay minutes must be at least 1'),
  }),
  senderId: z.string().optional(),
  locale: z.string().optional(),
  unsubscribeText: z.string().optional(),
  featureFlags: z.object({
    dashboardCharts: z.boolean(),
    realTimeMetrics: z.boolean(),
    campaignTemplates: z.boolean(),
    campaignScheduling: z.boolean(),
    campaignAutomation: z.boolean(),
    discountAutomation: z.boolean(),
    discountConflicts: z.boolean(),
    templateLiquid: z.boolean(),
    templateVariables: z.boolean(),
    templateValidation: z.boolean(),
  }),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;

// Validation helpers
export const validateQuietHours = (start: number, end: number) => {
  if (start === end) {
    return 'Start and end times cannot be the same';
  }
  return null;
};

export const validateCap = (windowHours: number, maxPerWindow: number) => {
  if (windowHours < 1) {
    return 'Window hours must be at least 1';
  }
  if (maxPerWindow < 1) {
    return 'Max per window must be at least 1';
  }
  return null;
};

export const validateSenderId = (senderId: string) => {
  if (senderId && senderId.length > 11) {
    return 'Sender ID must be 11 characters or less';
  }
  if (senderId && !/^[a-zA-Z0-9]+$/.test(senderId)) {
    return 'Sender ID must contain only letters and numbers';
  }
  return null;
};

export const validateUnsubscribeText = (text: string) => {
  if (text && text.length > 160) {
    return 'Unsubscribe text must be 160 characters or less';
  }
  return null;
};

// Default values
export const defaultSettings: SettingsFormData = {
  timezone: 'UTC',
  quietHours: {
    start: 22,
    end: 8,
  },
  cap: {
    windowHours: 24,
    maxPerWindow: 1,
  },
  abandoned: {
    delayMinutes: 30,
  },
  senderId: '',
  locale: 'en-US',
  unsubscribeText: 'Reply STOP to unsubscribe',
  featureFlags: {
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
  },
};
