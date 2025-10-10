/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MessagingReport } from '../models/MessagingReport';
import type { OverviewReport } from '../models/OverviewReport';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReportsService {
    /**
     * Overview report
     * Get high-level analytics overview
     * @returns OverviewReport Overview report data
     * @throws ApiError
     */
    public static getOverviewReport({
        shop,
        period = '30d',
        startDate,
        endDate,
    }: {
        /**
         * Shopify shop domain
         */
        shop: string,
        /**
         * Reporting period
         */
        period?: '7d' | '30d' | '90d' | '1y',
        /**
         * Start date (overrides period)
         */
        startDate?: string,
        /**
         * End date (overrides period)
         */
        endDate?: string,
    }): CancelablePromise<OverviewReport> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reports/overview',
            query: {
                'shop': shop,
                'period': period,
                'startDate': startDate,
                'endDate': endDate,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Messaging report
     * Get detailed messaging analytics
     * @returns MessagingReport Messaging report data
     * @throws ApiError
     */
    public static getMessagingReport({
        shop,
        period = '30d',
        groupBy = 'day',
    }: {
        /**
         * Shopify shop domain
         */
        shop: string,
        /**
         * Reporting period
         */
        period?: '7d' | '30d' | '90d' | '1y',
        /**
         * Group results by time period
         */
        groupBy?: 'day' | 'week' | 'month',
    }): CancelablePromise<MessagingReport> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reports/messaging',
            query: {
                'shop': shop,
                'period': period,
                'groupBy': groupBy,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
}
