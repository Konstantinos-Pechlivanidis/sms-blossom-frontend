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

// @cursor:start(appbridge-token-wrapper)
export async function authorizedFetch(input: RequestInfo, init: RequestInit = {}) {
  // Get fresh session token from App Bridge
  const { getBearerToken } = await import('../../lib/shopify');
  const token = await getBearerToken();
  
  const headers = new Headers(init.headers || {});
  headers.set('Authorization', `Bearer ${token}`);
  
  return fetch(input, { ...init, headers });
}
// @cursor:end(appbridge-token-wrapper)
// @cursor:end(app-providers)
