import React, { Component, ReactNode } from 'react';
import { Banner, Page, Button, Text } from '@shopify/polaris';

// @cursor:start(error-boundary)
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // In development, show detailed error info
    if (import.meta.env.DEV) {
      console.error('Error details:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Page>
        <Banner
          title="Something went wrong"
          tone="critical"
          action={{
            content: 'Try again',
            onAction: this.handleRetry,
          }}
        >
            <Text as="p">
              {this.state.error?.message || 'An unexpected error occurred. Please try refreshing the page.'}
            </Text>
            {import.meta.env.DEV && this.state.error?.stack && (
              <details style={{ marginTop: '1rem' }}>
                <summary>Error details (development only)</summary>
                <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </Banner>
        </Page>
      );
    }

    return this.props.children;
  }
}
// @cursor:end(error-boundary)
