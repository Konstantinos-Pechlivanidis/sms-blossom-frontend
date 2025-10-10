/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $HealthResponse = {
    properties: {
        ok: {
            type: 'boolean',
            description: `Overall system health`,
            isRequired: true,
        },
        version: {
            type: 'string',
            description: `API version`,
            isRequired: true,
        },
        db: {
            properties: {
                ok: {
                    type: 'boolean',
                    isRequired: true,
                },
                latency_ms: {
                    type: 'number',
                    isRequired: true,
                },
            },
            isRequired: true,
        },
        redis: {
            properties: {
                ok: {
                    type: 'boolean',
                    isRequired: true,
                },
                latency_ms: {
                    type: 'number',
                    isRequired: true,
                },
            },
            isRequired: true,
        },
        queues: {
            properties: {
                ok: {
                    type: 'boolean',
                    isRequired: true,
                },
                workers: {
                    type: 'number',
                    isRequired: true,
                },
            },
            isRequired: true,
        },
        pii: {
            properties: {
                phone_pct: {
                    type: 'number',
                    isNullable: true,
                    maximum: 100,
                },
                email_pct: {
                    type: 'number',
                    isNullable: true,
                    maximum: 100,
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
