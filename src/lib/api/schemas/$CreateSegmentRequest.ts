/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CreateSegmentRequest = {
    properties: {
        name: {
            type: 'string',
            isRequired: true,
            maxLength: 255,
            minLength: 1,
        },
        filterJson: {
            type: 'dictionary',
            contains: {
                properties: {
                },
            },
            isRequired: true,
        },
    },
} as const;
