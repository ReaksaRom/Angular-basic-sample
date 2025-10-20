// models/discount.ts
export interface Discount {
    id: number;
    code: string;
    name: string;
    description: string;
    type: 'percentage' | 'fixed_amount' | 'free_shipping';
    value: number;
    minimumAmount?: number;
    maximumDiscount?: number;
    startDate: string;
    endDate: string;
    usageLimit?: number;
    usedCount: number;
    isActive: boolean;
    applyTo: 'all_products' | 'specific_products' | 'specific_categories';
    products?: number[];
    categories?: number[];
    customerEligibility: 'all_customers' | 'specific_customers' | 'new_customers';
    customers?: number[];
    oncePerCustomer: boolean;
    freeShipping: boolean;
    createdAt: string;
    createdBy: string;
}

export interface DiscountUsage {
    id: number;
    discountId: number;
    discountCode: string;
    orderId: number;
    customerId: number;
    customerName: string;
    customerEmail: string;
    discountAmount: number;
    orderTotal: number;
    usedAt: string;
}

export interface DiscountStats {
    totalDiscounts: number;
    activeDiscounts: number;
    expiredDiscounts: number;
    totalSavings: number;
    usageCount: number;
    popularDiscounts: { code: string; usage: number }[];
}