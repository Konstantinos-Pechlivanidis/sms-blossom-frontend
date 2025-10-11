import { PolarisThemeProvider } from '../../ui/PolarisThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useMemo } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ensureHostParam } from '../../lib/shopify/host';
import { Banner, Page } from '@shopify/polaris';

// @cursor:start(app-providers)
export function AppProviders({ children }: { children: ReactNode }) {
  const qc = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 30 * 1000, // 30 seconds
      },
      mutations: {
        retry: 0,
      },
    },
  }), []);

  // Ensure host parameter is present for App Bridge
  const host = ensureHostParam();
  
  // If no host, show recovery UI
  if (!host) {
    return (
      <PolarisThemeProvider>
        <Page>
          <Banner
            tone="critical"
            title="App must be opened from Shopify Admin"
          >
            <p>
              This app must be accessed through the Shopify Admin interface. 
              Please go to your Shopify Admin → Apps → SMS Blossom to use this application.
            </p>
          </Banner>
        </Page>
      </PolarisThemeProvider>
    );
  }
  
  return (
    <PolarisThemeProvider>
      <QueryClientProvider client={qc}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </QueryClientProvider>
    </PolarisThemeProvider>
  );
}

// @cursor:start(authorized-fetch)
export function authorizedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers);
  
  // Try to get session token from App Bridge
  if (typeof window !== 'undefined' && (window as any).shopify?.sessionToken) {
    headers.set('Authorization', `Bearer ${(window as any).shopify.sessionToken}`);
  }
  
  // Add default headers
  headers.set('Content-Type', 'application/json');
  
  return fetch(url, {
    ...options,
    headers,
  });
}
// @cursor:end(authorized-fetch)
// @cursor:end(app-providers)
