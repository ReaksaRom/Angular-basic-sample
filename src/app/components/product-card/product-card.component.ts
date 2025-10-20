import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Review } from '../../models/review';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;
  @Input() layout: 'grid' | 'list' = 'grid';
  @Input() showActions: boolean = true;
  @Input() showDescription: boolean = true;
  @Input() showRating: boolean = true;
  @Input() showCategory: boolean = true;

  @Output() addToCartEvent = new EventEmitter<Product>();
  @Output() toggleWishlistEvent = new EventEmitter<number>();
  @Output() quickViewEvent = new EventEmitter<Product>();
  @Output() shareProductEvent = new EventEmitter<Product>();

  Math = Math;
  isInWishlist: boolean = false;
  showQuickView: boolean = false;
  quantity: number = 1;
  imageLoaded: boolean = false;
  imageError: boolean = false;

  constructor(
    public dataService: DataService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    // Check if product is in wishlist
    this.isInWishlist = this.dataService.isInWishlist(this.product.id);
  }

  // Navigation
  viewDetails(): void {
    this.router.navigate(['/product', this.product.id]);
  }

  // Cart Methods
  addToCart(event: Event): void {
    event.stopPropagation(); // Prevent card click event
    if (!this.isProductAvailable()) {
      this.notificationService.warning('Out of Stock', 'This product is currently out of stock.');
      return;
    }

    this.dataService.addToCart(this.product, this.quantity);
    this.addToCartEvent.emit(this.product);

    // Show success notification
    this.notificationService.success(
      'Added to Cart',
      `${this.product.name} has been added to your cart.`,
      {
        duration: 3000,
        actions: [
          {
            label: 'View Cart',
            type: 'primary',
            handler: () => this.router.navigate(['/cart'])
          }
        ]
      }
    );

    // Add visual feedback
    this.showAddToCartFeedback();
    this.quantity = 1; // Reset quantity after adding
  }

  // Wishlist Methods
  toggleWishlist(event: Event): void {
    event.stopPropagation(); // Prevent card click event

    if (this.isInWishlist) {
      this.dataService.removeFromWishlist(this.product.id);
      this.isInWishlist = false;
      this.notificationService.info('Removed', 'Product removed from wishlist.');
    } else {
      this.dataService.addToWishlist(this.product.id);
      this.isInWishlist = true;
      this.notificationService.success('Added!', 'Product added to wishlist.');
    }

    this.toggleWishlistEvent.emit(this.product.id);
    this.showWishlistFeedback();
  }

  // Price Methods
  getDiscountedPrice(): number {
    return this.dataService.getDiscountedPrice(this.product);
  }

  getSavingsAmount(): number {
    return this.product.price - this.getDiscountedPrice();
  }

  getSavingsPercentage(): number {
    return this.product.discount || 0;
  }

  getPricePerUnit(): string {
    // If product has weight/volume information, calculate price per unit
    return `$${this.getDiscountedPrice().toFixed(2)}`;
  }

  // Rating Methods
  getAverageRating(): number {
    return this.dataService.getAverageRating(this.product.id);
  }

  getStarRating(): { filled: number, half: boolean, empty: number } {
    const average = this.getAverageRating();
    const filled = Math.floor(average);
    const decimal = average - filled;
    const half = decimal >= 0.3 && decimal <= 0.7;
    const empty = 5 - filled - (half ? 1 : 0);
    return { filled, half, empty };
  }

  getStarsArray(count: number): number[] {
    return Array(count).fill(0);
  }

  getReviewCount(): number {
    return this.dataService.getReviews(this.product.id).length;
  }

  getRatingText(): string {
    const rating = this.getAverageRating();
    const reviews = this.getReviewCount();
    if (reviews === 0) return 'No reviews yet';
    return `${rating.toFixed(1)} (${reviews} review${reviews !== 1 ? 's' : ''})`;
  }

  // Category Methods
  getCategoryName(categoryId: number): string {
    const category = this.dataService.getCategoryById(categoryId);
    return category ? category.name : 'Unknown';
  }

  getCategoryColor(categoryId: number): string {
    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#f5576c',
      '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
      '#fa709a', '#fee140', '#a8edea', '#fed6e3'
    ];
    return colors[categoryId % colors.length];
  }

  // Stock Status Methods
  getStockStatus(): string {
    if (this.product.stock === 0) {
      return 'Out of Stock';
    } else if (this.product.stock <= 5) {
      return `Only ${this.product.stock} left`;
    } else {
      return 'In Stock';
    }
  }

  getStockBadgeClass(): string {
    if (this.product.stock === 0) {
      return 'stock-out';
    } else if (this.product.stock <= 5) {
      return 'stock-low';
    } else {
      return 'stock-available';
    }
  }

  getStockPercentage(): number {
    const maxStock = 100; // Assuming max stock for percentage calculation
    return Math.min((this.product.stock / maxStock) * 100, 100);
  }

  // Quantity Methods
  increaseQuantity(): void {
    if (this.quantity < this.product.stock) {
      this.quantity++;
    } else {
      this.notificationService.warning('Limit Reached', 'Cannot add more than available stock.');
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  setQuantity(event: Event): void {
    const input = event.target as HTMLInputElement; // cast target to HTMLInputElement
    const amount = input.valueAsNumber;

    if (!isNaN(amount) && amount >= 1 && amount <= this.product.stock) {
      this.quantity = amount;
    }
  }



  // Quick View Methods
  openQuickView(event: Event): void {
    event.stopPropagation();
    this.showQuickView = true;
    this.quickViewEvent.emit(this.product);
  }

  closeQuickView(): void {
    this.showQuickView = false;
    this.quantity = 1;
  }

  // Visual Feedback Methods
  private showAddToCartFeedback(): void {
    const button = event?.target as HTMLElement;
    if (button) {
      button.classList.add('added-to-cart');
      setTimeout(() => {
        button.classList.remove('added-to-cart');
      }, 1000);
    }
  }

  private showWishlistFeedback(): void {
    const button = event?.target as HTMLElement;
    if (button) {
      button.classList.add('wishlist-updated');
      setTimeout(() => {
        button.classList.remove('wishlist-updated');
      }, 600);
    }
  }

  // Quick Actions
  quickAddToCart(): void {
    if (!this.isProductAvailable()) {
      this.notificationService.warning('Out of Stock', 'This product is currently out of stock.');
      return;
    }

    this.dataService.addToCart(this.product, 1);
    this.addToCartEvent.emit(this.product);
    this.notificationService.success('Added!', 'Product added to cart.');
  }

  // Utility Methods
  isNewProduct(): boolean {
    // Consider products added in the last 30 days as new
    // For now, use featured products as "new"
    return this.product.featured || false;
  }

  hasFreeShipping(): boolean {
    return this.getDiscountedPrice() >= 50; // Free shipping for orders over $50
  }

  isOnSale(): boolean {
    return (this.product.discount || 0) > 0;
  }

  isLowStock(): boolean {
    return this.product.stock > 0 && this.product.stock <= 5;
  }

  // Share Method
  shareProduct(event: Event): void {
    event.stopPropagation();

    if (!this.product) return;

    const productUrl = `${window.location.origin}/product/${this.product.id}`;
    const shareText = `Check out ${this.product.name} - $${this.getDiscountedPrice()} on TechStore!`;

    if (navigator.share) {
      navigator.share({
        title: this.product.name,
        text: shareText,
        url: productUrl
      }).then(() => {
        this.notificationService.success('Shared!', 'Product shared successfully.');
      }).catch(() => {
        this.showCopyFeedback();
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`${shareText} ${productUrl}`);
      this.showCopyFeedback();
    }

    this.shareProductEvent.emit(this.product);
  }

  private showCopyFeedback(): void {
    this.notificationService.info('Copied!', 'Product link copied to clipboard.');
  }

  // Image Handling
  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    this.imageError = true;
    img.src = 'https://via.placeholder.com/300x300?text=Image+Not+Available';
  }

  handleImageLoad(): void {
    this.imageLoaded = true;
  }

  getImagePlaceholder(): string {
    return `https://via.placeholder.com/300x300/667eea/ffffff?text=${encodeURIComponent(this.product.name.substring(0, 20))}`;
  }

  // Performance Optimization
  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  // Accessibility Methods
  getAriaLabel(): string {
    return `${this.product.name}, ${this.getCategoryName(this.product.categoryId)}, $${this.getDiscountedPrice()}, ${this.getStockStatus()}, Rating: ${this.getAverageRating()} out of 5 stars`;
  }

  // Discount Badge Text
  getDiscountBadgeText(): string {
    const discount = this.product.discount || 0;
    if (discount > 0) {
      return `-${discount}% OFF`;
    }
    return '';
  }

  // Product Availability
  isProductAvailable(): boolean {
    return this.product.stock > 0;
  }

  // Add to Cart from Quick View
  addToCartFromQuickView(): void {
    if (!this.isProductAvailable()) {
      this.notificationService.warning('Out of Stock', 'This product is currently out of stock.');
      return;
    }

    this.dataService.addToCart(this.product, this.quantity);
    this.addToCartEvent.emit(this.product);

    this.notificationService.success(
      'Added to Cart',
      `${this.quantity} x ${this.product.name} added to cart. Total: $${(this.getDiscountedPrice() * this.quantity).toFixed(2)}`,
      {
        duration: 4000,
        actions: [
          {
            label: 'View Cart',
            type: 'primary',
            handler: () => this.router.navigate(['/cart'])
          },
          {
            label: 'Continue Shopping',
            type: 'secondary',
            handler: () => this.closeQuickView()
          }
        ]
      }
    );

    this.showAddToCartFeedback();
    this.closeQuickView();
  }

  // Compare Methods
  addToCompare(event: Event): void {
    event.stopPropagation();
    this.notificationService.info('Compare', 'Product comparison feature coming soon!');
  }

  getQuickActions(): { label: string, icon: string, action: () => void, disabled?: boolean }[] {
    return [
      {
        label: 'Add to Cart',
        icon: 'fas fa-shopping-cart',
        action: () => this.quickAddToCart(),
        disabled: !this.isProductAvailable()
      },
      {
        label: this.isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist',
        icon: this.isInWishlist ? 'fas fa-heart' : 'far fa-heart',
        action: () => this.toggleWishlist(new Event('click')) // fake event
      },
      {
        label: 'Quick View',
        icon: 'fas fa-eye',
        action: () => this.openQuickView(new Event('click'))
      },
      {
        label: 'Share',
        icon: 'fas fa-share-alt',
        action: () => this.shareProduct(new Event('click'))
      }
    ];
  }


  // Layout specific methods
  getCardClass(): string {
    const baseClass = 'product-card';
    const layoutClass = `layout-${this.layout}`;
    const featuredClass = this.isNewProduct() ? 'featured' : '';
    const stockClass = !this.isProductAvailable() ? 'out-of-stock' : '';

    return `${baseClass} ${layoutClass} ${featuredClass} ${stockClass}`.trim();
  }

  // Price display methods
  getPriceDisplay(): { original: string, discounted: string, savings: string } {
    return {
      original: `$${this.product.price.toFixed(2)}`,
      discounted: `$${this.getDiscountedPrice().toFixed(2)}`,
      savings: `Save $${this.getSavingsAmount().toFixed(2)}`
    };
  }
}