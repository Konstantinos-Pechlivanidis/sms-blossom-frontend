/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SettingsGetResponse } from '../models/SettingsGetResponse';
import type { SettingsPutRequest } from '../models/SettingsPutRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SettingsService {
    /**
     * Get shop settings (rules, timezone)
     * @returns SettingsGetResponse Settings payload
     * @throws ApiError
     */
    public static getSettings({
        shop,
    }: {
        shop: string,
    }): CancelablePromise<SettingsGetResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/settings',
            query: {
                'shop': shop,
            },
            errors: {
                400: `Missing shop parameter`,
                404: `Shop not found`,
            },
        });
    }
    /**
     * Update shop settings (quiet hours, caps, abandoned delay)
     * @returns SettingsGetResponse Updated settings
     * @throws ApiError
     */
    public static updateSettings({
        shop,
        requestBody,
    }: {
        shop: string,
        requestBody: SettingsPutRequest,
    }): CancelablePromise<SettingsGetResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/settings',
            query: {
                'shop': shop,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Missing shop parameter`,
                404: `Shop not found`,
                422: `Invalid payload`,
            },
        });
    }
}
