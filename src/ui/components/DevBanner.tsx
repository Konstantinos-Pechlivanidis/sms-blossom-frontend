import React, { useState, useEffect } from 'react';
import { Banner, Button, InlineStack, Text, Collapsible } from '@shopify/polaris';
import { apiFetch } from '../../lib/api';
import { useShop } from '../../lib/shopContext';
import { getBearerToken } from '../../lib/shopify';

interface HealthStatus {
  status: string;
  db?: boolean;
  queue?: string;
}

interface WhoAmIResponse {
  shop: string;
  token_present: boolean;
  headers: Record<string, string>;
}

export default function DevBanner() {
  const { shop, host, isReady } = useShop();
  const [isExpanded, setIsExpanded] = useState(false);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [whoAmI, setWhoAmI] = useState<WhoAmIResponse | null>(null);
  const [tokenPresent, setTokenPresent] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || '';

  useEffect(() => {
    if (!isReady) return;

    // Check if session token is present
    getBearerToken()
      .then(() => setTokenPresent(true))
      .catch(() => setTokenPresent(false));

    // Test /health endpoint
    apiFetch<HealthStatus>('/health')
      .then(setHealthStatus)
      .catch(() => setHealthStatus({ status: 'error' }));
  }, [isReady]);

  const handleWhoAmI = async () => {
    setIsLoading(true);
    try {
      const result = await apiFetch<WhoAmIResponse>('/__debug/whoami');
      setWhoAmI(result);
    } catch (error) {
      console.error('WhoAmI failed:', error);
      setWhoAmI({ shop: 'error', token_present: false, headers: {} });
    } finally {
      setIsLoading(false);
    }
  };

  // Only show in development
  if (!import.meta.env.DEV) return null;

  return (
    <Banner
      title="Development Diagnostics"
      action={{
        content: isExpanded ? 'Hide Details' : 'Show Details',
        onAction: () => setIsExpanded(!isExpanded),
      }}
    >
      <div style={{ marginBottom: '8px' }}>
        <Text variant="bodyMd" as="p">
          <strong>Shop:</strong> {shop || 'Not detected'} |{' '}
          <strong>Host:</strong> {host || 'Not detected'} |{' '}
          <strong>Backend:</strong> {backendUrl} |{' '}
          <strong>Token:</strong> {tokenPresent === null ? 'Checking...' : tokenPresent ? '✓' : '✗'} |{' '}
          <strong>Health:</strong> {healthStatus?.status || 'Unknown'}
        </Text>
      </div>

      <Collapsible open={isExpanded} id="dev-details">
        <div style={{ padding: '8px 0' }}>
          <InlineStack gap="200">
            <Button size="slim" onClick={handleWhoAmI} loading={isLoading}>
              Debug: whoami
            </Button>
          </InlineStack>

          {whoAmI && (
            <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f6f6f7', borderRadius: '4px' }}>
              <Text variant="bodyMd" as="p">
                <strong>WhoAmI Response:</strong>
              </Text>
              <pre style={{ fontSize: '12px', margin: '4px 0' }}>
                {JSON.stringify(whoAmI, null, 2)}
              </pre>
            </div>
          )}

          {healthStatus && (
            <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f6f6f7', borderRadius: '4px' }}>
              <Text variant="bodyMd" as="p">
                <strong>Health Response:</strong>
              </Text>
              <pre style={{ fontSize: '12px', margin: '4px 0' }}>
                {JSON.stringify(healthStatus, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </Collapsible>
    </Banner>
  );
}
