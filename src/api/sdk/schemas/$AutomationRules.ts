/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AutomationRules = {
    properties: {
        quietHours: {
            properties: {
                enabled: {
                    type: 'boolean',
                },
                start: {
                    type: 'number',
                    maximum: 23,
                },
                end: {
                    type: 'number',
                    maximum: 23,
                },
                zone: {
                    type: 'string',
                    isNullable: true,
                },
            },
        },
        frequencyCap: {
            properties: {
                enabled: {
                    type: 'boolean',
                },
                per: {
                    type: 'Enum',
                },
                max: {
                    type: 'number',
                    minimum: 1,
                },
            },
        },
        dedupeWindowMin: {
            type: 'number',
        },
    },
} as const;
