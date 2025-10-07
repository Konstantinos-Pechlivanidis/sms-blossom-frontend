import React, { useState, useEffect } from 'react';
import {
  Modal,
  Text,
  Button,
  InlineStack,
  BlockStack,
  TextField,
  Select,
  Checkbox,
  Banner,
  Divider,
} from '@shopify/polaris';
import type { AutomationRules } from '../../../sdk/type-augment';

interface AutomationRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rules: AutomationRules) => void;
  initialRules?: AutomationRules;
  isLoading?: boolean;
}

export function AutomationRulesModal({
  isOpen,
  onClose,
  onSave,
  initialRules,
  isLoading = false,
}: AutomationRulesModalProps) {
  const [rules, setRules] = useState<AutomationRules>({
    quietHours: {
      enabled: false,
      start: 22,
      end: 8,
      zone: 'UTC',
    },
    frequencyCap: {
      enabled: false,
      max: 1,
      per: 'day',
    },
    dedupeWindowMin: 60,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialRules) {
      setRules(initialRules);
    }
  }, [initialRules]);

  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    // Validate quiet hours
    if (rules.quietHours?.enabled) {
      if (rules.quietHours.start < 0 || rules.quietHours.start > 23) {
        newErrors.quietStart = 'Start hour must be between 0 and 23';
      }
      if (rules.quietHours.end < 0 || rules.quietHours.end > 23) {
        newErrors.quietEnd = 'End hour must be between 0 and 23';
      }
    }

    // Validate frequency cap
    if (rules.frequencyCap?.enabled) {
      if (rules.frequencyCap.max < 1 || rules.frequencyCap.max > 100) {
        newErrors.frequencyMax = 'Max messages must be between 1 and 100';
      }
    }

    // Validate dedupe window
    if (rules.dedupeWindowMin < 5 || rules.dedupeWindowMin > 1440) {
      newErrors.dedupeMinutes = 'Dedupe window must be between 5 and 1440 minutes';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave(rules);
    }
  };

  const timezoneOptions = [
    { label: 'UTC', value: 'UTC' },
    { label: 'America/New_York', value: 'America/New_York' },
    { label: 'America/Chicago', value: 'America/Chicago' },
    { label: 'America/Denver', value: 'America/Denver' },
    { label: 'America/Los_Angeles', value: 'America/Los_Angeles' },
    { label: 'Europe/London', value: 'Europe/London' },
    { label: 'Europe/Paris', value: 'Europe/Paris' },
    { label: 'Asia/Tokyo', value: 'Asia/Tokyo' },
  ];

  const frequencyOptions = [
    { label: 'Hour', value: 'hour' },
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
  ];

  const hourOptions = Array.from({ length: 24 }, (_, i) => ({
    label: `${i.toString().padStart(2, '0')}:00`,
    value: i.toString(),
  }));

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Automation Rules"
      primaryAction={{
        content: 'Save Rules',
        onAction: handleSave,
        loading: isLoading,
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: onClose,
        },
      ]}
      size="large"
    >
      <Modal.Section>
        <BlockStack gap="500">
          {/* Quiet Hours */}
          <BlockStack gap="300">
            <Text variant="headingMd" as="h3">
              Quiet Hours
            </Text>
            <Checkbox
              label="Enable quiet hours"
              checked={rules.quietHours?.enabled || false}
              onChange={(checked) =>
                setRules(prev => ({
                  ...prev,
                  quietHours: {
                    ...prev.quietHours!,
                    enabled: checked,
                  },
                }))
              }
            />
            {rules.quietHours?.enabled && (
              <InlineStack gap="300">
                <Select
                  label="Start time"
                  options={hourOptions}
                  value={rules.quietHours.start?.toString() || '22'}
                  onChange={(value) =>
                    setRules(prev => ({
                      ...prev,
                      quietHours: {
                        ...prev.quietHours!,
                        start: parseInt(value),
                      },
                    }))
                  }
                  error={errors.quietStart}
                />
                <Select
                  label="End time"
                  options={hourOptions}
                  value={rules.quietHours.end?.toString() || '8'}
                  onChange={(value) =>
                    setRules(prev => ({
                      ...prev,
                      quietHours: {
                        ...prev.quietHours!,
                        end: parseInt(value),
                      },
                    }))
                  }
                  error={errors.quietEnd}
                />
                <Select
                  label="Timezone"
                  options={timezoneOptions}
                  value={rules.quietHours.zone || 'UTC'}
                  onChange={(value) =>
                    setRules(prev => ({
                      ...prev,
                      quietHours: {
                        ...prev.quietHours!,
                        zone: value,
                      },
                    }))
                  }
                />
              </InlineStack>
            )}
          </BlockStack>

          <Divider />

          {/* Frequency Cap */}
          <BlockStack gap="300">
            <Text variant="headingMd" as="h3">
              Frequency Cap
            </Text>
            <Checkbox
              label="Enable frequency cap"
              checked={rules.frequencyCap?.enabled || false}
              onChange={(checked) =>
                setRules(prev => ({
                  ...prev,
                  frequencyCap: {
                    ...prev.frequencyCap!,
                    enabled: checked,
                  },
                }))
              }
            />
            {rules.frequencyCap?.enabled && (
              <InlineStack gap="300">
                <TextField
                  label="Max messages"
                  type="number"
                  value={rules.frequencyCap.max?.toString() || '1'}
                  onChange={(value) =>
                    setRules(prev => ({
                      ...prev,
                      frequencyCap: {
                        ...prev.frequencyCap!,
                        max: parseInt(value) || 1,
                      },
                    }))
                  }
                  error={errors.frequencyMax}
                  min={1}
                  max={100}
                  autoComplete="off"
                />
                <Select
                  label="Per"
                  options={frequencyOptions}
                  value={rules.frequencyCap.per || 'day'}
                  onChange={(value) =>
                    setRules(prev => ({
                      ...prev,
                      frequencyCap: {
                        ...prev.frequencyCap!,
                        per: value as 'hour' | 'day' | 'week',
                      },
                    }))
                  }
                />
              </InlineStack>
            )}
          </BlockStack>

          <Divider />

          {/* Dedupe Window */}
          <BlockStack gap="300">
            <Text variant="headingMd" as="h3">
              Deduplication
            </Text>
            <TextField
              label="Dedupe window (minutes)"
              type="number"
              value={rules.dedupeWindowMin?.toString() || '60'}
              onChange={(value) =>
                setRules(prev => ({
                  ...prev,
                  dedupeWindowMin: parseInt(value) || 60,
                }))
              }
              error={errors.dedupeMinutes}
              min={5}
              max={1440}
              autoComplete="off"
              helpText="Minimum time between messages to the same contact"
            />
          </BlockStack>

          {/* Error Banner */}
          {Object.keys(errors).length > 0 && (
            <Banner tone="critical">
              <Text as="p">
                Please fix the following errors:
                <ul>
                  {Object.values(errors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </Text>
            </Banner>
          )}
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}
