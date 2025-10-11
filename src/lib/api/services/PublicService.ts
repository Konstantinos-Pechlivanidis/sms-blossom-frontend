/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PublicService {
    /**
     * Public unsubscribe
     * Handle public unsubscribe requests from App Proxy
     * @returns any Unsubscribe processed successfully
     * @throws ApiError
     */
    public static publicUnsubscribe({
        requestBody,
    }: {
        requestBody: {
            /**
             * Phone number to unsubscribe
             */
            phone?: string;
            /**
             * Shop domain
             */
            shop?: string;
        },
    }): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/public/unsubscribe',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request`,
            },
        });
    }
    /**
     * Back in stock notification
     * Handle back in stock notification requests from App Proxy
     * @returns any Back in stock request processed
     * @throws ApiError
     */
    public static publicBackInStock({
        requestBody,
    }: {
        requestBody: {
            /**
             * Phone number for notification
             */
            phone?: string;
            /**
             * Shop domain
             */
            shop?: string;
            /**
             * Shopify product ID
             */
            productId?: string;
            /**
             * Shopify variant ID
             */
            variantId?: string;
        },
    }): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/public/back-in-stock',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request`,
            },
        });
    }
}
