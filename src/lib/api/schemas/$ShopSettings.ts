/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ShopSettings = {
    properties: {
        shopId: {
            type: 'string',
            description: `Shop ID`,
            isRequired: true,
        },
        timezone: {
            type: 'string',
            description: `Shop timezone`,
            isRequired: true,
        },
        locale: {
            type: 'string',
            description: `Shop locale`,
            isRequired: true,
        },
        automations: {
            description: `Automation settings`,
            properties: {
                abandoned_checkout: {
                    properties: {
                        enabled: {
                            type: 'boolean',
                        },
                        delay_minutes: {
                            type: 'number',
                            minimum: 1,
                        },
                        template: {
                            type: 'string',
                        },
                    },
                },
                welcome: {
                    properties: {
                        enabled: {
                            type: 'boolean',
                        },
                        delay_minutes: {
                            type: 'number',
                            minimum: 1,
                        },
                        template: {
                            type: 'string',
                        },
                    },
                },
            },
            isRequired: true,
        },
        createdAt: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        updatedAt: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
    },
} as const;
