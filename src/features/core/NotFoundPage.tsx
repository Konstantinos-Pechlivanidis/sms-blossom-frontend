import React from 'react';
import { Page, EmptyState, Button, BlockStack, Text } from '@shopify/polaris';
import { HomeIcon } from '@shopify/polaris-icons';
import { useNavigateWithHost } from '../../lib/navigation/useNavigateWithHost';

export default function NotFoundPage() {
  const navigateWithHost = useNavigateWithHost();

  const handleBackToDashboard = () => {
    navigateWithHost('/');
  };

  return (
    <Page>
      <EmptyState
        heading="Page not found"
        image="https://cdn.shopify.com/shopifycloud/web/assets/v1/empty-state-illustration.svg"
        action={{
          content: 'Back to Dashboard',
          onAction: handleBackToDashboard,
          icon: HomeIcon,
        }}
      >
        <BlockStack gap="300">
          <Text as="p" tone="subdued">
            The page you're looking for doesn't exist or has been moved.
          </Text>
          <Text as="p" tone="subdued">
            Check the URL or return to the dashboard to continue.
          </Text>
        </BlockStack>
      </EmptyState>
    </Page>
  );
}

