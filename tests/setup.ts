import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { server } from './msw/server';
import React from 'react';

// Mock Shopify App Bridge
const mockAppBridge = {
  createApp: vi.fn(() => ({
    getSessionToken: vi.fn(() => Promise.resolve('mock-session-token')),
    getState: vi.fn(() => ({ shop: 'test-shop.myshopify.com', host: 'test-host' })),
  })),
};

vi.mock('@shopify/app-bridge', () => mockAppBridge);

// Mock Polaris components that might cause issues in tests
vi.mock('@shopify/polaris', async () => {
  const actual = await vi.importActual('@shopify/polaris');
  return {
    ...actual,
    // Mock complex components that might not work well in jsdom
    IndexTable: ({ children, ...props }: any) => {
      return React.createElement('div', { 'data-testid': 'index-table', ...props }, children);
    },
    DataTable: ({ children, ...props }: any) => {
      return React.createElement('div', { 'data-testid': 'data-table', ...props }, children);
    },
  };
});

// Setup MSW
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_BASE_URL: 'https://sms-blossom-api.onrender.com',
    VITE_SHOPIFY_API_KEY: 'test-api-key',
    DEV: true,
  },
  writable: true,
});

// Mock fetch globally
global.fetch = vi.fn();
