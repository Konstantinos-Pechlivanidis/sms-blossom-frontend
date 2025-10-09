/**
 * Feature flags for production kill-switches
 * These can be toggled via environment variables to disable risky features
 */

export interface FeatureFlags {
  AUTOMATIONS_ENABLED: boolean;
  REPORTS_ENABLED: boolean;
  CAMPAIGNS_ENABLED: boolean;
  DISCOUNTS_ENABLED: boolean;
  SEGMENTS_ENABLED: boolean;
  CONTACTS_ENABLED: boolean;
  TEMPLATES_ENABLED: boolean;
}

/**
 * Get feature flags from environment variables
 * Defaults to true for all features (safe for production)
 */
export function getFeatureFlags(): FeatureFlags {
  return {
    AUTOMATIONS_ENABLED: import.meta.env.VITE_AUTOMATIONS_ENABLED !== 'false',
    REPORTS_ENABLED: import.meta.env.VITE_REPORTS_ENABLED !== 'false',
    CAMPAIGNS_ENABLED: import.meta.env.VITE_CAMPAIGNS_ENABLED !== 'false',
    DISCOUNTS_ENABLED: import.meta.env.VITE_DISCOUNTS_ENABLED !== 'false',
    SEGMENTS_ENABLED: import.meta.env.VITE_SEGMENTS_ENABLED !== 'false',
    CONTACTS_ENABLED: import.meta.env.VITE_CONTACTS_ENABLED !== 'false',
    TEMPLATES_ENABLED: import.meta.env.VITE_TEMPLATES_ENABLED !== 'false',
  };
}

/**
 * Check if a specific feature is enabled
 */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  const flags = getFeatureFlags();
  return flags[feature];
}

/**
 * Get disabled features for debugging
 */
export function getDisabledFeatures(): string[] {
  const flags = getFeatureFlags();
  return Object.entries(flags)
    .filter(([_, enabled]) => !enabled)
    .map(([feature, _]) => feature);
}

/**
 * Feature flag hook for React components
 */
export function useFeatureFlags() {
  return getFeatureFlags();
}

/**
 * Feature flag hook for specific feature
 */
export function useFeatureFlag(feature: keyof FeatureFlags): boolean {
  return isFeatureEnabled(feature);
}
