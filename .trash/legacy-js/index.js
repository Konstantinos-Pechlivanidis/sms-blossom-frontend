/**
 * Generated SDK lives in src/api/sdk (via npm run api:generate).
 * Wrap fetch to include Shopify session token automatically.
 */
import { getBearerToken } from '../lib/shopify';
export function withAuth(fn, baseUrl) {
    return async (...args) => {
        const token = await getBearerToken();
        return fn(...args, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            baseUrl,
        });
    };
}
