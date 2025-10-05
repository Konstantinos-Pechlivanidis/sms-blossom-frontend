/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CampaignsService {
    /**
     * Snapshot audience from segment/filter into recipients
     * @returns any Snapshot done
     * @throws ApiError
     */
    public static snapshotCampaign({
        id,
        shop,
    }: {
        id: string,
        shop: string,
    }): CancelablePromise<{
        ok?: boolean;
        total?: number;
        inserted?: number;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/campaigns/{id}/snapshot',
            path: {
                'id': id,
            },
            query: {
                'shop': shop,
            },
            errors: {
                404: `Unknown shop or campaign`,
            },
        });
    }
    /**
     * Estimate cost/segments for pending recipients
     * @returns any Estimate returned
     * @throws ApiError
     */
    public static estimateCampaign({
        id,
        shop,
    }: {
        id: string,
        shop: string,
    }): CancelablePromise<{
        ok?: boolean;
        recipients?: number;
        perMessageSegments?: number;
        totalSegments?: number;
        estCost?: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/campaigns/{id}/estimate',
            path: {
                'id': id,
            },
            query: {
                'shop': shop,
            },
            errors: {
                404: `Unknown shop or campaign`,
            },
        });
    }
    /**
     * Test send to a specific phone (E.164)
     * @returns any Test send result
     * @throws ApiError
     */
    public static testSendCampaign({
        id,
        shop,
        requestBody,
    }: {
        id: string,
        shop: string,
        requestBody: {
            phone: string;
        },
    }): CancelablePromise<{
        ok?: boolean;
        result?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/campaigns/{id}/test-send',
            path: {
                'id': id,
            },
            query: {
                'shop': shop,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Unknown shop, campaign, or contact`,
                422: `Missing phone`,
            },
        });
    }
    /**
     * Send to snapshotted audience (batched, throttled)
     * @returns any Send summary
     * @throws ApiError
     */
    public static sendCampaign({
        id,
        shop,
    }: {
        id: string,
        shop: string,
    }): CancelablePromise<{
        ok?: boolean;
        sent?: number;
        failed?: number;
        skipped?: number;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/campaigns/{id}/send-now',
            path: {
                'id': id,
            },
            query: {
                'shop': shop,
            },
            errors: {
                404: `Unknown shop or campaign`,
            },
        });
    }
    /**
     * Attach an existing Discount to a Campaign
     * @returns any Attached
     * @throws ApiError
     */
    public static attachDiscountToCampaign({
        id,
        shop,
        requestBody,
    }: {
        id: string,
        shop: string,
        requestBody: {
            discountId?: string;
            code?: string;
        },
    }): CancelablePromise<{
        ok?: boolean;
        campaignId?: string;
        discountId?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/campaigns/{id}/attach-discount',
            path: {
                'id': id,
            },
            query: {
                'shop': shop,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Unknown shop, campaign, or discount`,
            },
        });
    }
    /**
     * Detach discount from Campaign
     * @returns any Detached
     * @throws ApiError
     */
    public static detachDiscountFromCampaign({
        id,
        shop,
    }: {
        id: string,
        shop: string,
    }): CancelablePromise<{
        ok?: boolean;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/campaigns/{id}/detach-discount',
            path: {
                'id': id,
            },
            query: {
                'shop': shop,
            },
            errors: {
                404: `Unknown shop or campaign`,
            },
        });
    }
    /**
     * Set UTM params for Campaign
     * @returns any Saved
     * @throws ApiError
     */
    public static setCampaignUtm({
        id,
        shop,
        requestBody,
    }: {
        id: string,
        shop: string,
        requestBody: Record<string, any>,
    }): CancelablePromise<{
        ok?: boolean;
        utm?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/campaigns/{id}/utm',
            path: {
                'id': id,
            },
            query: {
                'shop': shop,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Unknown shop or campaign`,
            },
        });
    }
    /**
     * Preview campaign discount apply URL (UTM/shortlink)
     * @returns any URL returned
     * @throws ApiError
     */
    public static getCampaignApplyUrl({
        id,
        shop,
        redirect = '/checkout',
        short = false,
    }: {
        id: string,
        shop: string,
        redirect?: string,
        short?: boolean,
    }): CancelablePromise<{
        ok?: boolean;
        url?: string;
        short?: string | null;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/campaigns/{id}/apply-url',
            path: {
                'id': id,
            },
            query: {
                'shop': shop,
                'redirect': redirect,
                'short': short,
            },
            errors: {
                404: `Unknown shop or campaign`,
                422: `Campaign has no discount`,
            },
        });
    }
}
