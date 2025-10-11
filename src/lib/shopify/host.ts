// @cursor:start(appbridge-host-utils)
/**
 * App Bridge host parameter management
 * Handles reading, persisting, and recovering the host parameter for embedded apps
 */

export function getHostFromLocation(): string | null {
  const s = new URLSearchParams(window.location.search);
  return s.get('host');
}

export function persistHost(host: string): void {
  if (host) {
    try {
      sessionStorage.setItem('shopify:host', host);
    } catch (error) {
      console.warn('Failed to persist host:', error);
    }
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
  const current = getHostFromLocation();
  if (current) { 
    persistHost(current); 
    return current; 
  }
  const persisted = loadPersistedHost();
  if (persisted) {
    const url = new URL(window.location.href);
    url.searchParams.set('host', persisted);
    window.history.replaceState({}, '', url.toString());
    return persisted;
  }
  return null; // let the app show a friendly banner
}

export function getCurrentHost(): string | null {
  return getHostFromLocation() || loadPersistedHost();
}
// @cursor:end(appbridge-host-utils)
