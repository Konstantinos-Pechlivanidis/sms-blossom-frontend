/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type DiscountCreateRequest = {
    code: string;
    title?: string;
    kind: 'percentage' | 'amount';
    value: number;
    currencyCode?: string;
    startsAt?: string;
    endsAt?: string;
    appliesOncePerCustomer?: boolean;
    usageLimit?: number;
    redirect?: string;
    segments?: Array<string>;
};

