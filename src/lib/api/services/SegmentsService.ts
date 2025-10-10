/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateSegmentRequest } from '../models/CreateSegmentRequest';
import type { Segment } from '../models/Segment';
import type { SegmentListResponse } from '../models/SegmentListResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SegmentsService {
    /**
     * List segments
     * Retrieve customer segments
     * @returns SegmentListResponse List of segments
     * @throws ApiError
     */
    public static listSegments({
        shop,
        page = 1,
        limit = 20,
    }: {
        /**
         * Shopify shop domain
         */
        shop: string,
        page?: number,
        limit?: number,
    }): CancelablePromise<SegmentListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/segments',
            query: {
                'shop': shop,
                'page': page,
                'limit': limit,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Create segment
     * Create a new customer segment
     * @returns Segment Segment created successfully
     * @throws ApiError
     */
    public static createSegment({
        shop,
        requestBody,
    }: {
        /**
         * Shopify shop domain
         */
        shop: string,
        requestBody: CreateSegmentRequest,
    }): CancelablePromise<Segment> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/segments',
            query: {
                'shop': shop,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request data`,
            },
        });
    }
    /**
     * Preview segment
     * Preview segment filter and get estimated count
     * @returns any Segment preview
     * @throws ApiError
     */
    public static previewSegment({
        shop,
        requestBody,
    }: {
        /**
         * Shopify shop domain
         */
        shop: string,
        requestBody: {
            /**
             * Segment filter DSL
             */
            filterJson?: Record<string, any>;
        },
    }): CancelablePromise<{
        estimatedCount?: number;
        /**
         * Parsed filter object
         */
        filter?: Record<string, any>;
        warnings?: Array<string>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/segments/preview',
            query: {
                'shop': shop,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
