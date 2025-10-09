import { describe, it, expect } from 'vitest';
import { 
  settingsSchema, 
  validateQuietHours, 
  validateCap, 
  validateSenderId, 
  validateUnsubscribeText,
  defaultSettings
} from '../../../src/features/settings/schemas/settingsSchema';

describe('Settings Schema', () => {
  describe('settingsSchema', () => {
    it('should validate correct settings data', () => {
      const validData = {
        timezone: 'America/New_York',
        quietHours: { start: 22, end: 8 },
        cap: { windowHours: 24, maxPerWindow: 1 },
        abandoned: { delayMinutes: 30 },
        senderId: 'SMSBlossom',
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

      const result = settingsSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid timezone', () => {
      const invalidData = {
        timezone: '',
        quietHours: { start: 22, end: 8 },
        cap: { windowHours: 24, maxPerWindow: 1 },
        abandoned: { delayMinutes: 30 },
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

      const result = settingsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Timezone is required');
      }
    });

    it('should reject invalid quiet hours', () => {
      const invalidData = {
        timezone: 'UTC',
        quietHours: { start: 25, end: 8 },
        cap: { windowHours: 24, maxPerWindow: 1 },
        abandoned: { delayMinutes: 30 },
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

      const result = settingsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Start hour must be between 0-23');
      }
    });
  });

  describe('validateQuietHours', () => {
    it('should validate correct quiet hours', () => {
      const result = validateQuietHours(22, 8);
      expect(result).toBeNull();
    });

    it('should reject same start and end times', () => {
      const result = validateQuietHours(22, 22);
      expect(result).toBe('Start and end times cannot be the same');
    });
  });

  describe('validateCap', () => {
    it('should validate correct cap settings', () => {
      const result = validateCap(24, 1);
      expect(result).toBeNull();
    });

    it('should reject invalid window hours', () => {
      const result = validateCap(0, 1);
      expect(result).toBe('Window hours must be at least 1');
    });

    it('should reject invalid max per window', () => {
      const result = validateCap(24, 0);
      expect(result).toBe('Max per window must be at least 1');
    });
  });

  describe('validateSenderId', () => {
    it('should validate correct sender ID', () => {
      const result = validateSenderId('SMSBlossom');
      expect(result).toBeNull();
    });

    it('should reject sender ID that is too long', () => {
      const result = validateSenderId('ThisIsTooLongForSenderID');
      expect(result).toBe('Sender ID must be 11 characters or less');
    });

    it('should reject sender ID with special characters', () => {
      const result = validateSenderId('SMS-Blossom!');
      expect(result).toBe('Sender ID must be 11 characters or less');
    });
  });

  describe('validateUnsubscribeText', () => {
    it('should validate correct unsubscribe text', () => {
      const result = validateUnsubscribeText('Reply STOP to unsubscribe');
      expect(result).toBeNull();
    });

    it('should reject unsubscribe text that is too long', () => {
      const longText = 'A'.repeat(161);
      const result = validateUnsubscribeText(longText);
      expect(result).toBe('Unsubscribe text must be 160 characters or less');
    });
  });

  describe('defaultSettings', () => {
    it('should have correct default values', () => {
      expect(defaultSettings.timezone).toBe('UTC');
      expect(defaultSettings.quietHours).toEqual({ start: 22, end: 8 });
      expect(defaultSettings.cap).toEqual({ windowHours: 24, maxPerWindow: 1 });
      expect(defaultSettings.abandoned).toEqual({ delayMinutes: 30 });
      expect(defaultSettings.senderId).toBe('');
      expect(defaultSettings.locale).toBe('en-US');
      expect(defaultSettings.unsubscribeText).toBe('Reply STOP to unsubscribe');
      expect(defaultSettings.featureFlags.dashboardCharts).toBe(true);
      expect(defaultSettings.featureFlags.realTimeMetrics).toBe(false);
    });
  });
});
