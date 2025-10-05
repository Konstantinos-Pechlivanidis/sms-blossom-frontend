/**
 * Generated SDK lives in src/api/sdk (via npm run api:generate).
 * Wrap fetch to include Shopify session token automatically.
 */
import { getBearerToken } from '../lib/shopify';

export function withAuth<T extends (...args: any[]) => any>(fn: T, baseUrl: string) {
  return async (...args: any[]) => {
    const token = await getBearerToken();
    return fn(...args, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      baseUrl,
    });
  };
}
