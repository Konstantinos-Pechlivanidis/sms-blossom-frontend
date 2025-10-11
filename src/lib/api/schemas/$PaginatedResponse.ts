/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PaginatedResponse = {
    properties: {
        data: {
            type: 'array',
            contains: {
                properties: {
                },
            },
        },
        pagination: {
            properties: {
                page: {
                    type: 'number',
                    minimum: 1,
                },
                limit: {
                    type: 'number',
                    minimum: 1,
                },
                total: {
                    type: 'number',
                },
                pages: {
                    type: 'number',
                },
            },
        },
    },
} as const;
