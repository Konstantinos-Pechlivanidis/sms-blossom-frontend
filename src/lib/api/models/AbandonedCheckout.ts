/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AbandonedCheckout = {
    id: string;
    shopId: string;
    checkoutToken: string;
    customerId?: string | null;
    email?: string | null;
    phone?: string | null;
    totalPrice?: number | null;
    currency?: string | null;
    abandonedAt: string;
    recoveredAt?: string | null;
    abandonedCheckoutUrl?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

