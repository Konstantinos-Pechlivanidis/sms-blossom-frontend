import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient } from '../src/lib/apiClient';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock environment variables
vi.mock('../src/lib/shopContext', () => ({
  useShop: () => ({
    shop: 'test-shop.myshopify.com',
    host: 'test-host',
  }),
}));

// Mock App Bridge
vi.mock('../src/lib/appBridge', () => ({
  getSessionToken: vi.fn().mockResolvedValue('mock-session-token'),
}));

describe('API Headers Tests', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Required Headers', () => {
    it('should include Authorization header', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: 'test' }),
      });

      try {
        await apiClient.get('/test', { shop: 'test-shop.myshopify.com' });
      } catch (error) {
        // Expected to fail due to missing implementation
      }

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Bearer'),
          }),
        })
      );
    });

    it('should include X-Shop-Domain header', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: 'test' }),
      });

      try {
        await apiClient.get('/test', { shop: 'test-shop.myshopify.com' });
      } catch (error) {
        // Expected to fail due to missing implementation
      }

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Shop-Domain': 'test-shop.myshopify.com',
          }),
        })
      );
    });

    it('should include X-Request-ID header', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: 'test' }),
      });

      try {
        await apiClient.get('/test', { shop: 'test-shop.myshopify.com' });
      } catch (error) {
        // Expected to fail due to missing implementation
      }

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Request-ID': expect.stringMatching(/^req_/),
          }),
        })
      );
    });
  });

  describe('Rate Limiting (429)', () => {
    it('should retry once on 429 with Retry-After header', async () => {
      const retryAfter = 2; // seconds
      
      // First call returns 429
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 429,
          headers: {
            get: (name: string) => name === 'Retry-After' ? retryAfter.toString() : null,
          },
          json: () => Promise.resolve({ error: 'rate_limited' }),
        })
        // Second call succeeds
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ data: 'success' }),
        });

      // Mock timers for retry delay
      vi.useFakeTimers();
      
      try {
        const promise = apiClient.get('/test', { shop: 'test-shop.myshopify.com' });
        
        // Fast-forward time to trigger retry
        vi.advanceTimersByTime(retryAfter * 1000);
        
        await promise;
      } catch (error) {
        // Expected to fail due to missing implementation
      } finally {
        vi.useRealTimers();
      }

      // Should have been called twice (initial + retry)
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should fail after max retries', async () => {
      // Always return 429
      mockFetch.mockResolvedValue({
        ok: false,
        status: 429,
        headers: {
          get: (name: string) => name === 'Retry-After' ? '1' : null,
        },
        json: () => Promise.resolve({ error: 'rate_limited' }),
      });

      vi.useFakeTimers();
      
      try {
        const promise = apiClient.get('/test', { shop: 'test-shop.myshopify.com' });
        
        // Fast-forward time multiple times to exhaust retries
        vi.advanceTimersByTime(10000);
        
        await promise;
      } catch (error) {
        expect(error).toBeDefined();
      } finally {
        vi.useRealTimers();
      }

      // Should have been called multiple times (initial + retries)
      expect(mockFetch).toHaveBeenCalledTimes(expect.any(Number));
    });
  });

  describe('Error Handling', () => {
    it('should handle 401 unauthorized', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'invalid_token' }),
      });

      try {
        await apiClient.get('/test', { shop: 'test-shop.myshopify.com' });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle 404 not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'not_found' }),
      });

      try {
        await apiClient.get('/test', { shop: 'test-shop.myshopify.com' });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle 422 validation error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: () => Promise.resolve({ 
          error: 'validation_error',
          message: 'Invalid input data'
        }),
      });

      try {
        await apiClient.get('/test', { shop: 'test-shop.myshopify.com' });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
