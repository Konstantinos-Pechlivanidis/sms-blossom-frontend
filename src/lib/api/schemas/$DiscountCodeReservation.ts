/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DiscountCodeReservation = {
    properties: {
        id: {
            type: 'string',
            isRequired: true,
        },
        shopId: {
            type: 'string',
            isRequired: true,
        },
        poolId: {
            type: 'string',
            isRequired: true,
        },
        campaignId: {
            type: 'string',
            isRequired: true,
        },
        quantity: {
            type: 'number',
            isRequired: true,
            minimum: 1,
        },
        status: {
            type: 'Enum',
            isRequired: true,
        },
        expiresAt: {
            type: 'string',
            isNullable: true,
            format: 'date-time',
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
