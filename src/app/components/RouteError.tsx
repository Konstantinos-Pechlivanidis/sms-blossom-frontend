import React from 'react';
import { useRouteError } from 'react-router-dom';
import { Page, Banner, Button, BlockStack, Text } from '@shopify/polaris';
import { HomeIcon } from '@shopify/polaris-icons';
import { useNavigateWithHost } from '../../lib/navigation/useNavigateWithHost';

// @cursor:start(router-error-element)
export function RouteError() {
  const error = useRouteError() as any;
  const navigateWithHost = useNavigateWithHost();

  const handleGoHome = () => {
    navigateWithHost('/');
  };

  return (
    <Page title="Something went wrong">
      <Banner tone="critical" title={error?.statusText || 'Unexpected error'}>
        <BlockStack gap="300">
          <Text as="p">
            {error?.message || 'Please try again.'}
          </Text>
          <Button 
            icon={HomeIcon}
            onClick={handleGoHome}
          >
            Go to Dashboard
          </Button>
        </BlockStack>
      </Banner>
    </Page>
  );
}
// @cursor:end(router-error-element)
