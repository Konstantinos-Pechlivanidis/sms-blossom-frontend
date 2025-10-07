import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  logPageView, 
  logFeatureUsage, 
  logUserAction, 
  logPerformance,
  setUserContext 
} from './telemetry';

// Hook for automatic page view tracking
export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    logPageView(location.pathname, document.referrer);
  }, [location.pathname]);
}

// Hook for feature usage tracking
export function useFeatureTracking() {
  const trackFeature = useCallback((feature: string, action: string, data?: Record<string, any>) => {
    logFeatureUsage(feature, action, data);
  }, []);

  return { trackFeature };
}

// Hook for user action tracking
export function useActionTracking() {
  const trackAction = useCallback((action: string, component?: string, data?: Record<string, any>) => {
    logUserAction(action, component, data);
  }, []);

  return { trackAction };
}

// Hook for performance tracking
export function usePerformanceTracking() {
  const trackPerformance = useCallback((metric: string, value: number, unit?: string) => {
    logPerformance(metric, value, unit);
  }, []);

  return { trackPerformance };
}

// Hook for setting user context
export function useUserContext(userId?: string, shop?: string) {
  useEffect(() => {
    setUserContext(userId, shop);
  }, [userId, shop]);
}

// Combined hook for all telemetry
export function useTelemetry(userId?: string, shop?: string) {
  usePageTracking();
  useUserContext(userId, shop);
  
  const { trackFeature } = useFeatureTracking();
  const { trackAction } = useActionTracking();
  const { trackPerformance } = usePerformanceTracking();

  return {
    trackFeature,
    trackAction,
    trackPerformance,
  };
}
