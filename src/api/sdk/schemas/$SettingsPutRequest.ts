/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SettingsPutRequest = {
    properties: {
        timezone: {
            type: 'string',
        },
        quietHours: {
            properties: {
                start: {
                    type: 'number',
                    isRequired: true,
                },
                end: {
                    type: 'number',
                    isRequired: true,
                },
            },
        },
        cap: {
            properties: {
                windowHours: {
                    type: 'number',
                    isRequired: true,
                },
                maxPerWindow: {
                    type: 'number',
                    isRequired: true,
                },
            },
        },
        abandoned: {
            properties: {
                delayMinutes: {
                    type: 'number',
                    maximum: 1440,
                    minimum: 5,
                },
            },
        },
    },
} as const;
