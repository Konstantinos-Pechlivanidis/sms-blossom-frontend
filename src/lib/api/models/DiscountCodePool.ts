/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type DiscountCodePool = {
    id: string;
    shopId: string;
    discountId: string;
    name: string;
    description?: string | null;
    totalCodes: number;
    reservedCodes: number;
    usedCodes: number;
    status: 'active' | 'inactive' | 'exhausted';
    createdAt?: string;
    updatedAt?: string;
};

