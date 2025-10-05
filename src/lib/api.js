import { getBearerToken } from './shopify';
import { emitApiError } from './events';
const API_BASE = __BACKEND_URL__;
export async function apiFetch(path, init = {}) {
    const token = await getBearerToken();
    const headers = new Headers(init.headers || {});
    headers.set('Authorization', `Bearer ${token}`);
    headers.set('Content-Type', 'application/json');
    const res = await fetch(`${API_BASE}${path}`, { ...init, headers, credentials: 'include' });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        const msg = `API ${res.status}: ${text || res.statusText}`;
        emitApiError(msg);
        throw new Error(msg);
    }
    return (await res.json());
}
