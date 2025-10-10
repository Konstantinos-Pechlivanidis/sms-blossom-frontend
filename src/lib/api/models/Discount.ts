/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Discount = {
    /**
     * Discount ID
     */
    id: string;
    /**
     * Discount code
     */
    code: string;
    /**
     * Discount title
     */
    title?: string | null;
    /**
     * Discount type
     */
    type: 'percentage' | 'amount' | 'shipping';
    /**
     * Discount value
     */
    value?: number | null;
    /**
     * Currency code
     */
    currencyCode?: string | null;
    /**
     * Start date
     */
    startsAt?: string | null;
    /**
     * End date
     */
    endsAt?: string | null;
    /**
     * Usage limit
     */
    usageLimit?: number | null;
    /**
     * One use per customer
     */
    oncePerCustomer?: boolean | null;
    /**
     * Apply URL
     */
    applyUrl?: string | null;
    /**
     * Shopify discount ID
     */
    providerId?: string | null;
    /**
     * Discount status
     */
    status?: 'active' | 'expired' | 'scheduled' | null;
    /**
     * UTM parameters
     */
    utmJson?: Record<string, any> | null;
    /**
     * Shop ID
     */
    shopId: string;
    createdAt: string;
    updatedAt: string;
};

