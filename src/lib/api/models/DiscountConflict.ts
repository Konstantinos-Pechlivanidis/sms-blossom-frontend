/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type DiscountConflict = {
    id: string;
    code: string;
    type: string;
    conflictType: 'exact_match' | 'similar_code' | 'overlapping_period';
    message?: string;
};

