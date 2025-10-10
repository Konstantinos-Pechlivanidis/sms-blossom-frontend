// tests/boot.spec.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ShopProvider } from '../src/lib/shopContext';
import App from '../src/ui/App';
import Dashboard from '../src/ui/pages/Dashboard';
import { describe, it, expect } from 'vitest';
import React from 'react';

const queryClient = new QueryClient();

describe('Boot Integrity Tests', () => {
  it('should render App with visible content', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/']}>
          <ShopProvider>
            <App />
          </ShopProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Should have navigation items
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Contacts')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should render Dashboard at root route', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/']}>
          <ShopProvider>
            <Dashboard />
          </ShopProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Dashboard should have some content
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });
});
