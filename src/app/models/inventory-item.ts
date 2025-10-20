export interface InventoryItem {
    id: number;
    productId: number;
    productName: string;
    sku: string;
    currentStock: number;
    lowStockThreshold: number;
    reorderPoint: number;
    costPrice: number;
    sellingPrice: number;
    location: string;
    supplier: string;
    lastRestocked: string;
    nextRestockDate?: string;
    status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
    category: string;
    imageUrl?: string;
}
