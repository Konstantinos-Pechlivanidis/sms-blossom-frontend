// @cursor:start(appbridge-session-token)
import { getCurrentHost } from '../shopify/host';
import { getBearerToken } from '../shopify';

/**
 * Authorized fetch function that obtains a fresh session token per request
 * and attaches it as Authorization header for backend calls.
 * 
 * Note: Shopify session tokens expire after ~1 minute, so we NEVER cache them.
 * Each request gets a fresh token via App Bridge getSessionToken.
 */
export async function authorizedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  try {
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    
    // Ensure we have a valid host for App Bridge
    const host = getCurrentHost();
    if (!host) {
      throw new Error('App Bridge host parameter is required for authentication');
    }
    
    // Get fresh session token from App Bridge
    const sessionToken = await getBearerToken();
    if (sessionToken) {
      headers.set('Authorization', `Bearer ${sessionToken}`);
    }

    // Make the request with authorized headers
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle common auth errors
    if (response.status === 401) {
      throw new Error('Session expired. Please refresh the page.');
    }

    if (response.status === 403) {
      throw new Error('Insufficient permissions for this action.');
    }

    return response;
  } catch (error) {
    console.error('Authorized fetch error:', error);
    
    // Re-throw with more context
    if (error instanceof Error) {
      throw new Error(`Request failed: ${error.message}`);
    }
    
    throw new Error('Network request failed. Please check your connection.');
  }
}

/**
 * Helper to check if we're in a valid Shopify admin context
 */
export function isShopifyAdminContext(): boolean {
  return typeof window !== 'undefined' && 
         window.location.hostname.includes('myshopify.com') &&
         window.location.pathname.includes('/admin/apps/');
}
// @cursor:end(appbridge-auth)