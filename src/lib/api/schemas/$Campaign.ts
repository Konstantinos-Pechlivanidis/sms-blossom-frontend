/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Campaign = {
    properties: {
        id: {
            type: 'string',
            description: `Campaign ID`,
            isRequired: true,
        },
        name: {
            type: 'string',
            description: `Campaign name`,
            isRequired: true,
        },
        status: {
            type: 'Enum',
            isRequired: true,
        },
        template: {
            type: 'string',
            description: `Template content`,
            isNullable: true,
        },
        segmentId: {
            type: 'string',
            description: `Target segment ID`,
            isNullable: true,
        },
        templateId: {
            type: 'string',
            description: `Template ID`,
            isNullable: true,
        },
        templateKey: {
            type: 'string',
            description: `Template key`,
            isNullable: true,
        },
        scheduleAt: {
            type: 'string',
            description: `Scheduled send time`,
            isNullable: true,
            format: 'date-time',
        },
        utmJson: {
            type: 'dictionary',
            contains: {
                properties: {
                },
            },
            isNullable: true,
        },
        batchSize: {
            type: 'number',
            description: `Batch size for sending`,
            isNullable: true,
        },
        bodyText: {
            type: 'string',
            description: `SMS body text`,
            isNullable: true,
        },
        discountId: {
            type: 'string',
            description: `Associated discount ID`,
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
