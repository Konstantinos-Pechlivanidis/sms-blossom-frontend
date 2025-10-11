/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DiscountCodePool = {
    properties: {
        id: {
            type: 'string',
            isRequired: true,
        },
        shopId: {
            type: 'string',
            isRequired: true,
        },
        discountId: {
            type: 'string',
            isRequired: true,
        },
        name: {
            type: 'string',
            isRequired: true,
        },
        description: {
            type: 'string',
            isNullable: true,
        },
        totalCodes: {
            type: 'number',
            isRequired: true,
        },
        reservedCodes: {
            type: 'number',
            isRequired: true,
        },
        usedCodes: {
            type: 'number',
            isRequired: true,
        },
        status: {
            type: 'Enum',
            isRequired: true,
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
