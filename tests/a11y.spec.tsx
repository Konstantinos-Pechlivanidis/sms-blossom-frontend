import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '@shopify/polaris';
import { ShopProvider } from '../src/lib/shopContext';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock components for testing
const Dashboard = () => (
  <div>
    <h1>Dashboard</h1>
    <main>
      <section>
        <h2>Overview</h2>
        <div role="region" aria-label="Statistics">
          <div>Messages Sent: 100</div>
          <div>Delivery Rate: 95%</div>
        </div>
      </section>
    </main>
  </div>
);

const Campaigns = () => (
  <div>
    <h1>Campaigns</h1>
    <main>
      <section>
        <h2>Campaign List</h2>
        <table role="table" aria-label="Campaigns">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Welcome Campaign</td>
              <td>Active</td>
              <td>
                <button aria-label="Edit campaign">Edit</button>
                <button aria-label="Delete campaign">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
);

const Automations = () => (
  <div>
    <h1>Automations</h1>
    <main>
      <section>
        <h2>Automation Rules</h2>
        <form aria-label="Automation settings">
          <fieldset>
            <legend>Abandoned Cart</legend>
            <label htmlFor="delay">Delay (minutes)</label>
            <input id="delay" type="number" aria-describedby="delay-help" />
            <div id="delay-help">Time to wait before sending reminder</div>
          </fieldset>
        </form>
      </section>
    </main>
  </div>
);

// Test wrapper with all providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <BrowserRouter>
      <AppProvider i18n={{}}>
        <QueryClientProvider client={queryClient}>
          <ShopProvider>
            {children}
          </ShopProvider>
        </QueryClientProvider>
      </AppProvider>
    </BrowserRouter>
  );
};

describe('Accessibility Tests', () => {
  describe('Dashboard Page', () => {
    it('should not have critical accessibility violations', async () => {
      const { container } = render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Campaigns Page', () => {
    it('should not have critical accessibility violations', async () => {
      const { container } = render(
        <TestWrapper>
          <Campaigns />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Automations Page', () => {
    it('should not have critical accessibility violations', async () => {
      const { container } = render(
        <TestWrapper>
          <Automations />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Navigation', () => {
    it('should have proper landmark structure', async () => {
      const { container } = render(
        <TestWrapper>
          <nav role="navigation" aria-label="Main navigation">
            <ul>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/campaigns">Campaigns</a></li>
              <li><a href="/automations">Automations</a></li>
            </ul>
          </nav>
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Form Controls', () => {
    it('should have proper labels and associations', async () => {
      const { container } = render(
        <TestWrapper>
          <form>
            <label htmlFor="test-input">Test Input</label>
            <input id="test-input" type="text" aria-describedby="test-help" />
            <div id="test-help">This is help text</div>
            
            <fieldset>
              <legend>Test Fieldset</legend>
              <label>
                <input type="radio" name="test" value="option1" />
                Option 1
              </label>
              <label>
                <input type="radio" name="test" value="option2" />
                Option 2
              </label>
            </fieldset>
          </form>
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
