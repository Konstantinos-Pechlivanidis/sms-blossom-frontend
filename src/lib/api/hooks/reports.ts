import { useQuery } from '@tanstack/react-query';
import { apiClient, handleApiError } from '../client';
import { useShop } from '../../shopContext';

// @cursor:start(reports-hooks)
// Reports Query Keys
export const reportsKeys = {
  all: ['reports'] as const,
  overview: (filters: Record<string, any>) => [...reportsKeys.all, 'overview', filters] as const,
  messaging: (filters: Record<string, any>) => [...reportsKeys.all, 'messaging', filters] as const,
};

// Overview report
export function useOverviewReport(filters: { 
  period?: '7d' | '30d' | '90d' | '1y'; 
  startDate?: string; 
  endDate?: string; 
} = {}) {
  const { shop } = useShop();
  
  return useQuery({
    queryKey: reportsKeys.overview(filters),
    queryFn: async () => {
      // Mock data for now
      return {
        period: { start: '2024-01-01', end: '2024-01-31' },
        totalMessages: 15000,
        deliveredMessages: 14250,
        failedMessages: 750,
        optOuts: 25,
        revenue: 45000.00,
        averageDeliveryTime: 2.5,
        topCampaigns: [
          { id: 'camp_123', name: 'Black Friday Sale', messages: 5000, revenue: 15000.00 }
        ]
      };
    },
    enabled: !!shop,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Messaging report
export function useMessagingReport(filters: { 
  period?: '7d' | '30d' | '90d' | '1y'; 
  groupBy?: 'day' | 'week' | 'month';
} = {}) {
  const { shop } = useShop();
  
  return useQuery({
    queryKey: reportsKeys.messaging(filters),
    queryFn: async () => {
      // Mock data for now
      return {
        period: { start: '2024-01-01', end: '2024-01-31' },
        timeseries: [
          { date: '2024-01-01', sent: 500, delivered: 475, failed: 25, optOuts: 2 }
        ],
        summary: {
          totalSent: 15000,
          totalDelivered: 14250,
          totalFailed: 750,
          totalOptOuts: 25,
          deliveryRate: 95.0,
          optOutRate: 0.17
        }
      };
    },
    enabled: !!shop,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
// @cursor:end(reports-hooks)