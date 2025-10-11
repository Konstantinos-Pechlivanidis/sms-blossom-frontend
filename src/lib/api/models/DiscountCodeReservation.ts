/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type DiscountCodeReservation = {
    id: string;
    shopId: string;
    poolId: string;
    campaignId: string;
    quantity: number;
    status: 'active' | 'used' | 'expired' | 'cancelled';
    expiresAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

