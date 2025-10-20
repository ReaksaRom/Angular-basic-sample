export interface Supplier {
    id: number;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    productsSupplied: number;
    rating: number;
    status: 'active' | 'inactive';
}
