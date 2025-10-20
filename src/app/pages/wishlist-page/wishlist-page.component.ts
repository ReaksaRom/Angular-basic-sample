import { Component } from '@angular/core';
import { Product } from '../../models';
import { Router, RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-wishlist-page',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './wishlist-page.component.html',
  styleUrl: './wishlist-page.component.css'
})
export class WishlistPageComponent {
  wishlistProducts: Product[] = [];
  isLoading = true;
  private destroy$ = new Subject<void>();
  Math = Math;

  // Filter and sort options
  sortOptions = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'price-asc', label: 'Price (Low to High)' },
    { value: 'price-desc', label: 'Price (High to Low)' },
    { value: 'date-added', label: 'Date Added' }
  ];

  selectedSort = 'date-added';
  searchTerm = '';

  constructor(
    private dataService: DataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadWishlist();

    // Subscribe to wishlist changes
    this.dataService.getWishlistItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadWishlist();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadWishlist(): void {
    this.isLoading = true;

    // Simulate loading delay for better UX
    setTimeout(() => {
      const wishlistIds = this.dataService['wishlistItems'].value;
      const allProducts = this.dataService.getProducts();

      this.wishlistProducts = allProducts.filter(product =>
        wishlistIds.includes(product.id)
      );

      this.isLoading = false;
    }, 500);
  }

  removeFromWishlist(productId: number): void {
    this.dataService.removeFromWishlist(productId);
  }

  addToCart(product: Product): void {
    this.dataService.addToCart(product);

    // Show success feedback
    this.showToast(`${product.name} added to cart!`, 'success');
  }

  moveAllToCart(): void {
    this.wishlistProducts.forEach(product => {
      this.dataService.addToCart(product);
    });

    this.showToast('All items moved to cart!', 'success');
  }

  clearWishlist(): void {
    this.wishlistProducts.forEach(product => {
      this.dataService.removeFromWishlist(product.id);
    });

    this.showToast('Wishlist cleared!', 'info');
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  getDiscountedPrice(product: Product): number {
    return this.dataService.getDiscountedPrice(product);
  }

  getAverageRating(productId: number): number {
    return this.dataService.getAverageRating(productId);
  }

  getCategoryName(categoryId: number): string {
    const category = this.dataService.getCategoryById(categoryId);
    return category ? category.name : 'Unknown';
  }

  // Filtering and sorting
  get filteredProducts(): Product[] {
    let products = [...this.wishlistProducts];

    // Apply search filter
    if (this.searchTerm) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    switch (this.selectedSort) {
      case 'name-asc':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        products.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        products.sort((a, b) => this.getDiscountedPrice(a) - this.getDiscountedPrice(b));
        break;
      case 'price-desc':
        products.sort((a, b) => this.getDiscountedPrice(b) - this.getDiscountedPrice(a));
        break;
      case 'date-added':
        // Default order (as loaded)
        break;
    }

    return products;
  }

  get totalValue(): number {
    return this.wishlistProducts.reduce((total, product) =>
      total + this.getDiscountedPrice(product), 0
    );
  }

  get totalItems(): number {
    return this.wishlistProducts.length;
  }

  get hasDiscountedItems(): boolean {
    return this.wishlistProducts.some(product => product.discount > 0);
  }

  get discountedItemsCount(): number {
    return this.wishlistProducts.filter(product => product.discount > 0).length;
  }

  private showToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    // In a real app, you might use a toast service
    const toast = document.createElement('div');
    toast.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    toast.style.cssText = `
      top: 20px;
      right: 20px;
      z-index: 1060;
      min-width: 300px;
    `;
    toast.innerHTML = `
      <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle'} me-2"></i>
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3000);
  }
}
