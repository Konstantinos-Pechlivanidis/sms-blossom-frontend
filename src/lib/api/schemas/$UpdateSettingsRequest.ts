/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UpdateSettingsRequest = {
    properties: {
        timezone: {
            type: 'string',
        },
        locale: {
            type: 'string',
        },
        automations: {
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
        },
    },
} as const;
