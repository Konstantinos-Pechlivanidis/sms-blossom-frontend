/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SegmentsService {
    /**
     * Create or update a Segment
     * @returns any Segment upserted
     * @throws ApiError
     */
    public static createSegment({
        shop,
        requestBody,
    }: {
        shop: string,
        requestBody: {
            id?: string;
            name: string;
            filterJson: Record<string, any>;
        },
    }): CancelablePromise<{
        ok?: boolean;
        segment?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/segments',
            query: {
                'shop': shop,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Unknown shop`,
                422: `Invalid payload`,
            },
        });
    }
    /**
     * Preview segment audience (count + sample)
     * @returns any Count and sample returned
     * @throws ApiError
     */
    public static previewSegment({
        shop,
        limit = 25,
        requestBody,
    }: {
        shop: string,
        limit?: number,
        requestBody?: {
            filterJson?: Record<string, any>;
        },
    }): CancelablePromise<{
        ok?: boolean;
        count?: number;
        sample?: Array<Record<string, any>>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/segments/preview',
            query: {
                'shop': shop,
                'limit': limit,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Unknown shop`,
            },
        });
    }
}
