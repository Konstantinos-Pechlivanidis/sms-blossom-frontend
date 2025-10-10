/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ShopSettings = {
    /**
     * Shop ID
     */
    shopId: string;
    /**
     * Shop timezone
     */
    timezone: string;
    /**
     * Shop locale
     */
    locale: string;
    /**
     * Automation settings
     */
    automations: {
        abandoned_checkout?: {
            enabled?: boolean;
            delay_minutes?: number;
            template?: string;
        };
        welcome?: {
            enabled?: boolean;
            delay_minutes?: number;
            template?: string;
        };
    };
    createdAt: string;
    updatedAt: string;
};

