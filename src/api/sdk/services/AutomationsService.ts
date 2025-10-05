/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AutomationsResponse } from '../models/AutomationsResponse';
import type { AutomationsUpdateRequest } from '../models/AutomationsUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AutomationsService {
    /**
     * Read automations config
     * Includes abandoned checkout settings:
     * - `abandoned.delayMinutes`: inactivity window before SMS is sent (default 30)
     * - `abandoned.discountCode`: optional code appended to recovery URL
     *
     * @returns AutomationsResponse Automations config
     * @throws ApiError
     */
    public static getAutomations({
        shop,
    }: {
        shop: string,
    }): CancelablePromise<AutomationsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/automations',
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
     * Update automations config
     * @returns AutomationsResponse Updated automations config
     * @throws ApiError
     */
    public static updateAutomations({
        shop,
        requestBody,
    }: {
        shop: string,
        requestBody: AutomationsUpdateRequest,
    }): CancelablePromise<AutomationsResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/automations',
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
