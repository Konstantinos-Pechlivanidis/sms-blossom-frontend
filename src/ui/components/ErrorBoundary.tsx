import React from 'react';
import { Page, Card, BlockStack, Text, Button, InlineStack } from '@shopify/polaris';
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
    return (
      <Page title="Something went wrong">
        <Card>
          <div style={{ padding: '16px' }}>
            <BlockStack gap="300">
              <Text as="p" tone="critical">
                An unexpected error occurred.
              </Text>
              <Text as="p" tone="subdued">
                {String(this.state.error?.message || '')}
              </Text>
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
