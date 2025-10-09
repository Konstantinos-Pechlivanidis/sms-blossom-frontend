import React from 'react';
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  TextField,
  Banner,
  Badge,
} from '@shopify/polaris';

interface FrequencyCapsSectionProps {
  value: { windowHours: number; maxPerWindow: number };
  onChange: (value: { windowHours: number; maxPerWindow: number }) => void;
  errors?: Record<string, string>;
}

export function FrequencyCapsSection({ value, onChange, errors }: FrequencyCapsSectionProps) {
  const handleWindowHoursChange = (newValue: string) => {
    const windowHours = parseInt(newValue) || 0;
    onChange({ ...value, windowHours });
  };

  const handleMaxPerWindowChange = (newValue: string) => {
    const maxPerWindow = parseInt(newValue) || 0;
    onChange({ ...value, maxPerWindow });
  };

  const getCapDisplay = () => {
    const windowText = value.windowHours === 1 ? 'hour' : 'hours';
    return `${value.maxPerWindow} message${value.maxPerWindow === 1 ? '' : 's'} per ${value.windowHours} ${windowText}`;
  };

  const getCapSeverity = () => {
    if (value.maxPerWindow === 1) return 'success';
    if (value.maxPerWindow <= 3) return 'warning';
    return 'critical';
  };

  return (
    <Card>
      <BlockStack gap="400">
        <Text variant="headingMd" as="h3">
          Frequency Caps
        </Text>
        
        <Text as="p" tone="subdued">
          Limit the number of messages sent to each customer within a time window to prevent spam.
        </Text>

        <InlineStack gap="400" align="start">
          <div style={{ flex: 1 }}>
            <TextField
              label="Window Hours"
              type="number"
              value={value.windowHours.toString()}
              onChange={handleWindowHoursChange}
              error={errors?.windowHours}
              helpText="Time window in hours"
              min={1}
              max={168}
              autoComplete="off"
            />
          </div>
          
          <div style={{ flex: 1 }}>
            <TextField
              label="Max Per Window"
              type="number"
              value={value.maxPerWindow.toString()}
              onChange={handleMaxPerWindowChange}
              error={errors?.maxPerWindow}
              helpText="Maximum messages per window"
              min={1}
              max={10}
              autoComplete="off"
            />
          </div>
        </InlineStack>

        {errors?.cap && (
          <Banner tone="critical">
            <Text as="p">{errors.cap}</Text>
          </Banner>
        )}

        <InlineStack gap="200" align="center">
          <Text as="p" variant="bodyMd">
            Current cap: <strong>{getCapDisplay()}</strong>
          </Text>
          <Badge tone={getCapSeverity()}>
            {value.maxPerWindow === 1 ? 'Conservative' : 
             value.maxPerWindow <= 3 ? 'Moderate' : 'Aggressive'}
          </Badge>
        </InlineStack>

        <Text as="p" variant="bodySm" tone="subdued">
          This prevents customers from receiving too many messages in a short time period. 
          Conservative settings (1 message per 24 hours) are recommended for better deliverability.
        </Text>
      </BlockStack>
    </Card>
  );
}
