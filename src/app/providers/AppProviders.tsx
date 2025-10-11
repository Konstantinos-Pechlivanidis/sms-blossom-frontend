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

  // Call ensureHostParam() before initializing App Bridge / rendering app shell
  const host = ensureHostParam();
  
  // If it returns null, render a Polaris Banner
  if (!host) {
    return (
      <PolarisThemeProvider>
        <Page>
          <Banner
            tone="critical"
            title="Open this app from Shopify Admin"
          >
            <p>
              Open this app from Shopify Admin so we can receive the host parameter.
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

// @cursor:start(appbridge-session-token)
export async function authorizedFetch(input: RequestInfo, init: RequestInit = {}) {
  // Build an App Bridge client using apiKey + current host
  const { getAppBridge } = await import('../../lib/shopify');
  const { getCurrentHost } = await import('../../lib/shopify/host');
  
  const host = getCurrentHost();
  if (!host) {
    throw new Error('Host parameter is required for App Bridge session token');
  }
  
  // For EVERY request, fetch a fresh session token via App Bridge getSessionToken
  const appBridge = getAppBridge();
  const sessionToken = await appBridge.getSessionToken();
  
  const headers = new Headers(init.headers || {});
  headers.set('Authorization', `Bearer ${sessionToken}`);
  
  return fetch(input, { ...init, headers });
}
// @cursor:end(appbridge-session-token)
// @cursor:end(app-providers)
