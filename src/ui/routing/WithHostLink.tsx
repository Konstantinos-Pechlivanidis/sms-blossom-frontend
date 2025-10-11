// @cursor:start(with-host-link)
import { Link, LinkProps } from 'react-router-dom';
import { loadPersistedHost } from '../../lib/shopify/host';

/**
 * Link component that preserves the host parameter for App Bridge
 */
export function WithHostLink({ to, ...props }: LinkProps) {
  const host = loadPersistedHost();
  
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
  const host = loadPersistedHost();
  
  if (host) {
    const url = new URL(to, window.location.origin);
    url.searchParams.set('host', host);
    return url.pathname + url.search;
  }
  
  return to;
}

/**
 * Helper function for programmatic navigation with host preservation
 */
export function navigateWithHost(navigate: (path: string) => void, path: string) {
  const host = loadPersistedHost();
  
  if (host) {
    const url = new URL(path, window.location.origin);
    url.searchParams.set('host', host);
    navigate(url.pathname + url.search);
  } else {
    navigate(path);
  }
}
// @cursor:end(with-host-link)
