/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateDiscountRequest = {
    code: string;
    title?: string | null;
    type: 'percentage' | 'amount' | 'shipping';
    value?: number | null;
    currencyCode?: string | null;
    startsAt?: string | null;
    endsAt?: string | null;
    usageLimit?: number | null;
    oncePerCustomer?: boolean | null;
    utmJson?: Record<string, any> | null;
};

