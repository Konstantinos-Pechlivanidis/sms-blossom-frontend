/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { QueueStatus } from './QueueStatus';
export type QueueHealthResponse = {
    redis: boolean;
    queues: {
        events?: QueueStatus;
        automations?: QueueStatus;
        campaigns?: QueueStatus;
        delivery?: QueueStatus;
        housekeeping?: QueueStatus;
    };
    dlq: {
        events_dead?: number;
        delivery_dead?: number;
    };
    timestamp: string;
    request_id: string;
};

