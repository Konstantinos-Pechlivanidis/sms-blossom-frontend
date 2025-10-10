/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MittoDLRPayload } from '../models/MittoDLRPayload';
import type { MittoInboundPayload } from '../models/MittoInboundPayload';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WebhooksService {
    /**
     * Shopify orders/create webhook
     * Handle Shopify order creation webhook
     * @returns any Webhook processed successfully
     * @throws ApiError
     */
    public static handleOrdersCreate({
        requestBody,
    }: {
        requestBody: Record<string, any>,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webhooks/shopify/orders/create',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid webhook payload`,
                401: `Invalid HMAC signature`,
            },
        });
    }
    /**
     * Shopify orders/paid webhook
     * Handle Shopify order payment webhook
     * @returns any Webhook processed successfully
     * @throws ApiError
     */
    public static handleOrdersPaid({
        requestBody,
    }: {
        requestBody: Record<string, any>,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webhooks/shopify/orders/paid',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid webhook payload`,
                401: `Invalid HMAC signature`,
            },
        });
    }
    /**
     * Shopify checkouts/create webhook
     * Handle Shopify checkout creation webhook
     * @returns any Webhook processed successfully
     * @throws ApiError
     */
    public static handleCheckoutsCreate({
        requestBody,
    }: {
        requestBody: Record<string, any>,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webhooks/shopify/checkouts/create',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid webhook payload`,
                401: `Invalid HMAC signature`,
            },
        });
    }
    /**
     * Shopify checkouts/update webhook
     * Handle Shopify checkout update webhook (abandoned checkout detection)
     * @returns any Webhook processed successfully
     * @throws ApiError
     */
    public static handleCheckoutsUpdate({
        requestBody,
    }: {
        requestBody: Record<string, any>,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webhooks/shopify/checkouts/update',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid webhook payload`,
                401: `Invalid HMAC signature`,
            },
        });
    }
    /**
     * Mitto DLR webhook
     * Handle Mitto delivery receipt webhook
     * @returns any DLR processed successfully
     * @throws ApiError
     */
    public static handleMittoDlr({
        requestBody,
    }: {
        requestBody: MittoDLRPayload,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webhooks/mitto/dlr',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid DLR payload`,
                401: `Invalid HMAC signature`,
            },
        });
    }
    /**
     * Mitto inbound webhook
     * Handle Mitto inbound SMS webhook
     * @returns any Inbound message processed successfully
     * @throws ApiError
     */
    public static handleMittoInbound({
        requestBody,
    }: {
        requestBody: MittoInboundPayload,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webhooks/mitto/inbound',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid inbound payload`,
                401: `Invalid HMAC signature`,
            },
        });
    }
}
