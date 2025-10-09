import React from 'react';
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Select,
  TextField,
  Banner,
  Badge,
} from '@shopify/polaris';

interface QuietHoursSectionProps {
  value: { start: number; end: number };
  timezone: string;
  onChange: (value: { start: number; end: number }) => void;
  onTimezoneChange: (timezone: string) => void;
  errors?: Record<string, string>;
}

export function QuietHoursSection({ 
  value, 
  timezone, 
  onChange, 
  onTimezoneChange, 
  errors 
}: QuietHoursSectionProps) {
  const timeOptions = Array.from({ length: 24 }, (_, i) => ({
    label: `${i.toString().padStart(2, '0')}:00`,
    value: i.toString(),
  }));

  const timezoneOptions = [
    { label: 'UTC', value: 'UTC' },
    { label: 'America/New_York', value: 'America/New_York' },
    { label: 'America/Chicago', value: 'America/Chicago' },
    { label: 'America/Denver', value: 'America/Denver' },
    { label: 'America/Los_Angeles', value: 'America/Los_Angeles' },
    { label: 'Europe/London', value: 'Europe/London' },
    { label: 'Europe/Paris', value: 'Europe/Paris' },
    { label: 'Europe/Berlin', value: 'Europe/Berlin' },
    { label: 'Asia/Tokyo', value: 'Asia/Tokyo' },
    { label: 'Asia/Shanghai', value: 'Asia/Shanghai' },
    { label: 'Australia/Sydney', value: 'Australia/Sydney' },
  ];

  const isQuietTime = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    const start = value.start;
    const end = value.end;
    
    // Handle overnight quiet hours (e.g., 22:00 to 08:00)
    if (start > end) {
      return currentHour >= start || currentHour <= end;
    }
    
    // Handle same-day quiet hours (e.g., 12:00 to 14:00)
    return currentHour >= start && currentHour <= end;
  };

  const getQuietHoursDisplay = () => {
    const startTime = `${value.start.toString().padStart(2, '0')}:00`;
    const endTime = `${value.end.toString().padStart(2, '0')}:00`;
    
    if (value.start > value.end) {
      return `${startTime} - ${endTime} (overnight)`;
    }
    
    return `${startTime} - ${endTime}`;
  };

  return (
    <Card>
      <BlockStack gap="400">
        <Text variant="headingMd" as="h3">
          Quiet Hours
        </Text>
        
        <Text as="p" tone="subdued">
          Configure when SMS messages should not be sent to respect customer preferences.
        </Text>

        <InlineStack gap="400" align="start">
          <div style={{ flex: 1 }}>
            <Select
              label="Start Time"
              options={timeOptions}
              value={value.start.toString()}
              onChange={(newValue) => onChange({ ...value, start: parseInt(newValue) })}
              error={errors?.start}
            />
          </div>
          
          <div style={{ flex: 1 }}>
            <Select
              label="End Time"
              options={timeOptions}
              value={value.end.toString()}
              onChange={(newValue) => onChange({ ...value, end: parseInt(newValue) })}
              error={errors?.end}
            />
          </div>
        </InlineStack>

        <Select
          label="Timezone"
          options={timezoneOptions}
          value={timezone}
          onChange={onTimezoneChange}
          error={errors?.timezone}
        />

        {errors?.quietHours && (
          <Banner tone="critical">
            <Text as="p">{errors.quietHours}</Text>
          </Banner>
        )}

        <InlineStack gap="200" align="center">
          <Text as="p" variant="bodyMd">
            Current quiet hours: <strong>{getQuietHoursDisplay()}</strong>
          </Text>
          <Badge tone={isQuietTime() ? 'critical' : 'success'}>
            {isQuietTime() ? 'Quiet Time' : 'Active Time'}
          </Badge>
        </InlineStack>

        <Text as="p" variant="bodySm" tone="subdued">
          Messages will not be sent during quiet hours. Configure this to respect customer time zones and preferences.
        </Text>
      </BlockStack>
    </Card>
  );
}
