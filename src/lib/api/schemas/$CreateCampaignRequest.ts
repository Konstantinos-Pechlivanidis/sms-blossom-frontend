/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CreateCampaignRequest = {
    properties: {
        name: {
            type: 'string',
            isRequired: true,
            maxLength: 255,
            minLength: 1,
        },
        template: {
            type: 'string',
            isNullable: true,
        },
        segmentId: {
            type: 'string',
            isNullable: true,
        },
        templateId: {
            type: 'string',
            isNullable: true,
        },
        templateKey: {
            type: 'string',
            isNullable: true,
        },
        scheduleAt: {
            type: 'string',
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
            isNullable: true,
            maximum: 1000,
            minimum: 1,
        },
        bodyText: {
            type: 'string',
            isNullable: true,
        },
        discountId: {
            type: 'string',
            isNullable: true,
        },
    },
} as const;
