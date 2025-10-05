import { getBearerToken } from './shopify';
import { emitApiError } from './events';
export const API_BASE = String(import.meta.env?.VITE_BACKEND_URL || '').replace(/\/+$/, '');
export async function apiFetch(path, init = {}) {
    const token = await getBearerToken();
    const headers = new Headers(init.headers || {});
    headers.set('Authorization', `Bearer ${token}`);
    headers.set('Content-Type', 'application/json');
    const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
    const res = await fetch(url, { ...init, headers, credentials: 'include' });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        const msg = `API ${res.status}: ${text || res.statusText}`;
        emitApiError(msg);
        throw new Error(msg);
    }
    return (await res.json());
}
