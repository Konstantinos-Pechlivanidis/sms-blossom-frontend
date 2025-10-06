import { Frame, Navigation, Toast } from '@shopify/polaris';
import {
  HomeIcon,
  SettingsIcon,
  ViewIcon,
  DiscountIcon,
  PersonIcon,
  MentionIcon,
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
import ErrorBoundary from './components/ErrorBoundary';
import DevBanner from './components/DevBanner';
import { ShopProvider } from '../lib/shopContext';
import { bus } from '../lib/events';

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

  React.useEffect(() => {
    function onErr(e: any) {
      setToast({ active: true, content: e?.detail?.message || 'Request failed' });
    }
    bus.addEventListener('api-error', onErr as any);
    return () => bus.removeEventListener('api-error', onErr as any);
  }, []);

  return (
    <ShopProvider>
      <Frame
        navigation={
          <Navigation location="/">
            <NavLink to="/" label="Dashboard" icon={HomeIcon} />
            <NavLink to="/discounts" label="Discounts" icon={DiscountIcon} />
            <NavLink to="/segments" label="Segments" icon={PersonIcon} />
            <NavLink to="/campaigns" label="Campaigns" icon={MentionIcon} />
            <NavLink to="/reports" label="Reports" icon={ViewIcon} />
            <NavLink to="/settings" label="Settings" icon={SettingsIcon} />
          </Navigation>
        }
      >
        <DevBanner />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/discounts" element={<Discounts />} />
            <Route path="/segments" element={<Segments />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaigns/:id" element={<CampaignDetail />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<div style={{ padding: 16 }}>Not found</div>} />
          </Routes>
        </ErrorBoundary>
        {toast.active && (
          <Toast content={toast.content} onDismiss={() => setToast({ active: false, content: '' })} />
        )}
        <Outlet />
      </Frame>
    </ShopProvider>
  );
}
