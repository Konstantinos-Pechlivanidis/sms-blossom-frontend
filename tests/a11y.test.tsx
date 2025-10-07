import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';

// Import pages to test
import Dashboard from '../src/ui/pages/Dashboard';
import Contacts from '../src/ui/pages/Contacts';
import Campaigns from '../src/ui/pages/Campaigns';
import Discounts from '../src/ui/pages/Discounts';
import Reports from '../src/ui/pages/Reports';
import Settings from '../src/ui/pages/Settings';
import { AutomationsPage } from '../src/features/automations/AutomationsPage';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Test wrapper with all providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider i18n={enTranslations}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </AppProvider>
    </QueryClientProvider>
  );
};

// Helper function to render with providers
const renderWithProviders = (component: React.ReactElement) => {
  return render(component, { wrapper: TestWrapper });
};

describe('Accessibility Tests', () => {
  describe('Dashboard Page', () => {
    it('should not have accessibility violations', async () => {
      const { container } = renderWithProviders(<Dashboard />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Contacts Page', () => {
    it('should not have accessibility violations', async () => {
      const { container } = renderWithProviders(<Contacts />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Campaigns Page', () => {
    it('should not have accessibility violations', async () => {
      const { container } = renderWithProviders(<Campaigns />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Discounts Page', () => {
    it('should not have accessibility violations', async () => {
      const { container } = renderWithProviders(<Discounts />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Reports Page', () => {
    it('should not have accessibility violations', async () => {
      const { container } = renderWithProviders(<Reports />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Settings Page', () => {
    it('should not have accessibility violations', async () => {
      const { container } = renderWithProviders(<Settings />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Automations Page', () => {
    it('should not have accessibility violations', async () => {
      const { container } = renderWithProviders(<AutomationsPage />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
