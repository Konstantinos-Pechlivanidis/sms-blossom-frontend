/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $MittoDLRPayload = {
    properties: {
        messageId: {
            type: 'string',
            description: `Message ID`,
            isRequired: true,
        },
        status: {
            type: 'Enum',
            isRequired: true,
        },
        timestamp: {
            type: 'string',
            description: `Status timestamp`,
            isRequired: true,
            format: 'date-time',
        },
        errorCode: {
            type: 'string',
            description: `Error code if failed`,
            isNullable: true,
        },
        errorMessage: {
            type: 'string',
            description: `Error message if failed`,
            isNullable: true,
        },
    },
} as const;
