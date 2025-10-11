/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Template = {
    properties: {
        id: {
            type: 'string',
            description: `Template ID`,
            isRequired: true,
        },
        name: {
            type: 'string',
            description: `Template name`,
            isRequired: true,
        },
        trigger: {
            type: 'Enum',
            isRequired: true,
        },
        body: {
            type: 'string',
            description: `Template body with Liquid syntax`,
            isRequired: true,
        },
        variables: {
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
