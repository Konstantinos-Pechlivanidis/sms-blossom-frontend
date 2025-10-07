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
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import React from 'react';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Discounts from './pages/Discounts';
import Segments from './pages/Segments';
import Campaigns from './pages/Campaigns';
import CampaignDetail from './pages/CampaignDetail';
import Reports from './pages/Reports';
import Contacts from './pages/Contacts';
import { AutomationsPage } from '../features/automations/AutomationsPage';
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
            <NavLink to="/" label="Dashboard" icon={HomeIcon} />
            <NavLink to="/contacts" label="Contacts" icon={CustomersIcon} />
            <NavLink to="/discounts" label="Discounts" icon={DiscountIcon} />
            <NavLink to="/segments" label="Segments" icon={PersonIcon} />
            <NavLink to="/campaigns" label="Campaigns" icon={MentionIcon} />
            <NavLink to="/automations" label="Automations" icon={AutomationIcon} />
            <NavLink to="/reports" label="Reports" icon={ViewIcon} />
            <NavLink to="/settings" label="Settings" icon={SettingsIcon} />
          </Navigation>
        }
      >
        <DevBanner />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/discounts" element={<Discounts />} />
            <Route path="/segments" element={<Segments />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaigns/:id" element={<CampaignDetail />} />
            <Route path="/automations" element={<AutomationsPage />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<div style={{ padding: 16 }}>Not found</div>} />
          </Routes>
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
