/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AutomationConfig } from './AutomationConfig';
export type AutomationsResponse = {
    ok?: boolean;
    shop?: string;
    automations?: {
        orderPaid?: AutomationConfig;
        abandoned?: AutomationConfig;
        fulfillmentUpdate?: AutomationConfig;
        welcome?: AutomationConfig;
        backInStock?: AutomationConfig;
    };
};

