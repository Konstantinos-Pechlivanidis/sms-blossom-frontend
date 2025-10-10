/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type HealthResponse = {
    /**
     * Overall system health
     */
    ok: boolean;
    /**
     * API version
     */
    version: string;
    db: {
        ok: boolean;
        latency_ms: number;
    };
    redis: {
        ok: boolean;
        latency_ms: number;
    };
    queues: {
        ok: boolean;
        workers: number;
    };
    pii: {
        phone_pct?: number | null;
        email_pct?: number | null;
    };
    timestamp: string;
    request_id: string;
};

