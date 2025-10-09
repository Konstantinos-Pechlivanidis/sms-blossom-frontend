import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from '@shopify/polaris';
import { ShopProvider } from '../src/lib/shopContext';
import App from '../src/ui/App';

// Test wrapper
const TestWrapper = ({ children, initialEntries = ['/'] }: { 
  children: React.ReactNode; 
  initialEntries?: string[];
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <MemoryRouter initialEntries={initialEntries}>
      <AppProvider i18n={{}}>
        <QueryClientProvider client={queryClient}>
          <ShopProvider>
            {children}
          </ShopProvider>
        </QueryClientProvider>
      </AppProvider>
    </MemoryRouter>
  );
};

describe('Routing Tests', () => {
  describe('Route Rendering', () => {
    it('should render dashboard at root path', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );
      
      // Check for navigation items that should be present
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('should render campaigns page', () => {
      render(
        <TestWrapper initialEntries={['/campaigns']}>
          <App />
        </TestWrapper>
      );
      
      expect(screen.getByText('Campaigns')).toBeInTheDocument();
    });

    it('should render reports page', () => {
      render(
        <TestWrapper initialEntries={['/reports']}>
          <App />
        </TestWrapper>
      );
      
      expect(screen.getByText('Reports')).toBeInTheDocument();
    });

    it('should render automations page', () => {
      render(
        <TestWrapper initialEntries={['/automations']}>
          <App />
        </TestWrapper>
      );
      
      expect(screen.getByText('Automations')).toBeInTheDocument();
    });

    it('should render settings page', () => {
      render(
        <TestWrapper initialEntries={['/settings']}>
          <App />
        </TestWrapper>
      );
      
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });
  });

  describe('404 Handling', () => {
    it('should render 404 page for unknown routes', () => {
      render(
        <TestWrapper initialEntries={['/unknown-route']}>
          <App />
        </TestWrapper>
      );
      
      expect(screen.getByText('Page not found')).toBeInTheDocument();
    });
  });

  describe('Base Path Handling', () => {
    it('should respect base path configuration', () => {
      // Mock environment variable
      const originalBasePath = import.meta.env.VITE_BASE_PATH;
      (import.meta.env as any).VITE_BASE_PATH = '/app';
      
      render(
        <TestWrapper initialEntries={['/app/dashboard']}>
          <App />
        </TestWrapper>
      );
      
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      
      // Restore original value
      (import.meta.env as any).VITE_BASE_PATH = originalBasePath;
    });
  });

  describe('Navigation', () => {
    it('should have proper navigation structure', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );
      
      // Check for main navigation items
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Campaigns')).toBeInTheDocument();
      expect(screen.getByText('Reports')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });
  });
});