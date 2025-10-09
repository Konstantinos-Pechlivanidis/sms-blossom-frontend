/**
 * Navigation utility for building consistent paths
 * Handles base path configuration and preserves Shopify app context
 */

const BASE_PATH = import.meta.env.VITE_BASE_PATH || '';

/**
 * Builds a consistent path for navigation
 * @param path - The route path (e.g., '/campaigns', '/settings')
 * @returns The full path with base path prefix
 */
export function buildPath(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Combine base path with normalized path
  const fullPath = `${BASE_PATH}${normalizedPath}`;
  
  return fullPath;
}

/**
 * Navigation paths for the application
 */
export const ROUTES = {
  DASHBOARD: buildPath('/'),
  CONTACTS: buildPath('/contacts'),
  DISCOUNTS: buildPath('/discounts'),
  SEGMENTS: buildPath('/segments'),
  CAMPAIGNS: buildPath('/campaigns'),
  CAMPAIGN_DETAIL: (id: string) => buildPath(`/campaigns/${id}`),
  AUTOMATIONS: buildPath('/automations'),
  REPORTS: buildPath('/reports'),
  SETTINGS: buildPath('/settings'),
} as const;

/**
 * Check if a path matches the current route
 * @param currentPath - Current pathname
 * @param targetPath - Target path to check
 * @returns True if the paths match
 */
export function isActiveRoute(currentPath: string, targetPath: string): boolean {
  return currentPath === targetPath || currentPath.startsWith(targetPath);
}

