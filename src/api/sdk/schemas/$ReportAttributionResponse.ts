/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ReportAttributionResponse = {
    properties: {
        ok: {
            type: 'boolean',
        },
        range: {
            type: 'string',
        },
        items: {
            type: 'array',
            contains: {
                properties: {
                    code: {
                        type: 'string',
                    },
                    orders: {
                        type: 'number',
                    },
                    revenue: {
                        type: 'number',
                        format: 'float',
                    },
                },
            },
        },
    },
} as const;
