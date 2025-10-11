/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SegmentListResponse = {
    type: 'all-of',
    contains: [{
        type: 'PaginatedResponse',
    }, {
        properties: {
            data: {
                type: 'array',
                contains: {
                    type: 'Segment',
                },
            },
        },
    }],
} as const;
