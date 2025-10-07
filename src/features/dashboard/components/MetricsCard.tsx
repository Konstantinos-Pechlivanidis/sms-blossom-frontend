import React from 'react';
import { Card, Text, InlineStack, BlockStack, Badge } from '@shopify/polaris';

interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  status?: 'positive' | 'negative' | 'neutral';
  loading?: boolean;
  onClick?: () => void;
}

export default function MetricsCard({
  title,
  value,
  subtitle,
  trend,
  status = 'neutral',
  loading = false,
  onClick,
}: MetricsCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'positive':
        return 'success';
      case 'negative':
        return 'critical';
      default:
        return 'info';
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    switch (trend.direction) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      default:
        return '→';
    }
  };

  const getTrendColor = () => {
    if (!trend) return 'info';
    switch (trend.direction) {
      case 'up':
        return 'success';
      case 'down':
        return 'critical';
      default:
        return 'info';
    }
  };

  return (
    <Card>
      <BlockStack gap="200">
        <Text variant="bodyMd" tone="subdued" as="span">
          {title}
        </Text>
        
        {loading ? (
          <Text variant="heading2xl" tone="subdued" as="span">
            Loading...
          </Text>
        ) : (
          <InlineStack gap="200" align="space-between">
            <Text variant="heading2xl" fontWeight="bold" as="h2">
              {String(value)}
            </Text>
            
            {trend && (
              <Badge tone={getTrendColor()}>
                {`${getTrendIcon()} ${Math.abs(trend.value)}%`}
              </Badge>
            )}
          </InlineStack>
        )}
        
        {subtitle && (
          <Text variant="bodySm" as="p">
            {subtitle}
          </Text>
        )}
        
        {status !== 'neutral' && (
          <Badge tone={getStatusColor()}>
            {status === 'positive' ? 'Good' : status === 'negative' ? 'Needs Attention' : 'Neutral'}
          </Badge>
        )}
      </BlockStack>
    </Card>
  );
}
