/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DiscountCreateResponse = {
    properties: {
        ok: {
            type: 'boolean',
        },
        code: {
            type: 'string',
        },
        title: {
            type: 'string',
        },
        id: {
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
        applyUrl: {
            type: 'string',
        },
    },
} as const;
