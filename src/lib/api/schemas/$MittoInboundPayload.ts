/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $MittoInboundPayload = {
    properties: {
        phone: {
            type: 'string',
            description: `Sender phone number`,
            isRequired: true,
        },
        message: {
            type: 'string',
            description: `Inbound message text`,
            isRequired: true,
        },
        timestamp: {
            type: 'string',
            description: `Message timestamp`,
            isRequired: true,
            format: 'date-time',
        },
        messageId: {
            type: 'string',
            description: `Message ID`,
            isNullable: true,
        },
    },
} as const;
