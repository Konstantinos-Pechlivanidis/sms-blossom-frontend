import React from 'react';
import { Page, Card, BlockStack, Text, Button, InlineStack, Banner } from '@shopify/polaris';
import { logError } from '../../lib/telemetry';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: any };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, info: any) {
    console.error('ErrorBoundary', error, info);
    
    // Log to telemetry
    logError(error, {
      componentStack: info.componentStack,
      errorBoundary: true,
    });
  }
  render() {
    if (!this.state.hasError) return this.props.children;
    
    // Generate a request ID for this error
    const requestId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <Page title="Something went wrong">
        <Card>
          <div style={{ padding: '16px' }}>
            <BlockStack gap="300">
              <Banner tone="critical" title="An unexpected error occurred">
                <Text as="p" tone="subdued">
                  {String(this.state.error?.message || 'Unknown error')}
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  Request ID: {requestId}
                </Text>
              </Banner>
              <InlineStack gap="200">
                <Button onClick={() => this.setState({ hasError: false, error: undefined })}>
                  Try again
                </Button>
                <Button onClick={() => location.reload()} variant="secondary">
                  Reload page
                </Button>
              </InlineStack>
            </BlockStack>
          </div>
        </Card>
      </Page>
    );
  }
}
