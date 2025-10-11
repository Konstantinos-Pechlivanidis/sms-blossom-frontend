/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ErrorResponse = {
    properties: {
        error: {
            type: 'string',
            description: `Error code`,
            isRequired: true,
        },
        message: {
            type: 'string',
            description: `Human-readable error message`,
            isRequired: true,
        },
        details: {
            type: 'dictionary',
            contains: {
                properties: {
                },
            },
        },
        traceId: {
            type: 'string',
            description: `Request trace ID for debugging`,
        },
    },
} as const;
