import { useQuery, useMutation } from '@tanstack/react-query';
import { enhancedApiClient } from '../../lib/apiClient';
import { useShop } from '../../lib/shopContext';
import type { 
  HealthResponse,
  ReportOverviewResponse,
  ReportMessagingResponse
} from '../../sdk/type-augment';

// Health status hook
export function useHealthStatus() {
  return useQuery({
    queryKey: ['health'] as const,
    queryFn: () => enhancedApiClient.getHealth(),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

// Overview report hook
export function useOverviewReport(window?: string) {
  const { shop, isReady } = useShop();
  
  return useQuery({
    queryKey: ['overview', shop, window] as const,
    queryFn: () => enhancedApiClient.getOverviewReport({ 
      shop, 
      window: window || '30d' 
    }),
    enabled: isReady && !!shop,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Messaging report hook
export function useMessagingReport(window?: string) {
  const { shop, isReady } = useShop();
  
  return useQuery({
    queryKey: ['messaging', shop, window] as const,
    queryFn: () => enhancedApiClient.getMessagingReport({ 
      shop, 
      window: window || '30d' 
    }),
    enabled: isReady && !!shop,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Connectivity check hook
export function useConnectivityCheck() {
  return useMutation({
    mutationFn: () => enhancedApiClient.getHealth(),
  });
}

// Dashboard KPIs hook
export function useDashboardKPIs(window?: string) {
  const overview = useOverviewReport(window);
  const messaging = useMessagingReport(window);
  const health = useHealthStatus();
  
  const isLoading = overview.isLoading || messaging.isLoading || health.isLoading;
  const error = overview.error || messaging.error || health.error;
  
  const data = {
    overview: overview.data,
    messaging: messaging.data,
    health: health.data,
  };
  
  return {
    data,
    isLoading,
    error,
    refetch: () => {
      overview.refetch();
      messaging.refetch();
      health.refetch();
    },
  };
}

// Real-time metrics hook (if enabled)
export function useRealTimeMetrics(enabled: boolean = false) {
  const { shop, isReady } = useShop();
  
  return useQuery({
    queryKey: ['realtime-metrics', shop] as const,
    queryFn: () => enhancedApiClient.getOverviewReport({ shop, window: '1d' }),
    enabled: isReady && !!shop && enabled,
    refetchInterval: enabled ? 30 * 1000 : false, // 30 seconds if enabled
    staleTime: 0, // Always consider stale for real-time
  });
}

// Dashboard analytics hook
export function useDashboardAnalytics(window?: string) {
  const { data: kpis, isLoading, error } = useDashboardKPIs(window);
  
  if (!kpis?.overview || !kpis?.messaging) {
    return {
      metrics: null,
      trends: null,
      health: kpis?.health,
      isLoading,
      error,
    };
  }
  
  const overview = kpis.overview;
  const messaging = kpis.messaging;
  
  // Calculate key metrics
  const metrics = {
    totalSent: overview.messages.sent || 0,
    totalDelivered: overview.messages.delivered || 0,
    totalFailed: overview.messages.failed || 0,
    totalOpened: overview.messages.opened || 0,
    totalClicked: overview.messages.clicked || 0,
    totalRevenue: overview.revenue || 0,
    totalCost: overview.cost || 0,
    deliveryRate: overview.messages.sent > 0 ? (overview.messages.delivered / overview.messages.sent) * 100 : 0,
    openRate: overview.messages.delivered > 0 ? ((overview.messages.opened || 0) / overview.messages.delivered) * 100 : 0,
    clickRate: overview.messages.delivered > 0 ? ((overview.messages.clicked || 0) / overview.messages.delivered) * 100 : 0,
    roi: overview.cost && overview.cost > 0 ? ((overview.revenue?.total || 0) - overview.cost) / overview.cost * 100 : 0,
  };
  
  // Calculate trends (if time series data available)
  const trends = messaging.series ? {
    sent: messaging.series.map((point: any) => ({
      date: point.day,
      value: point.sent,
    })),
    delivered: messaging.series.map((point: any) => ({
      date: point.day,
      value: point.delivered,
    })),
    revenue: messaging.series.map((point: any) => ({
      date: point.day,
      value: point.revenue,
    })),
  } : null;
  
  return {
    metrics,
    trends,
    health: kpis.health,
    isLoading,
    error,
  };
}

// System health status hook
export function useSystemHealth() {
  const { data: health, isLoading, error } = useHealthStatus();
  
  if (!health) {
    return {
      status: 'unknown',
      message: 'Health status unknown',
      details: null,
      isLoading,
      error,
    };
  }
  
  const isHealthy = health.ok && 
    health.db?.ok && 
    health.redis?.ok && 
    health.queue?.ok;
  
  const status = isHealthy ? 'healthy' : 'unhealthy';
  
  const message = isHealthy 
    ? 'All systems operational'
    : 'Some systems are experiencing issues';
  
  const details = {
    overall: health.ok,
    database: health.db,
    redis: health.redis,
    queue: health.queue,
    version: health.version,
    uptime: health.uptime,
  };
  
  return {
    status,
    message,
    details,
    isLoading,
    error,
  };
}
