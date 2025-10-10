/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MittoDLRPayload = {
    /**
     * Message ID
     */
    messageId: string;
    /**
     * Delivery status
     */
    status: 'delivered' | 'failed' | 'pending';
    /**
     * Status timestamp
     */
    timestamp: string;
    /**
     * Error code if failed
     */
    errorCode?: string | null;
    /**
     * Error message if failed
     */
    errorMessage?: string | null;
};

