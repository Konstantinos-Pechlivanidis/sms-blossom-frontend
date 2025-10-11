/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SMSSegments = {
    properties: {
        parts: {
            type: 'number',
            description: `Number of SMS parts`,
            isRequired: true,
            minimum: 1,
        },
        characters: {
            type: 'number',
            description: `Character count`,
            isRequired: true,
        },
        encoding: {
            type: 'Enum',
            isRequired: true,
        },
    },
} as const;
