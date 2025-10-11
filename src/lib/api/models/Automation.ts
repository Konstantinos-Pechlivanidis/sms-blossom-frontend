/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Automation = {
    id: string;
    shopId: string;
    name: string;
    trigger: 'abandoned_checkout' | 'order_created' | 'order_paid' | 'fulfillment_update';
    enabled: boolean;
    delayMinutes: number;
    template: string;
    /**
     * Additional trigger conditions
     */
    conditions?: Record<string, any> | null;
    /**
     * Discount configuration for this automation
     */
    discountConfig?: Record<string, any> | null;
    createdAt?: string;
    updatedAt?: string;
};

