/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WebhooksService {
    /**
     * Shopify webhooks ingress (HMAC verified)
     * @returns any Accepted
     * @throws ApiError
     */
    public static shopifyWebhook({
        topic,
        xShopifyTopic,
        xShopifyHmacSha256,
        xShopifyShopDomain,
    }: {
        topic: string,
        xShopifyTopic?: string,
        xShopifyHmacSha256?: string,
        xShopifyShopDomain?: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webhooks/shopify/{topic}',
            path: {
                'topic': topic,
            },
            headers: {
                'X-Shopify-Topic': xShopifyTopic,
                'X-Shopify-Hmac-Sha256': xShopifyHmacSha256,
                'X-Shopify-Shop-Domain': xShopifyShopDomain,
            },
            errors: {
                401: `Invalid HMAC signature`,
            },
        });
    }
    /**
     * Mitto delivery receipts
     * @returns any Acknowledged
     * @throws ApiError
     */
    public static mittoDlr({
        mid,
    }: {
        mid: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webhooks/mitto/dlr',
            query: {
                'mid': mid,
            },
            errors: {
                400: `Missing mid parameter`,
            },
        });
    }
    /**
     * Mitto inbound MO (STOP/UNSUB)
     * @returns any Acknowledged
     * @throws ApiError
     */
    public static mittoInbound(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webhooks/mitto/inbound',
            errors: {
                400: `Invalid request`,
            },
        });
    }
}
