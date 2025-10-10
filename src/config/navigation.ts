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

// @cursor:start(navigation-config)
export interface NavigationItem {
  url: string;
  label: string;
  icon: any;
  badge?: string;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    url: '/',
    label: 'Dashboard',
    icon: HomeIcon,
  },
  {
    url: '/contacts',
    label: 'Contacts',
    icon: CustomersIcon,
  },
  {
    url: '/discounts',
    label: 'Discounts',
    icon: DiscountIcon,
  },
  {
    url: '/segments',
    label: 'Segments',
    icon: PersonIcon,
  },
  {
    url: '/templates',
    label: 'Templates',
    icon: MentionIcon,
  },
  {
    url: '/campaigns',
    label: 'Campaigns',
    icon: MentionIcon,
  },
  {
    url: '/automations',
    label: 'Automations',
    icon: AutomationIcon,
  },
  {
    url: '/reports',
    label: 'Reports',
    icon: ViewIcon,
  },
  {
    url: '/settings',
    label: 'Settings',
    icon: SettingsIcon,
  },
];

export const APP_NAME = 'SMS Blossom';
// @cursor:end(navigation-config)
