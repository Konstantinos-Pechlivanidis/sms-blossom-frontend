/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AutomationRules = {
    quietHours?: {
        enabled?: boolean;
        start?: number;
        end?: number;
        zone?: string | null;
    };
    frequencyCap?: {
        enabled?: boolean;
        per?: 'hour' | 'day' | 'week';
        max?: number;
    };
    dedupeWindowMin?: number;
};

