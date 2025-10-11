/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Segment = {
    properties: {
        id: {
            type: 'string',
            description: `Segment ID`,
            isRequired: true,
        },
        name: {
            type: 'string',
            description: `Segment name`,
            isRequired: true,
        },
        filterJson: {
            type: 'dictionary',
            contains: {
                properties: {
                },
            },
            isRequired: true,
        },
        lastMaterializedAt: {
            type: 'string',
            description: `Last materialization time`,
            isNullable: true,
            format: 'date-time',
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
