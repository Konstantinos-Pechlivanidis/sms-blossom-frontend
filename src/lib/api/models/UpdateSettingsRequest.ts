/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateSettingsRequest = {
    timezone?: string;
    locale?: string;
    automations?: {
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
};

