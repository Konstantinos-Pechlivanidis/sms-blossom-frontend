/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UpdateCampaignRequest = {
    properties: {
        name: {
            type: 'string',
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
        scheduleAt: {
            type: 'string',
            isNullable: true,
            format: 'date-time',
        },
        status: {
            type: 'Enum',
        },
    },
} as const;
