import React, { useState, useCallback, useEffect } from 'react';
import { TopBar, Icon, Badge, Popover, ActionList, Text } from '@shopify/polaris';
import { NotificationIcon } from '@shopify/polaris-icons';

// @cursor:start(notifications-bell)
interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export function NotificationsBell() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Campaign Sent',
      message: 'Your "Black Friday Sale" campaign has been sent to 1,250 customers.',
      timestamp: '2 minutes ago',
      read: false,
    },
    {
      id: '2',
      title: 'Low Credits',
      message: 'Your account balance is running low. Consider adding more credits.',
      timestamp: '1 hour ago',
      read: true,
    },
  ]);

  // TODO: Check for custom SVG icons with non-20×20 viewBox
  useEffect(() => {
    if (typeof window !== 'undefined' && import.meta.env.DEV) {
      console.warn('TODO: Check custom SVG icons for 20×20 viewBox compliance');
    }
  }, []);

  const toggleNotifications = useCallback(() => setIsNotificationsOpen((isOpen) => !isOpen), []);
  const closeNotifications = useCallback(() => setIsNotificationsOpen(false), []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const notificationItems = notifications.map((notification) => ({
    content: `${notification.title}: ${notification.message} (${notification.timestamp})`,
    onAction: () => {
      console.log('Notification clicked:', notification.id);
      closeNotifications();
    },
  }));

  return (
    <TopBar.Menu
      activatorContent={
        <div style={{ position: 'relative' }}>
          <Icon source={NotificationIcon} />
          {unreadCount > 0 && (
            <Badge tone="critical" size="small">
              {unreadCount.toString()}
            </Badge>
          )}
        </div>
      }
      open={isNotificationsOpen}
      onOpen={toggleNotifications}
      onClose={closeNotifications}
      actions={[
        {
          items: notificationItems,
        },
      ]}
    />
  );
}
// @cursor:end(notifications-bell)
