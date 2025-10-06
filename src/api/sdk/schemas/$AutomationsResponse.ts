/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AutomationsResponse = {
    properties: {
        ok: {
            type: 'boolean',
        },
        shop: {
            type: 'string',
        },
        automations: {
            properties: {
                orderPaid: {
                    type: 'AutomationConfig',
                },
                abandoned: {
                    type: 'AutomationConfig',
                },
                fulfillmentUpdate: {
                    type: 'AutomationConfig',
                },
                welcome: {
                    type: 'AutomationConfig',
                },
                backInStock: {
                    type: 'AutomationConfig',
                },
            },
        },
    },
} as const;
