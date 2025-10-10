/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type DiscountCode = {
    id: string;
    shopId: string;
    poolId: string;
    discountId: string;
    code: string;
    status: 'available' | 'reserved' | 'used' | 'expired';
    reservedAt?: string | null;
    usedAt?: string | null;
    assignedTo?: string | null;
    shopifyGid?: string | null;
    reservationId?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

