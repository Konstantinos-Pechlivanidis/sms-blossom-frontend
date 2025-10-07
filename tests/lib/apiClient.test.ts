import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient, handleApiError, RateLimitError } from '../../src/lib/apiClient';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock console methods
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('apiClient', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockConsoleError.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('successful requests', () => {
    it('should make successful API calls with correct headers', async () => {
      const mockResponse = { data: 'test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
        headers: new Map([['x-request-id', 'req-123']]),
      });

      const result = await apiClient.get('/test', { shop: 'test-shop.myshopify.com' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-session-token',
            'X-Shop-Domain': 'test-shop.myshopify.com',
            'Content-Type': 'application/json',
            'X-Request-ID': expect.any(String),
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle POST requests with body', async () => {
      const mockResponse = { id: 'new-item' };
      const requestBody = { name: 'Test Item' };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: () => Promise.resolve(mockResponse),
        headers: new Map(),
      });

      const result = await apiClient.post('/items', requestBody, { shop: 'test-shop.myshopify.com' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/items'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestBody),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('error handling', () => {
    it('should handle 401 unauthorized errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'invalid_token' }),
        headers: new Map(),
      });

      await expect(apiClient.get('/test', { shop: 'test-shop.myshopify.com' }))
        .rejects.toThrow('Authentication failed. Please refresh the page.');
    });

    it('should handle 404 unknown_shop errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'unknown_shop' }),
        headers: new Map(),
      });

      await expect(apiClient.get('/test', { shop: 'test-shop.myshopify.com' }))
        .rejects.toThrow('Shop is not recognized. Please reinstall the app.');
    });

    it('should handle 409 shop_not_installed with redirect', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: () => Promise.resolve({ 
          error: 'shop_not_installed',
          install_url: 'https://install.example.com'
        }),
        headers: new Map(),
      });

      // Mock window.location.href
      Object.defineProperty(window, 'location', {
        value: { href: '' },
        writable: true,
      });

      await expect(apiClient.get('/test', { shop: 'test-shop.myshopify.com' }))
        .rejects.toThrow('Redirecting to install URL');
    });

    it('should handle 422 validation errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: () => Promise.resolve({ 
          error: 'validation_error',
          details: 'Name is required'
        }),
        headers: new Map(),
      });

      await expect(apiClient.get('/test', { shop: 'test-shop.myshopify.com' }))
        .rejects.toThrow('Please check your input and try again.');
    });

    it('should handle 429 rate limiting with retry', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 429,
          json: () => Promise.resolve({ error: 'rate_limited' }),
          headers: new Map([['retry-after', '1']]),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ data: 'success' }),
          headers: new Map(),
        });

      const result = await apiClient.get('/test', { shop: 'test-shop.myshopify.com' });

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ data: 'success' });
    });

    it('should handle 5xx server errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'internal_error' }),
        headers: new Map(),
      });

      await expect(apiClient.get('/test', { shop: 'test-shop.myshopify.com' }))
        .rejects.toThrow('An internal error occurred. Please try again.');
    });
  });

  describe('retry logic', () => {
    it('should retry on rate limit with exponential backoff', async () => {
      const startTime = Date.now();
      
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 429,
          json: () => Promise.resolve({ error: 'rate_limited' }),
          headers: new Map([['retry-after', '0.1']]),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ data: 'success' }),
          headers: new Map(),
        });

      const result = await apiClient.get('/test', { shop: 'test-shop.myshopify.com' });

      const elapsed = Date.now() - startTime;
      expect(elapsed).toBeGreaterThanOrEqual(100); // At least 100ms delay
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ data: 'success' });
    });

    it('should fail after max retries', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 429,
        json: () => Promise.resolve({ error: 'rate_limited' }),
        headers: new Map([['retry-after', '0.01']]),
      });

      await expect(apiClient.get('/test', { shop: 'test-shop.myshopify.com' }))
        .rejects.toThrow('Too many requests. Please wait a moment and try again.');
    });
  });
});

describe('handleApiError', () => {
  it('should map known error codes to user messages', () => {
    const error = { error: 'invalid_phone' };
    expect(() => handleApiError(error, 422)).toThrow('Please enter a valid phone number.');
  });

  it('should handle unknown error codes', () => {
    const error = { error: 'unknown_error' };
    expect(() => handleApiError(error, 500)).toThrow('An unexpected error occurred. Please try again.');
  });

  it('should handle non-JSON error responses', () => {
    expect(() => handleApiError('Network error', 0)).toThrow('Network error. Please check your connection.');
  });
});

describe('RateLimitError', () => {
  it('should create rate limit error with retry after', () => {
    const error = new RateLimitError('Rate limited', 60);
    expect(error.message).toBe('Rate limited');
    expect(error.retryAfter).toBe(60);
    expect(error.name).toBe('RateLimitError');
  });
});
