/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTemplateRequest } from '../models/CreateTemplateRequest';
import type { SMSSegments } from '../models/SMSSegments';
import type { Template } from '../models/Template';
import type { TemplateListResponse } from '../models/TemplateListResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TemplatesService {
    /**
     * List templates
     * Retrieve SMS templates for the shop
     * @returns TemplateListResponse List of templates
     * @throws ApiError
     */
    public static listTemplates({
        shop,
        trigger,
    }: {
        /**
         * Shopify shop domain
         */
        shop: string,
        /**
         * Filter by trigger type
         */
        trigger?: 'abandoned_checkout' | 'order_created' | 'order_paid' | 'fulfillment_update' | 'welcome' | 'back_in_stock',
    }): CancelablePromise<TemplateListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/templates',
            query: {
                'shop': shop,
                'trigger': trigger,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Create template
     * Create a new SMS template
     * @returns Template Template created successfully
     * @throws ApiError
     */
    public static createTemplate({
        shop,
        requestBody,
    }: {
        /**
         * Shopify shop domain
         */
        shop: string,
        requestBody: CreateTemplateRequest,
    }): CancelablePromise<Template> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/templates',
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
     * Preview template
     * Preview how a template will render with sample data
     * @returns any Template preview
     * @throws ApiError
     */
    public static previewTemplate({
        requestBody,
    }: {
        requestBody: {
            /**
             * Template body with Liquid syntax
             */
            body?: string;
            /**
             * Sample variables for rendering
             */
            variables?: Record<string, any>;
            /**
             * Locale for formatting
             */
            locale?: string;
        },
    }): CancelablePromise<{
        text?: string;
        warnings?: Array<string>;
        segments?: SMSSegments;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/templates/preview',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Validate template
     * Validate template syntax and required variables
     * @returns any Validation results
     * @throws ApiError
     */
    public static validateTemplate({
        requestBody,
    }: {
        requestBody: {
            /**
             * Template body to validate
             */
            body?: string;
            /**
             * Trigger type for validation
             */
            trigger?: 'abandoned_checkout' | 'order_created' | 'order_paid' | 'fulfillment_update' | 'welcome' | 'back_in_stock';
        },
    }): CancelablePromise<{
        ok?: boolean;
        errors?: Array<string>;
        warnings?: Array<string>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/templates/validate',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get template variables
     * Get available variables for a specific trigger type
     * @returns any Available variables
     * @throws ApiError
     */
    public static getTemplateVariables({
        trigger,
    }: {
        /**
         * Trigger type
         */
        trigger: 'abandoned_checkout' | 'order_created' | 'order_paid' | 'fulfillment_update' | 'welcome' | 'back_in_stock',
    }): CancelablePromise<{
        required?: Array<string>;
        optional?: Array<string>;
        description?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/templates/variables/{trigger}',
            path: {
                'trigger': trigger,
            },
        });
    }
}
