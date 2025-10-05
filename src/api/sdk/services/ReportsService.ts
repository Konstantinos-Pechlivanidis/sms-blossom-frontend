/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReportAttributionResponse } from '../models/ReportAttributionResponse';
import type { ReportOverviewResponse } from '../models/ReportOverviewResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReportsService {
    /**
     * Overview KPIs
     * @returns ReportOverviewResponse Overview metrics
     * @throws ApiError
     */
    public static getReportOverview({
        shop,
        range = '30d',
    }: {
        shop: string,
        range?: '7d' | '30d' | '90d',
    }): CancelablePromise<ReportOverviewResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reports/overview',
            query: {
                'shop': shop,
                'range': range,
            },
            errors: {
                400: `Missing shop parameter`,
                404: `Shop not found`,
            },
        });
    }
    /**
     * Revenue by discount code
     * @returns ReportAttributionResponse Attribution items
     * @throws ApiError
     */
    public static getReportAttribution({
        shop,
        range = '30d',
    }: {
        shop: string,
        range?: '7d' | '30d' | '90d',
    }): CancelablePromise<ReportAttributionResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reports/attribution',
            query: {
                'shop': shop,
                'range': range,
            },
            errors: {
                400: `Missing shop parameter`,
                404: `Shop not found`,
            },
        });
    }
    /**
     * Campaign attribution (revenue/orders via discount or UTM)
     * @returns any Campaign attribution list
     * @throws ApiError
     */
    public static getCampaignAttribution({
        shop,
        from,
        to,
        window,
    }: {
        shop: string,
        from?: string,
        to?: string,
        window?: string,
    }): CancelablePromise<{
        ok?: boolean;
        range?: {
            from?: string;
            to?: string;
        };
        items?: Array<{
            campaignId?: string;
            name?: string;
            revenue?: number;
            orders?: number;
            via?: {
                discount?: number;
                utm?: number;
            };
            clicks_lifetime?: number;
            messaging?: {
                sent?: number;
                delivered?: number;
                failed?: number;
            };
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reports/campaigns',
            query: {
                'shop': shop,
                'from': from,
                'to': to,
                'window': window,
            },
            errors: {
                404: `Unknown shop`,
                500: `Server error`,
            },
        });
    }
    /**
     * Automation attribution (Abandoned Checkout revenue)
     * @returns any Automation attribution
     * @throws ApiError
     */
    public static getAutomationAttribution({
        shop,
        from,
        to,
        window,
    }: {
        shop: string,
        from?: string,
        to?: string,
        window?: string,
    }): CancelablePromise<{
        ok?: boolean;
        range?: {
            from?: string;
            to?: string;
        };
        items?: Array<{
            automation?: string;
            orders?: number;
            revenue?: number;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reports/automations',
            query: {
                'shop': shop,
                'from': from,
                'to': to,
                'window': window,
            },
            errors: {
                404: `Unknown shop`,
                500: `Server error`,
            },
        });
    }
    /**
     * Messaging daily timeseries (sent/delivered/failed/cost)
     * @returns any Timeseries returned
     * @throws ApiError
     */
    public static getMessagingTimeseries({
        shop,
        from,
        to,
        window,
    }: {
        shop: string,
        from?: string,
        to?: string,
        window?: string,
    }): CancelablePromise<{
        ok?: boolean;
        range?: {
            from?: string;
            to?: string;
        };
        series?: Array<{
            day?: string;
            sent?: number;
            delivered?: number;
            failed?: number;
            cost?: number;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reports/messaging/timeseries',
            query: {
                'shop': shop,
                'from': from,
                'to': to,
                'window': window,
            },
            errors: {
                404: `Unknown shop`,
                500: `Server error`,
            },
        });
    }
}
