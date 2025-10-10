/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OverviewReport = {
    period: {
        start: string;
        end: string;
    };
    totalMessages: number;
    deliveredMessages: number;
    failedMessages: number;
    optOuts: number;
    revenue: number;
    averageDeliveryTime?: number;
    topCampaigns?: Array<{
        id?: string;
        name?: string;
        messages?: number;
        revenue?: number;
    }>;
};

