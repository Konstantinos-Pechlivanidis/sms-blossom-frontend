// Comprehensive telemetry for development and production monitoring
interface TelemetryEvent {
  type: 'request_start' | 'request_end' | 'error' | 'retry' | 'user_action' | 'page_view' | 'feature_usage' | 'performance';
  timestamp: number;
  data: Record<string, any>;
  sessionId: string;
  userId?: string;
  shop?: string;
}

class TelemetryLogger {
  private events: TelemetryEvent[] = [];
  private isEnabled: boolean;
  private sessionId: string;
  private userId?: string;
  private shop?: string;

  constructor() {
    this.isEnabled = import.meta.env.DEV || import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
    this.sessionId = this.generateSessionId();
  }

  setUserContext(userId?: string, shop?: string) {
    this.userId = userId;
    this.shop = shop;
  }

  log(event: Omit<TelemetryEvent, 'timestamp' | 'sessionId' | 'userId' | 'shop'>) {
    if (!this.isEnabled) return;

    const fullEvent: TelemetryEvent = {
      ...event,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      shop: this.shop,
    };

    this.events.push(fullEvent);

    // Console logging in development
    if (import.meta.env.DEV) {
      console.log(`[Telemetry] ${event.type}:`, event.data);
    }

    // Send to analytics service in production
    if (!import.meta.env.DEV && import.meta.env.VITE_ANALYTICS_ENDPOINT) {
      this.sendToAnalytics(fullEvent);
    }

    // Keep only last 100 events in memory
    if (this.events.length > 100) {
      this.events = this.events.slice(-100);
    }
  }

  // Request tracking
  logRequestStart(url: string, method: string, shop?: string) {
    this.log({
      type: 'request_start',
      data: {
        url,
        method,
        shop,
        requestId: this.generateRequestId(),
      },
    });
  }

  logRequestEnd(url: string, method: string, status: number, duration: number, shop?: string) {
    this.log({
      type: 'request_end',
      data: {
        url,
        method,
        status,
        duration,
        shop,
      },
    });
  }

  // Error tracking
  logError(error: Error, context?: Record<string, any>) {
    this.log({
      type: 'error',
      data: {
        message: error.message,
        name: error.name,
        stack: error.stack,
        context,
      },
    });
  }

  // Retry tracking
  logRetry(url: string, attempt: number, delay: number, error: string) {
    this.log({
      type: 'retry',
      data: {
        url,
        attempt,
        delay,
        error,
      },
    });
  }

  // User action tracking
  logUserAction(action: string, component?: string, data?: Record<string, any>) {
    this.log({
      type: 'user_action',
      data: {
        action,
        component,
        ...data,
      },
    });
  }

  // Get events for debugging
  getEvents(): TelemetryEvent[] {
    return [...this.events];
  }

  // Clear events
  clear() {
    this.events = [];
  }

  // Page view tracking
  logPageView(page: string, referrer?: string) {
    this.log({
      type: 'page_view',
      data: {
        page,
        referrer,
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
    });
  }

  // Feature usage tracking
  logFeatureUsage(feature: string, action: string, data?: Record<string, any>) {
    this.log({
      type: 'feature_usage',
      data: {
        feature,
        action,
        ...data,
      },
    });
  }

  // Performance tracking
  logPerformance(metric: string, value: number, unit: string = 'ms') {
    this.log({
      type: 'performance',
      data: {
        metric,
        value,
        unit,
      },
    });
  }

  // Send to analytics service
  private async sendToAnalytics(event: TelemetryEvent) {
    try {
      await fetch(import.meta.env.VITE_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.warn('Failed to send telemetry:', error);
    }
  }

  // Generate unique request ID
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate session ID
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance
export const telemetry = new TelemetryLogger();

// Convenience functions
export const logRequestStart = (url: string, method: string, shop?: string) => {
  telemetry.logRequestStart(url, method, shop);
};

export const logRequestEnd = (url: string, method: string, status: number, duration: number, shop?: string) => {
  telemetry.logRequestEnd(url, method, status, duration, shop);
};

export const logError = (error: Error, context?: Record<string, any>) => {
  telemetry.logError(error, context);
};

export const logRetry = (url: string, attempt: number, delay: number, error: string) => {
  telemetry.logRetry(url, attempt, delay, error);
};

export const logUserAction = (action: string, component?: string, data?: Record<string, any>) => {
  telemetry.logUserAction(action, component, data);
};

export const logPageView = (page: string, referrer?: string) => {
  telemetry.logPageView(page, referrer);
};

export const logFeatureUsage = (feature: string, action: string, data?: Record<string, any>) => {
  telemetry.logFeatureUsage(feature, action, data);
};

export const logPerformance = (metric: string, value: number, unit?: string) => {
  telemetry.logPerformance(metric, value, unit);
};

export const setUserContext = (userId?: string, shop?: string) => {
  telemetry.setUserContext(userId, shop);
};

// Export for debugging
export const getTelemetryEvents = () => telemetry.getEvents();
export const clearTelemetry = () => telemetry.clear();
