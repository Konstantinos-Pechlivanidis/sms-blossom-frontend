/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ReportOverviewResponse = {
    properties: {
        ok: {
            type: 'boolean',
        },
        range: {
            type: 'string',
        },
        contacts: {
            properties: {
                total: {
                    type: 'number',
                },
                optedIn: {
                    type: 'number',
                },
                optedOutRecent: {
                    type: 'number',
                },
            },
        },
        messages: {
            properties: {
                sent: {
                    type: 'number',
                },
                delivered: {
                    type: 'number',
                },
                failed: {
                    type: 'number',
                },
                deliveryRate: {
                    type: 'number',
                    format: 'float',
                },
            },
        },
        revenue: {
            properties: {
                attributed: {
                    type: 'number',
                    format: 'float',
                },
            },
        },
    },
} as const;
