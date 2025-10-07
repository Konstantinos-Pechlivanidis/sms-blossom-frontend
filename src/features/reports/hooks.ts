import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { enhancedApiClient } from '../../lib/apiClient';
import { useShop } from '../../lib/shopContext';
import type { 
  ReportMessagingResponse,
  ReportCampaignsResponse,
  ReportAutomationsResponse,
  ReportAttributionResponse
} from '../../sdk/type-helpers';

// Types are now imported from type-helpers

// Overview report hook
export function useOverviewReport(window?: string) {
  const { shop, isReady } = useShop();
  
  return useQuery({
    queryKey: ['reports-overview', shop, window] as const,
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
    queryKey: ['reports-messaging', shop, window] as const,
    queryFn: () => enhancedApiClient.getMessagingReport({ 
      shop, 
      window: window || '30d' 
    }),
    enabled: isReady && !!shop,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Campaigns report hook
export function useCampaignsReport(window?: string) {
  const { shop, isReady } = useShop();
  
  return useQuery({
    queryKey: ['reports-campaigns', shop, window] as const,
    queryFn: () => enhancedApiClient.getCampaignsReport({ 
      shop, 
      window: window || '30d' 
    }),
    enabled: isReady && !!shop,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Automations report hook
export function useAutomationsReport(window?: string) {
  const { shop, isReady } = useShop();
  
  return useQuery({
    queryKey: ['reports-automations', shop, window] as const,
    queryFn: () => enhancedApiClient.getAutomationsReport({ 
      shop, 
      window: window || '30d' 
    }),
    enabled: isReady && !!shop,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Attribution report hook
export function useAttributionReport(window?: string) {
  const { shop, isReady } = useShop();
  
  return useQuery({
    queryKey: ['reports-attribution', shop, window] as const,
    queryFn: () => enhancedApiClient.getAttributionReport({ 
      shop, 
      window: window || '30d' 
    }),
    enabled: isReady && !!shop,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Report filters hook
export function useReportFilters() {
  const [filters, setFilters] = React.useState({
    dateRange: '30d',
    campaignId: '',
    segmentId: '',
    status: '',
    sortBy: 'date',
    sortOrder: 'desc',
  });
  
  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const resetFilters = () => {
    setFilters({
      dateRange: '30d',
      campaignId: '',
      segmentId: '',
      status: '',
      sortBy: 'date',
      sortOrder: 'desc',
    });
  };
  
  return {
    filters,
    updateFilter,
    resetFilters,
  };
}

// Report export hook
export function useReportExport() {
  const { shop } = useShop();
  
  return useMutation({
    mutationFn: ({ 
      type, 
      format, 
      filters 
    }: { 
      type: string; 
      format: 'csv' | 'json' | 'pdf'; 
      filters: any 
    }) => 
      enhancedApiClient.exportReport({ 
        shop, 
        type, 
        format, 
        // filters 
      }),
  });
}

// Report analytics hook
export function useReportAnalytics(window?: string) {
  const overview = useOverviewReport(window);
  const messaging = useMessagingReport(window);
  const campaigns = useCampaignsReport(window);
  const automations = useAutomationsReport(window);
  const attribution = useAttributionReport(window);
  
  const isLoading = overview.isLoading || messaging.isLoading || 
    campaigns.isLoading || automations.isLoading || attribution.isLoading;
  
  const error = overview.error || messaging.error || 
    campaigns.error || automations.error || attribution.error;
  
  const data = {
    overview: overview.data,
    messaging: messaging.data,
    campaigns: campaigns.data,
    automations: automations.data,
    attribution: attribution.data,
  };
  
  // Calculate key metrics
  const metrics = React.useMemo(() => {
    if (!data.overview) return null;
    
    const overview = data.overview;
    
    return {
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
  }, [data.overview]);
  
  // Calculate trends
  const trends = React.useMemo(() => {
    if (!data.messaging?.series) return null;
    
    const series = data.messaging.series;
    
    return {
      sent: series.map((point: any) => ({
        date: point.day,
        value: point.sent,
      })),
      delivered: series.map((point: any) => ({
        date: point.day,
        value: point.delivered,
      })),
      revenue: series.map((point: any) => ({
        date: point.day,
        value: point.revenue,
      })),
      cost: series.map((point: any) => ({
        date: point.day,
        value: point.cost,
      })),
    };
  }, [data.messaging]);
  
  return {
    data,
    metrics,
    trends,
    isLoading,
    error,
    refetch: () => {
      overview.refetch();
      messaging.refetch();
      campaigns.refetch();
      automations.refetch();
      attribution.refetch();
    },
  };
}

// Report comparison hook
export function useReportComparison(period1: string, period2: string) {
  const report1 = useReportAnalytics(period1);
  const report2 = useReportAnalytics(period2);
  
  const comparison = React.useMemo(() => {
    if (!report1.metrics || !report2.metrics) return null;
    
    const m1 = report1.metrics;
    const m2 = report2.metrics;
    
    return {
      sent: {
        current: m1.totalSent,
        previous: m2.totalSent,
        change: m2.totalSent > 0 ? ((m1.totalSent - m2.totalSent) / m2.totalSent) * 100 : 0,
      },
      revenue: {
        current: m1.totalRevenue,
        previous: m2.totalRevenue,
        change: m2.totalRevenue?.total && m2.totalRevenue.total > 0 ? ((m1.totalRevenue?.total || 0) - (m2.totalRevenue?.total || 0)) / (m2.totalRevenue?.total || 1) * 100 : 0,
      },
      deliveryRate: {
        current: m1.deliveryRate,
        previous: m2.deliveryRate,
        change: m2.deliveryRate > 0 ? ((m1.deliveryRate - m2.deliveryRate) / m2.deliveryRate) * 100 : 0,
      },
      openRate: {
        current: m1.openRate,
        previous: m2.openRate,
        change: m2.openRate > 0 ? ((m1.openRate - m2.openRate) / m2.openRate) * 100 : 0,
      },
      clickRate: {
        current: m1.clickRate,
        previous: m2.clickRate,
        change: m2.clickRate > 0 ? ((m1.clickRate - m2.clickRate) / m2.clickRate) * 100 : 0,
      },
    };
  }, [report1.metrics, report2.metrics]);
  
  return {
    comparison,
    isLoading: report1.isLoading || report2.isLoading,
    error: report1.error || report2.error,
  };
}
