/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateTemplateRequest = {
    name: string;
    trigger: 'abandoned_checkout' | 'order_created' | 'order_paid' | 'fulfillment_update' | 'welcome' | 'back_in_stock';
    body: string;
    variables?: Record<string, any> | null;
};

