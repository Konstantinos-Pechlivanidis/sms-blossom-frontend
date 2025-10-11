// tests/router.spec.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ShopProvider } from '../src/lib/shopContext';
import { AutomationsPage } from '../src/features/automations/AutomationsPage';
import { describe, it, expect } from 'vitest';
import React from 'react';

const queryClient = new QueryClient();

describe('Router Tests', () => {
  it('should render automations page at /automations route', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/automations']}>
          <ShopProvider>
            <Routes>
              <Route path="/automations" element={<AutomationsPage />} />
            </Routes>
          </ShopProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    // AutomationsPage should have some content
    expect(screen.getByText(/Automations/i)).toBeInTheDocument();
  });
});
