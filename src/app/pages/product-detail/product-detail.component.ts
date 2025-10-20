import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Review } from '../../models/review';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  quantity: number = 1;
  hoverRating: number = 0;
  temporaryRating: number = 0;

  // New review form
  newReview = {
    rating: 0,
    title: '',
    comment: '',
    recommend: true
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.product = this.dataService.getProductById(productId);

    if (!this.product) {
      this.router.navigate(['/']);
    }
  }

  // Cart Methods
  addToCart(): void {
    if (this.product) {
      this.dataService.addToCart(this.product, this.quantity);
      alert('Product added to cart!');
    }
  }

  // Category Methods
  getCategoryName(categoryId: number): string {
    const category = this.dataService.getCategoryById(categoryId);
    return category ? category.name : 'Unknown';
  }

  navigateToCategory(categoryId: number): void {
    this.router.navigate(['/'], { queryParams: { category: categoryId } });
  }

  // Quantity Methods
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  validateQuantity(): void {
    if (this.product) {
      if (this.quantity < 1) {
        this.quantity = 1;
      } else if (this.quantity > this.product.stock) {
        this.quantity = this.product.stock;
      }
    }
  }

  // Price Methods
  getDiscountedPrice(): number {
    if (!this.product) return 0;
    return this.dataService.getDiscountedPrice(this.product);
  }

  // Stock Methods
  getStockStatus(): string {
    if (!this.product) return 'Unknown';

    if (this.product.stock === 0) {
      return 'Out of Stock';
    } else if (this.product.stock <= 5) {
      return 'Low Stock';
    } else {
      return 'In Stock';
    }
  }

  getStockBadgeClass(): string {
    if (!this.product) return 'bg-secondary';

    if (this.product.stock === 0) {
      return 'bg-danger';
    } else if (this.product.stock <= 5) {
      return 'bg-warning text-dark';
    } else {
      return 'bg-success';
    }
  }

  // Rating Methods
  getAverageRating(): number {
    if (!this.product) return 0;
    return this.dataService.getAverageRating(this.product.id);
  }

  getReviews(): Review[] {
    if (!this.product) return [];
    return this.dataService.getReviews(this.product.id);
  }

  getRatingCount(rating: number): number {
    const reviews = this.getReviews();
    return reviews.filter(review => review.rating === rating).length;
  }

  getRatingPercentage(rating: number): number {
    const reviews = this.getReviews();
    if (reviews.length === 0) return 0;

    const count = this.getRatingCount(rating);
    return (count / reviews.length) * 100;
  }

  setTemporaryRating(rating: number): void {
    this.temporaryRating = rating;
    // In a real app, you might want to save this rating after user confirmation
    console.log('User rated:', rating);
  }

  // Review Methods
  submitReview(): void {
    if (!this.product || !this.isLoggedIn()) return;

    const review: Omit<Review, 'id'> = {
      productId: this.product.id,
      userId: this.dataService.getCurrentUser()?.id || 0,
      rating: this.newReview.rating,
      title: this.newReview.title,
      comment: this.newReview.comment,
      date: new Date().toISOString().split('T')[0],
      userName: this.dataService.getCurrentUser()?.name || 'Anonymous',
      recommend: this.newReview.recommend
    };

    this.dataService.addReview(review);

    // Reset form
    this.newReview = {
      rating: 0,
      title: '',
      comment: '',
      recommend: true
    };

    alert('Thank you for your review!');
  }

  // Wishlist Methods
  toggleWishlist(): void {
    if (!this.product) return;

    if (this.isInWishlist()) {
      this.dataService.removeFromWishlist(this.product.id);
    } else {
      this.dataService.addToWishlist(this.product.id);
    }
  }

  isInWishlist(): boolean {
    if (!this.product) return false;
    return this.dataService.isInWishlist(this.product.id);
  }

  // Share Method
  shareProduct(): void {
    if (!this.product) return;

    const productUrl = window.location.href;
    const shareText = `Check out ${this.product.name} on TechStore!`;

    if (navigator.share) {
      navigator.share({
        title: this.product.name,
        text: shareText,
        url: productUrl
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`${shareText} ${productUrl}`);
      alert('Product link copied to clipboard!');
    }
  }

  // Auth Methods
  isLoggedIn(): boolean {
    return this.dataService.isAuthenticated();
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Navigation Methods
  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  // Utility Methods for Template
  getCurrentUser() {
    return this.dataService.getCurrentUser();
  }

  // Image Gallery Methods (for future enhancement)
  getImageGallery(): string[] {
    // In a real app, you might have multiple images per product
    if (!this.product) return [];
    return [this.product.imageUrl, this.product.imageUrl, this.product.imageUrl, this.product.imageUrl];
  }
}