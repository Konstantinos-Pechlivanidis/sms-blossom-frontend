/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $TemplateListResponse = {
    type: 'all-of',
    contains: [{
        type: 'PaginatedResponse',
    }, {
        properties: {
            data: {
                type: 'array',
                contains: {
                    type: 'Template',
                },
            },
        },
    }],
} as const;
