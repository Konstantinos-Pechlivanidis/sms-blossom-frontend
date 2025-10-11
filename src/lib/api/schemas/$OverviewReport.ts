/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OverviewReport = {
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
        totalMessages: {
            type: 'number',
            isRequired: true,
        },
        deliveredMessages: {
            type: 'number',
            isRequired: true,
        },
        failedMessages: {
            type: 'number',
            isRequired: true,
        },
        optOuts: {
            type: 'number',
            isRequired: true,
        },
        revenue: {
            type: 'number',
            isRequired: true,
        },
        averageDeliveryTime: {
            type: 'number',
        },
        topCampaigns: {
            type: 'array',
            contains: {
                properties: {
                    id: {
                        type: 'string',
                    },
                    name: {
                        type: 'string',
                    },
                    messages: {
                        type: 'number',
                    },
                    revenue: {
                        type: 'number',
                    },
                },
            },
        },
    },
} as const;
