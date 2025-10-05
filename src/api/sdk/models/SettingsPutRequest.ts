/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SettingsPutRequest = {
    timezone?: string;
    quietHours?: {
        start: number;
        end: number;
    };
    cap?: {
        windowHours: number;
        maxPerWindow: number;
    };
    abandoned?: {
        delayMinutes?: number;
    };
};

