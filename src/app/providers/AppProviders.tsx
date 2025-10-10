import React, { ReactNode } from 'react';
import { AppProvider as PolarisProvider } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { PolarisThemeProvider } from '../../ui/PolarisThemeProvider';
import { env } from '../../config/env';

// @cursor:start(app-providers)
interface AppProvidersProps {
  children: ReactNode;
}

// Create a new QueryClient instance with optimized settings
const queryClient = new QueryClient({
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
});

// App Bridge is handled by Shopify CLI, no need for React provider
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <PolarisProvider 
      i18n={{}}
    >
      <PolarisThemeProvider>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </QueryClientProvider>
      </PolarisThemeProvider>
    </PolarisProvider>
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
