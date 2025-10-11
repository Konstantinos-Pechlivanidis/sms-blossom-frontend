import React from 'react';
import { Card, Text, InlineStack, BlockStack, Badge, Box } from '@shopify/polaris';

interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; direction: 'up' | 'down' | 'neutral' };
  status?: 'positive' | 'negative' | 'neutral';
  loading?: boolean;
  onClick?: () => void; // makes the card pressable if provided
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
  const statusTone = status === 'positive' ? 'success' : status === 'negative' ? 'critical' : 'info';

  const trendIcon =
    !trend ? null : trend.direction === 'up' ? '↗️' : trend.direction === 'down' ? '↘️' : '→';

  const trendTone =
    !trend ? 'info' : trend.direction === 'up' ? 'success' : trend.direction === 'down' ? 'critical' : 'info';

  const pressable = Boolean(onClick);

  return (
    <Card>
      <Box padding="300" borderRadius="300">
        {/* Put interactivity on a div, not on Box */}
        <div
          role={pressable ? 'button' : undefined}
          tabIndex={pressable ? 0 : undefined}
          onClick={onClick}
          onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
            if (!pressable) return;
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick?.();
            }
          }}
          style={pressable ? { cursor: 'pointer', outline: 'none' } : undefined}
        >
          <BlockStack gap="200">
            <Text variant="bodySm" tone="subdued" as="span">
              {title}
            </Text>

            {loading ? (
              <Text variant="heading2xl" tone="subdued" as="span">
                Loading…
              </Text>
            ) : (
              <InlineStack align="space-between" blockAlign="center">
                <Text variant="heading2xl" fontWeight="bold" as="h2">
                  {String(value)}
                </Text>
                {trend && (
                  <Badge tone={trendTone as any}>{`${trendIcon} ${Math.abs(trend.value)}%`}</Badge>
                )}
              </InlineStack>
            )}

            {subtitle && (
              <Text variant="bodySm" as="p">
                {subtitle}
              </Text>
            )}

            {status !== 'neutral' && (
              <Badge tone={statusTone as any}>
                {status === 'positive' ? 'Good' : status === 'negative' ? 'Needs attention' : 'Neutral'}
              </Badge>
            )}
          </BlockStack>
        </div>
      </Box>
    </Card>
  );
}
