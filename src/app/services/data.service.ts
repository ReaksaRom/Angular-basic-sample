import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Order } from '../models/order';
import { CartItem, Product } from '../models/product';
import { Category } from '../models/category';
import { Review } from '../models/review';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  getWishlist() {
    throw new Error('Method not implemented.');
  }
  private readonly API_DATA = {
    products: [
      {
        id: 1,
        name: "iPhone 15 Pro",
        categoryId: 1,
        price: 1299,
        description: "Apple iPhone 15 Pro with A17 Bionic chip and 256GB storage.",
        imageUrl: "https://www.channelnews.com.au/wp-content/uploads/2023/08/iPhone-14-Pro-Purple-Side-Perspective-Feature-Purple.jpg",
        stock: 25,
        featured: true,
        discount: 10
      },
      {
        id: 2,
        name: "Samsung Galaxy S24",
        categoryId: 1,
        price: 1199,
        description: "Samsung Galaxy S24 with 200MP camera and 5000mAh battery.",
        imageUrl: "https://stg-images.samsung.com/is/image/samsung/assets/za/smartphones/galaxy-s24-ultra/images/hotfix4/galaxy-s24-ultra-highlights-color-titanium-gray-back-mo.jpg?imbypass=true",
        stock: 18,
        featured: false,
        discount: 5
      },
      {
        id: 3,
        name: "Sony WH-1000XM5 Headphones",
        categoryId: 2,
        price: 399,
        description: "Noise-cancelling over-ear headphones with Bluetooth 5.2.",
        imageUrl: "https://m.media-amazon.com/images/I/61eeHPRFQ9L.jpg_BO30,255,255,255_UF900,850_SR1910,1000,0,C_QL100_.jpg",
        stock: 40,
        featured: true,
        discount: 0
      },
      {
        id: 4,
        name: "MacBook Air M3",
        categoryId: 3,
        price: 1599,
        description: "Apple MacBook Air with M3 chip, 16GB RAM, and 512GB SSD.",
        imageUrl: "https://www.loveitcoverit.com/wp-content/uploads/MacBook-Air-M3.webp",
        stock: 12,
        featured: true,
        discount: 8
      },
      {
        id: 5,
        name: "Google Pixel 8 Pro",
        categoryId: 1,
        price: 999,
        description: "Google Pixel 8 Pro with advanced AI features and camera.",
        imageUrl: "https://cdn.movertix.com/media/catalog/product/cache/image/1200x/g/o/google-pixel-8-pro-5g-mint-128gb.jpg",
        stock: 15,
        featured: false,
        discount: 12
      },
      {
        id: 6,
        name: "Bose QuietComfort 45",
        categoryId: 2,
        price: 329,
        description: "Wireless Bluetooth headphones with noise cancellation.",
        imageUrl: "https://m.media-amazon.com/images/I/6111lUBzI3L.jpg",
        stock: 30,
        featured: false,
        discount: 15
      },
      // New Products Start Here
      {
        id: 7,
        name: "iPad Pro 12.9\" M2",
        categoryId: 4,
        price: 1099,
        description: "Apple iPad Pro with M2 chip and Liquid Retina XDR display.",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp3tHgw-RWuz2-6A5k8yYMNl0VvSPnFsng5g&s",
        stock: 20,
        featured: true,
        discount: 5
      },
      {
        id: 8,
        name: "Samsung Galaxy Tab S9",
        categoryId: 4,
        price: 849,
        description: "Samsung flagship tablet with S Pen and Dynamic AMOLED 2X display.",
        imageUrl: "https://angkormeas.com/wp-content/uploads/2023/12/Galaxy-Tab-S9-1.jpg",
        stock: 22,
        featured: false,
        discount: 8
      },
      {
        id: 9,
        name: "Apple Watch Series 9",
        categoryId: 5,
        price: 399,
        description: "Advanced smartwatch with blood oxygen app and ECG.",
        imageUrl: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/refurb-45-cell-alum-midnight-sport-band-midnight-s9?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=SWVwd2Q3em9qR2w5RTZiVWtmcWQ1bTJMMlhwVll0ZHVzeHFzc3ZKNFJEMzE4QUxxTWFsRmJQTXB3MEp1T2pHd0FtWVJCbTFqbVlJVmw3ZkRFUGZoZ0YzaTQrYy82TUg0cFZQeUN1eC9DMlZNQkJEMXc0aklkVno5c3lHT1ZQU0FBWnQyaFdoU3JxaEVXcE5wK3NMblRR",
        stock: 35,
        featured: true,
        discount: 0
      },
      {
        id: 10,
        name: "Samsung Galaxy Watch 6",
        categoryId: 5,
        price: 299,
        description: "Advanced health monitoring with sleep coaching and body composition.",
        imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/africa_en/2307/gallery/africa-en-galaxy-watch6-r945-sm-r940nzkamea-537401503?$684_547_PNG$",
        stock: 28,
        featured: false,
        discount: 10
      },
      {
        id: 11,
        name: "Dell XPS 13 Plus",
        categoryId: 3,
        price: 1299,
        description: "Ultra-thin laptop with InfinityEdge touch display and 12th Gen Intel Core.",
        imageUrl: "https://rootitsupport.com/userfiles/plus_9320-4.png",
        stock: 16,
        featured: true,
        discount: 12
      },
      {
        id: 12,
        name: "ASUS ROG Zephyrus G14",
        categoryId: 3,
        price: 1599,
        description: "Gaming laptop with AMD Ryzen 9 and NVIDIA GeForce RTX 4060.",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFd-z7WLBrFGcv-LrwBojPyKCSJDW37-HppY2iiWktmIki8y7-lctVkJKVefXcfxFQJy0&usqp=CAU",
        stock: 10,
        featured: false,
        discount: 15
      },
      {
        id: 13,
        name: "AirPods Pro (2nd Gen)",
        categoryId: 2,
        price: 249,
        description: "Wireless earbuds with Active Noise Cancellation and Transparency mode.",
        imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361",
        stock: 50,
        featured: true,
        discount: 0
      },
      {
        id: 14,
        name: "Samsung Galaxy Buds2 Pro",
        categoryId: 2,
        price: 229,
        description: "True wireless earbuds with 360 Audio and intelligent ANC.",
        imageUrl: "https://arystorephone.com/wp-content/uploads/2022/08/galaxy_buds2pro_graphite_1.jpg",
        stock: 45,
        featured: false,
        discount: 8
      },
      {
        id: 15,
        name: "PlayStation 5",
        categoryId: 6,
        price: 499,
        description: "Next-gen gaming console with 4K/120fps and ray tracing.",
        imageUrl: "https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21",
        stock: 8,
        featured: true,
        discount: 0
      },
      {
        id: 16,
        name: "Xbox Series X",
        categoryId: 6,
        price: 499,
        description: "4K gaming console with 120fps and Quick Resume feature.",
        imageUrl: "https://cms-assets.xboxservices.com/assets/f0/8d/f08dfa50-f2ef-4873-bc8f-bcb6c34e48c0.png?n=642227_Hero-Gallery-0_C2_857x676.png",
        stock: 12,
        featured: false,
        discount: 5
      },
      {
        id: 17,
        name: "Nintendo Switch OLED",
        categoryId: 6,
        price: 349,
        description: "Hybrid gaming console with vibrant 7-inch OLED screen.",
        imageUrl: "https://m.media-amazon.com/images/I/61nqNujSF2L.jpg",
        stock: 25,
        featured: true,
        discount: 10
      },
      {
        id: 18,
        name: "Canon EOS R5",
        categoryId: 7,
        price: 3899,
        description: "Full-frame mirrorless camera with 8K video and 45MP sensor.",
        imageUrl: "https://s7d1.scene7.com/is/image/canon/4147C002_eos-r5-body_primary?fmt=webp-alpha&wid=800",
        stock: 6,
        featured: true,
        discount: 8
      },
      {
        id: 19,
        name: "Sony A7 IV",
        categoryId: 7,
        price: 2499,
        description: "Full-frame mirrorless camera with 33MP sensor and 4K 60p video.",
        imageUrl: "https://i5.walmartimages.com/asr/9edaa46d-d2a3-46ad-8741-3f90b8de6f2d.7080c72996c9f3ee71cde59b83bb0d54.jpeg",
        stock: 14,
        featured: false,
        discount: 12
      },
      {
        id: 20,
        name: "DJI Mavic 3 Pro",
        categoryId: 8,
        price: 2199,
        description: "Professional drone with triple camera system and 43-minute flight time.",
        imageUrl: "https://www.dronedepot.be/wp-content/uploads/2023/04/DJI-Mavic-3-Pro_front-1_square-min.png",
        stock: 9,
        featured: true,
        discount: 15
      },
      {
        id: 21,
        name: "GoPro HERO12 Black",
        categoryId: 7,
        price: 399,
        description: "Action camera with 5.3K video and HyperSmooth 6.0 stabilization.",
        imageUrl: "https://static.gopro.com/assets/blta2b8522e5372af40/blt86b2d5c67d4f1ed5/64d0e286369276296caf7a71/02-pdp-h12b-gallery-1920.png",
        stock: 32,
        featured: false,
        discount: 10
      },
      {
        id: 22,
        name: "Kindle Paperwhite",
        categoryId: 9,
        price: 139,
        description: "Waterproof ereader with 6.8\" display and adjustable warm light.",
        imageUrl: "data:image/jpeg;base64,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",
        stock: 40,
        featured: true,
        discount: 0
      },
      {
        id: 23,
        name: "Apple TV 4K",
        categoryId: 10,
        price: 129,
        description: "Streaming device with A15 Bionic chip and Dolby Vision.",
        imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/apple-tv-4k-hero-select-202210",
        stock: 28,
        featured: false,
        discount: 5
      },
      {
        id: 24,
        name: "Sonos Beam Soundbar",
        categoryId: 11,
        price: 449,
        description: "Compact smart soundbar with Dolby Atmos and voice control.",
        imageUrl: "https://media.sonos.com/images/znqtjj88/production/c79156fe93547d1b0a993dc1fb7b381d8773737a-3000x1834.png?q=75&fit=clip&auto=format",
        stock: 18,
        featured: true,
        discount: 8
      },
      {
        id: 25,
        name: "LG OLED C3 TV",
        categoryId: 10,
        price: 1599,
        description: "65\" 4K Smart TV with AI processor and Dolby Vision IQ.",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxrFFcn9PcXz82nE3TsBidv-ezMDKuyCLbOQ&s",
        stock: 7,
        featured: true,
        discount: 12
      },
      {
        id: 26,
        name: "Razer Blade 15",
        categoryId: 3,
        price: 2499,
        description: "Gaming laptop with NVIDIA GeForce RTX 4070 and 240Hz display.",
        imageUrl: "https://m.media-amazon.com/images/I/71kcJxMggRL._AC_SL1500_.jpg",
        stock: 5,
        featured: false,
        discount: 18
      }
    ],
    categories: [
      { id: 1, name: "Smartphones" },
      { id: 2, name: "Audio" },
      { id: 3, name: "Laptops" },
      { id: 4, name: "Tablets" },
      { id: 5, name: "Wearables" },
      { id: 6, name: "Gaming" },
      { id: 7, name: "Cameras" },
      { id: 8, name: "Drones" },
      { id: 9, name: "E-readers" },
      { id: 10, name: "TV & Streaming" },
      { id: 11, name: "Home Audio" }
    ],
    users: [
      {
        id: 1,
        name: "Reaksa",
        email: "reaksa@example.com",
        password: "password123",
        role: "customer",
        avatar: "https://ui-avatars.com/api/?name=Reaksa&background=0D8ABC&color=fff",
        createdAt: "2024-01-01"
      },
      {
        id: 2,
        name: "Admin",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
        avatar: "https://ui-avatars.com/api/?name=Admin&background=DC3545&color=fff",
        createdAt: "2024-01-01"
      }
    ],
    orders: [
      {
        id: 1,
        userId: 1,
        date: "2025-10-16",
        total: 1299,
        items: [
          { productId: 1, quantity: 1, price: 1299 }
        ],
        status: "Delivered",
        shippingAddress: {
          fullName: "Reaksa",
          address: "123 Main St",
          city: "Phnom Penh",
          zipCode: "12000",
          country: "Cambodia"
        }
      },
      {
        id: 2,
        userId: 1,
        date: "2025-10-10",
        total: 399,
        items: [
          { productId: 3, quantity: 1, price: 399 }
        ],
        status: "Processing",
        shippingAddress: {
          fullName: "Reaksa",
          address: "123 Main St",
          city: "Phnom Penh",
          zipCode: "12000",
          country: "Cambodia"
        }
      }
    ],
    reviews: [
      {
        id: 1,
        productId: 1,
        userId: 1,
        rating: 5,
        title: "Amazing iPhone",
        comment: "Excellent phone! Love the camera quality.",
        date: "2025-10-15",
        userName: "Reaksa",
        recommend: true
      },
      {
        id: 2,
        productId: 1,
        userId: 2,
        rating: 4,
        title: "Good but not perfect",
        comment: "Great device but battery could be better.",
        date: "2025-10-14",
        userName: "Admin",
        recommend: true
      },
      {
        id: 3,
        productId: 3,
        userId: 1,
        rating: 5,
        title: "Excellent headphones",
        comment: "Best noise cancellation I've ever experienced!",
        date: "2025-10-12",
        userName: "Reaksa",
        recommend: true
      }
    ],
    wishlist: [
      { userId: 1, productId: 2 },
      { userId: 1, productId: 4 }
    ]
  };

  private cart: CartItem[] = [];
  private currentUser: User | null = this.API_DATA.users[0];
  private authState = new BehaviorSubject<boolean>(!!this.currentUser);
  private wishlistItems = new BehaviorSubject<number[]>(
    this.API_DATA.wishlist.filter(item => item.userId === this.currentUser?.id).map(item => item.productId)
  );

  constructor() {
    this.loadCartFromStorage();
    this.loadWishlistFromStorage();
  }

  // Authentication methods
  login(email: string, password: string): boolean {
    const user = this.API_DATA.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.currentUser = user;
      this.authState.next(true);
      this.loadWishlistFromStorage();
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser = null;
    this.authState.next(false);
    this.cart = [];
    this.wishlistItems.next([]);
    localStorage.removeItem('ecommerce-cart');
    localStorage.removeItem('ecommerce-wishlist');
  }

  register(user: Omit<User, 'id' | 'role' | 'avatar' | 'createdAt'>): boolean {
    // Safely get next ID even if the list is empty
    const nextId =
      this.API_DATA.users.length > 0
        ? Math.max(...this.API_DATA.users.map(u => u.id)) + 1
        : 1;

    const newUser: User = {
      ...user,
      id: nextId,
      role: 'customer',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff`,
      createdAt: new Date().toISOString(),
    };

    // Prevent duplicate email registration
    const emailExists = this.API_DATA.users.some(u => u.email === user.email);
    if (emailExists) {
      console.warn('Registration failed: Email already exists.');
      return false;
    }

    // Push new user and update state
    this.API_DATA.users.push(newUser);
    this.currentUser = newUser;
    this.authState.next(true);

    return true;
  }


  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getAuthState(): Observable<boolean> {
    return this.authState.asObservable();
  }

  // Product methods
  getProducts(): Product[] {
    return this.API_DATA.products;
  }

  getFeaturedProducts(): Product[] {
    return this.API_DATA.products.filter(product => product.featured);
  }

  getDiscountedProducts(): Product[] {
    return this.API_DATA.products.filter(product => product.discount > 0);
  }

  getProductById(id: number): Product | undefined {
    return this.API_DATA.products.find(product => product.id === id);
  }

  getProductsByCategory(categoryId: number): Product[] {
    return this.API_DATA.products.filter(product => product.categoryId === categoryId);
  }

  searchProducts(query: string): Product[] {
    return this.API_DATA.products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Admin product management
  addProduct(product: Omit<Product, 'id'>): void {
    const newProduct: Product = {
      ...product,
      id: Math.max(...this.API_DATA.products.map(p => p.id)) + 1
    };
    this.API_DATA.products.push(newProduct);
  }

  updateProduct(id: number, updates: Partial<Product>): void {
    const index = this.API_DATA.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.API_DATA.products[index] = { ...this.API_DATA.products[index], ...updates };
    }
  }

  deleteProduct(id: number): void {
    this.API_DATA.products = this.API_DATA.products.filter(p => p.id !== id);
  }

  // Category methods
  getCategories(): Category[] {
    return this.API_DATA.categories;
  }

  getCategoryById(id: number): Category | undefined {
    return this.API_DATA.categories.find(category => category.id === id);
  }

  // Cart methods
  getCart(): CartItem[] {
    return this.cart;
  }

  addToCart(product: Product, quantity: number = 1): void {
    const existingItem = this.cart.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({ product, quantity });
    }

    this.saveCartToStorage();
  }

  removeFromCart(productId: number): void {
    this.cart = this.cart.filter(item => item.product.id !== productId);
    this.saveCartToStorage();
  }

  updateCartItemQuantity(productId: number, quantity: number): void {
    const item = this.cart.find(item => item.product.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
      }
    }
    this.saveCartToStorage();
  }

  clearCart(): void {
    this.cart = [];
    this.saveCartToStorage();
  }

  getCartTotal(): number {
    return this.cart.reduce((total, item) => total + (this.getDiscountedPrice(item.product) * item.quantity), 0);
  }

  getCartItemCount(): number {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('ecommerce-cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }
  }

  private saveCartToStorage(): void {
    localStorage.setItem('ecommerce-cart', JSON.stringify(this.cart));
  }

  // Add this getter method to make wishlistItems accessible
  getWishlistItems(): BehaviorSubject<number[]> {
    return this.wishlistItems;
  }

  addToWishlist(productId: number): void {
    if (!this.currentUser) return;

    const currentWishlist = this.wishlistItems.value;
    if (!currentWishlist.includes(productId)) {
      const newWishlist = [...currentWishlist, productId];
      this.wishlistItems.next(newWishlist);
      this.saveWishlistToStorage(newWishlist);
    }
  }

  removeFromWishlist(productId: number): void {
    const currentWishlist = this.wishlistItems.value;
    const newWishlist = currentWishlist.filter(id => id !== productId);
    this.wishlistItems.next(newWishlist);
    this.saveWishlistToStorage(newWishlist);
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistItems.value.includes(productId);
  }

  private loadWishlistFromStorage(): void {
    if (!this.currentUser) return;

    const savedWishlist = localStorage.getItem(`ecommerce-wishlist-${this.currentUser.id}`);
    if (savedWishlist) {
      this.wishlistItems.next(JSON.parse(savedWishlist));
    }
  }

  private saveWishlistToStorage(wishlist: number[]): void {
    if (this.currentUser) {
      localStorage.setItem(`ecommerce-wishlist-${this.currentUser.id}`, JSON.stringify(wishlist));
    }
  }

  // Review methods
  getReviews(productId: number): Review[] {
    return this.API_DATA.reviews.filter(review => review.productId === productId);
  }

  addReview(review: Omit<Review, 'id'>): void {
    const newReview: Review = {
      ...review,
      id: Math.max(...this.API_DATA.reviews.map(r => r.id)) + 1,
      date: new Date().toISOString().split('T')[0]
    };
    this.API_DATA.reviews.push(newReview);
  }

  // Order methods
  getOrders(): Order[] {
    if (this.isAdmin()) {
      return this.API_DATA.orders as Order[];
    }
    return this.API_DATA.orders.filter(order => order.userId === this.currentUser?.id) as Order[];
  }

  getOrderById(id: number): Order | undefined {
    return this.API_DATA.orders.find(order => order.id === id) as Order | undefined;
  }

  createOrder(orderData: any): number {
    const newOrder: Order = {
      id: Math.max(...this.API_DATA.orders.map(o => o.id)) + 1,
      userId: this.currentUser!.id,
      date: new Date().toISOString().split('T')[0],
      total: this.getCartTotal(),
      items: this.cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: this.getDiscountedPrice(item.product)
      })),
      status: 'Processing',
      shippingAddress: orderData.shippingAddress
    };

    this.API_DATA.orders.push(newOrder);
    this.clearCart();

    return newOrder.id;
  }

  updateOrderStatus(orderId: number, status: string): void {
    const order = this.API_DATA.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
    }
  }

  // Utility methods
  getDiscountedPrice(product: Product): number {
    return product.discount > 0
      ? product.price * (1 - product.discount / 100)
      : product.price;
  }

  getAverageRating(productId: number): number {
    const reviews = this.getReviews(productId);
    if (reviews.length === 0) return 0;

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
  }


  // User utility methods
  getAvatar(userId: number): string {
    const user = this.API_DATA.users.find(u => u.id === userId);
    return user
      ? user.avatar
      : 'https://ui-avatars.com/api/?name=Unknown&background=ccc&color=000';
  }

  getUserById(userId: number): User | undefined {
    return this.API_DATA.users.find(u => u.id === userId);
  }


}
