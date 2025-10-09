import { Frame, Navigation, Toast } from '@shopify/polaris';
import {
  HomeIcon,
  SettingsIcon,
  ViewIcon,
  DiscountIcon,
  PersonIcon,
  MentionIcon,
  AutomationIcon,
  PersonIcon as CustomersIcon,
} from '@shopify/polaris-icons';
import { Outlet, useLocation } from 'react-router-dom';
import React from 'react';
import { ROUTES } from '../lib/nav';
import ErrorBoundary from './components/ErrorBoundary';
import DevBanner from './components/DevBanner';
import PerformanceDashboard from './components/PerformanceDashboard';
import { ShopProvider } from '../lib/shopContext';
import { bus } from '../lib/events';
import { usePerformance } from '../lib/usePerformance';

function NavLink({ to, label, icon }: { to: string; label: string; icon: any }) {
  const location = useLocation();
  const selected = location.pathname.startsWith(to);
  return <Navigation.Item url={to} label={label} icon={icon} selected={selected} />;
}

export default function App() {
  const [toast, setToast] = React.useState<{ active: boolean; content: string }>({
    active: false,
    content: '',
  });
  const [showPerformanceDashboard, setShowPerformanceDashboard] = React.useState(false);
  const location = useLocation();
  const { measureFunction } = usePerformance({ pageName: location.pathname });

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
    <ShopProvider>
      <Frame
        navigation={
          <Navigation location="/">
            <NavLink to={ROUTES.DASHBOARD} label="Dashboard" icon={HomeIcon} />
            <NavLink to={ROUTES.CONTACTS} label="Contacts" icon={CustomersIcon} />
            <NavLink to={ROUTES.DISCOUNTS} label="Discounts" icon={DiscountIcon} />
            <NavLink to={ROUTES.SEGMENTS} label="Segments" icon={PersonIcon} />
            <NavLink to={ROUTES.CAMPAIGNS} label="Campaigns" icon={MentionIcon} />
            <NavLink to={ROUTES.AUTOMATIONS} label="Automations" icon={AutomationIcon} />
            <NavLink to={ROUTES.REPORTS} label="Reports" icon={ViewIcon} />
            <NavLink to={ROUTES.SETTINGS} label="Settings" icon={SettingsIcon} />
          </Navigation>
        }
      >
        <DevBanner />
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
        {toast.active && (
          <Toast content={toast.content} onDismiss={() => setToast({ active: false, content: '' })} />
        )}
        <PerformanceDashboard 
          isOpen={showPerformanceDashboard} 
          onClose={() => setShowPerformanceDashboard(false)} 
        />
        <Outlet />
      </Frame>
    </ShopProvider>
  );
}
