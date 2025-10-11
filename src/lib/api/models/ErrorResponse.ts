/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ErrorResponse = {
    /**
     * Error code
     */
    error: string;
    /**
     * Human-readable error message
     */
    message: string;
    /**
     * Additional error details
     */
    details?: Record<string, any>;
    /**
     * Request trace ID for debugging
     */
    traceId?: string;
};

