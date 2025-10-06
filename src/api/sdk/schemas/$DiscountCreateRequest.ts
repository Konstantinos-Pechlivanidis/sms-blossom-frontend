/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DiscountCreateRequest = {
    properties: {
        code: {
            type: 'string',
            isRequired: true,
        },
        title: {
            type: 'string',
        },
        kind: {
            type: 'Enum',
            isRequired: true,
        },
        value: {
            type: 'number',
            isRequired: true,
        },
        currencyCode: {
            type: 'string',
        },
        startsAt: {
            type: 'string',
            format: 'date-time',
        },
        endsAt: {
            type: 'string',
            format: 'date-time',
        },
        appliesOncePerCustomer: {
            type: 'boolean',
        },
        usageLimit: {
            type: 'number',
        },
        redirect: {
            type: 'string',
        },
        segments: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
    },
} as const;
