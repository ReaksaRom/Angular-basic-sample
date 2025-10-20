export interface Product {
    id: number;
    name: string;
    categoryId: number;
    price: number;
    description: string;
    imageUrl: string;
    stock: number;
    featured: boolean;
    discount: number;
}
export interface CartItem {
    product: Product;
    quantity: number;
}