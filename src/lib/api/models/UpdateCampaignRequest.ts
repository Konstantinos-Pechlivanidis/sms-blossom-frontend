/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateCampaignRequest = {
    name?: string;
    template?: string | null;
    segmentId?: string | null;
    scheduleAt?: string | null;
    status?: 'draft' | 'scheduled' | 'sending' | 'paused' | 'completed' | 'failed';
};

