import React from 'react';
import { Badge, Tooltip, InlineStack, Text } from '@shopify/polaris';
import { useSystemHealth } from '../hooks';

interface HealthStatusBadgeProps {
  showDetails?: boolean;
}

export default function HealthStatusBadge({ showDetails = false }: HealthStatusBadgeProps) {
  const { status, message, details, isLoading } = useSystemHealth();

  if (isLoading) {
    return <Badge tone="info" aria-live="polite">Checking…</Badge>;
  }

  const map = {
    healthy: { tone: 'success' as const, label: 'Healthy' },
    unhealthy: { tone: 'critical' as const, label: 'Issues' },
    unknown: { tone: 'warning' as const, label: 'Unknown' },
  };

  const badge = map[(status as keyof typeof map) || 'unknown'];

  if (!showDetails) {
    return <Badge tone={badge.tone} aria-live="polite">{badge.label}</Badge>;
  }

  const tooltipContent = (
    <div style={{ padding: 8, maxWidth: 280 }}>
      <Text variant="headingSm" as="p">System health</Text>
      <div style={{ marginTop: 6 }}>
        <Text as="p" variant="bodySm">Overall: {details?.overall ? '✅' : '❌'}</Text>
        <Text as="p" variant="bodySm">Database: {details?.database?.ok ? '✅' : '❌'}</Text>
        <Text as="p" variant="bodySm">Redis: {details?.redis?.ok ? '✅' : '❌'}</Text>
        <Text as="p" variant="bodySm">Queue: {details?.queue?.ok ? '✅' : '❌'}</Text>
        {details?.version && <Text as="p" variant="bodySm">Version: {details.version}</Text>}
        {details?.uptime && <Text as="p" variant="bodySm">Uptime: {details.uptime}</Text>}
        {message && (
          <div style={{ marginTop: 4 }}>
            <Text as="p" variant="bodySm" tone="subdued">{message}</Text>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Tooltip content={tooltipContent}>
      <Badge tone={badge.tone} aria-live="polite">{badge.label}</Badge>
    </Tooltip>
  );
}
