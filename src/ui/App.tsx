import { Toast } from '@shopify/polaris';
import { Outlet, useLocation } from 'react-router-dom';
import React from 'react';
import { AppFrame } from '../app/layout/AppFrame';
import DevBanner from './components/DevBanner';
import PerformanceDashboard from './components/PerformanceDashboard';
import { useShop } from '../lib/shopContext';
import { bus } from '../lib/events';
import { usePerformance } from '../lib/usePerformance';
import { apiClient } from '../lib/api/client';

// @cursor:start(app-component)
export default function App() {
  const [toast, setToast] = React.useState<{ active: boolean; content: string }>({
    active: false,
    content: '',
  });
  const [showPerformanceDashboard, setShowPerformanceDashboard] = React.useState(false);
  const location = useLocation();
  const { shop } = useShop();
  const { measureFunction } = usePerformance({ pageName: location.pathname });

  // Set shop in API client when available
  React.useEffect(() => {
    if (shop) {
      apiClient.setShop(shop);
    }
  }, [shop]);

  React.useEffect(() => {
    function onErr(e: any) {
      setToast({ active: true, content: e?.detail?.message || 'Request failed' });
    }
    bus.addEventListener('api-error', onErr as any);
    return () => bus.removeEventListener('api-error', onErr as any);
  }, []);

  // Measure page load time
  React.useEffect(() => {
    measureFunction('page_load', () => Promise.resolve());
  }, [location.pathname, measureFunction]);

  // Performance dashboard keyboard shortcut (Ctrl+Shift+P)
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        event.preventDefault();
        setShowPerformanceDashboard(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AppFrame>
      <DevBanner />
      <Outlet />
      {toast.active && (
        <Toast content={toast.content} onDismiss={() => setToast({ active: false, content: '' })} />
      )}
      <PerformanceDashboard 
        isOpen={showPerformanceDashboard} 
        onClose={() => setShowPerformanceDashboard(false)} 
      />
    </AppFrame>
  );
}
// @cursor:end(app-component)
