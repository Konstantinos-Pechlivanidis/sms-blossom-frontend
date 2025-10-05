/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GdprService {
    /**
     * Shopify GDPR webhooks (HMAC verified)
     * @returns any Acknowledged
     * @throws ApiError
     */
    public static gdprWebhook({
        topic,
        xShopifyHmacSha256,
        xShopifyShopDomain,
    }: {
        topic: 'customers/data_request' | 'customers/redact' | 'shop/redact',
        xShopifyHmacSha256?: string,
        xShopifyShopDomain?: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webhooks/gdpr/{topic}',
            path: {
                'topic': topic,
            },
            headers: {
                'X-Shopify-Hmac-Sha256': xShopifyHmacSha256,
                'X-Shopify-Shop-Domain': xShopifyShopDomain,
            },
            errors: {
                401: `Invalid HMAC signature`,
            },
        });
    }
}
