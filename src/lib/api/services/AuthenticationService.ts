/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthenticationService {
    /**
     * Shopify OAuth installation
     * Initiates Shopify OAuth flow for app installation
     * @returns void
     * @throws ApiError
     */
    public static installApp({
        shop,
        hmac,
        timestamp,
        state,
    }: {
        /**
         * Shopify shop domain (e.g., mystore.myshopify.com)
         */
        shop: string,
        /**
         * HMAC signature for request validation
         */
        hmac?: string,
        /**
         * Request timestamp
         */
        timestamp?: string,
        /**
         * OAuth state parameter
         */
        state?: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/install',
            query: {
                'shop': shop,
                'hmac': hmac,
                'timestamp': timestamp,
                'state': state,
            },
            errors: {
                302: `Redirect to Shopify OAuth`,
                400: `Invalid request parameters`,
            },
        });
    }
    /**
     * Shopify OAuth callback
     * Handles Shopify OAuth callback and completes app installation
     * @returns any OAuth successful
     * @throws ApiError
     */
    public static handleOAuthCallback({
        code,
        shop,
        state,
        hmac,
    }: {
        /**
         * Authorization code from Shopify
         */
        code: string,
        /**
         * Shopify shop domain
         */
        shop: string,
        /**
         * OAuth state parameter
         */
        state?: string,
        /**
         * HMAC signature for request validation
         */
        hmac?: string,
    }): CancelablePromise<{
        success?: boolean;
        shop?: string;
        token?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/callback',
            query: {
                'code': code,
                'shop': shop,
                'state': state,
                'hmac': hmac,
            },
            errors: {
                400: `OAuth failed`,
            },
        });
    }
}
