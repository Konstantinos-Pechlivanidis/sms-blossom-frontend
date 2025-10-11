/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Template = {
    /**
     * Template ID
     */
    id: string;
    /**
     * Template name
     */
    name: string;
    /**
     * Trigger type
     */
    trigger: 'abandoned_checkout' | 'order_created' | 'order_paid' | 'fulfillment_update' | 'welcome' | 'back_in_stock';
    /**
     * Template body with Liquid syntax
     */
    body: string;
    /**
     * Template variables
     */
    variables?: Record<string, any> | null;
    /**
     * Shop ID
     */
    shopId: string;
    createdAt: string;
    updatedAt: string;
};

