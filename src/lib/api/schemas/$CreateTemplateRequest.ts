/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CreateTemplateRequest = {
    properties: {
        name: {
            type: 'string',
            isRequired: true,
            maxLength: 255,
            minLength: 1,
        },
        trigger: {
            type: 'Enum',
            isRequired: true,
        },
        body: {
            type: 'string',
            isRequired: true,
            maxLength: 1600,
            minLength: 1,
        },
        variables: {
            type: 'dictionary',
            contains: {
                properties: {
                },
            },
            isNullable: true,
        },
    },
} as const;
