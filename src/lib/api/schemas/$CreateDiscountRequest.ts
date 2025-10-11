/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CreateDiscountRequest = {
    properties: {
        code: {
            type: 'string',
            isRequired: true,
            maxLength: 50,
            minLength: 1,
            pattern: '^[A-Z0-9_-]+$',
        },
        title: {
            type: 'string',
            isNullable: true,
            maxLength: 255,
        },
        type: {
            type: 'Enum',
            isRequired: true,
        },
        value: {
            type: 'number',
            isNullable: true,
        },
        currencyCode: {
            type: 'string',
            isNullable: true,
        },
        startsAt: {
            type: 'string',
            isNullable: true,
            format: 'date-time',
        },
        endsAt: {
            type: 'string',
            isNullable: true,
            format: 'date-time',
        },
        usageLimit: {
            type: 'number',
            isNullable: true,
            minimum: 1,
        },
        oncePerCustomer: {
            type: 'boolean',
            isNullable: true,
        },
        utmJson: {
            type: 'dictionary',
            contains: {
                properties: {
                },
            },
            isNullable: true,
        },
    },
} as const;
