/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AbandonedCheckout = {
    properties: {
        id: {
            type: 'string',
            isRequired: true,
        },
        shopId: {
            type: 'string',
            isRequired: true,
        },
        checkoutToken: {
            type: 'string',
            isRequired: true,
        },
        customerId: {
            type: 'string',
            isNullable: true,
        },
        email: {
            type: 'string',
            isNullable: true,
        },
        phone: {
            type: 'string',
            isNullable: true,
        },
        totalPrice: {
            type: 'number',
            isNullable: true,
        },
        currency: {
            type: 'string',
            isNullable: true,
        },
        abandonedAt: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        recoveredAt: {
            type: 'string',
            isNullable: true,
            format: 'date-time',
        },
        abandonedCheckoutUrl: {
            type: 'string',
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
