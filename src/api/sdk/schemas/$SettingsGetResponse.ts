/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SettingsGetResponse = {
    properties: {
        ok: {
            type: 'boolean',
        },
        shop: {
            type: 'string',
        },
        settings: {
            properties: {
                timezone: {
                    type: 'string',
                },
                quietHours: {
                    properties: {
                        start: {
                            type: 'number',
                        },
                        end: {
                            type: 'number',
                        },
                    },
                },
                cap: {
                    properties: {
                        windowHours: {
                            type: 'number',
                        },
                        maxPerWindow: {
                            type: 'number',
                        },
                    },
                },
                abandoned: {
                    properties: {
                        delayMinutes: {
                            type: 'number',
                        },
                    },
                },
            },
        },
    },
} as const;
