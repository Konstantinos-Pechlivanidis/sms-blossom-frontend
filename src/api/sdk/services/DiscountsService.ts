/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplyUrlResponse } from '../models/ApplyUrlResponse';
import type { DiscountCreateRequest } from '../models/DiscountCreateRequest';
import type { DiscountCreateResponse } from '../models/DiscountCreateResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DiscountsService {
    /**
     * Create a discount code (Shopify Admin GraphQL)
     * @returns DiscountCreateResponse Discount created
     * @throws ApiError
     */
    public static createDiscount({
        shop,
        requestBody,
    }: {
        shop: string,
        requestBody: DiscountCreateRequest,
    }): CancelablePromise<DiscountCreateResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/discounts',
            query: {
                'shop': shop,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Missing shop parameter`,
                409: `Code conflict`,
                422: `Invalid payload`,
            },
        });
    }
    /**
     * Build canonical apply URL for a code
     * @returns ApplyUrlResponse URL built
     * @throws ApiError
     */
    public static buildApplyUrl({
        shop,
        code,
        redirect = '/cart',
    }: {
        shop: string,
        code: string,
        redirect?: string,
    }): CancelablePromise<ApplyUrlResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/discounts/apply-url',
            query: {
                'shop': shop,
                'code': code,
                'redirect': redirect,
            },
            errors: {
                400: `Missing required parameters`,
            },
        });
    }
    /**
     * Advisory scan for active automatic discounts (possible conflicts)
     * @returns any Active automatic discounts returned
     * @throws ApiError
     */
    public static getDiscountConflicts({
        shop,
    }: {
        shop: string,
    }): CancelablePromise<{
        ok?: boolean;
        automaticDiscounts?: Array<Record<string, any>>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/discounts/conflicts',
            query: {
                'shop': shop,
            },
            errors: {
                400: `Missing shop or unknown shop`,
            },
        });
    }
}
