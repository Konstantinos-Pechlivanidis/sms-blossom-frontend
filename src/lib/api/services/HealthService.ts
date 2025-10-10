/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HealthResponse } from '../models/HealthResponse';
import type { QueueHealthResponse } from '../models/QueueHealthResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HealthService {
    /**
     * System health check
     * Returns comprehensive system health status including database, Redis, and queue health
     * @returns HealthResponse System health status
     * @throws ApiError
     */
    public static getHealth(): CancelablePromise<HealthResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health',
            errors: {
                500: `System unhealthy`,
            },
        });
    }
    /**
     * Readiness probe
     * Kubernetes-style readiness check - returns 200 only if all critical systems are ready
     * @returns any System ready
     * @throws ApiError
     */
    public static getReadiness(): CancelablePromise<{
        ready?: boolean;
        request_id?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health/ready',
            errors: {
                503: `System not ready`,
            },
        });
    }
    /**
     * Prometheus metrics
     * Exposes Prometheus-formatted metrics for monitoring
     * @returns string Prometheus metrics
     * @throws ApiError
     */
    public static getMetrics(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/metrics',
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Queue system health
     * Returns detailed queue system status including job counts and Redis connectivity
     * @returns QueueHealthResponse Queue health status
     * @throws ApiError
     */
    public static getQueueHealth(): CancelablePromise<QueueHealthResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/queue/health',
        });
    }
}
