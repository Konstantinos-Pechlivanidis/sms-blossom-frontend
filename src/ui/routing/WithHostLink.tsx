// @cursor:start(appbridge-host)
import { Link, LinkProps } from 'react-router-dom';
import { getCurrentHost } from '../../lib/shopify/host';

/**
 * Link component that preserves the host parameter for App Bridge
 */
export function WithHostLink({ to, ...props }: LinkProps) {
  const host = getCurrentHost();
  
  // If we have a host, append it to the URL
  if (host && typeof to === 'string') {
    const url = new URL(to, window.location.origin);
    url.searchParams.set('host', host);
    return <Link {...props} to={url.pathname + url.search} />;
  }
  
  return <Link {...props} to={to} />;
}

/**
 * Hook to get a URL with host parameter preserved
 */
export function useHostLink(to: string): string {
  const host = getCurrentHost();
  
  if (host) {
    const url = new URL(to, window.location.origin);
    url.searchParams.set('host', host);
    return url.pathname + url.search;
  }
  
  return to;
}
// @cursor:end(appbridge-host)
