/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $MessagingReport = {
    properties: {
        period: {
            properties: {
                start: {
                    type: 'string',
                    isRequired: true,
                    format: 'date',
                },
                end: {
                    type: 'string',
                    isRequired: true,
                    format: 'date',
                },
            },
            isRequired: true,
        },
        timeseries: {
            type: 'array',
            contains: {
                properties: {
                    date: {
                        type: 'string',
                        format: 'date',
                    },
                    sent: {
                        type: 'number',
                    },
                    delivered: {
                        type: 'number',
                    },
                    failed: {
                        type: 'number',
                    },
                    optOuts: {
                        type: 'number',
                    },
                },
            },
            isRequired: true,
        },
        summary: {
            properties: {
                totalSent: {
                    type: 'number',
                },
                totalDelivered: {
                    type: 'number',
                },
                totalFailed: {
                    type: 'number',
                },
                totalOptOuts: {
                    type: 'number',
                },
                deliveryRate: {
                    type: 'number',
                    maximum: 100,
                },
                optOutRate: {
                    type: 'number',
                    maximum: 100,
                },
            },
            isRequired: true,
        },
    },
} as const;
