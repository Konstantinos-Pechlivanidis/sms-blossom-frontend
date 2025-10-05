/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConsentRequest } from '../models/ConsentRequest';
import type { ConsentResponse } from '../models/ConsentResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PublicService {
    /**
     * Collect SMS consent via App Proxy
     * Validates App Proxy signature, normalizes phone to E.164, links/creates customer (PCD-safe), updates Shopify SMS consent when allowed, and upserts local Contact.
     *
     * @returns ConsentResponse Consent accepted (Shopify push may be pending if PCD not approved)
     * @throws ApiError
     */
    public static collectConsent({
        shop,
        timestamp,
        signature,
        requestBody,
    }: {
        /**
         * Shopify shop domain (added by App Proxy)
         */
        shop: string,
        /**
         * App Proxy timestamp
         */
        timestamp: string,
        /**
         * App Proxy HMAC
         */
        signature: string,
        requestBody: ConsentRequest,
    }): CancelablePromise<ConsentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/public/storefront/consent',
            query: {
                'shop': shop,
                'timestamp': timestamp,
                'signature': signature,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Invalid App Proxy signature`,
                422: `Invalid payload or phone format`,
            },
        });
    }
    /**
     * Public unsubscribe (App Proxy)
     * @returns string Confirmation HTML
     * @throws ApiError
     */
    public static publicUnsubscribe({
        shop,
        timestamp,
        signature,
        phone,
    }: {
        shop: string,
        timestamp: string,
        signature: string,
        phone: string,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/public/unsubscribe',
            query: {
                'shop': shop,
                'timestamp': timestamp,
                'signature': signature,
                'phone': phone,
            },
            errors: {
                401: `Invalid signature`,
                422: `Missing params`,
            },
        });
    }
    /**
     * Register back-in-stock interest (App Proxy signed)
     * @returns any Registered
     * @throws ApiError
     */
    public static registerBackInStockInterest({
        shop,
        timestamp,
        signature,
        requestBody,
    }: {
        shop: string,
        timestamp: string,
        signature: string,
        requestBody: {
            phone: string;
            inventoryItemId: string;
        },
    }): CancelablePromise<{
        ok?: boolean;
        id?: string;
        productMeta?: any | null;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/public/back-in-stock/interest',
            query: {
                'shop': shop,
                'timestamp': timestamp,
                'signature': signature,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Invalid signature`,
                403: `No consent for this contact`,
                404: `Unknown shop or contact`,
                422: `Missing or invalid params`,
            },
        });
    }
}
