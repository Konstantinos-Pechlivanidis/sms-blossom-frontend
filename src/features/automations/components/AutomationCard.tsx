import React from 'react';
import {
  Card,
  Text,
  Button,
  InlineStack,
  BlockStack,
  Badge,
  ButtonGroup,
  Icon,
  Box,
  Divider,
} from '@shopify/polaris';
import {
  EditIcon,
  ViewIcon,
  PlayIcon,
  DisabledIcon,
} from '@shopify/polaris-icons';
import type { AutomationConfig } from '../../../sdk/type-augment';

interface AutomationCardProps {
  triggerKey: string;
  title: string;
  description: string;
  config: AutomationConfig | null;
  onToggle: (enabled: boolean) => void;
  onEditTemplate: () => void;
  onEditRules: () => void;
  onPreview?: () => void;
  onTest?: () => void;
  isLoading?: boolean;
  metrics?: {
    sent?: number;
    delivered?: number;
    ctr?: number;
    period?: string;
  };
}

export function AutomationCard({
  triggerKey,
  title,
  description,
  config,
  onToggle,
  onEditTemplate,
  onEditRules,
  onPreview,
  onTest,
  isLoading = false,
  metrics,
}: AutomationCardProps) {
  const isEnabled = config?.enabled || false;
  const hasTemplate = !!config?.template?.trim();
  
  return (
    <Card>
      <BlockStack gap="400" data-testid={`automation-card-${triggerKey}`}>
        {/* Header */}
        <InlineStack align="space-between" blockAlign="center">
          <BlockStack gap="100">
            <Text variant="headingMd" as="h3">
              {title}
            </Text>
            <Text variant="bodyMd" tone="subdued" as="p">
              {description}
            </Text>
          </BlockStack>
          <InlineStack gap="200" align="end">
            <Badge tone={isEnabled ? 'success' : 'info'}>
              {isEnabled ? 'Active' : 'Inactive'}
            </Badge>
            <Button
              variant="primary"
              size="slim"
              onClick={() => onToggle(!isEnabled)}
              loading={isLoading}
              icon={isEnabled ? DisabledIcon : PlayIcon}
              data-testid={`toggle-${triggerKey}`}
            >
              {isEnabled ? 'Disable' : 'Enable'}
            </Button>
          </InlineStack>
        </InlineStack>

        {/* Metrics */}
        {metrics && (
          <Box>
            <Divider />
            <BlockStack gap="200">
              <Text variant="bodyMd" fontWeight="semibold" as="h4">
                Last {metrics.period || '7 days'}
              </Text>
              <InlineStack gap="400">
                {metrics.sent !== undefined && (
                  <InlineStack gap="100" align="center">
                    <Icon source={ViewIcon} />
                    <Text variant="bodySm" as="span">
                      {metrics.sent.toLocaleString()} sent
                    </Text>
                  </InlineStack>
                )}
                {metrics.delivered !== undefined && (
                  <InlineStack gap="100" align="center">
                    <Icon source={PlayIcon} />
                    <Text variant="bodySm" as="span">
                      {metrics.delivered.toLocaleString()} delivered
                    </Text>
                  </InlineStack>
                )}
                {metrics.ctr !== undefined && (
                  <InlineStack gap="100" align="center">
                    <Text variant="bodySm" as="span">
                      {metrics.ctr.toFixed(1)}% CTR
                    </Text>
                  </InlineStack>
                )}
              </InlineStack>
            </BlockStack>
          </Box>
        )}

        {/* Template Status */}
        <Box>
          <InlineStack gap="200" align="center">
            <Icon source={hasTemplate ? ViewIcon : EditIcon} />
            <Text variant="bodySm" as="span" tone={hasTemplate ? 'success' : 'critical'}>
              {hasTemplate ? 'Template configured' : 'No template set'}
            </Text>
          </InlineStack>
        </Box>

        {/* Actions */}
        <ButtonGroup>
          <Button
            variant="secondary"
            size="slim"
            onClick={onEditTemplate}
            icon={EditIcon}
            data-testid={`edit-template-${triggerKey}`}
          >
            Edit Template
          </Button>
          <Button
            variant="secondary"
            size="slim"
            onClick={onEditRules}
            data-testid={`edit-rules-${triggerKey}`}
          >
            Rules
          </Button>
          {onPreview && (
            <Button
              variant="tertiary"
              size="slim"
              onClick={onPreview}
              icon={ViewIcon}
              data-testid={`preview-${triggerKey}`}
            >
              Preview
            </Button>
          )}
          {onTest && (
            <Button
              variant="tertiary"
              size="slim"
              onClick={onTest}
              icon={PlayIcon}
              data-testid={`test-${triggerKey}`}
            >
              Test
            </Button>
          )}
        </ButtonGroup>

        {/* Configuration Summary */}
        {config && (
          <Box>
            <Divider />
            <BlockStack gap="200">
              <Text variant="bodyMd" fontWeight="semibold" as="h4">
                Configuration
              </Text>
              <InlineStack gap="400" wrap={false}>
                {config.delayMinutes && (
                  <Text variant="bodySm" as="span">
                    Delay: {config.delayMinutes}min
                  </Text>
                )}
                {config.rules?.quietHours && (
                  <Text variant="bodySm" as="span">
                    Quiet hours: {config.rules.quietHours.start}:00 - {config.rules.quietHours.end}:00
                  </Text>
                )}
                {config.rules?.frequencyCap && (
                  <Text variant="bodySm" as="span">
                    Cap: {config.rules.frequencyCap.max} per {config.rules.frequencyCap.per}
                  </Text>
                )}
              </InlineStack>
            </BlockStack>
          </Box>
        )}
      </BlockStack>
    </Card>
  );
}
