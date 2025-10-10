import { OpenAPI } from './core/OpenAPI';
import { env } from '../../config/env';
import { useShop } from '../shopContext';

// @cursor:start(api-client)
// Configure the OpenAPI client
OpenAPI.BASE = env.VITE_BACKEND_URL;
OpenAPI.WITH_CREDENTIALS = true;

// Authentication helper
export function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Try to get session token from App Bridge
  if (typeof window !== 'undefined' && (window as any).shopify?.sessionToken) {
    headers['Authorization'] = `Bearer ${(window as any).shopify.sessionToken}`;
  }

  return headers;
}

// API client wrapper with authentication
export class ApiClient {
  private static instance: ApiClient;
  private shop: string = '';

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  setShop(shop: string) {
    this.shop = shop;
  }

  getShop(): string {
    return this.shop;
  }

  // Helper to add shop parameter to requests
  addShopParams(params: Record<string, any> = {}): Record<string, any> {
    if (this.shop) {
      return { ...params, shop: this.shop };
    }
    return params;
  }

  // Helper to get authenticated headers
  getHeaders(): Record<string, string> {
    return getAuthHeaders();
  }
}

// Global API client instance
export const apiClient = ApiClient.getInstance();

// Error handling
export interface APIError {
  code: string;
  message: string;
  details?: any;
}

export function handleApiError(error: any): APIError {
  if (error?.body?.error) {
    return {
      code: error.body.error,
      message: error.body.message || 'API Error',
      details: error.body.details,
    };
  }
  
  if (error?.message) {
    return {
      code: 'network_error',
      message: error.message,
    };
  }

  return {
    code: 'unknown_error',
    message: 'An unexpected error occurred',
  };
}
// @cursor:end(api-client)
