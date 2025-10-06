import { emitApiError } from './events';
import { inferShopDomainFromHostParam } from './shop';
import { getBearerToken } from './shopify';

export const API_BASE: string = String((import.meta as any).env?.VITE_BACKEND_URL || '').replace(/\/+$/, '');

function needsShop(path: string) {
  // Endpoints that do NOT require shop
  const skip = [/^\/health\b/, /^\/openapi\b/i, /^\/docs\b/i, /^\/swagger\b/i];
  return !skip.some((rx) => rx.test(path));
}

function appendShop(path: string): string {
  if (!needsShop(path)) return path;
  if (/\bshop=/.test(path)) return path;
  const shop = inferShopDomainFromHostParam();
  if (!shop) return path; // last resort: backend may infer by token
  return path.includes('?') ? `${path}&shop=${encodeURIComponent(shop)}` : `${path}?shop=${encodeURIComponent(shop)}`;
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getBearerToken();
  const headers = new Headers(init.headers || {});
  headers.set('Authorization', `Bearer ${token}`);
  headers.set('Content-Type', 'application/json');
  const finalPath = appendShop(path);
  if (import.meta.env.DEV) {
    try {
      const q = finalPath.split('?')[1] || '';
      const s = new URLSearchParams(q).get('shop');
      console.debug('[apiFetch] shop=', s, 'path=', finalPath);
    } catch { /* ignore */ }
  }
  const res = await fetch(`${API_BASE}${finalPath}`, { ...init, headers, credentials: 'include' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const msg = `API ${res.status}: ${text || res.statusText}`;
    emitApiError(msg);
    throw new Error(msg);
  }
  return (await res.json()) as T;
}
