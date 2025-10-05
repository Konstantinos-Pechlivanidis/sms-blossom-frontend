/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SettingsGetResponse = {
    ok?: boolean;
    shop?: string;
    settings?: {
        timezone?: string;
        quietHours?: {
            start?: number;
            end?: number;
        };
        cap?: {
            windowHours?: number;
            maxPerWindow?: number;
        };
        abandoned?: {
            delayMinutes?: number;
        };
    };
};

