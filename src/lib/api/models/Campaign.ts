/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Campaign = {
    /**
     * Campaign ID
     */
    id: string;
    /**
     * Campaign name
     */
    name: string;
    status: 'draft' | 'scheduled' | 'sending' | 'paused' | 'completed' | 'failed';
    /**
     * Template content
     */
    template?: string | null;
    /**
     * Target segment ID
     */
    segmentId?: string | null;
    /**
     * Template ID
     */
    templateId?: string | null;
    /**
     * Template key
     */
    templateKey?: string | null;
    /**
     * Scheduled send time
     */
    scheduleAt?: string | null;
    /**
     * UTM tracking parameters
     */
    utmJson?: Record<string, any> | null;
    /**
     * Batch size for sending
     */
    batchSize?: number | null;
    /**
     * SMS body text
     */
    bodyText?: string | null;
    /**
     * Associated discount ID
     */
    discountId?: string | null;
    /**
     * Shop ID
     */
    shopId: string;
    createdAt: string;
    updatedAt: string;
};

