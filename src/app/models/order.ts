// 🧩 Each item in an order
export interface OrderItem {
    productId: number;
    quantity: number;
    price: number;
}

// 🏠 Shipping address for an order
export interface ShippingAddress {
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
}

// 📦 Order model
export interface Order {
    id: number;
    userId: number;
    date: string;
    total: number;
    items: OrderItem[];
    status: 'Processing' | 'Delivered' | 'Cancelled'; // 🔒 better typing
    shippingAddress: ShippingAddress;
}
