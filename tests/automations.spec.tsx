import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from '@shopify/polaris';
import { ShopProvider } from '../src/lib/shopContext';
import { AutomationsPage } from '../src/features/automations/AutomationsPage';

// Mock API responses
const mockAutomations = {
  abandoned: {
    enabled: true,
    delayMinutes: 30,
  },
  orderPaid: {
    enabled: true,
    delayMinutes: 0,
  },
  fulfillmentUpdate: {
    enabled: false,
    delayMinutes: 0,
  },
  welcome: {
    enabled: true,
    delayMinutes: 0,
  },
  backInStock: {
    enabled: false,
    delayMinutes: 0,
  },
};

const mockSettings = {
  timezone: 'America/New_York',
  quietHours: {
    enabled: true,
    start: 22,
    end: 8,
  },
  frequencyCap: {
    enabled: true,
    windowHours: 24,
    maxPerWindow: 1,
  },
  featureFlags: {
    AUTOMATIONS_ENABLED: true,
    REPORTS_ENABLED: true,
  },
};

// Mock API client
vi.mock('../src/lib/apiClient', () => ({
  enhancedApiClient: {
    getAutomations: vi.fn().mockResolvedValue(mockAutomations),
    updateAutomations: vi.fn().mockResolvedValue({ success: true }),
    previewTemplate: vi.fn().mockResolvedValue({ 
      rendered: 'Hello John! Your order #1234 is ready!',
      variables: ['customer_name', 'order_number']
    }),
    validateTemplate: vi.fn().mockResolvedValue({ 
      valid: true,
      errors: []
    }),
  },
}));

// Test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <AppProvider i18n={{}}>
      <QueryClientProvider client={queryClient}>
        <ShopProvider>
          {children}
        </ShopProvider>
      </QueryClientProvider>
    </AppProvider>
  );
};

describe('Automations Tests', () => {
  describe('GET Automations', () => {
    it('should load automations on mount', async () => {
      render(
        <TestWrapper>
          <AutomationsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Automations')).toBeInTheDocument();
      });

      // Check that automation toggles are rendered
      expect(screen.getByText('Abandoned Cart')).toBeInTheDocument();
      expect(screen.getByText('Order Paid')).toBeInTheDocument();
      expect(screen.getByText('Welcome Message')).toBeInTheDocument();
    });

    it('should display current automation settings', async () => {
      render(
        <TestWrapper>
          <AutomationsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        // Check that settings are displayed
        expect(screen.getByText('Quiet Hours')).toBeInTheDocument();
        expect(screen.getByText('Frequency Cap')).toBeInTheDocument();
      });
    });
  });

  describe('PUT Automations', () => {
    it('should update automation settings', async () => {
      render(
        <TestWrapper>
          <AutomationsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Automations')).toBeInTheDocument();
      });

      // Find and click a toggle
      const toggle = screen.getByRole('switch', { name: /abandoned cart/i });
      fireEvent.click(toggle);

      // Should show success message or update UI
      await waitFor(() => {
        expect(screen.getByText(/saved/i)).toBeInTheDocument();
      });
    });

    it('should handle validation errors', async () => {
      // Mock validation error
      vi.mocked(require('../src/lib/apiClient').enhancedApiClient.updateAutomations)
        .mockRejectedValueOnce({
          status: 422,
          response: {
            error: 'validation_error',
            message: 'Invalid delay minutes',
          },
        });

      render(
        <TestWrapper>
          <AutomationsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Automations')).toBeInTheDocument();
      });

      // Try to update with invalid data
      const delayInput = screen.getByLabelText(/delay/i);
      fireEvent.change(delayInput, { target: { value: '-1' } });

      const saveButton = screen.getByText(/save/i);
      fireEvent.click(saveButton);

      // Should show validation error
      await waitFor(() => {
        expect(screen.getByText(/invalid delay/i)).toBeInTheDocument();
      });
    });
  });

  describe('Template Preview', () => {
    it('should preview template with variables', async () => {
      render(
        <TestWrapper>
          <AutomationsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Automations')).toBeInTheDocument();
      });

      // Find preview button
      const previewButton = screen.getByText(/preview/i);
      fireEvent.click(previewButton);

      // Should show preview modal or section
      await waitFor(() => {
        expect(screen.getByText(/Hello John! Your order #1234 is ready!/)).toBeInTheDocument();
      });
    });
  });

  describe('Optimistic Updates', () => {
    it('should show optimistic update and rollback on error', async () => {
      render(
        <TestWrapper>
          <AutomationsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Automations')).toBeInTheDocument();
      });

      // Mock network error after optimistic update
      vi.mocked(require('../src/lib/apiClient').enhancedApiClient.updateAutomations)
        .mockRejectedValueOnce(new Error('Network error'));

      const toggle = screen.getByRole('switch', { name: /abandoned cart/i });
      const initialState = toggle.getAttribute('aria-checked');

      fireEvent.click(toggle);

      // Should immediately show optimistic update
      expect(toggle.getAttribute('aria-checked')).not.toBe(initialState);

      // Wait for error and rollback
      await waitFor(() => {
        expect(toggle.getAttribute('aria-checked')).toBe(initialState);
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });
  });

  describe('Feature Flags', () => {
    it('should respect AUTOMATIONS_ENABLED flag', async () => {
      // Mock disabled feature flag
      vi.mocked(require('../src/lib/featureFlags').getFeatureFlags)
        .mockReturnValue({
          AUTOMATIONS_ENABLED: false,
          REPORTS_ENABLED: true,
          CAMPAIGNS_ENABLED: true,
          DISCOUNTS_ENABLED: true,
          SEGMENTS_ENABLED: true,
          CONTACTS_ENABLED: true,
          TEMPLATES_ENABLED: true,
        });

      render(
        <TestWrapper>
          <AutomationsPage />
        </TestWrapper>
      );

      // Should show disabled message or redirect
      expect(screen.getByText(/feature disabled/i)).toBeInTheDocument();
    });
  });
});
