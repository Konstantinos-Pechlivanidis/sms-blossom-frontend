import React, { useState, useCallback } from 'react';
import { TopBar, ActionList, Popover, Button, Avatar } from '@shopify/polaris';
import { SettingsIcon, ExitIcon } from '@shopify/polaris-icons';
import { useShop } from '../../lib/shopContext';

// @cursor:start(user-menu)
interface UserMenuProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { shop } = useShop();

  const toggleUserMenu = useCallback(() => setIsUserMenuOpen((isUserMenuOpen) => !isUserMenuOpen), []);
  const closeUserMenu = useCallback(() => setIsUserMenuOpen(false), []);

  const handleLogout = useCallback(() => {
    // Implement logout logic
    console.log('Logout clicked');
    closeUserMenu();
  }, [closeUserMenu]);

  const handleSettings = useCallback(() => {
    // Navigate to settings
    window.location.href = '/settings';
    closeUserMenu();
  }, [closeUserMenu]);

  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={[
        {
          items: [
            {
              content: 'Settings',
              icon: SettingsIcon,
              onAction: handleSettings,
            },
            {
              content: 'Logout',
              icon: ExitIcon,
              onAction: handleLogout,
            },
          ],
        },
      ]}
      name={user?.name || 'User'}
      detail={user?.email || shop || 'SMS Blossom'}
      initials={user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
      avatar={user?.avatar}
      open={isUserMenuOpen}
      onToggle={toggleUserMenu}
    />
  );

  return userMenuMarkup;
}
// @cursor:end(user-menu)
