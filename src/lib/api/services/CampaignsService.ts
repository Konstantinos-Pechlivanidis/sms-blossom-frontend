/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Campaign } from '../models/Campaign';
import type { CampaignEstimate } from '../models/CampaignEstimate';
import type { CampaignListResponse } from '../models/CampaignListResponse';
import type { CreateCampaignRequest } from '../models/CreateCampaignRequest';
import type { UpdateCampaignRequest } from '../models/UpdateCampaignRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CampaignsService {
    /**
     * List campaigns
     * Retrieve paginated list of campaigns for the authenticated shop
     * @returns CampaignListResponse List of campaigns
     * @throws ApiError
     */
    public static listCampaigns({
        shop,
        page = 1,
        limit = 20,
        status,
    }: {
        /**
         * Shopify shop domain
         */
        shop: string,
        /**
         * Page number for pagination
         */
        page?: number,
        /**
         * Number of items per page
         */
        limit?: number,
        /**
         * Filter by campaign status
         */
        status?: 'draft' | 'scheduled' | 'sending' | 'paused' | 'completed' | 'failed',
    }): CancelablePromise<CampaignListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/campaigns',
            query: {
                'shop': shop,
                'page': page,
                'limit': limit,
                'status': status,
            },
            errors: {
                400: `Invalid request parameters`,
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Create campaign
     * Create a new SMS campaign
     * @returns Campaign Campaign created successfully
     * @throws ApiError
     */
    public static createCampaign({
        shop,
        requestBody,
    }: {
        /**
         * Shopify shop domain
         */
        shop: string,
        requestBody: CreateCampaignRequest,
    }): CancelablePromise<Campaign> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/campaigns',
            query: {
                'shop': shop,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request data`,
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Get campaign
     * Retrieve a specific campaign by ID
     * @returns Campaign Campaign details
     * @throws ApiError
     */
    public static getCampaign({
        id,
        shop,
    }: {
        /**
         * Campaign ID
         */
        id: string,
        /**
         * Shopify shop domain
         */
        shop: string,
    }): CancelablePromise<Campaign> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/campaigns/{id}',
            path: {
                'id': id,
            },
            query: {
                'shop': shop,
            },
            errors: {
                401: `Unauthorized`,
                404: `Campaign not found`,
            },
        });
    }
    /**
     * Update campaign
     * Update an existing campaign
     * @returns Campaign Campaign updated successfully
     * @throws ApiError
     */
    public static updateCampaign({
        id,
        shop,
        requestBody,
    }: {
        /**
         * Campaign ID
         */
        id: string,
        /**
         * Shopify shop domain
         */
        shop: string,
        requestBody: UpdateCampaignRequest,
    }): CancelablePromise<Campaign> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/campaigns/{id}',
            path: {
                'id': id,
            },
            query: {
                'shop': shop,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request data`,
                404: `Campaign not found`,
            },
        });
    }
    /**
     * Delete campaign
     * Delete a campaign (only if not sent)
     * @returns void
     * @throws ApiError
     */
    public static deleteCampaign({
        id,
        shop,
    }: {
        /**
         * Campaign ID
         */
        id: string,
        /**
         * Shopify shop domain
         */
        shop: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/campaigns/{id}',
            path: {
                'id': id,
            },
            query: {
                'shop': shop,
            },
            errors: {
                400: `Cannot delete sent campaign`,
                404: `Campaign not found`,
            },
        });
    }
    /**
     * Estimate campaign
     * Estimate campaign recipients and cost before sending
     * @returns CampaignEstimate Campaign estimate
     * @throws ApiError
     */
    public static estimateCampaign({
        id,
        shop,
    }: {
        /**
         * Campaign ID
         */
        id: string,
        /**
         * Shopify shop domain
         */
        shop: string,
    }): CancelablePromise<CampaignEstimate> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/campaigns/{id}/estimate',
            path: {
                'id': id,
            },
            query: {
                'shop': shop,
            },
            errors: {
                404: `Campaign not found`,
            },
        });
    }
    /**
     * Test send campaign
     * Send test SMS to a specific phone number
     * @returns any Test SMS sent successfully
     * @throws ApiError
     */
    public static testSendCampaign({
        id,
        shop,
        requestBody,
    }: {
        /**
         * Campaign ID
         */
        id: string,
        /**
         * Shopify shop domain
         */
        shop: string,
        requestBody: {
            /**
             * Phone number in E.164 format
             */
            phone?: string;
            /**
             * Template variables for testing
             */
            variables?: Record<string, any>;
        },
    }): CancelablePromise<{
        success?: boolean;
        messageId?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/campaigns/{id}/test',
            path: {
                'id': id,
            },
            query: {
                'shop': shop,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid phone number or campaign`,
            },
        });
    }
    /**
     * Send campaign
     * Start sending a campaign to its audience
     * @returns any Campaign sending started
     * @throws ApiError
     */
    public static sendCampaign({
        id,
        shop,
    }: {
        /**
         * Campaign ID
         */
        id: string,
        /**
         * Shopify shop domain
         */
        shop: string,
    }): CancelablePromise<{
        success?: boolean;
        campaignId?: string;
        estimatedRecipients?: number;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/campaigns/{id}/send',
            path: {
                'id': id,
            },
            query: {
                'shop': shop,
            },
            errors: {
                400: `Campaign cannot be sent`,
            },
        });
    }
    /**
     * Prepare campaign
     * Pre-assign discount codes and prebuild shortlinks
     * @returns any Campaign prepared
     * @throws ApiError
     */
    public static prepareCampaign({
        shop,
        id,
    }: {
        /**
         * Shopify shop domain
         */
        shop: string,
        /**
         * Campaign ID
         */
        id: string,
    }): CancelablePromise<{
        prepared?: boolean;
        codesAssigned?: number;
        shortlinksBuilt?: number;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/campaigns/{id}/prepare',
            path: {
                'id': id,
            },
            query: {
                'shop': shop,
            },
        });
    }
}
