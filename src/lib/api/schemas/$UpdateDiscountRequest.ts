/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UpdateDiscountRequest = {
    properties: {
        title: {
            type: 'string',
            isNullable: true,
            maxLength: 255,
        },
        value: {
            type: 'number',
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
    },
} as const;
