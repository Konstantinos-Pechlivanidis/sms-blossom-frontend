/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Discount = {
    properties: {
        id: {
            type: 'string',
            description: `Discount ID`,
            isRequired: true,
        },
        code: {
            type: 'string',
            description: `Discount code`,
            isRequired: true,
        },
        title: {
            type: 'string',
            description: `Discount title`,
            isNullable: true,
        },
        type: {
            type: 'Enum',
            isRequired: true,
        },
        value: {
            type: 'number',
            description: `Discount value`,
            isNullable: true,
        },
        currencyCode: {
            type: 'string',
            description: `Currency code`,
            isNullable: true,
        },
        startsAt: {
            type: 'string',
            description: `Start date`,
            isNullable: true,
            format: 'date-time',
        },
        endsAt: {
            type: 'string',
            description: `End date`,
            isNullable: true,
            format: 'date-time',
        },
        usageLimit: {
            type: 'number',
            description: `Usage limit`,
            isNullable: true,
        },
        oncePerCustomer: {
            type: 'boolean',
            description: `One use per customer`,
            isNullable: true,
        },
        applyUrl: {
            type: 'string',
            description: `Apply URL`,
            isNullable: true,
        },
        providerId: {
            type: 'string',
            description: `Shopify discount ID`,
            isNullable: true,
        },
        status: {
            type: 'Enum',
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
        shopId: {
            type: 'string',
            description: `Shop ID`,
            isRequired: true,
        },
        createdAt: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        updatedAt: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
    },
} as const;
