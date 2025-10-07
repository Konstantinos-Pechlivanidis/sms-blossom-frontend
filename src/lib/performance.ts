// Performance monitoring and metrics collection
import { logPerformance } from './telemetry';

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface PerformanceObserver {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

class PerformanceMonitor {
  private observers: Map<string, PerformanceObserver> = new Map();
  private metrics: PerformanceMetric[] = [];
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = import.meta.env.DEV || import.meta.env.VITE_ENABLE_PERFORMANCE === 'true';
  }

  // Start timing an operation
  startTiming(name: string, metadata?: Record<string, any>): void {
    if (!this.isEnabled) return;

    const observer: PerformanceObserver = {
      name,
      startTime: performance.now(),
      ...metadata,
    };

    this.observers.set(name, observer);
  }

  // End timing an operation
  endTiming(name: string): number | null {
    if (!this.isEnabled) return null;

    const observer = this.observers.get(name);
    if (!observer) {
      console.warn(`Performance observer '${name}' not found`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - observer.startTime;

    observer.endTime = endTime;
    observer.duration = duration;

    // Record metric
    const metric: PerformanceMetric = {
      name,
      value: duration,
      unit: 'ms',
      timestamp: Date.now(),
      metadata: observer,
    };

    this.metrics.push(metric);

    // Log to telemetry
    logPerformance(name, duration, 'ms');

    // Clean up observer
    this.observers.delete(name);

    return duration;
  }

  // Measure a function execution time
  async measureFunction<T>(
    name: string,
    fn: () => Promise<T> | T,
    metadata?: Record<string, any>
  ): Promise<T> {
    this.startTiming(name, metadata);
    
    try {
      const result = await fn();
      this.endTiming(name);
      return result;
    } catch (error) {
      this.endTiming(name);
      throw error;
    }
  }

  // Measure page load time
  measurePageLoad(page: string): () => void {
    this.startTiming(`page_load_${page}`);
    
    return () => {
      this.endTiming(`page_load_${page}`);
    };
  }

  // Measure API call time
  measureApiCall(endpoint: string, method: string): () => void {
    this.startTiming(`api_${method}_${endpoint}`);
    
    return () => {
      this.endTiming(`api_${method}_${endpoint}`);
    };
  }

  // Measure component render time
  measureComponentRender(componentName: string): () => void {
    this.startTiming(`render_${componentName}`);
    
    return () => {
      this.endTiming(`render_${componentName}`);
    };
  }

  // Measure user interaction time
  measureUserInteraction(interaction: string): () => void {
    this.startTiming(`interaction_${interaction}`);
    
    return () => {
      this.endTiming(`interaction_${interaction}`);
    };
  }

  // Get performance metrics
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  // Get metrics by name
  getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter(metric => metric.name === name);
  }

  // Get average duration for a metric
  getAverageDuration(name: string): number | null {
    const metrics = this.getMetricsByName(name);
    if (metrics.length === 0) return null;

    const total = metrics.reduce((sum, metric) => sum + metric.value, 0);
    return total / metrics.length;
  }

  // Get slowest operations
  getSlowestOperations(limit = 10): PerformanceMetric[] {
    return [...this.metrics]
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  }

  // Clear metrics
  clearMetrics(): void {
    this.metrics = [];
  }

  // Get Web Vitals
  getWebVitals(): Record<string, number> {
    const vitals: Record<string, number> = {};

    // First Contentful Paint
    if (performance.getEntriesByType) {
      const fcp = performance.getEntriesByName('first-contentful-paint')[0];
      if (fcp) {
        vitals.fcp = fcp.startTime;
      }

      // Largest Contentful Paint
      const lcp = performance.getEntriesByType('largest-contentful-paint');
      if (lcp.length > 0) {
        vitals.lcp = lcp[lcp.length - 1].startTime;
      }

      // First Input Delay
      const fid = performance.getEntriesByType('first-input');
      if (fid.length > 0) {
        vitals.fid = (fid[0] as any).processingStart - fid[0].startTime;
      }

      // Cumulative Layout Shift
      const cls = performance.getEntriesByType('layout-shift');
      if (cls.length > 0) {
        vitals.cls = cls.reduce((sum, entry) => sum + (entry as any).value, 0);
      }
    }

    return vitals;
  }

  // Monitor memory usage
  getMemoryUsage(): Record<string, number> | null {
    if (!(performance as any).memory) return null;

    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit,
    };
  }

  // Monitor network performance
  getNetworkMetrics(): Record<string, any>[] {
    if (!performance.getEntriesByType) return [];

    return performance.getEntriesByType('navigation').map(entry => ({
      name: entry.name,
      duration: entry.duration,
      transferSize: (entry as any).transferSize,
      encodedBodySize: (entry as any).encodedBodySize,
      decodedBodySize: (entry as any).decodedBodySize,
    }));
  }

  // Generate performance report
  generateReport(): Record<string, any> {
    const vitals = this.getWebVitals();
    const memory = this.getMemoryUsage();
    const network = this.getNetworkMetrics();
    const slowest = this.getSlowestOperations(5);

    return {
      timestamp: new Date().toISOString(),
      vitals,
      memory,
      network,
      slowestOperations: slowest,
      totalMetrics: this.metrics.length,
      averageMetrics: this.metrics.reduce((acc, metric) => {
        if (!acc[metric.name]) {
          acc[metric.name] = { count: 0, total: 0, average: 0 };
        }
        acc[metric.name].count++;
        acc[metric.name].total += metric.value;
        acc[metric.name].average = acc[metric.name].total / acc[metric.name].count;
        return acc;
      }, {} as Record<string, any>),
    };
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Convenience functions
export const startTiming = (name: string, metadata?: Record<string, any>) => {
  performanceMonitor.startTiming(name, metadata);
};

export const endTiming = (name: string) => {
  return performanceMonitor.endTiming(name);
};

export const measureFunction = <T>(
  name: string,
  fn: () => Promise<T> | T,
  metadata?: Record<string, any>
) => {
  return performanceMonitor.measureFunction(name, fn, metadata);
};

export const measurePageLoad = (page: string) => {
  return performanceMonitor.measurePageLoad(page);
};

export const measureApiCall = (endpoint: string, method: string) => {
  return performanceMonitor.measureApiCall(endpoint, method);
};

export const measureComponentRender = (componentName: string) => {
  return performanceMonitor.measureComponentRender(componentName);
};

export const measureUserInteraction = (interaction: string) => {
  return performanceMonitor.measureUserInteraction(interaction);
};

export const getPerformanceReport = () => {
  return performanceMonitor.generateReport();
};

export const getMetrics = () => {
  return performanceMonitor.getMetrics();
};

export const clearMetrics = () => {
  performanceMonitor.clearMetrics();
};
