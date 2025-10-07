import React, { useState } from 'react';
import { Button, Banner, InlineStack, Text, Spinner } from '@shopify/polaris';
import { useConnectivityCheck } from '../hooks';

interface ConnectivityCheckProps {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export default function ConnectivityCheck({ onSuccess, onError }: ConnectivityCheckProps) {
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const connectivityCheck = useConnectivityCheck();

  const handleCheck = async () => {
    try {
      const result = await connectivityCheck.mutateAsync();
      setLastCheck(new Date());
      onSuccess?.(result);
    } catch (error) {
      onError?.(error);
    }
  };

  const getStatusMessage = () => {
    if (connectivityCheck.isPending) {
      return 'Checking connectivity...';
    }
    
    if (connectivityCheck.isError) {
      return 'Connection failed. Please check your network and try again.';
    }
    
    if (connectivityCheck.isSuccess) {
      return 'Connection successful! All systems are operational.';
    }
    
    return 'Click to check connectivity';
  };

  const getStatusBanner = () => {
    if (connectivityCheck.isPending) {
      return null;
    }
    
    if (connectivityCheck.isError) {
      return (
        <Banner tone="critical">
          <Text variant="bodyMd" as="p">
            {getStatusMessage()}
          </Text>
        </Banner>
      );
    }
    
    if (connectivityCheck.isSuccess) {
      return (
        <Banner tone="success">
          <Text variant="bodyMd" as="p">
            {getStatusMessage()}
          </Text>
        </Banner>
      );
    }
    
    return null;
  };

  return (
    <div>
      <InlineStack gap="300" align="space-between">
        <div>
          <Text variant="bodyMd" fontWeight="semibold" as="span">
            Connectivity Check
          </Text>
          {lastCheck && (
            <Text variant="bodySm" tone="subdued" as="span">
              Last checked: {lastCheck.toLocaleTimeString()}
            </Text>
          )}
        </div>
        
        <Button
          onClick={handleCheck}
          loading={connectivityCheck.isPending}
          disabled={connectivityCheck.isPending}
        >
          {connectivityCheck.isPending ? 'Checking...' : 'Check Now'}
        </Button>
      </InlineStack>
      
      {getStatusBanner()}
    </div>
  );
}
