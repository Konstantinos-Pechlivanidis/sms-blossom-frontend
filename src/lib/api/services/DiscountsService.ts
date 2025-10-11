/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateDiscountRequest } from '../models/CreateDiscountRequest';
import type { Discount } from '../models/Discount';
import type { DiscountConflict } from '../models/DiscountConflict';
import type { DiscountListResponse } from '../models/DiscountListResponse';
import type { UpdateDiscountRequest } from '../models/UpdateDiscountRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DiscountsService {
    /**
     * List discounts
     * Retrieve paginated list of discount codes
     * @returns DiscountListResponse List of discounts
     * @throws ApiError
     */
    public static listDiscounts({
        shop,
        page = 1,
        limit = 20,
        status,
    }: {
        /**
         * Shopify shop domain
         */
        shop: string,
        page?: number,
        limit?: number,
        /**
         * Filter by discount status
         */
        status?: 'active' | 'expired' | 'scheduled',
    }): CancelablePromise<DiscountListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/discounts',
            query: {
                'shop': shop,
                'page': page,
                'limit': limit,
                'status': status,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Create discount
     * Create a new discount code in Shopify
     * @returns Discount Discount created successfully
     * @throws ApiError
     */
    public static createDiscount({
        shop,
        requestBody,
    }: {
        /**
         * Shopify shop domain
         */
        shop: string,
        requestBody: CreateDiscountRequest,
    }): CancelablePromise<Discount> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/discounts',
            query: {
                'shop': shop,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request data`,
                409: `Discount code already exists`,
            },
        });
    }
    /**
     * Get discount
     * Retrieve a specific discount by ID
     * @returns Discount Discount details
     * @throws ApiError
     */
    public static getDiscount({
        id,
        shop,
    }: {
        /**
         * Discount ID
         */
        id: string,
        /**
         * Shopify shop domain
         */
        shop: string,
    }): CancelablePromise<Discount> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/discounts/{id}',
            path: {
                'id': id,
            },
            query: {
                'shop': shop,
            },
            errors: {
                404: `Discount not found`,
            },
        });
    }
    /**
     * Update discount
     * Update an existing discount
     * @returns Discount Discount updated successfully
     * @throws ApiError
     */
    public static updateDiscount({
        id,
        shop,
        requestBody,
    }: {
        /**
         * Discount ID
         */
        id: string,
        /**
         * Shopify shop domain
         */
        shop: string,
        requestBody: UpdateDiscountRequest,
    }): CancelablePromise<Discount> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/discounts/{id}',
            path: {
                'id': id,
            },
            query: {
                'shop': shop,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Discount not found`,
            },
        });
    }
    /**
     * Delete discount
     * Delete a discount code
     * @returns void
     * @throws ApiError
     */
    public static deleteDiscount({
        id,
        shop,
    }: {
        /**
         * Discount ID
         */
        id: string,
        /**
         * Shopify shop domain
         */
        shop: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/discounts/{id}',
            path: {
                'id': id,
            },
            query: {
                'shop': shop,
            },
            errors: {
                404: `Discount not found`,
            },
        });
    }
    /**
     * Check discount conflicts
     * Check for potential conflicts with existing discount codes
     * @returns any Conflict check results
     * @throws ApiError
     */
    public static checkDiscountConflicts({
        shop,
        requestBody,
    }: {
        /**
         * Shopify shop domain
         */
        shop: string,
        requestBody: {
            /**
             * Discount code to check
             */
            code?: string;
            /**
             * Discount ID to exclude from conflict check
             */
            excludeId?: string;
        },
    }): CancelablePromise<{
        hasConflicts?: boolean;
        conflicts?: Array<DiscountConflict>;
        suggestions?: Array<string>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/discounts/conflicts',
            query: {
                'shop': shop,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Sync discounts from Shopify
     * Import metadata of existing discounts from Shopify Admin API
     * @returns any Sync results
     * @throws ApiError
     */
    public static syncDiscountsFromShopify({
        shop,
        requestBody,
    }: {
        /**
         * Shopify shop domain
         */
        shop: string,
        requestBody?: {
            /**
             * GraphQL query to filter discounts
             */
            query?: string;
        },
    }): CancelablePromise<{
        imported?: number;
        skipped?: number;
        errors?: Array<string>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/discounts/sync-from-shopify',
            query: {
                'shop': shop,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Import discount codes to pool
     * Create DiscountCode entries from provided codes
     * @returns any Import results
     * @throws ApiError
     */
    public static importDiscountCodes({
        shop,
        id,
        requestBody,
    }: {
        /**
         * Shopify shop domain
         */
        shop: string,
        /**
         * Discount ID
         */
        id: string,
        requestBody: {
            codes?: Array<string>;
        },
    }): CancelablePromise<{
        imported?: number;
        skipped?: number;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/discounts/{id}/pool/import',
            path: {
                'id': id,
            },
            query: {
                'shop': shop,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Generate discount codes
     * Create discount codes via Shopify API and save to pool
     * @returns any Generation results
     * @throws ApiError
     */
    public static generateDiscountCodes({
        shop,
        id,
        requestBody,
    }: {
        /**
         * Shopify shop domain
         */
        shop: string,
        /**
         * Discount ID
         */
        id: string,
        requestBody: {
            quantity?: number;
            prefix?: string;
            pattern?: string;
        },
    }): CancelablePromise<{
        generated?: number;
        shopifyGids?: Array<string>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/discounts/{id}/pool/generate',
            path: {
                'id': id,
            },
            query: {
                'shop': shop,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get pool status
     * Get discount code pool statistics
     * @returns any Pool status
     * @throws ApiError
     */
    public static getPoolStatus({
        shop,
        id,
    }: {
        /**
         * Shopify shop domain
         */
        shop: string,
        /**
         * Discount ID
         */
        id: string,
    }): CancelablePromise<{
        total?: number;
        reserved?: number;
        available?: number;
        used?: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/discounts/{id}/pool/status',
            path: {
                'id': id,
            },
            query: {
                'shop': shop,
            },
        });
    }
    /**
     * Reserve discount codes
     * Reserve N unique codes for a campaign
     * @returns any Reservation results
     * @throws ApiError
     */
    public static reserveDiscountCodes({
        shop,
        id,
        requestBody,
    }: {
        /**
         * Shopify shop domain
         */
        shop: string,
        /**
         * Discount ID
         */
        id: string,
        requestBody: {
            campaignId?: string;
            count?: number;
        },
    }): CancelablePromise<{
        reservationId?: string;
        reserved?: number;
        expiresAt?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/discounts/{id}/pool/reserve',
            path: {
                'id': id,
            },
            query: {
                'shop': shop,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete reservation
     * Cancel a discount code reservation
     * @returns any Reservation cancelled
     * @throws ApiError
     */
    public static deleteReservation({
        shop,
        id,
        reservationId,
    }: {
        /**
         * Shopify shop domain
         */
        shop: string,
        /**
         * Discount ID
         */
        id: string,
        /**
         * Reservation ID
         */
        reservationId: string,
    }): CancelablePromise<{
        cancelled?: boolean;
        released?: number;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/discounts/{id}/pool/reservations/{reservationId}',
            path: {
                'id': id,
                'reservationId': reservationId,
            },
            query: {
                'shop': shop,
            },
        });
    }
}
