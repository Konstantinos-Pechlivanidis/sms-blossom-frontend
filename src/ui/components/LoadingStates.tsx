import React from 'react';
import {
  Card,
  Spinner,
  Text,
  InlineStack,
  BlockStack,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  Layout,
} from '@shopify/polaris';

// Generic loading spinner
export function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <Card>
      <InlineStack align="center" gap="300">
        <Spinner size="small" />
        <Text as="span" tone="subdued">{message}</Text>
      </InlineStack>
    </Card>
  );
}

// Page loading skeleton
export function PageLoadingSkeleton() {
  return (
    <SkeletonPage
      primaryAction
    >
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={3} />
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={2} />
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );
}

// Table loading skeleton
export function TableLoadingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Card>
      <BlockStack gap="400">
        <SkeletonDisplayText size="small" />
        {Array.from({ length: rows }).map((_, index) => (
          <InlineStack key={index} gap="400" align="space-between">
            <SkeletonBodyText lines={1} />
            <SkeletonBodyText lines={1} />
            <SkeletonBodyText lines={1} />
          </InlineStack>
        ))}
      </BlockStack>
    </Card>
  );
}

// Card loading skeleton
export function CardLoadingSkeleton() {
  return (
    <Card>
      <BlockStack gap="400">
        <SkeletonDisplayText size="small" />
        <SkeletonBodyText lines={2} />
        <InlineStack gap="200">
          <SkeletonBodyText lines={1} />
          <SkeletonBodyText lines={1} />
        </InlineStack>
      </BlockStack>
    </Card>
  );
}

// Dashboard metrics loading
export function MetricsLoadingSkeleton() {
  return (
    <Layout>
      <Layout.Section variant="oneThird">
        <Card>
          <BlockStack gap="300">
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={1} />
          </BlockStack>
        </Card>
      </Layout.Section>
      <Layout.Section variant="oneThird">
        <Card>
          <BlockStack gap="300">
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={1} />
          </BlockStack>
        </Card>
      </Layout.Section>
      <Layout.Section variant="oneThird">
        <Card>
          <BlockStack gap="300">
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={1} />
          </BlockStack>
        </Card>
      </Layout.Section>
    </Layout>
  );
}

// Form loading skeleton
export function FormLoadingSkeleton() {
  return (
    <Card>
      <BlockStack gap="400">
        <SkeletonDisplayText size="small" />
        <SkeletonBodyText lines={1} />
        <SkeletonBodyText lines={1} />
        <SkeletonBodyText lines={1} />
        <InlineStack gap="200">
          <SkeletonBodyText lines={1} />
          <SkeletonBodyText lines={1} />
        </InlineStack>
      </BlockStack>
    </Card>
  );
}

// Button loading state
export function LoadingButton({ 
  loading, 
  children, 
  ...props 
}: { 
  loading: boolean; 
  children: React.ReactNode; 
  [key: string]: any;
}) {
  return (
    <button {...props} disabled={loading || props.disabled}>
      {loading ? (
        <InlineStack gap="200" align="center">
          <Spinner size="small" />
          <span>Loading...</span>
        </InlineStack>
      ) : (
        children
      )}
    </button>
  );
}

// Loading overlay
export function LoadingOverlay({ 
  loading, 
  children 
}: { 
  loading: boolean; 
  children: React.ReactNode;
}) {
  if (!loading) return <>{children}</>;

  return (
    <div style={{ position: 'relative' }}>
      {children}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
      >
        <InlineStack align="center" gap="300">
          <Spinner size="small" />
          <Text as="span" tone="subdued">Loading...</Text>
        </InlineStack>
      </div>
    </div>
  );
}

// Loading state hook
export function useLoadingState(initialState = false) {
  const [loading, setLoading] = React.useState(initialState);

  const startLoading = React.useCallback(() => setLoading(true), []);
  const stopLoading = React.useCallback(() => setLoading(false), []);
  const toggleLoading = React.useCallback(() => setLoading(prev => !prev), []);

  return {
    loading,
    startLoading,
    stopLoading,
    toggleLoading,
    setLoading,
  };
}
