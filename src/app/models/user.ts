export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'customer' | 'seller' | string; // flexible but typed
    avatar: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    zipCode?: string;
    createdAt: string;
}
