/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DiscountCode = {
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
        discountId: {
            type: 'string',
            isRequired: true,
        },
        code: {
            type: 'string',
            isRequired: true,
        },
        status: {
            type: 'Enum',
            isRequired: true,
        },
        reservedAt: {
            type: 'string',
            isNullable: true,
            format: 'date-time',
        },
        usedAt: {
            type: 'string',
            isNullable: true,
            format: 'date-time',
        },
        assignedTo: {
            type: 'string',
            isNullable: true,
        },
        shopifyGid: {
            type: 'string',
            isNullable: true,
        },
        reservationId: {
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
