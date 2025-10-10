/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ShopSettings } from '../models/ShopSettings';
import type { UpdateSettingsRequest } from '../models/UpdateSettingsRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SettingsService {
    /**
     * Get shop settings
     * Retrieve shop configuration and automation settings
     * @returns ShopSettings Shop settings
     * @throws ApiError
     */
    public static getSettings({
        shop,
    }: {
        /**
         * Shopify shop domain
         */
        shop: string,
    }): CancelablePromise<ShopSettings> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/settings',
            query: {
                'shop': shop,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Update shop settings
     * Update shop configuration and automation settings
     * @returns ShopSettings Settings updated successfully
     * @throws ApiError
     */
    public static updateSettings({
        shop,
        requestBody,
    }: {
        /**
         * Shopify shop domain
         */
        shop: string,
        requestBody: UpdateSettingsRequest,
    }): CancelablePromise<ShopSettings> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/settings',
            query: {
                'shop': shop,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid settings data`,
                401: `Unauthorized`,
            },
        });
    }
}
