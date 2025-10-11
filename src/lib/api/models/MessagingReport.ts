/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MessagingReport = {
    period: {
        start: string;
        end: string;
    };
    timeseries: Array<{
        date?: string;
        sent?: number;
        delivered?: number;
        failed?: number;
        optOuts?: number;
    }>;
    summary: {
        totalSent?: number;
        totalDelivered?: number;
        totalFailed?: number;
        totalOptOuts?: number;
        deliveryRate?: number;
        optOutRate?: number;
    };
};

