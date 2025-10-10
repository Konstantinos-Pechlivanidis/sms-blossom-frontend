import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { Spinner, Page } from '@shopify/polaris';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { validateEnvironment, getEnvironmentInfo } from './config/env';
import { AppProviders } from './app/providers/AppProviders';
import App from './ui/App';
import Dashboard from './ui/pages/Dashboard';
import Contacts from './ui/pages/Contacts';
import Discounts from './ui/pages/Discounts';
import Segments from './ui/pages/Segments';
import Settings from './ui/pages/Settings';
import Templates from './ui/pages/Templates';
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

// Validate environment configuration
try {
  const envValidation = validateEnvironment();
  if (!envValidation.valid) {
    console.warn('Environment validation failed:', envValidation.errors);
    // In development, show detailed error info
    if (import.meta.env.DEV) {
      console.warn('Environment info:', getEnvironmentInfo());
    }
  } else {
    console.log('Environment validation passed');
  }
} catch (error) {
  console.warn('Environment validation error:', error);
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
      { path: '/templates', element: <Templates /> },
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
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </React.StrictMode>
);
