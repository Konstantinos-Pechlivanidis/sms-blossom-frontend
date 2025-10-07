// React hook for performance monitoring
import { useEffect, useRef, useCallback } from 'react';
import { performanceMonitor, measureFunction, measurePageLoad, measureComponentRender, measureUserInteraction } from './performance';
import { useShop } from '../lib/shopContext';

export interface UsePerformanceOptions {
  componentName?: string;
  pageName?: string;
  trackUserInteractions?: boolean;
  trackApiCalls?: boolean;
  trackRenders?: boolean;
}

export function usePerformance(options: UsePerformanceOptions = {}) {
  const { componentName, pageName, trackUserInteractions = true, trackApiCalls = true, trackRenders = true } = options;
  const { shop } = useShop();
  const renderCount = useRef(0);
  const startTime = useRef<number>(0);

  // Track component mount time
  useEffect(() => {
    startTime.current = performance.now();
    
    if (componentName && trackRenders) {
      const endRender = measureComponentRender(componentName);
      return endRender;
    }
  }, [componentName, trackRenders]);

  // Track page load time
  useEffect(() => {
    if (pageName) {
      const endPageLoad = measurePageLoad(pageName);
      return endPageLoad;
    }
  }, [pageName]);

  // Track render count
  useEffect(() => {
    if (componentName && trackRenders) {
      renderCount.current++;
      performanceMonitor.startTiming(`render_${componentName}_${renderCount.current}`);
    }
  });

  // Track render completion
  useEffect(() => {
    if (componentName && trackRenders) {
      const endRender = performanceMonitor.endTiming(`render_${componentName}_${renderCount.current}`);
      if (endRender && endRender > 100) { // Log slow renders (>100ms)
        console.warn(`Slow render detected: ${componentName} took ${endRender}ms`);
      }
    }
  });

  // Measure user interactions
  const measureInteraction = useCallback((interaction: string, fn: () => void | Promise<void>) => {
    if (!trackUserInteractions) {
      fn();
      return;
    }

    const endInteraction = measureUserInteraction(interaction);
    try {
      fn();
    } finally {
      endInteraction();
    }
  }, [trackUserInteractions]);

  // Measure API calls
  const measureApiCall = useCallback((endpoint: string, method: string, apiCall: () => Promise<any>) => {
    if (!trackApiCalls) {
      return apiCall();
    }

    return measureFunction(`api_${method}_${endpoint}`, apiCall, { shop });
  }, [trackApiCalls, shop]);

  // Measure function execution
  const measureFunctionExecution = useCallback(<T>(
    name: string,
    fn: () => Promise<T> | T,
    metadata?: Record<string, any>
  ) => {
    return measureFunction(name, fn, { shop, ...metadata });
  }, [shop]);

  // Get performance metrics
  const getMetrics = useCallback(() => {
    return performanceMonitor.getMetrics();
  }, []);

  // Get performance report
  const getReport = useCallback(() => {
    return performanceMonitor.generateReport();
  }, []);

  // Clear metrics
  const clearMetrics = useCallback(() => {
    performanceMonitor.clearMetrics();
  }, []);

  return {
    measureInteraction,
    measureApiCall,
    measureFunction: measureFunctionExecution,
    getMetrics,
    getReport,
    clearMetrics,
  };
}

// Hook for measuring specific operations
export function usePerformanceMeasurement() {
  const { shop } = useShop();

  const measure = useCallback(<T>(
    name: string,
    fn: () => Promise<T> | T,
    metadata?: Record<string, any>
  ) => {
    return measureFunction(name, fn, { shop, ...metadata });
  }, [shop]);

  const startTiming = useCallback((name: string, metadata?: Record<string, any>) => {
    performanceMonitor.startTiming(name, { shop, ...metadata });
  }, [shop]);

  const endTiming = useCallback((name: string) => {
    return performanceMonitor.endTiming(name);
  }, []);

  return {
    measure,
    startTiming,
    endTiming,
  };
}

// Hook for measuring page performance
export function usePagePerformance(pageName: string) {
  const { shop } = useShop();
  const pageLoadTime = useRef<number>(0);

  useEffect(() => {
    const startTime = performance.now();
    pageLoadTime.current = startTime;

    const endPageLoad = measurePageLoad(pageName);
    
    return () => {
      endPageLoad();
    };
  }, [pageName]);

  const measurePageOperation = useCallback(<T>(
    operation: string,
    fn: () => Promise<T> | T
  ) => {
    return measureFunction(`page_${pageName}_${operation}`, fn, { shop });
  }, [pageName, shop]);

  return {
    measurePageOperation,
    pageLoadTime: pageLoadTime.current,
  };
}
