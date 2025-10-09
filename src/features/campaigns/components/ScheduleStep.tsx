import React, { useState, useEffect } from 'react';
import {
  Card,
  Text,
  TextField,
  Select,
  BlockStack,
  InlineStack,
  Button,
  Badge,
  Banner,
  Checkbox,
} from '@shopify/polaris';

interface ScheduleStepProps {
  data?: any;
  onChange: (data: any) => void;
  errors?: string;
}

const TIMEZONE_OPTIONS = [
  { label: 'UTC', value: 'UTC' },
  { label: 'America/New_York', value: 'America/New_York' },
  { label: 'America/Chicago', value: 'America/Chicago' },
  { label: 'America/Denver', value: 'America/Denver' },
  { label: 'America/Los_Angeles', value: 'America/Los_Angeles' },
  { label: 'Europe/London', value: 'Europe/London' },
  { label: 'Europe/Paris', value: 'Europe/Paris' },
  { label: 'Asia/Tokyo', value: 'Asia/Tokyo' },
];

export function ScheduleStep({ data, onChange, errors }: ScheduleStepProps) {
  const [scheduleType, setScheduleType] = useState(data?.scheduleType || 'now');
  const [scheduledAt, setScheduledAt] = useState(data?.scheduledAt || '');
  const [timezone, setTimezone] = useState(data?.timezone || 'UTC');
  const [respectQuietHours, setRespectQuietHours] = useState(data?.respectQuietHours ?? true);

  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const defaultTime = tomorrow.toISOString().slice(0, 16);

    onChange({
      scheduleType,
      scheduledAt: scheduleType === 'now' ? null : scheduledAt || defaultTime,
      timezone,
      respectQuietHours,
    });
  }, [scheduleType, scheduledAt, timezone, respectQuietHours, onChange]);

  const getScheduleDescription = () => {
    if (scheduleType === 'now') {
      return 'Send immediately when campaign is created';
    }
    if (scheduledAt) {
      const date = new Date(scheduledAt);
      return `Send on ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
    }
    return 'Schedule for a specific date and time';
  };

  const validateSchedule = () => {
    if (scheduleType === 'scheduled' && scheduledAt) {
      const scheduleDate = new Date(scheduledAt);
      const now = new Date();
      
      if (scheduleDate <= now) {
        return 'Scheduled time must be in the future';
      }
      
      // Check if it's more than 1 year in the future
      const oneYearFromNow = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
      if (scheduleDate > oneYearFromNow) {
        return 'Scheduled time cannot be more than 1 year in the future';
      }
    }
    return null;
  };

  const validationError = validateSchedule();

  return (
    <Card>
      <BlockStack gap="400">
        <BlockStack gap="200">
          <Text variant="headingMd" as="h3">
            Schedule Campaign
          </Text>
          <Text variant="bodyMd" as="p" tone="subdued">
            Choose when to send your campaign to customers.
          </Text>
        </BlockStack>

        <BlockStack gap="300">
          <Text variant="bodyMd" fontWeight="semibold" as="h4">
            Send Time
          </Text>
          
          <Select
            label="Schedule Type"
            options={[
              { label: 'Send Now', value: 'now' },
              { label: 'Schedule for Later', value: 'scheduled' },
            ]}
            value={scheduleType}
            onChange={setScheduleType}
          />

          {scheduleType === 'scheduled' && (
            <TextField
              type="datetime-local"
              label="Scheduled Date & Time"
              value={scheduledAt}
              onChange={setScheduledAt}
              error={validationError || undefined}
              helpText="Choose when to send the campaign"
              autoComplete="off"
            />
          )}

          <Select
            label="Timezone"
            options={TIMEZONE_OPTIONS}
            value={timezone}
            onChange={setTimezone}
            helpText="Timezone for the scheduled time"
          />
        </BlockStack>

        <BlockStack gap="300">
          <Text variant="bodyMd" fontWeight="semibold" as="h4">
            Delivery Settings
          </Text>
          
          <Checkbox
            label="Respect quiet hours"
            checked={respectQuietHours}
            onChange={setRespectQuietHours}
            helpText="Delay sending if it falls within configured quiet hours"
          />
        </BlockStack>

        <Card>
          <BlockStack gap="200">
            <Text variant="bodyMd" fontWeight="semibold" as="h4">
              Schedule Summary
            </Text>
            <InlineStack gap="200" align="center">
              <Text as="span">{getScheduleDescription()}</Text>
              <Badge tone={scheduleType === 'now' ? 'success' : 'info'}>
                {scheduleType === 'now' ? 'Immediate' : 'Scheduled'}
              </Badge>
            </InlineStack>
            {timezone !== 'UTC' && (
              <Text variant="bodySm" as="p" tone="subdued">
                Timezone: {timezone}
              </Text>
            )}
            {respectQuietHours && (
              <Text variant="bodySm" as="p" tone="subdued">
                Will respect quiet hours if configured
              </Text>
            )}
          </BlockStack>
        </Card>

        {validationError && (
          <Banner tone="critical">
            <Text as="p">{validationError}</Text>
          </Banner>
        )}

        <Banner tone="info">
          <Text as="p">
            <strong>Tip:</strong> Consider your customers' timezone and typical activity hours 
            for better engagement rates.
          </Text>
        </Banner>
      </BlockStack>
    </Card>
  );
}
