import { emitApiError } from './events';
import { inferShopDomainFromHostParam } from './shop';
import { getBearerToken } from './shopify';

export const API_BASE: string = String((import.meta as any).env?.VITE_BACKEND_URL || '').replace(/\/+$/, '');

function needsShop(path: string) {
  // Endpoints that do NOT require shop
  const skip = [/^\/health\b/, /^\/openapi\b/i, /^\/docs\b/i, /^\/swagger\b/i, /^\/__debug\b/i];
  return !skip.some((rx) => rx.test(path));
}

function appendShop(path: string, shop?: string): string {
  if (!needsShop(path)) return path;
  if (/\bshop=/.test(path)) return path;
  const shopDomain = shop || inferShopDomainFromHostParam();
  if (!shopDomain) return path; // last resort: backend may infer by token
  return path.includes('?') ? `${path}&shop=${encodeURIComponent(shopDomain)}` : `${path}?shop=${encodeURIComponent(shopDomain)}`;
}

export async function apiFetch<T>(path: string, init: RequestInit & { shop?: string } = {}): Promise<T> {
  const token = await getBearerToken();
  const headers = new Headers(init.headers || {});
  headers.set('Authorization', `Bearer ${token}`);
  headers.set('Content-Type', 'application/json');
  
  // Add X-Shop-Domain header for backend shop resolution
  const shopDomain = init.shop || inferShopDomainFromHostParam();
  if (shopDomain) {
    headers.set('X-Shop-Domain', shopDomain);
  }
  
  const finalPath = appendShop(path, shopDomain);
  
  if (import.meta.env.DEV) {
    try {
      const q = finalPath.split('?')[1] || '';
      const s = new URLSearchParams(q).get('shop');
      console.debug('[apiFetch] shop=', s, 'path=', finalPath, 'headers=', {
        'X-Shop-Domain': shopDomain,
        'Authorization': token ? 'Bearer ***' : 'none'
      });
    } catch { /* ignore */ }
  }
  
  const res = await fetch(`${API_BASE}${finalPath}`, { ...init, headers, credentials: 'include' });
  
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    let errorData;
    try {
      errorData = JSON.parse(text);
    } catch {
      errorData = { error: text || res.statusText };
    }
    
    // Handle specific error cases
    if (res.status === 409 && errorData.error === 'shop_not_installed' && errorData.install_url) {
      // Redirect to install URL
      window.location.href = errorData.install_url;
      return Promise.reject(new Error('Redirecting to install URL'));
    }
    
    if (res.status === 404 && errorData.error === 'unknown_shop') {
      const msg = `Shop is not recognized by the backend. Please (re)install the app. Detected shop: ${shopDomain || 'unknown'}`;
      emitApiError(msg);
      throw new Error(msg);
    }
    
    const msg = `API ${res.status}: ${text || res.statusText}`;
    emitApiError(msg);
    throw new Error(msg);
  }
  
  return (await res.json()) as T;
}
