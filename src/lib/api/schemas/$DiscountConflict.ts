/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DiscountConflict = {
    properties: {
        id: {
            type: 'string',
            isRequired: true,
        },
        code: {
            type: 'string',
            isRequired: true,
        },
        type: {
            type: 'string',
            isRequired: true,
        },
        conflictType: {
            type: 'Enum',
            isRequired: true,
        },
        message: {
            type: 'string',
        },
    },
} as const;
