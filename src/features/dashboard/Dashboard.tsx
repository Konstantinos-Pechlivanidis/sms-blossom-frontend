import React, { useMemo, useState } from 'react';
import { Button, Banner, InlineStack, Text, Spinner, Box } from '@shopify/polaris';
import { useConnectivityCheck } from './hooks';

interface ConnectivityCheckProps {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export default function ConnectivityCheck({ onSuccess, onError }: ConnectivityCheckProps) {
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const connectivity = useConnectivityCheck();

  const statusText = useMemo(() => {
    if (connectivity.isPending) return 'Checking connectivity...';
    if (connectivity.isError) return 'Connection failed. Please verify your network and try again.';
    if (connectivity.isSuccess) return 'Connection successful! All systems are operational.';
    return 'Click to check connectivity.';
  }, [connectivity.isPending, connectivity.isError, connectivity.isSuccess]);

  const handleCheck = async () => {
    try {
      const result = await connectivity.mutateAsync();
      setLastCheck(new Date());
      onSuccess?.(result);
    } catch (e) {
      onError?.(e);
    }
  };

  const tone = connectivity.isError ? 'critical' : connectivity.isSuccess ? 'success' : 'info';

  const meta = connectivity.data?.meta || connectivity.data || {};
  const extra =
    meta && (meta.endpoint || meta.latencyMs)
      ? `Endpoint: ${meta.endpoint ?? '—'} • Latency: ${meta.latencyMs ?? '—'}ms`
      : undefined;

  return (
    <Box padding="300">
      <InlineStack align="space-between" blockAlign="center">
        <InlineStack gap="200" blockAlign="center">
          <Text variant="bodyMd" fontWeight="semibold" as="span">
            Connectivity Check
          </Text>
          {lastCheck && (
            <Text variant="bodySm" tone="subdued" as="span">
              Last checked: {lastCheck.toLocaleTimeString()}
            </Text>
          )}
        </InlineStack>

        <Button onClick={handleCheck} loading={connectivity.isPending} disabled={connectivity.isPending}>
          {connectivity.isPending ? 'Checking…' : 'Check now'}
        </Button>
      </InlineStack>

      <Box paddingBlockStart="200">
        <Banner tone={tone as any} title={statusText}>
          {extra && <Text as="p">{extra}</Text>}
        </Banner>
      </Box>
    </Box>
  );
}
