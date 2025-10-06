/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AutomationConfig = {
    properties: {
        enabled: {
            type: 'boolean',
        },
        template: {
            type: 'string',
            isNullable: true,
        },
        delayMinutes: {
            type: 'number',
            maximum: 1440,
            minimum: 5,
        },
        rules: {
            type: 'AutomationRules',
        },
    },
} as const;
