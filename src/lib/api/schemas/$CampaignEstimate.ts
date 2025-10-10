/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CampaignEstimate = {
    properties: {
        estimatedRecipients: {
            type: 'number',
            isRequired: true,
        },
        estimatedCost: {
            type: 'number',
            isRequired: true,
        },
        segmentsUsed: {
            type: 'number',
            isRequired: true,
        },
        warnings: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
    },
} as const;
