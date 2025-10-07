import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCampaigns, useCreateCampaign, useCampaignEstimate } from '../../../src/features/campaigns/hooks';
import { server } from '../../msw/server';
import { http, HttpResponse } from 'msw';

// Mock the API client
vi.mock('../../../src/lib/apiClient', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('Campaign Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useCampaigns', () => {
    it('should fetch campaigns successfully', async () => {
      const mockCampaigns = {
        campaigns: [
          {
            id: 'camp_1',
            name: 'Welcome Series',
            status: 'active',
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-15T10:00:00Z',
            message_count: 3,
            sent_count: 1250,
            delivery_rate: 0.98,
          },
        ],
        total: 1,
        page: 1,
        per_page: 20,
      };

      server.use(
        http.get('*/api/campaigns', () => {
          return HttpResponse.json(mockCampaigns);
        })
      );

      const { result } = renderHook(() => useCampaigns({ shop: 'test-shop.myshopify.com' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCampaigns);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle campaign fetch errors', async () => {
      server.use(
        http.get('*/api/campaigns', () => {
          return HttpResponse.json(
            { error: 'shop_required' },
            { status: 400 }
          );
        })
      );

      const { result } = renderHook(() => useCampaigns({ shop: 'test-shop.myshopify.com' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });

  describe('useCreateCampaign', () => {
    it('should create campaign successfully', async () => {
      const newCampaign = {
        name: 'New Campaign',
        template_id: 'tpl_1',
        description: 'Test campaign',
      };

      const mockResponse = {
        id: 'camp_new',
        name: 'New Campaign',
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        message_count: 0,
        sent_count: 0,
        delivery_rate: 0,
      };

      server.use(
        http.post('*/api/campaigns', () => {
          return HttpResponse.json(mockResponse, { status: 201 });
        })
      );

      const { result } = renderHook(() => useCreateCampaign(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isIdle).toBe(true);
      });

      result.current.mutate(newCampaign);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
    });

    it('should handle campaign creation errors', async () => {
      const newCampaign = {
        name: '',
        template_id: '',
      };

      server.use(
        http.post('*/api/campaigns', () => {
          return HttpResponse.json(
            { error: 'validation_error', details: 'Name and template_id are required' },
            { status: 422 }
          );
        })
      );

      const { result } = renderHook(() => useCreateCampaign(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(newCampaign);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });

  describe('useCampaignEstimate', () => {
    it('should estimate campaign cost successfully', async () => {
      const estimateData = {
        campaign_id: 'camp_1',
        segment_id: 'seg_1',
      };

      const mockEstimate = {
        estimated_recipients: 1250,
        estimated_cost: 12.50,
        cost_per_message: 0.01,
        currency: 'USD',
      };

      server.use(
        http.post('*/api/campaigns/:id/estimate', () => {
          return HttpResponse.json(mockEstimate);
        })
      );

      const { result } = renderHook(() => useCampaignEstimate(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isIdle).toBe(true);
      });

      result.current.mutate(estimateData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockEstimate);
    });
  });
});
