/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Automation = {
    properties: {
        id: {
            type: 'string',
            isRequired: true,
        },
        shopId: {
            type: 'string',
            isRequired: true,
        },
        name: {
            type: 'string',
            isRequired: true,
        },
        trigger: {
            type: 'Enum',
            isRequired: true,
        },
        enabled: {
            type: 'boolean',
            isRequired: true,
        },
        delayMinutes: {
            type: 'number',
            isRequired: true,
        },
        template: {
            type: 'string',
            isRequired: true,
        },
        conditions: {
            type: 'dictionary',
            contains: {
                properties: {
                },
            },
            isNullable: true,
        },
        discountConfig: {
            type: 'dictionary',
            contains: {
                properties: {
                },
            },
            isNullable: true,
        },
        createdAt: {
            type: 'string',
            format: 'date-time',
        },
        updatedAt: {
            type: 'string',
            format: 'date-time',
        },
    },
} as const;
