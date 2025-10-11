import React from 'react';
import { Card, Text, InlineStack, BlockStack } from '@shopify/polaris';

// @cursor:start(metric-card)
interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  description?: string;
  loading?: boolean;
}

export function MetricCard({
  label,
  value,
  trend,
  description,
  loading = false
}: MetricCardProps) {
  const getTrendColor = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return 'success';
      case 'down':
        return 'critical';
      case 'neutral':
      default:
        return 'subdued';
    }
  };

  const getTrendIcon = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return '↗';
      case 'down':
        return '↘';
      case 'neutral':
      default:
        return '→';
    }
  };

  return (
    <Card>
      <BlockStack gap="200">
        <Text variant="bodyMd" as="p" tone="subdued">
          {label}
        </Text>
        
        <InlineStack gap="200" align="start">
          <Text variant="heading2xl" as="h2">
            {loading ? '...' : value}
          </Text>
          
          {trend && !loading && (
            <InlineStack gap="100" align="center">
              <Text variant="bodyMd" as="span" tone={getTrendColor(trend.direction)}>
                {getTrendIcon(trend.direction)} {Math.abs(trend.value)}%
              </Text>
            </InlineStack>
          )}
        </InlineStack>
        
        {description && (
          <Text variant="bodySm" as="p" tone="subdued">
            {description}
          </Text>
        )}
      </BlockStack>
    </Card>
  );
}
// @cursor:end(metric-card)
