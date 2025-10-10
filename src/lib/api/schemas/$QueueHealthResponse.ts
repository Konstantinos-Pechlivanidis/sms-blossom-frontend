/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $QueueHealthResponse = {
    properties: {
        redis: {
            type: 'boolean',
            isRequired: true,
        },
        queues: {
            properties: {
                events: {
                    type: 'QueueStatus',
                },
                automations: {
                    type: 'QueueStatus',
                },
                campaigns: {
                    type: 'QueueStatus',
                },
                delivery: {
                    type: 'QueueStatus',
                },
                housekeeping: {
                    type: 'QueueStatus',
                },
            },
            isRequired: true,
        },
        dlq: {
            properties: {
                events_dead: {
                    type: 'number',
                },
                delivery_dead: {
                    type: 'number',
                },
            },
            isRequired: true,
        },
        timestamp: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        request_id: {
            type: 'string',
            isRequired: true,
        },
    },
} as const;
