/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReportOverviewResponse = {
    ok?: boolean;
    range?: string;
    contacts?: {
        total?: number;
        optedIn?: number;
        optedOutRecent?: number;
    };
    messages?: {
        sent?: number;
        delivered?: number;
        failed?: number;
        deliveryRate?: number;
    };
    revenue?: {
        attributed?: number;
    };
};

