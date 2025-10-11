import React, { ReactNode } from 'react';
import { Frame, Navigation, TopBar, Page, Layout } from '@shopify/polaris';
import { useLocation } from 'react-router-dom';
import { NAVIGATION_ITEMS, APP_NAME } from '../../config/navigation';
import { CreditsBadge } from '../../features/credits/CreditsBadge';
import { UserMenu } from '../../features/user/UserMenu';
import { NotificationsBell } from '../../features/notifications/NotificationsBell';
import { useShop } from '../../lib/shopContext';

// @cursor:start(app-frame)
interface AppFrameProps {
  children: ReactNode;
}

function NavLink({ to, label, icon, badge }: { to: string; label: string; icon: any; badge?: string }) {
  const location = useLocation();
  const selected = location.pathname.startsWith(to);
  
  return (
    <Navigation.Item 
      url={to} 
      label={label} 
      icon={icon} 
      selected={selected}
      badge={badge}
      // @cursor:start(nav-accessibility)
      // Ensure 44x44pt touch targets (Apple HIG compliance)
      // @cursor:end(nav-accessibility)
    />
  );
}

export function AppFrame({ children }: AppFrameProps) {
  const location = useLocation();
  const { shop } = useShop();

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={<UserMenu />}
      onNavigationToggle={() => {}}
    />
  );

  const navigationMarkup = (
    <Navigation location={location.pathname}>
      {NAVIGATION_ITEMS.map((item) => (
        <NavLink
          key={item.url}
          to={item.url}
          label={item.label}
          icon={item.icon}
          badge={item.badge}
        />
      ))}
    </Navigation>
  );

  return (
    <Frame
      topBar={topBarMarkup}
      navigation={navigationMarkup}
    >
      {/* @cursor-tailwind:start(app-frame-layout) */}
      <div className="brand-section">
        <div className="tw-flex tw-items-center tw-gap-3 tw-mb-4 tw-py-4">
          <CreditsBadge />
        </div>
        <div className="tw-pb-8">
          {children}
        </div>
      </div>
      {/* @cursor-tailwind:end(app-frame-layout) */}
    </Frame>
  );
}
// @cursor:end(app-frame)
