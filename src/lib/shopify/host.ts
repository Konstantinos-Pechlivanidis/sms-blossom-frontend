// @cursor:start(appbridge-host)
/**
 * App Bridge host parameter management
 * Handles reading, persisting, and recovering the host parameter for embedded apps
 */

export function getHostFromLocation(): string | null {
  const url = new URL(window.location.href);
  return url.searchParams.get('host');
}

export function persistHost(host: string): void {
  try {
    sessionStorage.setItem('shopify:host', host);
  } catch (error) {
    console.warn('Failed to persist host:', error);
  }
}

export function loadPersistedHost(): string | null {
  try {
    return sessionStorage.getItem('shopify:host');
  } catch (error) {
    console.warn('Failed to load persisted host:', error);
    return null;
  }
}

export function ensureHostParam(): string | null {
  // 1. Check if host is in URL
  const urlHost = getHostFromLocation();
  if (urlHost) {
    persistHost(urlHost);
    return urlHost;
  }

  // 2. Check if we have a persisted host
  const persistedHost = loadPersistedHost();
  if (persistedHost) {
    // Push it into URL without reload
    const url = new URL(window.location.href);
    url.searchParams.set('host', persistedHost);
    window.history.replaceState({}, '', url.toString());
    return persistedHost;
  }

  // 3. No host available - return null for HostGuard to handle
  return null;
}

export function getCurrentHost(): string | null {
  return getHostFromLocation() || loadPersistedHost();
}
// @cursor:end(appbridge-host)
