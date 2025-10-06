/**
 * Robustly infer the shop domain (e.g. "store-name.myshopify.com") from:
 * 1) ?shop=... if valid
 * 2) ?host=... base64url ("<domain>/admin" or full URL)
 * 3) App Bridge state (if exposed)
 * 4) window.top location (?shop=...) if accessible
 * 5) localStorage('lastShopDomain')
 */
function isMyshopifyDomain(d?: string | null): d is string {
  if (!d) return false;
  const s = d.trim().toLowerCase();
  // must be like foo-bar-123.myshopify.com, not admin.myshopify.com
  return /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(s) && s !== 'admin.myshopify.com';
}

function decodeHost(hostParam: string): string | null {
  try {
    // Convert base64url to base64 and decode
    let b64 = hostParam.replace(/-/g, '+').replace(/_/g, '/');
    const pad = b64.length % 4;
    if (pad) b64 += '='.repeat(4 - pad);
    const decoded = atob(b64); // e.g. "store.myshopify.com/admin" or "https://store.myshopify.com/admin"
    // Extract hostname
    if (decoded.startsWith('http://') || decoded.startsWith('https://')) {
      const u = new URL(decoded);
      return u.hostname;
    }
    const first = decoded.split('/')[0]; // "<domain>"
    return first || null;
  } catch {
    return null;
  }
}

export function inferShopDomainFromHostParam(): string {
  // 1) query param ?shop=...
  const qs = new URLSearchParams(window.location.search);
  const shopQ = qs.get('shop');
  if (isMyshopifyDomain(shopQ)) {
    const s = shopQ!.toLowerCase();
    try { localStorage.setItem('lastShopDomain', s); } catch {}
    return s;
  }

  // 2) decode ?host=...
  const host = qs.get('host');
  const fromHost = host ? decodeHost(host) : null;
  if (isMyshopifyDomain(fromHost)) {
    const s = fromHost!.toLowerCase();
    try { localStorage.setItem('lastShopDomain', s); } catch {}
    return s;
  }

  // 3) App Bridge state (if available globally)
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const abShop = (window as any)?.appBridge?.getState?.()?.context?.shopify?.shop?.myshopifyDomain;
    if (isMyshopifyDomain(abShop)) {
      const s = abShop.toLowerCase();
      try { localStorage.setItem('lastShopDomain', s); } catch {}
      return s;
    }
  } catch {}

  // 4) window.top fallback (if accessible)
  try {
    const topQs = new URLSearchParams(window.top?.location.search || '');
    const topShop = topQs.get('shop');
    if (isMyshopifyDomain(topShop)) {
      const s = topShop!.toLowerCase();
      try { localStorage.setItem('lastShopDomain', s); } catch {}
      return s;
    }
  } catch {}

  // 5) cached
  try {
    const cached = localStorage.getItem('lastShopDomain');
    if (isMyshopifyDomain(cached)) return cached!.toLowerCase();
  } catch {}

  // last resort: empty (apiFetch will skip appending &shop=)
  return '';
}