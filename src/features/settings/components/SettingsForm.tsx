import React from 'react';
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  TextField,
  Button,
  Banner,
  Spinner,
  Divider,
} from '@shopify/polaris';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { settingsSchema, SettingsFormData } from '../schemas/settingsSchema';
import { QuietHoursSection } from './QuietHoursSection';
import { FrequencyCapsSection } from './FrequencyCapsSection';
import { FeatureFlagsSection } from './FeatureFlagsSection';

interface SettingsFormProps {
  initialData?: SettingsFormData;
  onSave: (data: SettingsFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
  success?: string;
}

export function SettingsForm({ 
  initialData, 
  onSave, 
  isLoading, 
  error, 
  success 
}: SettingsFormProps) {
  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialData,
  });

  const { handleSubmit, watch, setValue, formState: { errors, isDirty } } = form;

  const watchedValues = watch();

  const handleFormSubmit = async (data: SettingsFormData) => {
    try {
      await onSave(data);
    } catch (error) {
      // Error handling is done by the parent component
    }
  };

  const handleQuietHoursChange = (quietHours: { start: number; end: number }) => {
    setValue('quietHours', quietHours, { shouldDirty: true });
  };

  const handleTimezoneChange = (timezone: string) => {
    setValue('timezone', timezone, { shouldDirty: true });
  };

  const handleCapChange = (cap: { windowHours: number; maxPerWindow: number }) => {
    setValue('cap', cap, { shouldDirty: true });
  };

  const handleFeatureFlagsChange = (featureFlags: Record<string, boolean>) => {
    setValue('featureFlags', featureFlags as any, { shouldDirty: true });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <BlockStack gap="400">
        {error && (
          <Banner tone="critical">
            <Text as="p">{error}</Text>
          </Banner>
        )}

        {success && (
          <Banner tone="success">
            <Text as="p">{success}</Text>
          </Banner>
        )}

        <Card>
          <BlockStack gap="400">
            <Text variant="headingMd" as="h3">
              Basic Settings
            </Text>
            
            <InlineStack gap="400" align="start">
              <div style={{ flex: 1 }}>
                <TextField
                  label="Sender ID"
                  value={watchedValues.senderId || ''}
                  onChange={(value) => setValue('senderId', value, { shouldDirty: true })}
                  error={errors.senderId?.message}
                  helpText="Optional sender ID for SMS messages (max 11 characters)"
                  maxLength={11}
                  autoComplete="off"
                />
              </div>
              
              <div style={{ flex: 1 }}>
                <TextField
                  label="Locale"
                  value={watchedValues.locale || ''}
                  onChange={(value) => setValue('locale', value, { shouldDirty: true })}
                  error={errors.locale?.message}
                  helpText="Default locale for messages (e.g., en-US)"
                  autoComplete="off"
                />
              </div>
            </InlineStack>

            <TextField
              label="Unsubscribe Text"
              value={watchedValues.unsubscribeText || ''}
              onChange={(value) => setValue('unsubscribeText', value, { shouldDirty: true })}
              error={errors.unsubscribeText?.message}
              helpText="Text to append to messages for unsubscribe (max 160 characters)"
              maxLength={160}
              autoComplete="off"
            />
          </BlockStack>
        </Card>

        <QuietHoursSection
          value={watchedValues.quietHours}
          timezone={watchedValues.timezone}
          onChange={handleQuietHoursChange}
          onTimezoneChange={handleTimezoneChange}
          errors={errors.quietHours ? { start: errors.quietHours.start?.message || '', end: errors.quietHours.end?.message || '' } : undefined}
        />

        <FrequencyCapsSection
          value={watchedValues.cap}
          onChange={handleCapChange}
          errors={errors.cap ? { windowHours: errors.cap.windowHours?.message || '', maxPerWindow: errors.cap.maxPerWindow?.message || '' } : undefined}
        />

        <FeatureFlagsSection
          value={watchedValues.featureFlags}
          onChange={handleFeatureFlagsChange}
          errors={errors.featureFlags ? Object.fromEntries(Object.entries(errors.featureFlags).map(([key, error]) => [key, typeof error === 'string' ? error : (error as any)?.message || ''])) : undefined}
        />

        <Card>
          <BlockStack gap="400">
            <Text variant="headingMd" as="h3">
              Abandoned Checkout
            </Text>
            
            <TextField
              label="Delay Minutes"
              type="number"
              value={watchedValues.abandoned.delayMinutes.toString()}
              onChange={(value) => setValue('abandoned.delayMinutes', parseInt(value) || 0, { shouldDirty: true })}
              error={errors.abandoned?.delayMinutes?.message}
              helpText="Minutes to wait before sending abandoned checkout message"
              min={1}
              max={1440}
              autoComplete="off"
            />
          </BlockStack>
        </Card>

        <Divider />

        <InlineStack align="end" gap="200">
          <Button
            variant="primary"
            loading={isLoading}
            disabled={!isDirty || isLoading}
            onClick={handleSubmit(handleFormSubmit)}
          >
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </InlineStack>

        {isLoading && (
          <InlineStack align="center" gap="200">
            <Spinner size="small" />
            <Text as="p">Saving settings...</Text>
          </InlineStack>
        )}
      </BlockStack>
    </form>
  );
}
