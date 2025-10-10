import { useQuery } from '@tanstack/react-query';
import { apiClient, handleApiError } from '../client';

// @cursor:start(health-hooks)
// Health Query Keys
export const healthKeys = {
  all: ['health'] as const,
  status: () => [...healthKeys.all, 'status'] as const,
  readiness: () => [...healthKeys.all, 'readiness'] as const,
  queue: () => [...healthKeys.all, 'queue'] as const,
};

// System health check
export function useHealth() {
  return useQuery({
    queryKey: healthKeys.status(),
    queryFn: async () => {
      // Mock data for now
      return {
        ok: true,
        version: '1.0.0',
        db: { ok: true, latency_ms: 12 },
        redis: { ok: true, latency_ms: 8 },
        queues: { ok: true, workers: 2 },
        pii: { phone_pct: 95, email_pct: 98 },
        timestamp: new Date().toISOString(),
        request_id: 'req_123456'
      };
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

// Readiness check
export function useReadiness() {
  return useQuery({
    queryKey: healthKeys.readiness(),
    queryFn: async () => {
      // Mock data for now
      return { ready: true, request_id: 'req_123456' };
    },
    staleTime: 10 * 1000, // 10 seconds
  });
}

// Queue health
export function useQueueHealth() {
  return useQuery({
    queryKey: healthKeys.queue(),
    queryFn: async () => {
      // Mock data for now
      return {
        redis: true,
        queues: {
          events: { waiting: 5, active: 2, completed: 150, failed: 3, delayed: 1, paused: 0, drained: 0 },
          automations: { waiting: 2, active: 1, completed: 50, failed: 1, delayed: 0, paused: 0, drained: 0 },
          campaigns: { waiting: 3, active: 1, completed: 100, failed: 2, delayed: 1, paused: 0, drained: 0 },
          delivery: { waiting: 8, active: 3, completed: 200, failed: 5, delayed: 2, paused: 0, drained: 0 },
          housekeeping: { waiting: 1, active: 0, completed: 25, failed: 0, delayed: 0, paused: 0, drained: 0 }
        },
        dlq: { events_dead: 0, delivery_dead: 0 },
        timestamp: new Date().toISOString(),
        request_id: 'req_123456'
      };
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}
// @cursor:end(health-hooks)