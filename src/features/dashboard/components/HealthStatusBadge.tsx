import React from 'react';
import { Badge, Tooltip, InlineStack, Text } from '@shopify/polaris';
import { useSystemHealth } from '../hooks';

interface HealthStatusBadgeProps {
  showDetails?: boolean;
}

export default function HealthStatusBadge({ showDetails = false }: HealthStatusBadgeProps) {
  const { status, message, details, isLoading } = useSystemHealth();

  if (isLoading) {
    return <Badge tone="info">Checking...</Badge>;
  }

  const statusMap = {
    healthy: { tone: 'success' as const, children: 'Healthy' },
    unhealthy: { tone: 'critical' as const, children: 'Issues' },
    unknown: { tone: 'warning' as const, children: 'Unknown' },
  };

  const badgeProps = statusMap[status as keyof typeof statusMap];

  if (!showDetails) {
    return <Badge {...badgeProps} />;
  }

  const tooltipContent = details ? (
    <div style={{ padding: '8px' }}>
      <Text variant="bodyMd" fontWeight="semibold" as="p">System Health</Text>
      <div style={{ marginTop: '4px' }}>
        <Text variant="bodySm" as="span">Overall: {details.overall ? '✅' : '❌'}</Text>
        <br />
        <Text variant="bodySm" as="span">Database: {details.database?.ok ? '✅' : '❌'}</Text>
        <br />
        <Text variant="bodySm" as="span">Redis: {details.redis?.ok ? '✅' : '❌'}</Text>
        <br />
        <Text variant="bodySm" as="span">Queue: {details.queue?.ok ? '✅' : '❌'}</Text>
        {details.version && (
          <>
            <br />
            <Text variant="bodySm" as="span">Version: {details.version}</Text>
          </>
        )}
        {details.uptime && (
          <>
            <br />
            <Text variant="bodySm" as="span">Uptime: {details.uptime}</Text>
          </>
        )}
      </div>
    </div>
  ) : message;

  return (
    <Tooltip content={tooltipContent}>
      <Badge {...badgeProps} />
    </Tooltip>
  );
}
