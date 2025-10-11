/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Segment = {
    /**
     * Segment ID
     */
    id: string;
    /**
     * Segment name
     */
    name: string;
    /**
     * Segment filter DSL
     */
    filterJson: Record<string, any>;
    /**
     * Last materialization time
     */
    lastMaterializedAt?: string | null;
    /**
     * Shop ID
     */
    shopId: string;
    createdAt: string;
    updatedAt: string;
    // @cursor-doc:start(new-segment-fields)
    /**
     * Whether this is a system-managed segment
     */
    isSystem?: boolean;
    /**
     * Unique slug per shop for system segments
     */
    slug?: string;
    // @cursor-doc:end(new-segment-fields)
};

