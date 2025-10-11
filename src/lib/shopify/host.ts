// @cursor:start(host-utils)
/**
 * App Bridge host parameter management
 * Handles reading, persisting, and recovering the host parameter for embedded apps
 */

export function getHostFromLocation(): string | null {
  const u = new URL(window.location.href);
  return u.searchParams.get('host');
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
  const fromUrl = getHostFromLocation();
  if (fromUrl) { 
    persistHost(fromUrl); 
    return fromUrl; 
  }
  const persisted = loadPersistedHost();
  if (persisted) {
    // Re-append host without reload
    const u = new URL(window.location.href);
    u.searchParams.set('host', persisted);
    window.history.replaceState({}, '', u.toString());
    return persisted;
  }
  return null; // signal missing host
}

export function getCurrentHost(): string | null {
  return getHostFromLocation() || loadPersistedHost();
}
// @cursor:end(host-utils)
