import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider as PolarisProvider } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/query';
import App from './ui/App';
import { validateEnvironment, getEnvironmentInfo } from './config/env';

// Validate environment configuration
const envValidation = validateEnvironment();
if (!envValidation.valid) {
  console.error('Environment validation failed:', envValidation.errors);
  // In development, show detailed error info
  if (import.meta.env.DEV) {
    console.error('Environment info:', getEnvironmentInfo());
  }
}

const router = createBrowserRouter([{ path: '/*', element: <App /> }]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PolarisProvider i18n={{}}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </PolarisProvider>
  </React.StrictMode>
);
