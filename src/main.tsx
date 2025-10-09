import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider as PolarisProvider, Spinner, Page } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/query';
import App from './ui/App';
import Dashboard from './ui/pages/Dashboard';
import Contacts from './ui/pages/Contacts';
import Discounts from './ui/pages/Discounts';
import Segments from './ui/pages/Segments';
import Settings from './ui/pages/Settings';
import NotFoundPage from './features/core/NotFoundPage';

// Lazy load heavy routes for better performance
const Campaigns = lazy(() => import('./ui/pages/Campaigns'));
const CampaignDetail = lazy(() => import('./ui/pages/CampaignDetail'));
const Reports = lazy(() => import('./ui/pages/Reports'));
const AutomationsPage = lazy(() => import('./features/automations/AutomationsPage').then(module => ({ default: module.AutomationsPage })));

// Loading component for lazy routes
const RouteLoader = () => (
  <Page>
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <Spinner size="large" />
    </div>
  </Page>
);
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/contacts', element: <Contacts /> },
      { path: '/discounts', element: <Discounts /> },
      { path: '/segments', element: <Segments /> },
      { 
        path: '/campaigns', 
        element: (
          <Suspense fallback={<RouteLoader />}>
            <Campaigns />
          </Suspense>
        )
      },
      { 
        path: '/campaigns/:id', 
        element: (
          <Suspense fallback={<RouteLoader />}>
            <CampaignDetail />
          </Suspense>
        )
      },
      { 
        path: '/automations', 
        element: (
          <Suspense fallback={<RouteLoader />}>
            <AutomationsPage />
          </Suspense>
        )
      },
      { 
        path: '/reports', 
        element: (
          <Suspense fallback={<RouteLoader />}>
            <Reports />
          </Suspense>
        )
      },
      { path: '/settings', element: <Settings /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
], {
  basename: import.meta.env.VITE_BASE_PATH || undefined,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PolarisProvider i18n={{}}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </PolarisProvider>
  </React.StrictMode>
);
