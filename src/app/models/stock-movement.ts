export interface StockMovement {
    id: number;
    productId: number;
    productName: string;
    type: 'in' | 'out' | 'adjustment';
    quantity: number;
    previousStock: number;
    newStock: number;
    reason: string;
    date: string;
    performedBy: string;
    reference?: string; // Order ID, PO number, etc.
}
